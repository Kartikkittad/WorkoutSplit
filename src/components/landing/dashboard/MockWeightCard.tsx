'use client';

export default function MockWeightCard() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        background: '#ffffff',
        boxShadow: '2px 2px 0 #111111',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ font: "800 13px 'Archivo', sans-serif", color: '#111111' }}>Body Weight</div>
        <div style={{ font: "500 10px 'Archivo', sans-serif", color: '#666666' }}>Trend (Last 7d) ▼</div>
      </div>

      <div style={{ height: 44, marginBottom: 10 }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="mockWeightGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,35 Q25,35 50,20 T100,5 L100,40 L0,40 Z" fill="url(#mockWeightGrad)" opacity="0.3" />
          <path d="M0,35 Q25,35 50,20 T100,5" fill="none" stroke="#38bdf8" strokeWidth="2" />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, background: '#F5F5F0', borderRadius: 9, padding: '9px 10px', font: "500 11px 'Archivo', sans-serif", color: '#8a8a80' }}>
          Weight (lbs)
        </div>
        <div style={{ background: '#FFE100', border: '2px solid #111111', borderRadius: 9, padding: '9px 12px', font: "800 11px 'Archivo', sans-serif", color: '#111111' }}>
          Log Weight
        </div>
      </div>
    </div>
  );
}
