'use client';

const STATS = [
  { icon: '🔥', tint: 'rgba(255,140,50,0.14)', value: '0', label: 'Calories' },
  { icon: '📚', tint: 'rgba(200,241,53,0.22)', value: '0', label: 'Sets' },
  { icon: '⏱', tint: 'rgba(56,189,248,0.14)', value: '-', label: 'Duration' },
  { icon: '🎯', tint: 'rgba(168,85,247,0.14)', value: '0', label: 'Exercises' },
];

export default function MockStatsGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {STATS.map((s) => (
        <div
          key={s.label}
          style={{
            border: '2px solid #111111',
            borderRadius: 14,
            padding: '10px 11px',
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#ffffff',
            boxShadow: '2px 2px 0 #111111',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: s.tint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {s.icon}
          </div>
          <div>
            <div style={{ font: "800 15px 'Archivo', sans-serif", color: '#111111', lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ font: "500 9.5px 'Archivo', sans-serif", color: '#666666' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
