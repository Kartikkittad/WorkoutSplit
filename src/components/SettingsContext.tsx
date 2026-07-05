'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/dexie';

interface SettingsState {
  userName: string;
  weightUnit: 'kg' | 'lbs';
  restTimerDuration: number; // in seconds
  onboardingComplete: boolean;
}

interface SettingsContextType extends SettingsState {
  updateSettings: (partial: Partial<SettingsState>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: SettingsState = {
  userName: 'Athlete',
  weightUnit: 'kg',
  restTimerDuration: 60,
  onboardingComplete: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const allSettings = await db.settings.toArray();
        const settingsMap: Record<string, any> = {};
        for (const s of allSettings) {
          settingsMap[s.key] = s.value;
        }

        setSettings({
          userName: settingsMap.name || defaultSettings.userName,
          weightUnit: settingsMap.weightUnit || defaultSettings.weightUnit,
          restTimerDuration: settingsMap.restTimerDuration || defaultSettings.restTimerDuration,
          onboardingComplete: settingsMap.onboarding_complete || defaultSettings.onboardingComplete,
        });
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
      if (partial.userName !== undefined) await db.settings.put({ key: 'name', value: partial.userName });
      if (partial.weightUnit !== undefined) await db.settings.put({ key: 'weightUnit', value: partial.weightUnit });
      if (partial.restTimerDuration !== undefined) await db.settings.put({ key: 'restTimerDuration', value: partial.restTimerDuration });
      if (partial.onboardingComplete !== undefined) await db.settings.put({ key: 'onboarding_complete', value: partial.onboardingComplete });
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
