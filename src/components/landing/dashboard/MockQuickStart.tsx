'use client';

const SPLITS = [
  { emoji: '🏋️', name: 'Push Day', detail: 'Bench, Overhead Press, Triceps' },
  { emoji: '🚣', name: 'Pull Day', detail: 'Deadlift, Lat Pulldown, Biceps' },
  { emoji: '🦵', name: 'Leg Day', detail: 'Squats, Leg Press, Romanian DL' },
];

export default function MockQuickStart() {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ font: "800 14px 'Archivo Black', sans-serif", color: '#111111' }}>Quick Start Workouts</div>
        <div style={{ font: "700 10px 'Archivo', sans-serif", color: '#111111' }}>+ Custom</div>
      </div>

      {/* Horizontal rail — third card intentionally peeks off the edge */}
      <div style={{ display: 'flex', gap: 8, marginRight: -16 }}>
        {SPLITS.map((s) => (
          <div
            key={s.name}
            style={{
              flex: '0 0 118px',
              border: '2px solid #111111',
              borderRadius: 14,
              padding: 10,
              background: '#ffffff',
              boxShadow: '2px 2px 0 #111111',
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.emoji}</div>
            <div style={{ font: "800 12px 'Archivo', sans-serif", color: '#111111', marginBottom: 3 }}>{s.name}</div>
            <div style={{ font: "500 9px/1.25 'Archivo', sans-serif", color: '#666666' }}>{s.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
