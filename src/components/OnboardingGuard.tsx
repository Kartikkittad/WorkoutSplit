'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './SettingsContext';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { onboardingComplete, loading } = useSettings();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !onboardingComplete) {
      router.push('/onboarding');
    }
  }, [onboardingComplete, loading, router]);

  if (!mounted || loading) {
    return null;
  }

  if (!onboardingComplete) {
    return null;
  }

  return <>{children}</>;
}
