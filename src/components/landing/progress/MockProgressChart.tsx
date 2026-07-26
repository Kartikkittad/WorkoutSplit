'use client';

/** Max-weight trend card with gridlines, axis labels and an S-curve. */
export default function MockProgressChart() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 18,
        padding: 14,
        background: '#ffffff',
        boxShadow: '3px 3px 0 #111111',
        marginBottom: 12,
      }}
    >
      <div style={{ font: "800 13px 'Archivo', sans-serif", color: '#111111' }}>Barbell Bench Press</div>
      <div style={{ font: "500 9.5px 'Archivo', sans-serif", color: '#7a8aa0', marginBottom: 12 }}>
        Max Weight (lbs) · All time
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {/* Y axis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            font: "600 8px 'Archivo', sans-serif",
            color: '#5b6b8a',
            height: 74,
            flexShrink: 0,
          }}
        >
          <span>18</span>
          <span>16</span>
          <span>12</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ position: 'relative', height: 104 }}>
            {/* Gridlines */}
            {[0, 50, 100].map((p) => (
              <div
                key={p}
                style={{
                  position: 'absolute',
                  top: `${p}%`,
                  left: 0,
                  right: 0,
                  borderTop: '1px dashed #e2e2dc',
                }}
              />
            ))}

            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', position: 'relative' }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#c8f135" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#c8f135" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,36 C22,36 30,30 45,19 C60,8 74,4 100,3 L100,40 L0,40 Z" fill="url(#progressGrad)" />
              <path
                d="M0,36 C22,36 30,30 45,19 C60,8 74,4 100,3"
                fill="none"
                stroke="#c8f135"
                strokeWidth="2.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <span
              style={{
                position: 'absolute',
                top: -4,
                right: 0,
                font: "700 8.5px 'Archivo', sans-serif",
                color: '#111111',
              }}
            >
              17.5
            </span>
          </div>

          {/* X axis */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, font: "600 8px 'Archivo', sans-serif", color: '#5b6b8a' }}>
            <span>Jul 25</span>
            <span>Jul 26</span>
          </div>
        </div>
      </div>
    </div>
  );
}
