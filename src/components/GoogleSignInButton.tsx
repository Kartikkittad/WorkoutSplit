'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TurnstileCaptcha } from './TurnstileCaptcha';
import { env } from '@/lib/env';

interface GoogleSignInButtonProps {
  className?: string;
}

export function GoogleSignInButton({ className = '' }: GoogleSignInButtonProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!env.isSupabaseConfigured) {
      setErrorMessage('Sign in service unavailable. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: captchaToken ? { captchaToken } : undefined,
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage('Authentication failed. Please try again.');
        setLoading(false);
      }
    } catch {
      setErrorMessage('Sign in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        maxWidth: '360px',
        margin: '0 auto',
      }}
      className={className}
    >
      {/* Cloudflare Turnstile CAPTCHA */}
      <TurnstileCaptcha
        onSuccess={(token) => {
          setCaptchaToken(token);
          setErrorMessage(null);
        }}
        onExpire={() => setCaptchaToken(null)}
      />

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '14px 20px',
          backgroundColor: loading ? '#222222' : '#111111',
          color: '#FFFFFF',
          border: '2px solid var(--border-light, #333333)',
          borderRadius: '14px',
          fontWeight: 800,
          fontSize: '15px',
          fontFamily: 'inherit',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          boxShadow: loading ? 'none' : 'var(--shadow-card, 3px 3px 0 #FFE100)',
          transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <svg
          style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', flexShrink: 0 }}
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {errorMessage && (
        <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, textAlign: 'center', margin: 0 }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
