'use client';

export type ExerciseRow = {
  name: string;
  meta: string;
  icon: string;
  added?: boolean;
};

/** One row of the exercise picker — reused inside the phone and for the pop-out cards. */
export default function MockExerciseRow({
  ex,
  elevated = false,
}: {
  ex: ExerciseRow;
  elevated?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: '2px solid #111111',
        borderRadius: 14,
        padding: elevated ? '12px 14px' : '10px 12px',
        background: ex.added ? '#FFE100' : '#ffffff',
        boxShadow: elevated ? '5px 5px 0 #111111, 0 16px 34px rgba(17,17,17,0.2)' : '2px 2px 0 #111111',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: elevated ? 36 : 30,
          height: elevated ? 36 : 30,
          border: '2px solid #111111',
          borderRadius: 10,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: elevated ? 16 : 13,
          flexShrink: 0,
        }}
      >
        {ex.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: `800 ${elevated ? 13.5 : 11.5}px 'Archivo', sans-serif`,
            color: '#111111',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {ex.name}
        </div>
        <div style={{ font: `500 ${elevated ? 11 : 9.5}px 'Archivo', sans-serif`, color: ex.added ? '#5c5200' : '#777777' }}>
          {ex.meta}
        </div>
      </div>

      <div
        style={{
          width: elevated ? 26 : 20,
          height: elevated ? 26 : 20,
          borderRadius: '50%',
          border: ex.added ? '2px solid #111111' : 'none',
          background: ex.added ? '#111111' : 'transparent',
          color: ex.added ? '#FFE100' : '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: `800 ${elevated ? 14 : 15}px 'Archivo', sans-serif`,
          flexShrink: 0,
        }}
      >
        {ex.added ? '✓' : '+'}
      </div>
    </div>
  );
}
