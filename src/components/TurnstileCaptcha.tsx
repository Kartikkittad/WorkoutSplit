'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { env } from '@/lib/env';

interface TurnstileCaptchaProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export function TurnstileCaptcha({
  onSuccess,
  onError,
  onExpire,
  className = '',
}: TurnstileCaptchaProps) {
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <div
        style={{
          fontSize: '12px',
          color: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        ⚠️ NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing in .env.local
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '0 auto',
      }}
      className={className}
    >
      <Turnstile
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'dark',
        }}
      />
    </div>
  );
}
