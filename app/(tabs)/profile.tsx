import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HospitalPicker from '../../components/HospitalPicker';
import { CONFIG } from '../../constants/config';
import { DATA_SOURCE, SPECIALTY_NAMES } from '../../constants/nhsData';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [referralDate, setReferralDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [saved, setSaved] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const n = await AsyncStorage.getItem('user_name');
    const s = await AsyncStorage.getItem('user_specialty');
    const h = await AsyncStorage.getItem('user_hospital');
    const d = await AsyncStorage.getItem('user_referral_date');
    if (n) setName(n);
    if (s) setSpecialty(s);
    if (h) setHospital(h);
    if (d) setReferralDate(d);
  }

  async function saveChanges() {
    await AsyncStorage.setItem('user_name', name.trim());
    await AsyncStorage.setItem('user_specialty', specialty);
    await AsyncStorage.setItem('user_hospital', hospital.trim());
    await AsyncStorage.setItem('user_referral_date', referralDate);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function resetApp() {
    Alert.alert(
      'Reset app?',
      'This will clear all your data and take you back to the start.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/onboarding');
          }
        }
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + 16 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : 'W'}</Text>
        </View>
        <Text style={styles.title}>Your profile</Text>
        <Text style={styles.subtitle}>Update your details anytime</Text>
      </View>

      {/* NAME */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR NAME</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#C7C7CC"
          autoCapitalize="words"
        />
      </View>

      {/* SPECIALTY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR SPECIALTY</Text>
        <Text style={styles.sectionSub}>Select your referral specialty</Text>
        <View style={styles.pillGrid}>
          {SPECIALTY_NAMES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.pill, specialty === s && styles.pillActive]}
              onPress={() => setSpecialty(s)}
            >
              <Text style={[styles.pillText, specialty === s && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.pill, specialty === '' && styles.pillActive]}
            onPress={() => setSpecialty('')}
          >
            <Text style={[styles.pillText, specialty === '' && styles.pillTextActive]}>No referral</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HOSPITAL */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YOUR HOSPITAL</Text>
        <HospitalPicker value={hospital} onChange={setHospital} />
      </View>

      {/* REFERRAL DATE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>REFERRAL DATE</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: referralDate ? '#1C1C1E' : '#C7C7CC', fontSize: 15 }}>
            {referralDate || 'Tap to select date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
                const formatted = date.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                setReferralDate(formatted);
              }
            }}
          />
        )}
        {referralDate ? (
          <TouchableOpacity onPress={() => setReferralDate('')}>
            <Text style={{ color: '#A32D2D', fontSize: 12, marginTop: 6 }}>
              Clear date
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
        onPress={saveChanges}
      >
        <Text style={styles.saveBtnText}>
          {saved ? '✓ Saved!' : 'Save changes'}
        </Text>
      </TouchableOpacity>

      {/* RESET */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger zone</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={resetApp}>
          <Text style={styles.resetBtnText}>Reset app & start over</Text>
        </TouchableOpacity>
      </View>

      {/* APP INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>WaitSmart</Text>
        <Text style={styles.infoText}>Version {CONFIG.APP_VERSION}</Text>
        <Text style={styles.infoText}>Your data is stored on your phone only.</Text>
        <Text style={styles.infoText}>We never share or sell your information.</Text>
        <Text style={[styles.infoText, { color: '#005EB8', marginTop: 8 }]}>
          Data: NHS England RTT Statistics · {DATA_SOURCE.period}
        </Text>

        {/* About + Privacy links */}
        <View style={styles.infoLinks}>
          <TouchableOpacity onPress={() => router.push('/about')}>
            <Text style={styles.infoLink}>About WaitSmart →</Text>
          </TouchableOpacity>
          <Text style={styles.infoLinkDivider}>·</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://github.com/dilshadblp/WaitSmart/blob/main/PRIVACY_POLICY.md')}
          >
            <Text style={styles.infoLink}>Privacy Policy →</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.infoText, { marginTop: 8, fontSize: 10 }]}>
          WaitSmart is independent and not affiliated with NHS England.
        </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#005EB8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
  },

  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1C1C1E',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },

  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: '#D1D1D6',
    backgroundColor: '#F2F2F7',
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

  saveBtn: {
    backgroundColor: '#005EB8',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnSuccess: {
    backgroundColor: '#3B6D11',
  },
  saveBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },

  dangerZone: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  dangerTitle: {
    fontSize: 10,
    color: '#A32D2D',
    fontWeight: '500',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: '#FCEBEB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E24B4A',
  },
  resetBtnText: {
    color: '#A32D2D',
    fontSize: 14,
    fontWeight: '500',
  },

  infoBox: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 2,
  },
  infoLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  infoLink: {
    fontSize: 12,
    color: '#005EB8',
  },
  infoLinkDivider: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});
