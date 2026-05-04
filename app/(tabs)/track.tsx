import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const mid = parts[1].toLowerCase();
    if (months[mid] !== undefined) {
      return new Date(parseInt(parts[2]), months[mid], parseInt(parts[0]));
    }
  }
  return new Date(dateStr);
}

function getWeeksWaited(dateStr: string): number {
  if (!dateStr) return 0;
  const referred = parseDate(dateStr);
  const now = new Date();
  return Math.ceil((now.getTime() - referred.getTime()) / (1000 * 60 * 60 * 24 * 7));
}

function getProgressWidth(dateStr: string): `${number}%` {
  if (!dateStr) return '0%';
  const weeks = getWeeksWaited(dateStr);
  const percent = Math.min(Math.round((weeks / 18) * 100), 100);
  return `${percent}%`;
}

function getStatus(referralDate: string) {
  if (!referralDate) return { text: 'Not started', bg: '#F2F2F7', color: '#8E8E93' };
  const weeks = getWeeksWaited(referralDate);
  if (weeks >= 18) return { text: 'Overdue', bg: '#FCEBEB', color: '#A32D2D' };
  if (weeks >= 14) return { text: 'Due soon', bg: '#FAEEDA', color: '#854F0B' };
  return { text: 'On track', bg: '#EAF3DE', color: '#3B6D11' };
}

function getSteps(referralDate: string, hospital: string) {
  if (!referralDate) return [
    { label: 'GP referral sent', date: 'Date unknown', done: false },
    { label: 'Received by hospital', date: 'Pending', done: false },
    { label: 'Under clinical review', date: 'Pending', done: false },
    { label: 'Appointment booking', date: 'Pending', done: false },
    { label: 'First appointment', date: 'Pending', done: false },
  ];

  const referred = parseDate(referralDate);
  const weeksWaited = Math.ceil(
    (new Date().getTime() - referred.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );

  const addWeeks = (date: Date, weeks: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + weeks * 7);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return [
    { label: 'GP referral sent', date: referralDate, done: true },
    { label: `Received by ${hospital || 'hospital'}`, date: addWeeks(referred, 1), done: weeksWaited >= 1 },
    { label: 'Under clinical review', date: addWeeks(referred, 3), done: weeksWaited >= 3 },
    { label: 'Appointment booking', date: `Est. ${addWeeks(referred, 10)}`, done: weeksWaited >= 10 },
    { label: 'First appointment', date: `Est. ${addWeeks(referred, 18)}`, done: weeksWaited >= 18 },
  ];
}

export default function TrackScreen() {
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [referralDate, setReferralDate] = useState('');
  const STEPS = getSteps(referralDate, hospital);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const spec = await AsyncStorage.getItem('user_specialty');
        const hosp = await AsyncStorage.getItem('user_hospital');
        const date = await AsyncStorage.getItem('user_referral_date');
        setSpecialty(spec || '');
        setHospital(hosp || '');
        setReferralDate(date || '');
      }
      load();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Your referrals</Text>
        <Text style={styles.subtitle}>
          {specialty ? '1 active · Last updated today' : 'No active referrals'}
        </Text>
      </View>

      {/* REFERRAL CARD */}
      {specialty ? (
        <View style={styles.referralCard}>
          {/* Top row */}
          <View style={styles.cardTop}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.cardTitle}>{specialty}</Text>
              <Text style={styles.cardSub}>
                {referralDate || hospital ? `${referralDate} · ${hospital}` : 'Add referral date and hospital in Profile'}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatus(referralDate).bg }]}>
              <Text style={[styles.statusText, { color: getStatus(referralDate).color }]}>
                {getStatus(referralDate).text}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {referralDate ? `Week ${getWeeksWaited(referralDate)} of 18` : ''}
            </Text>
            <Text style={styles.progressLabel}>
              {referralDate ? `${Math.max(0, 18 - getWeeksWaited(referralDate))} weeks remaining` : ''}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: getProgressWidth(referralDate) }]} />
          </View>

          {/* Details grid */}
          <View style={styles.detailGrid}>
            {[
              { label: 'REFERRED', value: referralDate || 'Unknown', color: '#1C1C1E' },
              { label: 'DEADLINE', value: referralDate ? new Date(parseDate(referralDate).getTime() + 18 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set', color: '#1C1C1E' },
              { label: 'TRUST', value: hospital || 'Your trust', color: '#1C1C1E' },
              { label: 'STATUS', value: getStatus(referralDate).text, color: getStatus(referralDate).color },
            ].map(d => (
              <View key={d.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={[styles.detailValue, { color: d.color }]}>{d.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Timeline */}
          <Text style={styles.timelineHeader}>PATHWAY</Text>
          {STEPS.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.circle, step.done ? styles.circleDone : styles.circlePending]}>
                  {step.done && <Text style={styles.tick}>✓</Text>}
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.line, step.done ? styles.lineDone : styles.linePending]} />
                )}
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepLabel, !step.done && styles.stepLabelPending]}>
                  {step.label}
                </Text>
                <Text style={styles.stepDate}>{step.date}</Text>
              </View>
            </View>
          ))}

          {/* Chaser button */}
          <TouchableOpacity
            style={styles.chaserBtn}
            onPress={() => Alert.alert(
              'Send chaser letter?',
              `This will generate a formal letter to ${hospital || 'your hospital'} requesting an update on your ${specialty} referral.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Generate letter', onPress: () => Alert.alert('✓ Letter ready', 'Your chaser letter has been generated. Copy it and send to your hospital PALS team.') }
              ]
            )}
          >
            <Text style={styles.chaserBtnText}>Send chaser letter ›</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* EMPTY STATE — no referral */
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏥</Text>
          <Text style={styles.emptyTitle}>No active referral</Text>
          <Text style={styles.emptyBody}>
            When your GP refers you for treatment, add your details here to track your wait and find faster alternatives.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.emptyBtnText}>Add referral details →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* GREEN SUCCESS BANNER — only show when referral exists */}
      {specialty && referralDate ? <View style={[styles.successBanner, {
        backgroundColor: getStatus(referralDate).bg,
        borderLeftColor: getStatus(referralDate).color
      }]}>
        <Text style={[styles.successTitle, { color: getStatus(referralDate).color }]}>
          {getWeeksWaited(referralDate) >= 18
            ? '⚠ 18-week target breached — you have the right to switch trust'
            : '✓ Within 18-week legal target'}
        </Text>
        <Text style={[styles.successBody, { color: getStatus(referralDate).color }]}>
          {getWeeksWaited(referralDate) >= 18
            ? 'Your trust has breached your legal right. Tap Find to see faster alternatives immediately.'
            : 'Your referral is progressing on time. WaitSmart will alert you if your trust breaches your right.'}
        </Text>
      </View> : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },

  // Referral card
  referralCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 11,
    color: '#8E8E93',
  },
  statusBadge: {
    backgroundColor: '#FAEEDA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
  },
  statusText: {
    fontSize: 11,
    color: '#854F0B',
    fontWeight: '500',
  },

  // Progress
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#8E8E93',
  },
  progressBg: {
    backgroundColor: '#F2F2F7',
    borderRadius: 99,
    height: 8,
    marginBottom: 14,
  },
  progressFill: {
    backgroundColor: '#005EB8',
    borderRadius: 99,
    height: 8,
  },

  // Details grid
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    width: '47%',
  },
  detailLabel: {
    fontSize: 10,
    color: '#8E8E93',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },

  divider: {
    height: 0.5,
    backgroundColor: '#F2F2F7',
    marginBottom: 14,
  },

  // Timeline
  timelineHeader: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  stepLeft: {
    alignItems: 'center',
    width: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: '#005EB8',
  },
  circlePending: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
  },
  tick: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  line: {
    width: 1.5,
    flex: 1,
    minHeight: 20,
    marginVertical: 3,
  },
  lineDone: {
    backgroundColor: '#005EB8',
  },
  linePending: {
    backgroundColor: '#E5E5EA',
  },
  stepText: {
    paddingBottom: 16,
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  stepLabelPending: {
    fontWeight: '400',
    color: '#8E8E93',
  },
  stepDate: {
    fontSize: 11,
    color: '#8E8E93',
  },

  // Chaser button
  chaserBtn: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  chaserBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C3C43',
  },

  // Success banner
  successBanner: {
    backgroundColor: '#EAF3DE',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    marginBottom: 40,
    borderLeftWidth: 3,
    borderLeftColor: '#3B6D11',
  },
  successTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#27500A',
    marginBottom: 5,
  },
  successBody: {
    fontSize: 12,
    color: '#3B6D11',
    lineHeight: 18,
  },
  emptyState: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: '#005EB8',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },

});
