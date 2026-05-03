import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [referralDate, setReferralDate] = useState('');
  const [nhsStats, setNhsStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
  async function fetchLiveStats() {
    try {
      setStatsLoading(true);
      const response = await fetch(
        'https://raw.githubusercontent.com/dilshadblp/WaitSmart/main/nhs-live-stats.json'
      );
      const data = await response.json();
      setNhsStats(data);
    } catch (e) {
      // No internet — stats stay null
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();
    fetchLiveStats();
  }, []);

  async function loadUserData() {
    const name = await AsyncStorage.getItem('user_name');
    const spec = await AsyncStorage.getItem('user_specialty');
    const hosp = await AsyncStorage.getItem('user_hospital');
    const date = await AsyncStorage.getItem('user_referral_date');
    if (name) setUserName(name);
    if (spec) setSpecialty(spec);
    if (hosp) setHospital(hosp);
    if (date) setReferralDate(date);
  }

  return (
    <ScrollView style={styles.container}>

      {/* TOP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{userName || 'Welcome'}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName ? userName[0].toUpperCase() : 'W'}</Text>
        </View>
      </View>

      {/* BLUE REFERRAL CARD */}
      <View style={styles.referralCard}>
        <Text style={styles.referralLabel}>YOUR ACTIVE REFERRAL</Text>
        <Text style={styles.referralTitle}>{specialty || 'No referral yet'}</Text>
        <Text style={styles.referralSub}>{referralDate} · {hospital}</Text>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{referralDate ? `Referred: ${referralDate}` : 'Referral in progress'}</Text>
          <Text style={styles.progressText}>18 week target</Text>
        </View>
      </View>

      {/* ORANGE ALERT STRIP */}
      <TouchableOpacity style={styles.alertStrip} onPress={() => router.push('/find')}>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>⚠ Shorter wait found nearby</Text>
          <Text style={styles.alertSub}>Tap to find NHS hospitals with shorter waits than your current trust</Text>
        </View>
        <Text style={styles.alertArrow}>›</Text>
      </TouchableOpacity>

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
          <Text style={styles.gridSub}>1 active · On track</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/rights')}>
          <View style={[styles.gridIcon, { backgroundColor: '#FAEEDA' }]} />
          <Text style={styles.gridTitle}>Know your rights</Text>
          <Text style={styles.gridSub}>Patient guide 2025</Text>
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
    paddingTop: 60,
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
    width: '50%',
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
