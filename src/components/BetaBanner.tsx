'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'beta_notice_dismissed';

/**
 * Slim banner telling users the app is an early beta. Dismissible, and the
 * dismissal sticks so it is not nagging on every launch.
 */
export default function BetaBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== 'true');
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '12px 16px 0',
        padding: '10px 12px',
        borderRadius: 14,
        border: '2px solid var(--border-light)',
        background: 'var(--primary)',
        color: '#111111',
      }}
    >
      <span
        style={{
          flexShrink: 0,
          background: '#111111',
          color: 'var(--primary)',
          borderRadius: 999,
          padding: '3px 9px',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.08em',
        }}
      >
        BETA
      </span>

      <p style={{ flex: 1, fontSize: 12, fontWeight: 600, lineHeight: 1.35, margin: 0 }}>
        Early release, still under active development. Expect rough edges and
        occasional changes.
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss beta notice"
        style={{
          flexShrink: 0,
          border: 'none',
          background: 'transparent',
          color: '#111111',
          fontSize: 16,
          fontWeight: 800,
          lineHeight: 1,
          cursor: 'pointer',
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}
