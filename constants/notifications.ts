import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// ─── Date parser (matches track.tsx) ─────────────────────────────────────────

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

// ─── Permission request ───────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Schedule notifications for a referral ────────────────────────────────────
// Schedules two alerts:
//   • Week 17 — "1 week until deadline" warning
//   • Week 18 — "Deadline breached" final alert
// Skips any alert whose trigger date is already in the past.

export async function scheduleReferralNotifications(referral: {
  id: string;
  specialty: string;
  hospital: string;
  referralDate: string;
}): Promise<void> {
  if (!referral.referralDate) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  const referred = parseDate(referral.referralDate);
  const now = new Date();
  const scheduledIds: string[] = [];

  // Week 17 — warning
  const week17 = new Date(referred.getTime() + 17 * 7 * 24 * 60 * 60 * 1000);
  //const week17 = new Date(Date.now() + 10 * 1000); // 10 seconds from now
  
  if (week17 > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ 1 week until your NHS deadline',
        body: `Your ${referral.specialty} deadline is in 7 days. Chase ${referral.hospital || 'your hospital'} or consider switching trust now.`,
        data: { referralId: referral.id, screen: 'track' },
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: week17 },
    });
    scheduledIds.push(id);
  }

  // Week 18 — breached
  const week18 = new Date(referred.getTime() + 18 * 7 * 24 * 60 * 60 * 1000);
  //const week18 = new Date(Date.now() + 20 * 1000); // 20 seconds from now
  if (week18 > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 NHS 18-week right breached',
        body: `Your ${referral.specialty} legal right has been breached. Open WaitSmart to find a faster hospital now.`,
        data: { referralId: referral.id, screen: 'find' },
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: week18 },
    });
    scheduledIds.push(id);
  }

  // Persist IDs so we can cancel them later
  if (scheduledIds.length > 0) {
    await AsyncStorage.setItem(
      `notif_ids_${referral.id}`,
      JSON.stringify(scheduledIds)
    );
  }
}

// ─── Cancel notifications for a referral ─────────────────────────────────────
// Called when a referral is deleted.

export async function cancelReferralNotifications(referralId: string): Promise<void> {
  const stored = await AsyncStorage.getItem(`notif_ids_${referralId}`);
  if (!stored) return;
  const ids: string[] = JSON.parse(stored);
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
  await AsyncStorage.removeItem(`notif_ids_${referralId}`);
}

// ─── Cancel all WaitSmart notifications ──────────────────────────────────────
// Used on app reset.

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
