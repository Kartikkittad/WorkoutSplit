'use client';

export default function MockHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src="/logo.png" alt="WorkoutSplit" style={{ width: 30, height: 30, objectFit: 'contain' }} />
      </div>
      <div>
        <div style={{ font: "500 10px 'Archivo', sans-serif", color: '#888888' }}>Good Afternoon</div>
        <div style={{ font: "800 16px 'Archivo', sans-serif", color: '#111111', letterSpacing: '-.01em' }}>
          Let&apos;s get after it, test
        </div>
      </div>
    </div>
  );
}
