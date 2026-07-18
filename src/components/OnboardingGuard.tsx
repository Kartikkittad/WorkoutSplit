'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './SettingsContext';
import { isStandalone } from '@/lib/pwa';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { onboardingComplete } = useSettings();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // The app is PWA-only. In a regular browser tab, send users to the
    // landing page instead of exposing the app shell.
    if (!isStandalone()) {
      router.replace('/');
      return;
    }
    const obComplete = localStorage.getItem('onboarding_complete') === 'true' || onboardingComplete;
    if (!obComplete) {
      router.push('/onboarding');
    }
  }, [onboardingComplete, router]);

  const allowed = typeof window !== 'undefined' && isStandalone();
  const obComplete = typeof window !== 'undefined'
    ? localStorage.getItem('onboarding_complete') === 'true' || onboardingComplete
    : onboardingComplete;

  if (!mounted || !allowed || !obComplete) {
    return null;
  }

  return <>{children}</>;
}
