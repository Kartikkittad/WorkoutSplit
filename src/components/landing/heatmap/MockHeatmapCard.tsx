'use client';

import MockBodySilhouette from './MockBodySilhouette';

const BREAKDOWN = [
  { muscle: 'Chest', pct: 100 },
  { muscle: 'Shoulders', pct: 0 },
  { muscle: 'Biceps', pct: 0 },
  { muscle: 'Triceps', pct: 0 },
  { muscle: 'Forearms', pct: 0, faded: true },
];

/** The 2D muscle-load heatmap card, on its own in the second hero phone. */
export default function MockHeatmapCard() {
  return (
    <div
      style={{
        border: '2px solid #111111',
        borderRadius: 18,
        padding: 12,
        background: '#ffffff',
        boxShadow: '3px 3px 0 #111111',
      }}
    >
      <div
        style={{
          font: "800 8px 'Space Grotesk', monospace",
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: '#FFE100',
          marginBottom: 3,
        }}
      >
        2D muscle load
      </div>
      <div style={{ font: "400 15px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em', marginBottom: 9 }}>
        Heatmap Visualizer
      </div>

      {/* Front / Back toggle */}
      <div
        style={{
          display: 'inline-flex',
          border: '2px solid #111111',
          borderRadius: 999,
          padding: 2,
          marginBottom: 10,
          background: '#ffffff',
        }}
      >
        <span style={{ background: '#FFE100', borderRadius: 999, padding: '4px 14px', font: "800 9.5px 'Archivo', sans-serif", color: '#111111' }}>
          Front
        </span>
        <span style={{ padding: '4px 14px', font: "700 9.5px 'Archivo', sans-serif", color: '#555555' }}>Back</span>
      </div>

      {/* Body panel */}
      <div
        style={{
          border: '1.5px solid #e6e6dc',
          borderRadius: 14,
          background: '#F7F7F1',
          padding: '8px 10px 7px',
          marginBottom: 10,
        }}
      >
        <div style={{ font: "800 7.5px 'Space Grotesk', monospace", letterSpacing: '.12em', color: '#FFE100', marginBottom: 2 }}>
          FRONT VIEW
        </div>
        <div style={{ height: 196 }}>
          <MockBodySilhouette />
        </div>
        <div style={{ textAlign: 'center', font: "500 7.5px 'Archivo', sans-serif", color: '#8a8a80', marginTop: 3 }}>
          Hover or tap any muscle group to view load
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: 'linear-gradient(90deg, #eaeae2, #6ea8ff, #c8f135, #ffb300, #ff4d4d)',
          marginBottom: 4,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', font: "700 6px 'Space Grotesk', monospace", color: '#777777', marginBottom: 11 }}>
        <span>REST (0%)</span>
        <span>LIGHT (1-30%)</span>
        <span>MODERATE (31-65%)</span>
        <span>MAX (66%+)</span>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ font: "800 7.5px 'Space Grotesk', monospace", letterSpacing: '.1em', color: '#111111' }}>
          MUSCLE GROUP LOAD BREAKDOWN
        </span>
        <span style={{ font: "800 7.5px 'Space Grotesk', monospace", color: '#c9b400' }}>Scroll ↓</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BREAKDOWN.map((b) => (
          <div key={b.muscle} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: b.faded ? 0.45 : 1 }}>
            <span style={{ font: "700 8.5px 'Archivo', sans-serif", color: '#111111', width: 48, flexShrink: 0 }}>{b.muscle}</span>
            <span style={{ flex: 1, height: 5, borderRadius: 999, background: '#f0efe6', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  width: `${b.pct}%`,
                  height: '100%',
                  background: '#ff4d4d',
                  borderRadius: 999,
                }}
              />
            </span>
            <span style={{ font: "700 8px 'Archivo', sans-serif", color: '#777777', width: 24, textAlign: 'right', flexShrink: 0 }}>
              {b.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
