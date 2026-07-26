'use client';

/** A row of pill filters; the active one is yellow with a hard shadow. */
export default function MockChipRow({
  chips,
  active,
  marginBottom = 10,
}: {
  chips: string[];
  active: string;
  marginBottom?: number;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom }}>
      {chips.map((c) => {
        const isActive = c === active;
        return (
          <div
            key={c}
            style={{
              flex: 1,
              textAlign: 'center',
              border: '2px solid #111111',
              borderRadius: 999,
              padding: '8px 0',
              font: `${isActive ? 800 : 700} 10.5px 'Archivo', sans-serif`,
              color: '#111111',
              background: isActive ? '#FFE100' : '#ffffff',
              boxShadow: isActive ? '2px 2px 0 #111111' : 'none',
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
}
