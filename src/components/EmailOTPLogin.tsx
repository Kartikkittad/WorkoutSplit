'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { TurnstileCaptcha } from './TurnstileCaptcha';
import { env } from '@/lib/env';

export function EmailOTPLogin({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const startCooldown = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (env.isTurnstileConfigured && !captchaToken) {
      setError('Please complete the security verification first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captchaToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code.');
      }
      
      setStep('otp');
      startCooldown();
    } catch (err: any) {
      setError(err.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the full code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        throw new Error(error.message || 'Invalid code.');
      }
      
      // AuthGuard will automatically detect the session change and show the app.
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
      setLoading(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setOtp(value);
  };

  const isButtonDisabled = loading || (env.isTurnstileConfigured && !captchaToken);

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
      {step === 'email' ? (
        <form onSubmit={handleSendCode} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#1E1E1E',
              border: '2px solid var(--border-light, #333333)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '15px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          
          <TurnstileCaptcha
            onSuccess={(token) => {
              setCaptchaToken(token);
              setError(null);
            }}
            onExpire={() => setCaptchaToken(null)}
          />

          <button
            type="submit"
            disabled={isButtonDisabled || !email}
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: (isButtonDisabled || !email) ? '#222222' : '#FFE100',
              color: (isButtonDisabled || !email) ? '#FFFFFF' : '#111111',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '15px',
              fontFamily: 'inherit',
              cursor: (isButtonDisabled || !email) ? 'not-allowed' : 'pointer',
              opacity: (isButtonDisabled || !email) ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Sending Code...' : 'Send Verification Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <p style={{ fontSize: '13px', color: '#AAAAAA', textAlign: 'center', margin: '0 0 8px 0' }}>
            Enter the code sent to<br/>
            <strong style={{ color: '#FFFFFF' }}>{email}</strong>
          </p>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={8}
                value={otp}
                onChange={handleOtpChange}
                disabled={loading}
                autoFocus
                placeholder="------"
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: '#1E1E1E',
                  border: '2px solid var(--border-light, #333333)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '8px',
                  textAlign: 'center',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            style={{
              width: '100%',
              padding: '14px 20px',
              marginTop: '8px',
              backgroundColor: (loading || otp.length < 6) ? '#222222' : '#FFE100',
              color: (loading || otp.length < 6) ? '#FFFFFF' : '#111111',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '15px',
              fontFamily: 'inherit',
              cursor: (loading || otp.length < 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.length < 6) ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(null); }}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: '#AAAAAA', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              Change Email
            </button>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || cooldown > 0}
              style={{ background: 'none', border: 'none', color: cooldown > 0 ? '#666666' : '#FFE100', cursor: cooldown > 0 ? 'not-allowed' : 'pointer', padding: 0, fontWeight: 700 }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, textAlign: 'center', margin: 0, marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
