'use client';

const CHIPS = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Core'];

export default function MockExercisePicker() {
  return (
    <div>
      <div style={{ font: "400 17px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em', marginBottom: 10 }}>
        Add Exercise
      </div>

      {/* Search */}
      <div
        style={{
          border: '2px solid #111111',
          borderRadius: 12,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 10,
          background: '#ffffff',
        }}
      >
        <span style={{ fontSize: 11 }}>🔍</span>
        <span style={{ font: "500 11px 'Archivo', sans-serif", color: '#999999' }}>
          Search exercises (e.g. Overhead, Abs)
        </span>
      </div>

      {/* Filter chips — last one peeks off the edge */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 12, marginRight: -16 }}>
        {CHIPS.map((c, i) => (
          <div
            key={c}
            style={{
              flexShrink: 0,
              border: '2px solid #111111',
              borderRadius: 999,
              padding: '6px 14px',
              font: `${i === 0 ? 800 : 700} 11px 'Archivo', sans-serif`,
              color: '#111111',
              background: i === 0 ? '#FFE100' : '#ffffff',
              boxShadow: i === 0 ? '2px 2px 0 #111111' : 'none',
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Create custom */}
      <div
        style={{
          border: '2px dashed #111111',
          borderRadius: 12,
          background: '#FFE100',
          padding: '11px 0',
          textAlign: 'center',
          font: "800 12px 'Archivo', sans-serif",
          color: '#111111',
        }}
      >
        + Create Custom Exercise
      </div>
    </div>
  );
}
