'use client';

const STATS = [
  { value: '17.5', label: 'Best (lbs)' },
  { value: '780', label: 'Volume (lbs)' },
  { value: '7', label: 'Total Sets' },
];

export default function MockProgressStats() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {STATS.map((s) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            textAlign: 'center',
            border: '2px solid #111111',
            borderRadius: 14,
            padding: '11px 4px',
            background: '#ffffff',
            boxShadow: '3px 3px 0 #111111',
          }}
        >
          <div style={{ font: "400 17px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
            {s.value}
          </div>
          <div style={{ font: "500 8.5px 'Archivo', sans-serif", color: '#777777' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
