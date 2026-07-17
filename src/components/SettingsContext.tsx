'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/dexie';

interface SettingsState {
  userName: string;
  userGender: 'male' | 'female' | null;
  weightUnit: 'kg' | 'lbs';
  restTimerDuration: number; // in seconds
  onboardingComplete: boolean;
  buddyName: string;
}

interface SettingsContextType extends SettingsState {
  updateSettings: (partial: Partial<SettingsState>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: SettingsState = {
  userName: 'Athlete',
  userGender: null,
  weightUnit: 'kg',
  restTimerDuration: 60,
  onboardingComplete: false,
  buddyName: '',
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const isBrowser = typeof window !== 'undefined';

const getInitialSettings = (): SettingsState => {
  const name = isBrowser ? localStorage.getItem('user_name') || 'Athlete' : 'Athlete';
  const gender = isBrowser ? (localStorage.getItem('user_gender') as any) || null : null;
  const obComplete = isBrowser ? localStorage.getItem('onboarding_complete') === 'true' : false;
  const buddyName = isBrowser ? localStorage.getItem('buddy_name') || '' : '';

  return {
    userName: name,
    userGender: gender,
    weightUnit: 'kg',
    restTimerDuration: 60,
    onboardingComplete: obComplete,
    buddyName: buddyName,
  };
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(getInitialSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const allSettings = await db.settings.toArray();
        const settingsMap: Record<string, any> = {};
        for (const s of allSettings) {
          settingsMap[s.key] = s.value;
        }

        const userName = settingsMap.user_name || settingsMap.name || settings.userName;
        const userGender = settingsMap.user_gender || settings.userGender;
        const onboardingComplete = settingsMap.onboarding_complete !== undefined
          ? settingsMap.onboarding_complete
          : settings.onboardingComplete;
        const buddyName = settingsMap.buddy_name || '';

        setSettings({
          userName,
          userGender,
          weightUnit: settingsMap.weightUnit || settings.weightUnit,
          restTimerDuration: settingsMap.restTimerDuration || settings.restTimerDuration,
          onboardingComplete,
          buddyName,
        });

        // Sync to local storage
        localStorage.setItem('user_name', userName);
        if (userGender) localStorage.setItem('user_gender', userGender);
        localStorage.setItem('onboarding_complete', onboardingComplete ? 'true' : 'false');
        localStorage.setItem('buddy_name', buddyName);
      } catch (err) {
        console.error('Failed to load settings from Dexie:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const updateSettings = async (partial: Partial<SettingsState>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);

    try {
      if (partial.userName !== undefined) {
        await db.settings.put({ key: 'user_name', value: partial.userName });
        await db.settings.put({ key: 'name', value: partial.userName });
        localStorage.setItem('user_name', partial.userName);
      }
      if (partial.userGender !== undefined) {
        await db.settings.put({ key: 'user_gender', value: partial.userGender });
        localStorage.setItem('user_gender', partial.userGender || '');
      }
      if (partial.weightUnit !== undefined) {
        await db.settings.put({ key: 'weightUnit', value: partial.weightUnit });
      }
      if (partial.restTimerDuration !== undefined) {
        await db.settings.put({ key: 'restTimerDuration', value: partial.restTimerDuration });
      }
      if (partial.onboardingComplete !== undefined) {
        await db.settings.put({ key: 'onboarding_complete', value: partial.onboardingComplete });
        localStorage.setItem('onboarding_complete', partial.onboardingComplete ? 'true' : 'false');
      }
      if (partial.buddyName !== undefined) {
        await db.settings.put({ key: 'buddy_name', value: partial.buddyName });
        localStorage.setItem('buddy_name', partial.buddyName);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
