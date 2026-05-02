import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STEPS = [
  { label: 'GP referral sent',       date: '12 Jan 2025', done: true  },
  { label: 'Received by UCLH',       date: '18 Jan 2025', done: true  },
  { label: 'Under clinical review',  date: '3 Feb 2025',  done: true  },
  { label: 'Appointment booking',    date: 'Est. Mar 2025', done: false },
  { label: 'First appointment',      date: 'Est. May 2025', done: false },
];

export default function TrackScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Your referrals</Text>
        <Text style={styles.subtitle}>1 active · Last updated today</Text>
      </View>

      {/* REFERRAL CARD */}
      <View style={styles.referralCard}>

        {/* Top row */}
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardTitle}>Cardiology</Text>
            <Text style={styles.cardSub}>Dr. Ahmed · Hammersmith Surgery</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>On track</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Week 14 of 18</Text>
          <Text style={styles.progressLabel}>4 weeks remaining</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={styles.progressFill} />
        </View>

        {/* Details grid */}
        <View style={styles.detailGrid}>
          {[
            { label: 'REFERRED',  value: '12 Jan 2025', color: '#1C1C1E' },
            { label: 'DEADLINE',  value: '12 May 2025', color: '#1C1C1E' },
            { label: 'TRUST',     value: 'UCLH',        color: '#1C1C1E' },
            { label: 'STATUS',    value: 'Under review', color: '#3B6D11' },
          ].map(d => (
            <View key={d.label} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={[styles.detailValue, { color: d.color }]}>{d.value}</Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Timeline */}
        <Text style={styles.timelineHeader}>PATHWAY</Text>
        {STEPS.map((step, i) => (
          <View key={step.label} style={styles.stepRow}>

            {/* Circle + line */}
            <View style={styles.stepLeft}>
              <View style={[styles.circle, step.done ? styles.circleDone : styles.circlePending]}>
                {step.done && <Text style={styles.tick}>✓</Text>}
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.line, step.done ? styles.lineDone : styles.linePending]} />
              )}
            </View>

            {/* Text */}
            <View style={styles.stepText}>
              <Text style={[styles.stepLabel, !step.done && styles.stepLabelPending]}>
                {step.label}
              </Text>
              <Text style={styles.stepDate}>{step.date}</Text>
            </View>

          </View>
        ))}

        {/* Chaser button */}
        <TouchableOpacity style={styles.chaserBtn}>
          <Text style={styles.chaserBtnText}>Send chaser letter ›</Text>
        </TouchableOpacity>

      </View>

      {/* GREEN SUCCESS BANNER */}
      <View style={styles.successBanner}>
        <Text style={styles.successTitle}>✓ Within 18-week legal target</Text>
        <Text style={styles.successBody}>
          Your referral is progressing on time. WaitSmart will alert you immediately if your trust breaches your right.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 60,
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
    width: '77%',
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

});
