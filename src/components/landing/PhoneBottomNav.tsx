'use client';

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  log: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 5v14M16 5v14" />
    </svg>
  ),
  history: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </svg>
  ),
  progress: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5.5-6 4 3.5L21 6" />
      <path d="M16 6h5v5" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </svg>
  ),
};

const TABS = [
  { key: 'home', label: 'Home' },
  { key: 'log', label: 'Log' },
  { key: 'history', label: 'History' },
  { key: 'progress', label: 'Progress' },
  { key: 'settings', label: 'Settings' },
];

/** Dark tab bar + iOS home indicator, pinned to the bottom of the mock screen. */
export default function PhoneBottomNav({ active = 'home' }: { active?: string }) {
  return (
    <div style={{ marginTop: 'auto', background: '#111111', padding: '10px 16px 0', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <div
              key={t.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: isActive ? '#FFE100' : '#ffffff',
                opacity: isActive ? 1 : 0.45,
                flex: 1,
              }}
            >
              {ICONS[t.key]}
              <span style={{ font: `${isActive ? 800 : 600} 8.5px 'Archivo', sans-serif`, letterSpacing: '.01em' }}>
                {t.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 7px' }}>
        <div style={{ width: 112, height: 4.5, borderRadius: 999, background: '#ffffff', opacity: 0.85 }} />
      </div>
    </div>
  );
}
