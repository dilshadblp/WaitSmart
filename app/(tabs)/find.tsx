import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DATA_SOURCE, NHS_RTT_DATA, SPECIALTY_NAMES } from '../../constants/nhsData';



function getStatus(weeks: number) {
  if (weeks <= 10) return { label: 'Short wait', bg: '#EAF3DE', color: '#3B6D11' };
  if (weeks <= 18) return { label: 'Moderate', bg: '#FAEEDA', color: '#854F0B' };
  return { label: 'Long wait', bg: '#FCEBEB', color: '#A32D2D' };
}

export default function FindScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [userHospital, setUserHospital] = useState('');
  const scrollRef = useRef<any>(null);
  const pillPositions = useRef<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function autoSelectSpecialty() {
        const hosp = await AsyncStorage.getItem('user_hospital');
        setUserHospital(hosp || '');
        const userSpecialty = await AsyncStorage.getItem('user_specialty');
        if (userSpecialty && userSpecialty !== '') {
          const index = SPECIALTY_NAMES.findIndex(
            s => s.toLowerCase() === userSpecialty.toLowerCase()
          );
          if (index !== -1) {
            setSelected(index);
            setSelectedRegion('All');
            setTimeout(() => {
              const x = pillPositions.current[index] ?? 0;
              scrollRef.current?.scrollTo({
                x: Math.max(0, x - 20),
                animated: true,
              });
            }, 300);
          } else {
            setSelected(0);
            setSelectedRegion('All');
            scrollRef.current?.scrollTo({ x: 0, animated: true });
          }
        } else {
          setSelected(0);
          setSelectedRegion('All');
          scrollRef.current?.scrollTo({ x: 0, animated: true });
        }
      }
      autoSelectSpecialty();
    }, [])
  );

  const currentSpecialty = SPECIALTY_NAMES[selected];
  const specialtyData = NHS_RTT_DATA[currentSpecialty];
  const ALL_HOSPITALS = specialtyData?.hospitals || [];

  // Build unique region list from current specialty's hospitals
  const regions = ['All', ...Array.from(new Set(ALL_HOSPITALS.map(h => h.region))).sort()];

  // Apply region filter
  const HOSPITALS = selectedRegion === 'All'
    ? ALL_HOSPITALS
    : ALL_HOSPITALS.filter(h => h.region === selectedRegion);

  // Comparison values
  const nationalMedian = DATA_SOURCE.nationalMedian;
  const bestAvailable = ALL_HOSPITALS.length > 0 ? ALL_HOSPITALS[0].medianWeeks : null;
  const userHospitalData = userHospital
    ? ALL_HOSPITALS.find(h => h.name.toLowerCase().includes(userHospital.toLowerCase()))
    : null;

  function handleSpecialtyChange(index: number) {
    setSelected(index);
    setSelectedRegion('All'); // reset region when specialty changes
    const x = pillPositions.current[index] ?? 0;
    scrollRef.current?.scrollTo({
      x: Math.max(0, x - 20),
      animated: true,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Find shorter wait</Text>
        <Text style={styles.subtitle}>Exercise your legal right · Any NHS trust in England</Text>
        <Text style={{ fontSize: 11, color: '#EF9F27', marginTop: 4 }}>
          ⚠ Data: NHS England {DATA_SOURCE.period} · Verify with your GP before switching
        </Text>
        {!currentSpecialty && (
          <View style={{ backgroundColor: '#E6F1FB', borderRadius: 10, padding: 10, marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#185FA5' }}>
              💡 Tip: Add your specialty in Profile to auto-select your hospitals
            </Text>
          </View>
        )}
      </View>

      {/* SPECIALTY PILLS */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillRow}
      >
        {SPECIALTY_NAMES.map((s, i) => (
          <TouchableOpacity
            key={s}
            style={[styles.pill, i === selected && styles.pillActive]}
            onPress={() => handleSpecialtyChange(i)}
            onLayout={(e) => {
              pillPositions.current[i] = e.nativeEvent.layout.x;
            }}
          >
            <Text style={[styles.pillText, i === selected && styles.pillTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* REGION FILTER */}
      <View style={styles.regionWrapper}>
        <Text style={styles.regionLabel}>FILTER BY REGION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.regionRow}>
          {regions.map(region => (
            <TouchableOpacity
              key={region}
              style={[styles.regionPill, selectedRegion === region && styles.regionPillActive]}
              onPress={() => setSelectedRegion(region)}
            >
              <Text style={[styles.regionPillText, selectedRegion === region && styles.regionPillTextActive]}>
                {region}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* COMPARISON CARD — only shows when user has a specialty */}
      {currentSpecialty && bestAvailable !== null && (
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>HOW YOUR WAIT COMPARES</Text>
          <View style={styles.comparisonRow}>

            {/* Your hospital */}
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonNum}>
                {userHospitalData ? `${userHospitalData.medianWeeks}w` : '—'}
              </Text>
              <Text style={styles.comparisonLabel}>Your hospital</Text>
              {userHospitalData && (
                <Text style={styles.comparisonSub} numberOfLines={1}>{userHospitalData.name.split(' ').slice(0, 2).join(' ')}</Text>
              )}
              {!userHospitalData && (
                <Text style={styles.comparisonSub}>Add in Profile</Text>
              )}
            </View>

            <View style={styles.comparisonDivider} />

            {/* National median */}
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonNum}>{nationalMedian}w</Text>
              <Text style={styles.comparisonLabel}>National median</Text>
              <Text style={styles.comparisonSub}>England avg</Text>
            </View>

            <View style={styles.comparisonDivider} />

            {/* Best available */}
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonNum, { color: '#3B6D11' }]}>{bestAvailable}w</Text>
              <Text style={styles.comparisonLabel}>Best available</Text>
              <Text style={styles.comparisonSub}>Any NHS trust</Text>
            </View>

          </View>

          {/* Saving callout — only if user hospital is found and slower than best */}
          {userHospitalData && userHospitalData.medianWeeks > bestAvailable && (
            <View style={styles.savingStrip}>
              <Text style={styles.savingText}>
                💡 Switching could save you{' '}
                <Text style={{ fontWeight: '600' }}>
                  {userHospitalData.medianWeeks - bestAvailable} weeks
                </Text>
              </Text>
            </View>
          )}
        </View>
      )}

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          {currentSpecialty} · {HOSPITALS.length} trust{HOSPITALS.length !== 1 ? 's' : ''}
          {selectedRegion !== 'All' ? ` in ${selectedRegion}` : ' across England'}
        </Text>
        <View style={styles.nhsBadge}>
          <Text style={styles.nhsBadgeText}>NHS</Text>
        </View>
      </View>

      {/* EMPTY STATE — no hospitals in selected region */}
      {HOSPITALS.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No trusts found</Text>
          <Text style={styles.emptyText}>
            No {currentSpecialty} data available for {selectedRegion}.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => setSelectedRegion('All')}
          >
            <Text style={styles.emptyBtnText}>Show all regions</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* HOSPITAL LIST */}
      <View style={styles.listContainer}>
        {HOSPITALS.map((h, i) => {
          const status = getStatus(h.medianWeeks);
          const isTop = i === 0;
          return (
            <View key={h.name} style={[styles.hospitalCard, isTop && styles.hospitalCardTop]}>

              {/* Top badge for best result */}
              {isTop && (
                <View style={styles.topBadge}>
                  <Text style={styles.topBadgeText}>
                    {selectedRegion === 'All' ? 'SHORTEST WAIT NEARBY' : `SHORTEST IN ${selectedRegion.toUpperCase()}`}
                  </Text>
                </View>
              )}

              <View style={styles.hospitalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalName}>{h.name}</Text>
                  <Text style={styles.hospitalRegion}>
                    {h.region} · {h.totalWaiting.toLocaleString()} waiting
                  </Text>
                </View>
                <Text style={[styles.weeks, isTop && { color: '#005EB8' }]}>
                  {h.medianWeeks}<Text style={styles.weeksLabel}>w</Text>
                </Text>
              </View>

              <View style={styles.hospitalFooter}>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <TouchableOpacity
                  style={styles.switchBtn}
                  onPress={() => {
                    Alert.alert(
                      'Switch to ' + h.name + '?',
                      'This will notify your GP to update your referral to ' + h.name + '. They will contact you within 5 working days to confirm.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Yes, switch trust', onPress: () => Alert.alert('✓ Request sent', 'Your GP has been notified. You will receive confirmation within 5 working days.') }
                      ]
                    );
                  }}
                >
                  <Text style={styles.switchBtnText}>{isTop ? 'Switch to this trust ›' : 'Switch ›'}</Text>
                </TouchableOpacity>
              </View>

            </View>
          );
        })}
      </View>

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

  // Specialty pills
  pillRow: {
    paddingLeft: 20,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: '#D1D1D6',
    backgroundColor: 'white',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#005EB8',
    borderColor: '#005EB8',
  },
  pillText: {
    fontSize: 13,
    color: '#3C3C43',
  },
  pillTextActive: {
    color: 'white',
    fontWeight: '500',
  },

  // Region filter
  regionWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  regionLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  regionRow: {
    flexDirection: 'row',
  },
  regionPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: '#D1D1D6',
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  regionPillActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  regionPillText: {
    fontSize: 12,
    color: '#3C3C43',
  },
  regionPillTextActive: {
    color: 'white',
    fontWeight: '500',
  },

  // Comparison card
  comparisonCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  comparisonTitle: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  comparisonItem: {
    alignItems: 'center',
    flex: 1,
  },
  comparisonNum: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  comparisonLabel: {
    fontSize: 11,
    color: '#3C3C43',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  comparisonSub: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  comparisonDivider: {
    width: 0.5,
    backgroundColor: '#E5E5EA',
    alignSelf: 'stretch',
  },
  savingStrip: {
    marginTop: 12,
    backgroundColor: '#EAF3DE',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  savingText: {
    fontSize: 13,
    color: '#3B6D11',
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
  },
  nhsBadge: {
    backgroundColor: '#E6F1FB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nhsBadgeText: {
    fontSize: 11,
    color: '#185FA5',
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyBtn: {
    backgroundColor: '#005EB8',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },

  // Hospital cards
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hospitalCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  hospitalCardTop: {
    borderWidth: 2,
    borderColor: '#005EB8',
  },
  topBadge: {
    backgroundColor: '#005EB8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  topBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  hospitalRegion: {
    fontSize: 11,
    color: '#8E8E93',
  },
  weeks: {
    fontSize: 26,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  weeksLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  hospitalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  switchBtn: {
    backgroundColor: '#005EB8',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  switchBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },

});
