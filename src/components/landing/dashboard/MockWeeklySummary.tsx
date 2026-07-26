'use client';

export default function MockWeeklySummary() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 16,
        padding: '12px 14px',
        marginBottom: 10,
        background: '#ffffff',
        boxShadow: '2px 2px 0 #111111',
      }}
    >
      <div style={{ font: "800 13px 'Archivo', sans-serif", color: '#111111', marginBottom: 4 }}>Weekly Summary</div>
      <div style={{ font: "600 11px 'Archivo', sans-serif", color: '#111111' }}>
        This week: <span style={{ fontWeight: 800 }}>0 cal</span> burned 🔥
      </div>
    </div>
  );
}
