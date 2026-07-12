'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const obComplete = localStorage.getItem('onboarding_complete') === 'true';
    if (obComplete) {
      router.replace('/app');
    } else {
      router.replace('/onboarding');
    }
  }, [router]);

  return null;
}
