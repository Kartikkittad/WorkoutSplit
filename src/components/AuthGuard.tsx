'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmailOTPLogin } from '@/components/EmailOTPLogin';
import LogoIcon from '@/components/LogoIcon';
import { env } from '@/lib/env';
import { User } from '@supabase/supabase-js';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured in .env.local, skip auth gate for offline/local testing
    if (!env.isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 1. Loading State
  if (loading && env.isSupabaseConfigured) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg, #121212)',
          color: 'var(--text-primary, #FFFFFF)',
          gap: 16,
        }}
      >
        <LogoIcon size={56} mode="auto" />
        <div style={{ font: "800 13px 'Space Grotesk', monospace", letterSpacing: '.12em', color: 'var(--primary, #FFE100)' }}>
          LOADING WORKOUTSPLIT...
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Native PWA Login Screen inside /app)
  if (!user && env.isSupabaseConfigured) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          backgroundColor: 'var(--bg, #121212)',
          color: 'var(--text-primary, #FFFFFF)',
          fontFamily: "'Archivo', sans-serif",
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'var(--card-bg, #1E1E1E)',
            border: '2px solid var(--border-light, #333333)',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: 'var(--shadow-card, 4px 4px 0 #FFE100)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Logo */}
          <LogoIcon size={52} mode="auto" />

          {/* Titles */}
          <div>
            <h1
              style={{
                font: "900 24px 'Archivo Black', sans-serif",
                letterSpacing: '-.02em',
                marginBottom: '6px',
                color: 'var(--text-primary, #FFFFFF)',
              }}
            >
              Sign In to WorkoutSplit
            </h1>
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary, #AAAAAA)',
                lineHeight: 1.5,
              }}
            >
              Sign in with your email to sync your splits, exercise logs, and personal records.
            </p>
          </div>

          {/* Email OTP Login */}
          <div style={{ width: '100%', marginTop: '8px' }}>
            <EmailOTPLogin />
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated State: Render app
  return <>{children}</>;
}
