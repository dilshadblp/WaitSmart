import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONFIG } from '../../constants/config';



export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
      if (months[mid] !== undefined) {
        return new Date(parseInt(parts[2]), months[mid], parseInt(parts[0]));
      }
    }
    return new Date(dateStr);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function getProgressWidth(): `${number}%` {
    if (!referralDate) return '0%';
    const referred = parseDate(referralDate);
    const now = new Date();
    const weeksWaited = Math.ceil(
      (now.getTime() - referred.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    const percent = Math.min(Math.round((weeksWaited / 18) * 100), 100);
    return `${percent}%`;
  }

  async function fetchLiveStats() {
    try {
      setStatsLoading(true);
      const response = await fetch(CONFIG.NHS_STATS_URL);
      const data = await response.json();
      setNhsStats(data);
    } catch (e) {
      // No internet — stats stay null
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message:
          '7.1M NHS patients are waiting — did you know you have the right to switch to a faster hospital?\n\n' +
          "I'm using WaitSmart to track my NHS referral and find shorter waits nearby. It's free.\n\n" +
          'Download it on Android: https://github.com/dilshadblp/WaitSmart',
        title: 'WaitSmart — Your NHS, faster.',
      });
    } catch (e) {
      // User dismissed share sheet — do nothing
    }
  }

  useEffect(() => {
    fetchLiveStats();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  async function loadUserData() {
    const name = await AsyncStorage.getItem('user_name');
    const spec = await AsyncStorage.getItem('user_specialty');
    const hosp = await AsyncStorage.getItem('user_hospital');
    const date = await AsyncStorage.getItem('user_referral_date');
    setUserName(name || '');
    setSpecialty(spec || '');
    setHospital(hosp || '');
    setReferralDate(date || '');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{userName || 'Welcome'}</Text>
        </View>

        {/* Share + Avatar buttons */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Feather name="share-2" size={18} color="#005EB8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : 'W'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BLUE REFERRAL CARD */}
      <View style={styles.referralCard}>
        <Text style={styles.referralLabel}>YOUR ACTIVE REFERRAL</Text>
        <Text style={styles.referralTitle}>{specialty || 'No referral yet'}</Text>
        {specialty ? (
          <Text style={styles.referralSub}>{referralDate} · {hospital}</Text>
        ) : (
          <Text style={styles.referralSub}>Add your referral details in Profile</Text>
        )}

        {/* Progress bar */}
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

      {/* ORANGE ALERT STRIP — only shows if user has a referral */}
      {specialty && (
        <TouchableOpacity style={styles.alertStrip} onPress={() => router.push('/find')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>⚠ Shorter wait found nearby</Text>
            <Text style={styles.alertSub}>
              Faster {specialty} appointments available — tap to compare all NHS trusts
            </Text>
          </View>
          <Text style={styles.alertArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* 4 ACTION BUTTONS */}
      <View style={styles.grid}>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/find')}>
          <View style={[styles.gridIcon, { backgroundColor: '#E6F1FB' }]} />
          <Text style={styles.gridTitle}>Find shorter wait</Text>
          <Text style={styles.gridSub}>Any specialty, any trust</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/track')}>
          <View style={[styles.gridIcon, { backgroundColor: '#EAF3DE' }]} />
          <Text style={styles.gridTitle}>Track referral</Text>
          <Text style={styles.gridSub}>{specialty ? `${specialty} · Active` : 'No referral yet'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/rights')}>
          <View style={[styles.gridIcon, { backgroundColor: '#FAEEDA' }]} />
          <Text style={styles.gridTitle}>Know your rights</Text>
          <Text style={styles.gridSub}>Patient guide {new Date().getFullYear()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/find')}>
          <View style={[styles.gridIcon, { backgroundColor: '#F1EFE8' }]} />
          <Text style={styles.gridTitle}>GP fast lane</Text>
          <Text style={styles.gridSub}>Same-day slots near you</Text>
        </TouchableOpacity>

      </View>

      {/* NHS STATS BOX */}
      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>
          NHS ENGLAND · {nhsStats ? nhsStats.dataPeriod.toUpperCase() : 'LIVE DATA'}
        </Text>

        {statsLoading ? (
          <View style={styles.statsRow}>
            <Text style={{ color: '#8E8E93', fontSize: 12, textAlign: 'center', flex: 1 }}>
              Loading latest NHS data...
            </Text>
          </View>
        ) : nhsStats ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {(nhsStats.totalWaiting / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.statSub}>waiting</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#A32D2D' }]}>
                {100 - nhsStats.percentWithin18Weeks}%
              </Text>
              <Text style={styles.statSub}>over 18wk</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#3B6D11' }]}>
                {nhsStats.percentWithin18Weeks}%
              </Text>
              <Text style={styles.statSub}>on target</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <Text style={{ color: '#8E8E93', fontSize: 12, textAlign: 'center', flex: 1 }}>
              Connect to internet to see live NHS stats
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.statsBtn} onPress={() => router.push('/rights')}>
          <Text style={styles.statsBtnText}>Your right to choose a faster trust ›</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#005EB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },

  // Referral card
  referralCard: {
    backgroundColor: '#005EB8',
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },
  referralLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 5,
  },
  referralTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 3,
  },
  referralSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginBottom: 16,
  },
  progressBg: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 99,
    height: 7,
    marginBottom: 7,
  },
  progressFill: {
    backgroundColor: 'white',
    borderRadius: 99,
    height: 7,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
  },

  // Alert strip
  alertStrip: {
    backgroundColor: '#FAEEDA',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 13,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#EF9F27',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7C4A00',
    marginBottom: 2,
  },
  alertSub: {
    fontSize: 11,
    color: '#854F0B',
    lineHeight: 16,
  },
  alertArrow: {
    fontSize: 24,
    color: '#854F0B',
    marginLeft: 8,
  },

  // 4 button grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  gridBtn: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    width: '47%',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  gridIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  gridSub: {
    fontSize: 11,
    color: '#8E8E93',
  },

  // NHS stats
  statsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  statsLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  statSub: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: '#E5E5EA',
  },
  statsBtn: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  statsBtnText: {
    fontSize: 12,
    color: '#005EB8',
    fontWeight: '500',
  },

});
