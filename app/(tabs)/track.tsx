import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HospitalPicker from '../../components/HospitalPicker';
import { AppColors, DarkColors, LightColors } from '../../constants/Colors';
import { SPECIALTY_NAMES } from '../../constants/nhsData';
import { cancelReferralNotifications, scheduleReferralNotifications } from '../../constants/notifications';

type Referral = { id: string; specialty: string; hospital: string; referralDate: string; };

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const months: Record<string, number> = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) { const mid = parts[1].toLowerCase(); if (months[mid] !== undefined) return new Date(parseInt(parts[2]), months[mid], parseInt(parts[0])); }
  return new Date(dateStr);
}
function getWeeksWaited(d: string) { return !d ? 0 : Math.ceil((new Date().getTime() - parseDate(d).getTime()) / (1000 * 60 * 60 * 24 * 7)); }
function getProgressWidth(d: string): `${number}%` { return `${Math.min(Math.round((getWeeksWaited(d) / 18) * 100), 100)}%`; }
function getStatus(referralDate: string) {
  if (!referralDate) return { text: 'Not started', bg: '#F2F2F7', color: '#8E8E93' };
  const w = getWeeksWaited(referralDate);
  if (w >= 18) return { text: 'Overdue', bg: '#FCEBEB', color: '#A32D2D' };
  if (w >= 14) return { text: 'Due soon', bg: '#FAEEDA', color: '#854F0B' };
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
  const w = getWeeksWaited(referralDate);
  const addWeeks = (date: Date, weeks: number) => { const d = new Date(date); d.setDate(d.getDate() + weeks * 7); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  return [
    { label: 'GP referral sent', date: referralDate, done: true },
    { label: `Received by ${hospital || 'hospital'}`, date: addWeeks(referred, 1), done: w >= 1 },
    { label: 'Under clinical review', date: addWeeks(referred, 3), done: w >= 3 },
    { label: 'Appointment booking', date: `Est. ${addWeeks(referred, 10)}`, done: w >= 10 },
    { label: 'First appointment', date: `Est. ${addWeeks(referred, 18)}`, done: w >= 18 },
  ];
}

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const C = scheme === 'dark' ? DarkColors : LightColors;
  const styles = makeStyles(C);

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newHospital, setNewHospital] = useState('');
  const [newReferralDate, setNewReferralDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(useCallback(() => {
    async function load() {
      const stored = await AsyncStorage.getItem('user_referrals');
      if (stored) {
        const parsed: Referral[] = JSON.parse(stored);
        setReferrals(parsed);
        if (parsed.length > 0 && !expandedId) setExpandedId(parsed[0].id);
      } else {
        const spec = await AsyncStorage.getItem('user_specialty');
        const hosp = await AsyncStorage.getItem('user_hospital');
        const date = await AsyncStorage.getItem('user_referral_date');
        if (spec) {
          const migrated: Referral[] = [{ id: Date.now().toString(), specialty: spec, hospital: hosp || '', referralDate: date || '' }];
          setReferrals(migrated); setExpandedId(migrated[0].id);
          await AsyncStorage.setItem('user_referrals', JSON.stringify(migrated));
          await scheduleReferralNotifications(migrated[0]);
        }
      }
    }
    load();
  }, []));

  async function saveReferrals(updated: Referral[]) { setReferrals(updated); await AsyncStorage.setItem('user_referrals', JSON.stringify(updated)); }

  function openAddModal() { setNewSpecialty(''); setNewHospital(''); setNewReferralDate(''); setShowAddModal(true); }

  async function confirmAdd() {
    if (!newSpecialty) return;
    const newRef: Referral = { id: Date.now().toString(), specialty: newSpecialty, hospital: newHospital, referralDate: newReferralDate };
    await scheduleReferralNotifications(newRef);
    const updated = [...referrals, newRef];
    await saveReferrals(updated);
    setExpandedId(newRef.id);
    setShowAddModal(false);
  }

  function deleteReferral(id: string, specialty: string) {
    Alert.alert(`Remove ${specialty}?`, 'This referral will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        await cancelReferralNotifications(id);
        const updated = referrals.filter(r => r.id !== id);
        await saveReferrals(updated);
        if (expandedId === id) setExpandedId(updated[0]?.id ?? null);
      }},
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Your referrals</Text>
          <Text style={styles.subtitle}>{referrals.length > 0 ? `${referrals.length} active · Last updated today` : 'No active referrals'}</Text>
        </View>
        {referrals.length < 5 && (
          <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
            <Feather name="plus" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {referrals.length > 0 ? referrals.map(ref => {
        const isExpanded = expandedId === ref.id;
        const status = getStatus(ref.referralDate);
        const STEPS = getSteps(ref.referralDate, ref.hospital);
        return (
          <View key={ref.id} style={styles.referralCard}>
            <TouchableOpacity style={styles.cardTop} onPress={() => setExpandedId(isExpanded ? null : ref.id)} activeOpacity={0.7}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.cardTitle}>{ref.specialty}</Text>
                <Text style={styles.cardSub}>{ref.referralDate || ref.hospital ? `${ref.referralDate}${ref.hospital ? ' · ' + ref.hospital : ''}` : 'No date or hospital set'}</Text>
              </View>
              <View style={styles.cardHeaderRight}>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={C.textSecondary} style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>
                {ref.referralDate ? (getWeeksWaited(ref.referralDate) > 18 ? `Overdue by ${getWeeksWaited(ref.referralDate) - 18} weeks` : `Week ${getWeeksWaited(ref.referralDate)} of 18`) : ''}
              </Text>
              <Text style={styles.progressLabel}>{ref.referralDate ? `${Math.max(0, 18 - getWeeksWaited(ref.referralDate))} weeks remaining` : ''}</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: getProgressWidth(ref.referralDate) }]} />
            </View>

            {isExpanded && (
              <>
                <View style={styles.detailGrid}>
                  {[
                    { label: 'REFERRED', value: ref.referralDate || 'Unknown', color: C.textPrimary },
                    { label: 'DEADLINE', value: ref.referralDate ? new Date(parseDate(ref.referralDate).getTime() + 18 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set', color: C.textPrimary },
                    { label: 'TRUST', value: ref.hospital || 'Your trust', color: C.textPrimary },
                    { label: 'STATUS', value: status.text, color: status.color },
                  ].map(d => (
                    <View key={d.label} style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{d.label}</Text>
                      <Text style={[styles.detailValue, { color: d.color }]}>{d.value}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />
                <Text style={styles.timelineHeader}>PATHWAY</Text>
                {STEPS.map((step, i) => (
                  <View key={step.label} style={styles.stepRow}>
                    <View style={styles.stepLeft}>
                      <View style={[styles.circle, step.done ? styles.circleDone : styles.circlePending]}>
                        {step.done && <Text style={styles.tick}>✓</Text>}
                      </View>
                      {i < STEPS.length - 1 && <View style={[styles.line, step.done ? styles.lineDone : styles.linePending]} />}
                    </View>
                    <View style={styles.stepText}>
                      <Text style={[styles.stepLabel, !step.done && styles.stepLabelPending]}>{step.label}</Text>
                      <Text style={styles.stepDate}>{step.date}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.chaserBtn} onPress={() => Alert.alert('Send chaser letter?', `Generate a letter to ${ref.hospital || 'your hospital'} for your ${ref.specialty} referral.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Generate letter', onPress: () => Alert.alert('✓ Letter ready', 'Copy it and send to your hospital PALS team.') }])}>
                    <Text style={styles.chaserBtnText}>Send chaser letter ›</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReferral(ref.id, ref.specialty)}>
                    <Feather name="trash-2" size={14} color={C.red} />
                  </TouchableOpacity>
                </View>

                {ref.referralDate && (
                  <View style={[styles.successBanner, { backgroundColor: status.bg, borderLeftColor: status.color }]}>
                    <Text style={[styles.successTitle, { color: status.color }]}>
                      {getWeeksWaited(ref.referralDate) >= 18 ? '⚠ 18-week target breached — you have the right to switch trust' : '✓ Within 18-week legal target'}
                    </Text>
                    <Text style={[styles.successBody, { color: status.color }]}>
                      {getWeeksWaited(ref.referralDate) >= 18 ? 'Your trust has breached your legal right. Tap Find to see faster alternatives immediately.' : 'Your referral is progressing on time. WaitSmart will alert you if your trust breaches your right.'}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        );
      }) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏥</Text>
          <Text style={styles.emptyTitle}>No active referrals</Text>
          <Text style={styles.emptyBody}>When your GP refers you for treatment, add your details here to track your wait and find faster alternatives.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={openAddModal}>
            <Text style={styles.emptyBtnText}>Add your first referral →</Text>
          </TouchableOpacity>
        </View>
      )}

      {referrals.length > 0 && referrals.length < 5 && (
        <TouchableOpacity style={styles.addMoreBtn} onPress={openAddModal}>
          <Feather name="plus-circle" size={15} color="#005EB8" />
          <Text style={styles.addMoreText}>Add another referral</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />

      {/* ADD MODAL */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView style={[styles.modal]} keyboardShouldPersistTaps="handled">
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add referral</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>SPECIALTY</Text>
              <Text style={styles.modalSectionSub}>Select your referral specialty</Text>
              <View style={styles.pillGrid}>
                {SPECIALTY_NAMES.map(s => (
                  <TouchableOpacity key={s} style={[styles.pill, newSpecialty === s && styles.pillActive]} onPress={() => setNewSpecialty(s)}>
                    <Text style={[styles.pillText, newSpecialty === s && styles.pillTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>HOSPITAL</Text>
              <HospitalPicker value={newHospital} onChange={setNewHospital} />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>REFERRAL DATE</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: newReferralDate ? C.textPrimary : C.textTertiary, fontSize: 15 }}>
                  {newReferralDate || 'Tap to select date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate} mode="date" display="spinner"
                  maximumDate={new Date()}
                  minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 3))}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) { setSelectedDate(date); setNewReferralDate(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })); }
                  }}
                />
              )}
              {newReferralDate ? <TouchableOpacity onPress={() => setNewReferralDate('')}><Text style={{ color: C.red, fontSize: 12, marginTop: 6 }}>Clear date</Text></TouchableOpacity> : null}
            </View>

            <TouchableOpacity style={[styles.saveBtn, !newSpecialty && styles.saveBtnDisabled]} onPress={confirmAdd} disabled={!newSpecialty}>
              <Text style={styles.saveBtnText}>Add referral</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

    </ScrollView>
  );
}

function makeStyles(C: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '500', color: C.textPrimary, marginBottom: 4 },
    subtitle: { fontSize: 12, color: C.textSecondary },
    addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#005EB8', alignItems: 'center', justifyContent: 'center' },
    referralCard: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
    cardHeaderRight: { flexDirection: 'row', alignItems: 'center' },
    cardTitle: { fontSize: 17, fontWeight: '500', color: C.textPrimary, marginBottom: 3 },
    cardSub: { fontSize: 11, color: C.textSecondary },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 7 },
    statusText: { fontSize: 11, fontWeight: '500' },
    progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    progressLabel: { fontSize: 11, color: C.textSecondary },
    progressBg: { backgroundColor: C.input, borderRadius: 99, height: 8, marginBottom: 12 },
    progressFill: { backgroundColor: '#005EB8', borderRadius: 99, height: 8 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    detailItem: { backgroundColor: C.surfaceSecondary, borderRadius: 10, padding: 10, width: '47%' },
    detailLabel: { fontSize: 10, color: C.textSecondary, letterSpacing: 0.3, marginBottom: 3 },
    detailValue: { fontSize: 13, fontWeight: '500' },
    divider: { height: 0.5, backgroundColor: C.border, marginBottom: 14 },
    timelineHeader: { fontSize: 10, color: C.textSecondary, fontWeight: '500', letterSpacing: 0.8, marginBottom: 14 },
    stepRow: { flexDirection: 'row', gap: 12 },
    stepLeft: { alignItems: 'center', width: 20 },
    circle: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    circleDone: { backgroundColor: '#005EB8' },
    circlePending: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.borderMid, borderStyle: 'dashed' },
    tick: { color: 'white', fontSize: 11, fontWeight: '600' },
    line: { width: 1.5, flex: 1, minHeight: 20, marginVertical: 3 },
    lineDone: { backgroundColor: '#005EB8' },
    linePending: { backgroundColor: C.border },
    stepText: { paddingBottom: 16, flex: 1 },
    stepLabel: { fontSize: 13, fontWeight: '500', color: C.textPrimary, marginBottom: 2 },
    stepLabelPending: { fontWeight: '400', color: C.textSecondary },
    stepDate: { fontSize: 11, color: C.textSecondary },
    cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    chaserBtn: { flex: 1, backgroundColor: C.input, borderRadius: 10, padding: 12, alignItems: 'center' },
    chaserBtnText: { fontSize: 13, fontWeight: '500', color: C.textMid },
    deleteBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.redLight, alignItems: 'center', justifyContent: 'center' },
    successBanner: { borderRadius: 10, padding: 12, marginTop: 12, borderLeftWidth: 3 },
    successTitle: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
    successBody: { fontSize: 11, lineHeight: 17 },
    addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginBottom: 4, padding: 14, backgroundColor: C.surface, borderRadius: 14, borderWidth: 0.5, borderColor: C.border },
    addMoreText: { fontSize: 14, color: '#005EB8', fontWeight: '500' },
    emptyState: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 0.5, borderColor: C.border, marginBottom: 12 },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 17, fontWeight: '500', color: C.textPrimary, marginBottom: 8 },
    emptyBody: { fontSize: 13, color: C.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
    emptyBtn: { backgroundColor: '#005EB8', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
    emptyBtnText: { color: 'white', fontSize: 14, fontWeight: '500' },
    modal: { flex: 1, backgroundColor: C.bg },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: C.surface, borderBottomWidth: 0.5, borderBottomColor: C.border },
    modalTitle: { fontSize: 17, fontWeight: '600', color: C.textPrimary },
    modalCancel: { fontSize: 15, color: C.textSecondary },
    modalSection: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 0.5, borderColor: C.border },
    modalSectionTitle: { fontSize: 10, color: C.textSecondary, fontWeight: '500', letterSpacing: 0.8, marginBottom: 6 },
    modalSectionSub: { fontSize: 12, color: C.textSecondary, marginBottom: 12 },
    pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, borderWidth: 0.5, borderColor: C.borderMid, backgroundColor: C.input },
    pillActive: { backgroundColor: '#005EB8', borderColor: '#005EB8' },
    pillText: { fontSize: 13, color: C.textMid },
    pillTextActive: { color: 'white', fontWeight: '500' },
    dateInput: { backgroundColor: C.input, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: C.border },
    saveBtn: { backgroundColor: '#005EB8', marginHorizontal: 20, marginTop: 16, marginBottom: 40, borderRadius: 14, padding: 16, alignItems: 'center' },
    saveBtnDisabled: { backgroundColor: C.borderMid },
    saveBtnText: { color: 'white', fontSize: 15, fontWeight: '500' },
  });
}
