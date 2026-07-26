'use client';

export default function MockProgressCard() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        boxShadow: '2px 2px 0 #111111',
      }}
    >
      <div>
        <div style={{ font: "800 9px 'Space Grotesk', monospace", color: '#FFE100', letterSpacing: '.05em', marginBottom: 4, textTransform: 'uppercase' }}>
          Workout Progress!
        </div>
        <div style={{ font: "800 15px 'Archivo', sans-serif", color: '#111111', marginBottom: 2 }}>Today&apos;s Workout</div>
        <div style={{ font: "500 10px 'Archivo', sans-serif", color: '#666666' }}>No exercises yet — tap to start!</div>
      </div>

      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          border: '4px solid #f2f2ee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: "800 12px 'Archivo', sans-serif",
          color: '#111111',
          background: '#ffffff',
          flexShrink: 0,
        }}
      >
        0%
      </div>
    </div>
  );
}
