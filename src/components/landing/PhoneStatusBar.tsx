'use client';

/** iOS status bar — time on the left, wifi + battery on the right. */
export default function PhoneStatusBar({ time = '2:41', dark = false }: { time?: string; dark?: boolean }) {
  const fg = dark ? '#ffffff' : '#111111';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 26px 6px',
        flexShrink: 0,
      }}
    >
      <span style={{ font: "800 13px 'Archivo', sans-serif", color: fg, letterSpacing: '-.01em' }}>
        {time}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={fg} strokeWidth="1.7" strokeLinecap="round">
          <path d="M1 3.4a10 10 0 0 1 14 0" />
          <path d="M3.6 6.1a6.3 6.3 0 0 1 8.8 0" />
          <path d="M6.2 8.7a2.6 2.6 0 0 1 3.6 0" />
        </svg>

        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="3.2" stroke={fg} strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="2.4" y="2.4" width="15" height="7.2" rx="1.8" fill={fg} />
          <path d="M23.2 4.2v3.6a2 2 0 0 0 0-3.6z" fill={fg} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
