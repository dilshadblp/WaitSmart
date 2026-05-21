import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors, DarkColors, LightColors } from '../constants/Colors';
import { CONFIG } from '../constants/config';
import { DATA_SOURCE } from '../constants/nhsData';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const C = scheme === 'dark' ? DarkColors : LightColors;
  const styles = makeStyles(C);

  async function handleShare() {
    try {
      await Share.share({
        message: '7.1M NHS patients are waiting — did you know you have the right to switch to a faster hospital?\n\nI\'m using WaitSmart to track my NHS referral and find shorter waits nearby. It\'s free.\n\nDownload it on Android: https://github.com/dilshadblp/WaitSmart',
        title: 'WaitSmart — Your NHS, faster.',
      });
    } catch (e) {}
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, paddingBottom: insets.bottom }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 16, paddingBottom: 60 }}>

      <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
        <Feather name="arrow-left" size={16} color="#005EB8" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.hero}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>W</Text>
        </View>
        <Text style={styles.appName}>WaitSmart</Text>
        <Text style={styles.tagline}>Your NHS, faster.</Text>
        <Text style={styles.version}>Version {CONFIG.APP_VERSION}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>THE PROBLEM</Text>
        <Text style={styles.bodyText}>
          Over 7 million people in England are on an NHS waiting list right now. Most of them don't know they have a legal right — established in {CONFIG.NHS_CHOICE_YEAR} — to choose any NHS hospital that offers their treatment. A patient waiting 30 weeks at one trust could be seen in 9 weeks at another.
        </Text>
        <Text style={[styles.bodyText, { marginTop: 10 }]}>
          The information to make that switch exists. But it's scattered across PDFs, government websites, and trust-specific portals. No independent mobile app brought it together in one place — until now.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>WHAT WAITSMART DOES</Text>
        {[
          { icon: 'search' as const, title: 'Find shorter waits', desc: 'Compare waiting times across NHS trusts for 12 specialties. See which hospitals near you have shorter queues.' },
          { icon: 'activity' as const, title: 'Track your referral', desc: 'Enter your referral date and specialty. WaitSmart tracks your 18-week NHS target and shows you exactly where you stand.' },
          { icon: 'shield' as const, title: 'Know your rights', desc: 'Plain-English guides to Right to Choose, the 18-week standard, how to request a switch, and what to do if your trust refuses.' },
          { icon: 'lock' as const, title: 'Private by design', desc: 'All your data stays on your phone. No account required. No data shared. No ads. Ever.' },
        ].map(item => (
          <View key={item.title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Feather name={item.icon} size={16} color="#005EB8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionLabel}>NHS DATA</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{(DATA_SOURCE.totalWaiting / 1000000).toFixed(1)}M</Text>
            <Text style={styles.statLabel}>patients waiting</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{DATA_SOURCE.nationalMedian}wk</Text>
            <Text style={styles.statLabel}>median wait</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{CONFIG.NHS_CHOICE_YEAR}</Text>
            <Text style={styles.statLabel}>right to choose</Text>
          </View>
        </View>
        <Text style={styles.dataSource}>Source: NHS England RTT Statistics · {DATA_SOURCE.period}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>BUILT BY</Text>
        <Text style={styles.bodyText}>
          WaitSmart was built by Dilshad Ahmad, a software engineer based in Stoke-on-Trent, England. It started as a personal project after seeing family members struggle to navigate NHS waiting lists without knowing their options.
        </Text>
        <Text style={[styles.bodyText, { marginTop: 10 }]}>
          The app is independent and has no affiliation with NHS England or any NHS trust. All NHS data is sourced from publicly available statistics.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>LINKS</Text>
        {[
          { icon: 'github' as const, label: 'View on GitHub', url: 'https://github.com/dilshadblp/WaitSmart' },
          { icon: 'file-text' as const, label: 'Privacy Policy', url: 'https://github.com/dilshadblp/WaitSmart/blob/main/PRIVACY_POLICY.md' },
          { icon: 'bar-chart-2' as const, label: 'NHS RTT Statistics', url: 'https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/' },
        ].map(link => (
          <TouchableOpacity key={link.label} style={styles.linkRow} onPress={() => Linking.openURL(link.url)}>
            <Feather name={link.icon} size={15} color="#005EB8" />
            <Text style={styles.linkText}>{link.label}</Text>
            <Feather name="external-link" size={13} color={C.textSecondary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Feather name="share-2" size={16} color="white" />
        <Text style={styles.shareBtnText}>Share WaitSmart</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Dilshad Ahmad. All rights reserved.{'\n'}WaitSmart is not affiliated with NHS England.
      </Text>

    </ScrollView>
    </View>
  );
}

function makeStyles(C: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, marginBottom: 20 },
    backText: { fontSize: 15, color: '#005EB8' },
    hero: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
    logoBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#005EB8', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    logoText: { color: 'white', fontSize: 36, fontWeight: '700' },
    appName: { fontSize: 26, fontWeight: '600', color: C.textPrimary, marginBottom: 4 },
    tagline: { fontSize: 14, color: C.textSecondary, marginBottom: 4 },
    version: { fontSize: 12, color: C.textTertiary },
    section: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
    sectionLabel: { fontSize: 10, color: C.textSecondary, fontWeight: '500', letterSpacing: 0.8, marginBottom: 12 },
    bodyText: { fontSize: 14, color: C.textBody, lineHeight: 21 },
    featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
    featureIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: C.blueLight, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
    featureTitle: { fontSize: 14, fontWeight: '500', color: C.textPrimary, marginBottom: 3 },
    featureDesc: { fontSize: 13, color: C.textSecondary, lineHeight: 18 },
    statsCard: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    statItem: { alignItems: 'center' },
    statNum: { fontSize: 20, fontWeight: '600', color: '#005EB8', marginBottom: 3 },
    statLabel: { fontSize: 10, color: C.textSecondary, textAlign: 'center' },
    statDivider: { width: 0.5, backgroundColor: C.border },
    dataSource: { fontSize: 10, color: C.textTertiary, textAlign: 'center' },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: C.bg },
    linkText: { fontSize: 14, color: C.textPrimary },
    shareBtn: { backgroundColor: '#005EB8', marginHorizontal: 20, borderRadius: 14, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
    shareBtnText: { color: 'white', fontSize: 15, fontWeight: '500' },
    footer: { fontSize: 11, color: C.textTertiary, textAlign: 'center', lineHeight: 18, marginHorizontal: 20 },
  });
}
