import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RIGHTS = [
  {
    title: '18-week rule',
    tag: 'Legal right',
    tagBg: '#EAF3DE',
    tagColor: '#3B6D11',
    body: 'You have a legal right to start treatment within 18 weeks of your GP referral. If this is breached, your trust must offer you an alternative provider immediately.',
    cta: 'Check my status →',
    ctaColor: '#005EB8',
  },
  {
    title: 'Right to choose',
    tag: 'Key right',
    tagBg: '#E6F1FB',
    tagColor: '#185FA5',
    body: 'You can choose to be treated at ANY NHS trust in England — not just your local one. This has been your legal right since 2012 but most patients never knew it existed.',
    cta: 'Find a faster trust →',
    ctaColor: '#005EB8',
  },
  {
    title: 'Second opinion',
    tag: 'Clinical right',
    tagBg: '#FAEEDA',
    tagColor: '#854F0B',
    body: 'You can ask your GP for a referral to another specialist for a second medical opinion. Your GP must support any reasonable request — we have template letters ready.',
    cta: 'Get template letter →',
    ctaColor: '#005EB8',
  },
  {
    title: 'Access your records',
    tag: 'Data right',
    tagBg: '#F1EFE8',
    tagColor: '#5F5E5A',
    body: 'You have the right to access your full NHS records including referral letters, test results and clinical notes. Your trust must respond within 1 month by law.',
    cta: 'Learn how →',
    ctaColor: '#005EB8',
  },
];

export default function RightsScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Patient rights</Text>
        <Text style={styles.subtitle}>Plain English · Updated for England 2025</Text>
      </View>

      {/* RIGHTS CARDS */}
      {RIGHTS.map(r => (
        <View key={r.title} style={styles.card}>

          {/* Card header */}
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{r.title}</Text>
            <View style={[styles.tag, { backgroundColor: r.tagBg }]}>
              <Text style={[styles.tagText, { color: r.tagColor }]}>{r.tag}</Text>
            </View>
          </View>

          {/* Body text */}
          <Text style={styles.cardBody}>{r.body}</Text>

          {/* CTA link */}
          <TouchableOpacity>
            <Text style={[styles.cta, { color: r.ctaColor }]}>{r.cta}</Text>
          </TouchableOpacity>

        </View>
      ))}

      {/* COMPLAINT BANNER */}
      <View style={styles.complaintBanner}>
        <Text style={styles.complaintTitle}>Need to make a complaint?</Text>
        <Text style={styles.complaintBody}>
          We guide you step by step through NHS complaints — including PALS, NHS England escalation, and the Parliamentary Ombudsman.
        </Text>
        <TouchableOpacity style={styles.complaintBtn}>
          <Text style={styles.complaintBtnText}>Start complaint guide ›</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM HELP BOX */}
      <View style={styles.helpBox}>
        <Text style={styles.helpTitle}>Did you know?</Text>
        <Text style={styles.helpBody}>
          Over 7.6 million people are currently on NHS waiting lists in England. Most of them don't know they can legally switch to a faster hospital. WaitSmart helps you exercise rights you already have.
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

  // Rights cards
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    flex: 1,
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 5,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardBody: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cta: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Complaint banner
  complaintBanner: {
    backgroundColor: '#005EB8',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  complaintTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    marginBottom: 6,
  },
  complaintBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    marginBottom: 14,
  },
  complaintBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 11,
    alignItems: 'center',
  },
  complaintBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },

  // Help box
  helpBox: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    borderLeftWidth: 3,
    borderLeftColor: '#005EB8',
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  helpBody: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },

});
