'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { env } from '@/lib/env';

interface SettingsState {
  userName: string;
  userGender: 'male' | 'female' | null;
  weightUnit: 'kg' | 'lbs';
  restTimerDuration: number;
  showRestTimer: boolean;
  theme: 'light' | 'dark';
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
  showRestTimer: true,
  theme: 'light',
  onboardingComplete: false,
  buddyName: '',
};

const SettingsContext = createContext<SettingsContextType | null>(null);

const isBrowser = typeof window !== 'undefined';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const lsComplete = isBrowser ? localStorage.getItem('onboarding_complete') === 'true' : false;
    return {
      ...defaultSettings,
      onboardingComplete: lsComplete,
    };
  });
  const [loading, setLoading] = useState(true);

  // Apply theme to HTML root element
  useEffect(() => {
    if (isBrowser) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadSettings() {
      if (!env.isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const lsComplete = isBrowser ? localStorage.getItem('onboarding_complete') === 'true' : false;
          const metaComplete = Boolean(user.user_metadata?.onboarding_complete);

          const { data } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data) {
            const isComplete = Boolean(data.onboarding_complete || metaComplete || lsComplete);
            setSettings({
              userName: data.user_name || user.user_metadata?.full_name || 'Athlete',
              userGender: data.user_gender || null,
              weightUnit: data.weight_unit || 'kg',
              restTimerDuration: data.rest_timer_duration || 60,
              showRestTimer: data.show_rest_timer ?? true,
              theme: data.theme || 'light',
              onboardingComplete: isComplete,
              buddyName: data.buddy_name || '',
            });
            if (isBrowser) {
              localStorage.setItem('onboarding_complete', isComplete ? 'true' : 'false');
            }
          } else {
            const isComplete = Boolean(metaComplete || lsComplete);
            setSettings((prev) => ({
              ...prev,
              userName: user.user_metadata?.full_name || 'Athlete',
              onboardingComplete: isComplete,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load settings from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateSettings = async (partial: Partial<SettingsState>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);

    if (isBrowser && partial.onboardingComplete !== undefined) {
      localStorage.setItem('onboarding_complete', partial.onboardingComplete ? 'true' : 'false');
    }

    if (!env.isSupabaseConfigured) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update Supabase Auth user metadata as fail-safe
      if (partial.onboardingComplete !== undefined) {
        await supabase.auth.updateUser({
          data: { onboarding_complete: partial.onboardingComplete },
        });
      }

      // Upsert into user_settings table
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        user_name: updated.userName,
        user_gender: updated.userGender,
        weight_unit: updated.weightUnit,
        rest_timer_duration: updated.restTimerDuration,
        show_rest_timer: updated.showRestTimer,
        theme: updated.theme,
        onboarding_complete: updated.onboardingComplete,
        buddy_name: updated.buddyName,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to save settings to Supabase:', err);
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
