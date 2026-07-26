'use client';

/** The exercise dropdown at the top of the Progress screen. */
export default function MockExerciseSelect() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: '2px solid #111111',
        borderRadius: 14,
        padding: '9px 12px',
        background: '#ffffff',
        boxShadow: '3px 3px 0 #111111',
        marginBottom: 12,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          background: '#FFFBD6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        🏋️
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "800 12px 'Archivo', sans-serif", color: '#111111' }}>Barbell Bench Press</div>
        <div style={{ font: "500 9.5px 'Archivo', sans-serif", color: '#777777' }}>Push</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 9 7 7 7-7" />
      </svg>
    </div>
  );
}
