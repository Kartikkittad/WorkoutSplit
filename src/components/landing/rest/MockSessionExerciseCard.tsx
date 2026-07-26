'use client';

/** Logged exercise with the overload target shown inline (light theme). */
export default function MockSessionExerciseCard() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 18,
        padding: 12,
        background: '#ffffff',
        boxShadow: '3px 3px 0 #111111',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>🏋️</span>
        <span
          style={{
            font: "800 12.5px 'Archivo', sans-serif",
            color: '#111111',
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Barbell Bench Press
        </span>
        <span
          style={{
            background: '#FFE100',
            border: '1.5px solid #111111',
            borderRadius: 999,
            padding: '2px 7px',
            font: "800 8.5px 'Archivo', sans-serif",
            color: '#111111',
            flexShrink: 0,
          }}
        >
          Push
        </span>
        <span style={{ font: "700 9.5px 'Archivo', sans-serif", color: '#e0413c', flexShrink: 0 }}>Remove</span>
      </div>

      {/* Set chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flexShrink: 0,
              border: '2px solid #111111',
              borderRadius: 9,
              padding: '6px 9px',
              font: "700 9.5px 'Archivo', sans-serif",
              color: '#111111',
              background: '#ffffff',
            }}
          >
            S{n}: - × 8
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#FFE100',
          border: '2px solid #111111',
          borderRadius: 999,
          padding: '10px 0',
          textAlign: 'center',
          font: "800 11.5px 'Archivo', sans-serif",
          color: '#111111',
        }}
      >
        + Log Set
      </div>
    </div>
  );
}
