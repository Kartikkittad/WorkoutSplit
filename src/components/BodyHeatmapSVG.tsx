'use client';

import React from 'react';

interface BodyHeatmapSVGProps {
  muscleCounts: Record<string, number>;
  view: 'front' | 'back';
}

export default function BodyHeatmapSVG({ muscleCounts, view }: BodyHeatmapSVGProps) {
  const getColor = (muscle: string) => {
    const count = muscleCounts[muscle] || 0;
    if (count === 0) return '#CCCCCC'; // Matches the silhouette light grey exactly
    if (count === 1) return '#FFE066'; // Yellow
    if (count === 2) return '#FF922B'; // Orange
    return '#FA5252'; // Red
  };

  if (view === 'front') {
    return (
      <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}>
        <svg
          viewBox="0 0 600 1000"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            overflow: 'visible',
          }}
        >
          <image
            href="/body-front.png"
            x="0"
            y="0"
            width="600"
            height="1000"
          />

          {/* ── TRAPEZIUS (Visible from front, maps to Back) ── */}
          <path d="M270,180 C246,186 204,204 168,222 L186,240 C216,222 252,204 270,192 Z" fill={getColor('Back')} />
          <path d="M330,180 C354,186 396,204 432,222 L414,240 C384,222 348,204 330,192 Z" fill={getColor('Back')} />

          {/* ── LEFT DELTOID (Shoulder) ── */}
          <path d="M177,185 C160,195 153,220 153,240 C153,251 168,251 221,240 Z" fill={getColor('Shoulders')} />

          {/* ── RIGHT DELTOID (Shoulder) ── */}
          <path d="M423,185 C440,195 447,220 447,240 C447,251 432,251 379,240 Z" fill={getColor('Shoulders')} />

          {/* ── LEFT PECTORAL (Chest) ── */}
          <path d="M221,195 C221,195 295,195 295,210 L295,279 C260,279 221,260 221,230 Z" fill={getColor('Chest')} />

          {/* ── RIGHT PECTORAL (Chest) ── */}
          <path d="M379,195 C379,195 305,195 305,210 L305,279 C340,279 379,260 379,230 Z" fill={getColor('Chest')} />

          {/* ── LEFT BICEP ── */}
          <path d="M175,260 C168,275 168,310 175,321 C185,321 196,300 196,275 Z" fill={getColor('Biceps')} />

          {/* ── RIGHT BICEP ── */}
          <path d="M425,260 C432,275 432,310 425,321 C415,321 404,300 404,275 Z" fill={getColor('Biceps')} />

          {/* ── ABDOMINALS (Core) ── */}
          <rect x="256" y="278" width="41" height="38" rx="4" fill={getColor('Core')} />
          <rect x="303" y="278" width="41" height="38" rx="4" fill={getColor('Core')} />
          <rect x="256" y="322" width="41" height="38" rx="4" fill={getColor('Core')} />
          <rect x="303" y="322" width="41" height="38" rx="4" fill={getColor('Core')} />
          <rect x="256" y="366" width="41" height="38" rx="4" fill={getColor('Core')} />
          <rect x="303" y="366" width="41" height="38" rx="4" fill={getColor('Core')} />

          {/* ── LOWER ABS & OBLIQUES (Core) ── */}
          <path d="M 256 410 H 297 V 470 C 275 470, 256 445, 256 410 Z" fill={getColor('Core')} />
          <path d="M 344 410 H 303 V 470 C 325 470, 344 445, 344 410 Z" fill={getColor('Core')} />

          {/* ── LEFT QUAD ── */}
          <path d="M 211 452 C 211 480, 215 570, 230 654 L 272 654 C 272 570, 272 480, 272 452 Z" fill={getColor('Quads')} />

          {/* ── RIGHT QUAD ── */}
          <path d="M 389 452 C 389 480, 385 570, 370 654 L 328 654 C 328 570, 328 480, 328 452 Z" fill={getColor('Quads')} />
        </svg>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // BACK VIEW
  // ═══════════════════════════════════════
  return (
    <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 600 1000"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        <image
          href="/body-back.png"
          x="0"
          y="0"
          width="600"
          height="1000"
        />

        {/* ── TRAPEZIUS (Back) ── */}
        <path d="M300,178 L187,220 C187,250 240,280 300,303 Z" fill={getColor('Back')} />
        <path d="M300,178 L413,220 C413,250 360,280 300,303 Z" fill={getColor('Back')} />

        {/* ── LEFT REAR DELTOID (Shoulder) ── */}
        <path d="M177,185 C160,195 153,220 153,240 C153,251 168,251 221,240 Z" fill={getColor('Shoulders')} />

        {/* ── RIGHT REAR DELTOID (Shoulder) ── */}
        <path d="M423,185 C440,195 447,220 447,240 C447,251 432,251 379,240 Z" fill={getColor('Shoulders')} />

        {/* ── UPPER BACK (Teres/Rhomboids) ── */}
        <path d="M200,220 L297,220 L297,383 L153,383 C153,330 180,270 200,220 Z" fill={getColor('Back')} />
        <path d="M400,220 L303,220 L303,383 L447,383 C447,330 420,270 400,220 Z" fill={getColor('Back')} />

        {/* ── LATS ── */}
        <path d="M427,315 C427,340 410,390 380,422 L303,422 L303,315 Z" fill={getColor('Back')} />
        <path d="M173,315 C173,340 190,390 220,422 L297,422 L297,315 Z" fill={getColor('Back')} />

        {/* ── LOWER BACK ── */}
        <path d="M220,380 H297 V422 H220 Z" fill={getColor('Back')} />
        <path d="M380,380 H303 V422 H380 Z" fill={getColor('Back')} />

        {/* ── LEFT TRICEP ── */}
        <path d="M175,260 C168,275 168,310 175,321 C185,321 196,300 196,275 Z" fill={getColor('Triceps')} />

        {/* ── RIGHT TRICEP ── */}
        <path d="M425,260 C432,275 432,310 425,321 C415,321 404,300 404,275 Z" fill={getColor('Triceps')} />

        {/* ── GLUTES ── */}
        <path d="M168,409 C168,440 200,522 297,522 L297,409 Z" fill={getColor('Glutes')} />
        <path d="M432,409 C432,440 400,522 303,522 L303,409 Z" fill={getColor('Glutes')} />

        {/* ── LEFT HAMSTRING ── */}
        <path d="M220,498 C158,540 210,650 240,683 L297,683 L297,498 Z" fill={getColor('Hamstrings')} />

        {/* ── RIGHT HAMSTRING ── */}
        <path d="M380,498 C442,540 390,650 360,683 L303,683 L303,498 Z" fill={getColor('Hamstrings')} />

        {/* ── LEFT CALF ── */}
        <path d="M230,690 C210,740 220,830 250,870 L297,870 L297,690 Z" fill={getColor('Calves')} />

        {/* ── RIGHT CALF ── */}
        <path d="M370,690 C390,740 380,830 350,870 L303,870 L303,690 Z" fill={getColor('Calves')} />
      </svg>
    </div>
  );
}
