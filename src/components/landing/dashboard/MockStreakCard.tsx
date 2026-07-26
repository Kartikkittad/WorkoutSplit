'use client';

export default function MockStreakCard() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 16,
        padding: '12px 14px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#ffffff',
        boxShadow: '2px 2px 0 #111111',
      }}
    >
      <div style={{ fontSize: 24, flexShrink: 0 }}>🔥</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ font: "400 18px 'Archivo Black', sans-serif", color: '#111111' }}>1</span>
          <span style={{ font: "800 12px 'Archivo', sans-serif", color: '#111111' }}>day streak</span>
        </div>
        <div style={{ font: "500 10px 'Archivo', sans-serif", color: '#666666' }}>Keep up the strong momentum!</div>
      </div>
      <div style={{ font: "700 10px 'Archivo', sans-serif", color: '#111111', flexShrink: 0 }}>Best: 1 days</div>
    </div>
  );
}
