'use client';

let activeNotification: Notification | null = null;
let originalTitle: string | null = null;

/**
 * Format seconds to MM:SS string
 */
export function formatTimerDisplay(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if browser supports system Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  
  if (Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return Notification.permission;
    }
  }
  return Notification.permission;
}

/**
 * Synthesize a pleasant completion audio chime using Web Audio API
 */
export function playCompletionAudio(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Play tone 1 (D5 - 587Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Play tone 2 (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (e) {
    console.warn('Audio chime playback omitted or blocked by user gesture policy:', e);
  }
}

/**
 * Trigger vibration pattern for rest completion
 */
export function playCompletionVibration(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    // Strong triple buzz pattern: 400ms buzz, 150ms pause, 400ms buzz, 150ms pause, 600ms buzz
    navigator.vibrate([400, 150, 400, 150, 600]);
  }
}

/**
 * Trigger mild warning vibration (e.g. at 10 seconds remaining)
 */
export function playWarningVibration(): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([100, 100, 100]);
  }
}

/**
 * Update or post system notification showing remaining rest time
 */
export async function updateRestNotification(secondsLeft: number, totalSeconds: number): Promise<void> {
  if (typeof window === 'undefined') return;

  // Track original document title
  if (originalTitle === null) {
    originalTitle = document.title;
  }

  const timeStr = formatTimerDisplay(secondsLeft);
  document.title = `(${timeStr}) Rest Timer — WorkoutSplit`;

  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const title = `⏳ Rest Timer: ${timeStr} left`;
  const body = `Resting... Get ready for your next set!`;
  const tag = 'workout-rest-timer';

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        tag,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        silent: true,
        renotify: false,
        data: { url: '/app/log' },
      });
    } else {
      if (activeNotification) {
        activeNotification.close();
      }
      activeNotification = new Notification(title, {
        body,
        tag,
        icon: '/icon-192.png',
        silent: true,
      });
    }
  } catch (err) {
    console.warn('Error updating rest notification:', err);
  }
}

/**
 * Trigger completion notification, sound, and vibration when rest timer hits 0
 */
export async function triggerRestCompletion(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Play sound & vibration
  playCompletionVibration();
  playCompletionAudio();

  // Restore document title with notification flash
  document.title = `⏰ Rest Complete! — WorkoutSplit`;

  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const title = `⏰ Rest Time Completed!`;
  const body = `Your rest period is over. Time to hit your next set!`;
  const tag = 'workout-rest-timer';
  const vibratePattern = [400, 150, 400, 150, 600];

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        tag,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: vibratePattern,
        renotify: true,
        requireInteraction: true,
        data: { url: '/app/log' },
      });
    } else {
      if (activeNotification) {
        activeNotification.close();
      }
      activeNotification = new Notification(title, {
        body,
        tag,
        icon: '/icon-192.png',
        requireInteraction: true,
      });
    }
  } catch (err) {
    console.warn('Error displaying completion notification:', err);
  }
}

/**
 * Clear notification and reset document title
 */
export async function clearRestNotification(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (originalTitle !== null) {
    document.title = originalTitle;
    originalTitle = null;
  }

  if (activeNotification) {
    activeNotification.close();
    activeNotification = null;
  }

  if (isNotificationSupported() && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const notifications = await reg.getNotifications({ tag: 'workout-rest-timer' });
      notifications.forEach((n) => n.close());
    } catch (e) {
      console.warn('Error clearing service worker notifications:', e);
    }
  }
}
