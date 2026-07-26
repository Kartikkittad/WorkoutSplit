'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { env } from '@/lib/env';

interface TurnstileCaptchaProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

// Cloudflare official testing site key (Guaranteed pass for testing/dev environments)
const DEMO_SITE_KEY = '1x00000000000000000000AA';

export function TurnstileCaptcha({
  onSuccess,
  onError,
  onExpire,
  className = '',
}: TurnstileCaptchaProps) {
  const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEMO_SITE_KEY;

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
