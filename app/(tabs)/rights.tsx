import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors, DarkColors, LightColors } from '../../constants/Colors';
import { useNHSData } from '../../constants/liveNHSData';

export default function RightsScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const C = scheme === 'dark' ? DarkColors : LightColors;
  const styles = makeStyles(C);

  const nhs = useNHSData();
  const totalWaiting = (nhs.totalWaiting / 1000000).toFixed(1) + 'M';

  const RIGHTS = [
    {
      title: '18-week rule',
      tag: 'Legal right',
      tagBg: C.greenLight,
      tagColor: C.green,
      body: 'You have a legal right to start treatment within 18 weeks of your GP referral. If this is breached, your trust must offer you an alternative provider immediately.',
      cta: 'Check my status →',
      url: 'https://www.england.nhs.uk/long-read/national-elective-access-policy/',
    },
    {
      title: 'Right to choose',
      tag: 'Key right',
      tagBg: C.blueLight,
      tagColor: C.blueDark,
      body: 'You can choose to be treated at ANY NHS trust in England — not just your local one. This has been your legal right since 2012 but most patients never knew it existed.',
      cta: 'Find a faster trust →',
      url: '',
      internal: true,
    },
    {
      title: 'Second opinion',
      tag: 'Clinical right',
      tagBg: C.orangeLight,
      tagColor: C.orange,
      body: 'You can ask your GP for a referral to another specialist for a second medical opinion. Your GP must support any reasonable request — we have template letters ready.',
      cta: 'Get template letter →',
      url: 'https://www.royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/changing-your-nhs-hospital-doctor-or-asking-second-opinion',
    },
    {
      title: 'Access your records',
      tag: 'Data right',
      tagBg: C.surfaceSecondary,
      tagColor: C.textSecondary,
      body: 'You have the right to access your full NHS records including referral letters, test results and clinical notes. Your trust must respond within 1 month by law.',
      cta: 'Learn how →',
      url: 'https://www.ageuk.org.uk/information-advice/health-wellbeing/health-services/healthcare-rights/',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 16 }}>

        <View style={styles.header}>
          <Text style={styles.title}>Patient rights</Text>
          <Text style={styles.subtitle}>Plain English · Updated for England {new Date().getFullYear()}</Text>
        </View>

        {RIGHTS.map(r => (
          <View key={r.title} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{r.title}</Text>
              <View style={[styles.tag, { backgroundColor: r.tagBg }]}>
                <Text style={[styles.tagText, { color: r.tagColor }]}>{r.tag}</Text>
              </View>
            </View>
            <Text style={styles.cardBody}>{r.body}</Text>
            <TouchableOpacity onPress={() => r.internal ? router.push('/find') : Linking.openURL(r.url)}>
              <Text style={styles.cta}>{r.cta}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.complaintBanner}>
          <Text style={styles.complaintTitle}>Need to make a complaint?</Text>
          <Text style={styles.complaintBody}>
            We guide you step by step through NHS complaints — including PALS, NHS England escalation, and the Parliamentary Ombudsman.
          </Text>
          <TouchableOpacity
            style={styles.complaintBtn}
            onPress={() => Linking.openURL('https://www.england.nhs.uk/contact-us/feedback-and-complaints/complaint/')}
          >
            <Text style={styles.complaintBtnText}>Start complaint guide ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpTitle}>Did you know?</Text>
          <Text style={styles.helpBody}>
            Over {totalWaiting} people are currently on NHS waiting lists in England. Most of them don't know they can legally switch to a faster hospital. WaitSmart helps you exercise rights you already have.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

function makeStyles(C: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { paddingHorizontal: 20, marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '500', color: C.textPrimary, marginBottom: 4 },
    subtitle: { fontSize: 12, color: C.textSecondary },
    card: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: C.border },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    cardTitle: { fontSize: 15, fontWeight: '500', color: C.textPrimary, flex: 1 },
    tag: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 5, marginLeft: 8 },
    tagText: { fontSize: 11, fontWeight: '500' },
    cardBody: { fontSize: 13, color: C.textBody, lineHeight: 20, marginBottom: 12 },
    cta: { fontSize: 13, fontWeight: '500', color: C.blueText },
    complaintBanner: { backgroundColor: '#005EB8', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 10, marginTop: 4 },
    complaintTitle: { fontSize: 15, fontWeight: '500', color: 'white', marginBottom: 6 },
    complaintBody: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 18, marginBottom: 14 },
    complaintBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 11, alignItems: 'center' },
    complaintBtnText: { color: 'white', fontSize: 13, fontWeight: '500' },
    helpBox: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 40, borderWidth: 0.5, borderColor: C.border, borderLeftWidth: 3, borderLeftColor: '#005EB8' },
    helpTitle: { fontSize: 13, fontWeight: '500', color: C.textPrimary, marginBottom: 6 },
    helpBody: { fontSize: 12, color: C.textSecondary, lineHeight: 18 },
  });
}
