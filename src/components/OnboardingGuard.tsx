'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './SettingsContext';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { onboardingComplete, loading } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !onboardingComplete) {
      router.push('/onboarding');
    }
  }, [loading, onboardingComplete, router]);

  if (loading || !onboardingComplete) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
