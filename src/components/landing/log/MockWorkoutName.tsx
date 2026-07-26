'use client';

export default function MockWorkoutName() {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          font: "700 9.5px 'Space Grotesk', monospace",
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          color: '#888888',
          marginBottom: 6,
        }}
      >
        Workout Name
      </div>
      <div
        style={{
          border: '2px solid #111111',
          borderRadius: 12,
          background: '#F5F5F0',
          padding: '11px 13px',
          font: "600 12.5px 'Archivo', sans-serif",
          color: '#111111',
        }}
      >
        My Workout
      </div>
    </div>
  );
}
