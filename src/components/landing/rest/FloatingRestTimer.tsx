'use client';

/**
 * The rest timer, zoomed out of the session screen — it breaks past both
 * bezels and floats above the phone.
 */
export default function FloatingRestTimer() {
  return (
    <div
      className="rest-float-timer"
      style={{
        position: 'absolute',
        zIndex: 30,
        border: '2px solid #111111',
        borderRadius: 18,
        padding: '14px 16px',
        background: '#ffffff',
        boxShadow: '5px 5px 0 #111111, 0 16px 34px rgba(17,17,17,0.2)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Countdown ring */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '5px solid #F0EFE6',
          borderTopColor: '#FFE100',
          borderRightColor: '#FFE100',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          transform: 'rotate(-30deg)',
        }}
      >
        <span style={{ font: "800 12px 'Archivo', sans-serif", color: '#111111', transform: 'rotate(30deg)' }}>
          0:40
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: "800 9px 'Space Grotesk', monospace",
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: '#8a7500',
            marginBottom: 3,
          }}
        >
          Resting
        </div>
        <div style={{ font: "400 20px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
          0:40 left
        </div>
        <div style={{ font: "500 10px 'Archivo', sans-serif", color: '#777777' }}>
          Buzzes when it&apos;s time to lift again
        </div>
      </div>

      <div
        style={{
          background: '#FFE100',
          border: '2px solid #111111',
          borderRadius: 999,
          padding: '7px 12px',
          font: "800 10px 'Archivo', sans-serif",
          color: '#111111',
          flexShrink: 0,
        }}
      >
        Skip →
      </div>
    </div>
  );
}
