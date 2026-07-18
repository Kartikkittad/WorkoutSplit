'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The landing page now lives at the root route ("/"). Keep this path working
// by forwarding any old links there.
export default function LandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
