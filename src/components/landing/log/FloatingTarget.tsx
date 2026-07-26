'use client';

/**
 * The progressive-overload line, zoomed out of the exercise card — it breaks
 * past both bezels and floats above the phone.
 */
export default function FloatingTarget() {
  return (
    <div
      className="overload-float-target"
      style={{
        position: 'absolute',
        zIndex: 30,
        border: '2px solid #111111',
        borderRadius: 18,
        padding: '14px 16px',
        background: '#ffffff',
        boxShadow: '5px 5px 0 #111111, 0 16px 34px rgba(17,17,17,0.2)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          font: "800 9px 'Space Grotesk', monospace",
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: '#8a7500',
          marginBottom: 8,
        }}
      >
        Progressive overload
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div>
          <div style={{ font: "700 9px 'Space Grotesk', monospace", letterSpacing: '.08em', color: '#999999' }}>
            LAST
          </div>
          <div style={{ font: "700 14px 'Archivo', sans-serif", color: '#888888' }}>17.5 lbs × 8</div>
        </div>

        <div style={{ font: "400 18px 'Archivo Black', sans-serif", color: '#111111' }}>→</div>

        <div>
          <div style={{ font: "700 9px 'Space Grotesk', monospace", letterSpacing: '.08em', color: '#8a7500' }}>
            TARGET
          </div>
          <div style={{ font: "400 18px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
            20 lbs × 8
          </div>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            background: '#FFE100',
            border: '2px solid #111111',
            borderRadius: 999,
            padding: '5px 10px',
            font: "800 10px 'Space Grotesk', monospace",
            color: '#111111',
            flexShrink: 0,
          }}
        >
          ▲ 2.5
        </div>
      </div>
    </div>
  );
}
