import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { CONFIG } from '../constants/config';
import { DATA_SOURCE, SPECIALTY_NAMES } from '../constants/nhsData';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';



export default function OnboardingScreen() {
    const [name, setName] = useState('');
    const [totalWaiting, setTotalWaiting] = useState(
        (DATA_SOURCE.totalWaiting / 1000000).toFixed(1) + 'M'
    );

    useEffect(() => {
        fetch(CONFIG.NHS_STATS_URL)
            .then(r => r.json())
            .then(d => setTotalWaiting((d.totalWaiting / 1000000).toFixed(1) + 'M'))
            .catch(() => {});
    }, []);
    const [specialty, setSpecialty] = useState('');
    const [hospital, setHospital] = useState('');
    const [referralDate, setReferralDate] = useState('');
    const [step, setStep] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    async function handleFinish() {
        if (!name.trim()) return;
        await AsyncStorage.setItem('user_name', name.trim());
        await AsyncStorage.setItem('user_specialty', specialty || '');
        await AsyncStorage.setItem('user_hospital', hospital.trim() || '');
        await AsyncStorage.setItem('user_referral_date', referralDate.trim() || '');
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/(tabs)');
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>W</Text>
                    </View>
                    <Text style={styles.appName}>WaitSmart</Text>
                    <Text style={styles.tagline}>Your NHS, faster.</Text>
                </View>

                {/* STEP INDICATOR */}
                <View style={styles.stepRow}>
                    {[1, 2, 3].map(s => (
                        <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
                    ))}
                </View>

                {/* STEP 1 — NAME */}
                {step === 1 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>What's your name?</Text>
                        <Text style={styles.cardSub}>So we can personalise your dashboard</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your first name"
                            placeholderTextColor="#C7C7CC"
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            autoCapitalize="words"
                        />
                        <TouchableOpacity
                            style={[styles.btn, !name.trim() && styles.btnDisabled]}
                            onPress={() => name.trim() && setStep(2)}
                        >
                            <Text style={styles.btnText}>Continue →</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 2 — SPECIALTY */}
                {step === 2 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Do you have an active referral?</Text>
                        <Text style={styles.cardSub}>Select your specialty — or skip if you don't have one yet</Text>
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
                        </View>
                        <TouchableOpacity style={styles.btn} onPress={() => setStep(3)}>
                            <Text style={styles.btnText}>{specialty ? 'Continue →' : 'Skip →'}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* STEP 3 — HOSPITAL + DATE */}
                {step === 3 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Which hospital referred you?</Text>
                        <Text style={styles.cardSub}>We'll track your wait and find faster alternatives</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your hospital name"
                            placeholderTextColor="#C7C7CC"
                            value={hospital}
                            onChangeText={setHospital}
                            autoCapitalize="words"
                        />
                        <Text style={[styles.cardSub, { marginTop: 16, marginBottom: 8 }]}>
                            When did your GP refer you?
                        </Text>

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
                                            year: 'numeric'
                                        });
                                        setReferralDate(formatted);
                                    }
                                }}
                            />
                        )}
                        <TouchableOpacity style={styles.btn} onPress={handleFinish}>
                            <Text style={styles.btnText}>Let's go →</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* TRUST BOX */}
                <View style={styles.trustBox}>
                    <Text style={styles.trustText}>
                        🔒 Your data stays on your phone only. We never share or sell it.
                    </Text>
                </View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    {[
                        { n: totalWaiting, l: 'NHS patients waiting' },
                        { n: CONFIG.APP_PRICE, l: 'Always free to use' },
                        { n: CONFIG.NHS_CHOICE_YEAR, l: 'Your right to choose' },
                    ].map(s => (
                        <View key={s.l} style={styles.statItem}>
                            <Text style={styles.statNum}>{s.n}</Text>
                            <Text style={styles.statLabel}>{s.l}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        paddingTop: 80,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#005EB8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '700',
    },
    appName: {
        fontSize: 28,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    tagline: {
        fontSize: 14,
        color: '#8E8E93',
    },

    // Step dots
    stepRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D1D6',
    },
    stepDotActive: {
        backgroundColor: '#005EB8',
        width: 24,
    },

    // Card
    card: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: '#E5E5EA',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1C1C1E',
        marginBottom: 6,
    },
    cardSub: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 16,
        lineHeight: 18,
    },

    // Input
    input: {
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#1C1C1E',
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: '#E5E5EA',
    },

    // Button
    btn: {
        backgroundColor: '#005EB8',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    btnDisabled: {
        backgroundColor: '#C7C7CC',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
    },

    // Specialty pills
    pillGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
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

    // Trust box
    trustBox: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#EAF3DE',
        borderRadius: 12,
    },
    trustText: {
        fontSize: 12,
        color: '#3B6D11',
        textAlign: 'center',
        lineHeight: 18,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginBottom: 60,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 0.5,
        borderColor: '#E5E5EA',
    },
    statItem: {
        alignItems: 'center',
    },
    statNum: {
        fontSize: 18,
        fontWeight: '600',
        color: '#005EB8',
        marginBottom: 3,
    },
    statLabel: {
        fontSize: 10,
        color: '#8E8E93',
        textAlign: 'center',
        maxWidth: 70,
    },
});
