'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './SettingsContext';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { onboardingComplete } = useSettings();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const obComplete = localStorage.getItem('onboarding_complete') === 'true' || onboardingComplete;
    if (!obComplete) {
      router.push('/onboarding');
    }
  }, [onboardingComplete, router]);

  const obComplete = typeof window !== 'undefined'
    ? localStorage.getItem('onboarding_complete') === 'true' || onboardingComplete
    : onboardingComplete;

  if (!mounted || !obComplete) {
    return null;
  }

  return <>{children}</>;
}
