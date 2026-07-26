'use client';

/**
 * The Body Weight card lifted out of the phone — floats above the device,
 * overlapping the right bezel to break the frame.
 */
export default function FloatingWeightCard() {
  return (
    <div
      className="hero-float-weight"
      style={{
        position: 'absolute',
        zIndex: 30,
        border: '2px solid #111111',
        borderRadius: 20,
        padding: 16,
        background: '#ffffff',
        boxShadow: '6px 6px 0 #111111, 0 18px 40px rgba(17,17,17,0.22)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ font: "800 15px 'Archivo', sans-serif", color: '#111111' }}>Body Weight</div>
        <div style={{ font: "500 11px 'Archivo', sans-serif", color: '#666666' }}>Trend (Last 7d) ▼</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 6 }}>
        <span style={{ font: "400 26px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
          172.4
        </span>
        <span style={{ font: "700 12px 'Archivo', sans-serif", color: '#666666' }}>lbs</span>
        <span
          style={{
            marginLeft: 'auto',
            background: '#FFE100',
            border: '2px solid #111111',
            borderRadius: 999,
            padding: '3px 9px',
            font: "800 10px 'Space Grotesk', monospace",
            color: '#111111',
          }}
        >
          ▲ 1.2
        </span>
      </div>

      <div style={{ height: 62, marginBottom: 12 }}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="floatWeightGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,35 Q25,35 50,20 T100,5 L100,40 L0,40 Z" fill="url(#floatWeightGrad)" opacity="0.3" />
          <path d="M0,35 Q25,35 50,20 T100,5" fill="none" stroke="#38bdf8" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{ flex: 1, background: '#F5F5F0', borderRadius: 10, padding: '10px 12px', font: "500 12px 'Archivo', sans-serif", color: '#8a8a80' }}>
          Weight (lbs)
        </div>
        <div style={{ background: '#FFE100', border: '2px solid #111111', borderRadius: 10, padding: '10px 14px', font: "800 12px 'Archivo', sans-serif", color: '#111111' }}>
          Log Weight
        </div>
      </div>
    </div>
  );
}
