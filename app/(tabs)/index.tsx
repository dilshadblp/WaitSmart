import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors, DarkColors, LightColors } from '../../constants/Colors';
import { CONFIG } from '../../constants/config';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const C = scheme === 'dark' ? DarkColors : LightColors;
  const styles = makeStyles(C);

  const [userName, setUserName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [referralDate, setReferralDate] = useState('');
  const [nhsStats, setNhsStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  function parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const months: Record<string, number> = {
      january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
      july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    };
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const mid = parts[1].toLowerCase();
      if (months[mid] !== undefined) return new Date(parseInt(parts[2]), months[mid], parseInt(parts[0]));
    }
    return new Date(dateStr);
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function getProgressWidth(): `${number}%` {
    if (!referralDate) return '0%';
    const weeks = Math.ceil((new Date().getTime() - parseDate(referralDate).getTime()) / (1000 * 60 * 60 * 24 * 7));
    return `${Math.min(Math.round((weeks / 18) * 100), 100)}%`;
  }

  async function fetchLiveStats() {
    try {
      setStatsLoading(true);
      const data = await (await fetch(CONFIG.NHS_STATS_URL)).json();
      setNhsStats(data);
    } catch (e) {
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message: '7.1M NHS patients are waiting — did you know you have the right to switch to a faster hospital?\n\nI\'m using WaitSmart to track my NHS referral and find shorter waits nearby. It\'s free.\n\nDownload it on Android: https://github.com/dilshadblp/WaitSmart',
        title: 'WaitSmart — Your NHS, faster.',
      });
    } catch (e) {}
  }

  useEffect(() => { fetchLiveStats(); }, []);
  useFocusEffect(useCallback(() => { loadUserData(); }, []));

  async function loadUserData() {
    const name = await AsyncStorage.getItem('user_name');
    const spec = await AsyncStorage.getItem('user_specialty');
    const hosp = await AsyncStorage.getItem('user_hospital');
    const date = await AsyncStorage.getItem('user_referral_date');
    setUserName(name || ''); setSpecialty(spec || ''); setHospital(hosp || ''); setReferralDate(date || '');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{userName || 'Welcome'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Feather name="share-2" size={18} color="#005EB8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : 'W'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.referralCard}>
        <Text style={styles.referralLabel}>YOUR ACTIVE REFERRAL</Text>
        <Text style={styles.referralTitle}>{specialty || 'No referral yet'}</Text>
        <Text style={styles.referralSub}>
          {specialty ? `${referralDate} · ${hospital}` : 'Add your referral details in Profile'}
        </Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: getProgressWidth() }]} />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {specialty && referralDate ? `Week ${Math.ceil((new Date().getTime() - parseDate(referralDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} of 18` : ''}
          </Text>
          <Text style={styles.progressText}>
            {specialty && referralDate ? `Due: ${new Date(parseDate(referralDate).getTime() + 18 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
          </Text>
        </View>
      </View>

      {specialty && (
        <TouchableOpacity style={styles.alertStrip} onPress={() => router.push('/find')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>⚠ Shorter wait found nearby</Text>
            <Text style={styles.alertSub}>Faster {specialty} appointments available — tap to compare all NHS trusts</Text>
          </View>
          <Text style={styles.alertArrow}>›</Text>
        </TouchableOpacity>
      )}

      <View style={styles.grid}>
        {[
          { title: 'Find shorter wait', sub: 'Any specialty, any trust', bg: C.blueLight, route: '/find' },
          { title: 'Track referral', sub: specialty ? `${specialty} · Active` : 'No referral yet', bg: C.greenLight, route: '/track' },
          { title: 'Know your rights', sub: `Patient guide ${new Date().getFullYear()}`, bg: C.orangeLight, route: '/rights' },
          { title: 'GP fast lane', sub: 'Same-day slots near you', bg: C.surfaceSecondary, route: '/find' },
        ].map(item => (
          <TouchableOpacity key={item.title} style={styles.gridBtn} onPress={() => router.push(item.route as any)}>
            <View style={[styles.gridIcon, { backgroundColor: item.bg }]} />
            <Text style={styles.gridTitle}>{item.title}</Text>
            <Text style={styles.gridSub}>{item.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>NHS ENGLAND · {nhsStats ? nhsStats.dataPeriod.toUpperCase() : 'LIVE DATA'}</Text>
        {statsLoading ? (
          <View style={styles.statsRow}>
            <Text style={{ color: C.textSecondary, fontSize: 12, textAlign: 'center', flex: 1 }}>Loading latest NHS data...</Text>
          </View>
        ) : nhsStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{(nhsStats.totalWaiting / 1000000).toFixed(1)}M</Text>
              <Text style={styles.statSub}>waiting</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: C.red }]}>{100 - nhsStats.percentWithin18Weeks}%</Text>
              <Text style={styles.statSub}>over 18wk</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: C.green }]}>{nhsStats.percentWithin18Weeks}%</Text>
              <Text style={styles.statSub}>on target</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <Text style={{ color: C.textSecondary, fontSize: 12, textAlign: 'center', flex: 1 }}>Connect to internet to see live NHS stats</Text>
          </View>
        )}
        <TouchableOpacity style={styles.statsBtn} onPress={() => router.push('/rights')}>
          <Text style={styles.statsBtnText}>Your right to choose a faster trust ›</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

function makeStyles(C: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    greeting: { fontSize: 13, color: C.textSecondary, marginBottom: 2 },
    name: { fontSize: 26, fontWeight: '500', color: C.textPrimary },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    shareBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: C.border },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#005EB8', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: 'white', fontSize: 17, fontWeight: '500' },
    referralCard: { backgroundColor: '#005EB8', marginHorizontal: 20, borderRadius: 18, padding: 18, marginBottom: 12 },
    referralLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, letterSpacing: 1, marginBottom: 5 },
    referralTitle: { color: 'white', fontSize: 22, fontWeight: '500', marginBottom: 3 },
    referralSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 16 },
    progressBg: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 99, height: 7, marginBottom: 7 },
    progressFill: { backgroundColor: 'white', borderRadius: 99, height: 7 },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
    progressText: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },
    alertStrip: { backgroundColor: C.orangeLight, marginHorizontal: 20, borderRadius: 14, padding: 13, marginBottom: 14, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#EF9F27' },
    alertTitle: { fontSize: 13, fontWeight: '500', color: C.orange, marginBottom: 2 },
    alertSub: { fontSize: 11, color: C.orange, lineHeight: 16 },
    alertArrow: { fontSize: 24, color: C.orange, marginLeft: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10, marginBottom: 14 },
    gridBtn: { backgroundColor: C.surface, borderRadius: 16, padding: 14, width: '47%', borderWidth: 0.5, borderColor: C.border },
    gridIcon: { width: 32, height: 32, borderRadius: 9, marginBottom: 10 },
    gridTitle: { fontSize: 13, fontWeight: '500', color: C.textPrimary, marginBottom: 2 },
    gridSub: { fontSize: 11, color: C.textSecondary },
    statsCard: { backgroundColor: C.surface, marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 40, borderWidth: 0.5, borderColor: C.border },
    statsLabel: { fontSize: 10, color: C.textSecondary, fontWeight: '500', letterSpacing: 0.8, marginBottom: 12 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
    statItem: { alignItems: 'center' },
    statNumber: { fontSize: 22, fontWeight: '500', color: C.textPrimary },
    statSub: { fontSize: 10, color: C.textSecondary, marginTop: 2 },
    statDivider: { width: 0.5, backgroundColor: C.border },
    statsBtn: { backgroundColor: C.bg, borderRadius: 10, padding: 10, alignItems: 'center' },
    statsBtnText: { fontSize: 12, color: C.blueText, fontWeight: '500' },
  });
}
