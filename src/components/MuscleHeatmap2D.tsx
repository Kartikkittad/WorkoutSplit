'use client';

import React, { useState, useMemo } from 'react';

interface MuscleHeatmap2DProps {
  muscleCounts: Record<string, number>;
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  lats: 'Lats',
  traps: 'Traps',
  lowerback: 'Lower Back',
  glutes: 'Glutes',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
};

export default function MuscleHeatmap2D({ muscleCounts }: MuscleHeatmap2DProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState<'FRONT' | 'BACK'>('FRONT');
  const [canScrollDown, setCanScrollDown] = useState(true);

  const muscleValues = useMemo(() => {
    const raw: Record<string, number> = {
      chest: muscleCounts['Chest'] || 0,
      shoulders: muscleCounts['Shoulders'] || 0,
      biceps: muscleCounts['Biceps'] || 0,
      triceps: muscleCounts['Triceps'] || 0,
      forearms: muscleCounts['Forearms'] || 0,
      abs: muscleCounts['Core'] || muscleCounts['Abs'] || 0,
      obliques: Math.round((muscleCounts['Core'] || muscleCounts['Abs'] || 0) * 0.7),
      lats: muscleCounts['Back'] || 0,
      traps: Math.round((muscleCounts['Back'] || 0) * 0.75),
      lowerback: Math.round((muscleCounts['Back'] || 0) * 0.6),
      quads: muscleCounts['Quads'] || 0,
      hamstrings: muscleCounts['Hamstrings'] || 0,
      glutes: muscleCounts['Glutes'] || 0,
      calves: muscleCounts['Calves'] || 0,
    };

    const max = Math.max(...Object.values(raw), 1);
    const pcts: Record<string, number> = {};
    for (const key in raw) {
      pcts[key] = Math.round((raw[key] / max) * 100);
      if (raw[key] === 0) pcts[key] = 0;
    }
    return pcts;
  }, [muscleCounts]);

  const getHeatColor = (val: number, isHovered: boolean) => {
    if (val <= 0) return isHovered ? 'var(--input-bg)' : 'rgba(255, 255, 255, 0.06)';
    if (val <= 30) return isHovered ? '#60a5fa' : '#3b82f6'; // Blue
    if (val <= 65) return isHovered ? '#FFF066' : '#FFE100'; // Lime / Yellow
    return isHovered ? '#FF7A52' : '#FF4757'; // Electric Orange / Red
  };

  const sortedRows = useMemo(() => {
    return Object.keys(muscleValues)
      .map((k) => ({
        key: k,
        label: MUSCLE_LABELS[k],
        val: muscleValues[k],
      }))
      .sort((a, b) => b.val - a.val);
  }, [muscleValues]);

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    setCanScrollDown(!isAtBottom);
  };

  const hoveredInfo = hovered ? { label: MUSCLE_LABELS[hovered], pct: muscleValues[hovered] } : null;

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '2px solid var(--border-light)',
        borderRadius: 24,
        padding: '20px 16px',
        color: 'var(--text-primary)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header & View Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#FFE100', letterSpacing: 1, textTransform: 'uppercase' }}>
            2D Muscle Load
          </span>
          <h3 style={{ fontSize: 18, fontWeight: 900, margin: '2px 0 0', color: 'var(--text-primary)' }}>
            Heatmap Visualizer
          </h3>
        </div>

        {/* Front and Back View Buttons */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--input-bg)', padding: 4, borderRadius: 9999, border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => setView('FRONT')}
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 800,
              border: view === 'FRONT' ? '1.5px solid #111111' : 'none',
              background: view === 'FRONT' ? '#FFE100' : 'transparent',
              color: view === 'FRONT' ? '#111111' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            Front
          </button>
          <button
            onClick={() => setView('BACK')}
            style={{
              padding: '6px 16px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 800,
              border: view === 'BACK' ? '1.5px solid #111111' : 'none',
              background: view === 'BACK' ? '#FFE100' : 'transparent',
              color: view === 'BACK' ? '#111111' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            Back
          </button>
        </div>
      </div>

      {/* Main 2D Viewport */}
      <div
        style={{
          position: 'relative',
          height: 380,
          background: 'var(--input-bg)',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 16,
            fontSize: 11,
            fontWeight: 800,
            color: '#FFE100',
            letterSpacing: 1,
          }}
        >
          {view} VIEW
        </div>

        {/* 2D Vector Anatomy Canvas Container */}
        <div style={{ width: 200, height: 340, position: 'relative' }}>
          {view === 'FRONT' ? (
            /* FRONT SVG */
            <svg
              viewBox="0 0 300 560"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            >
              {/* Body Outline Base */}
              <path
                fill="var(--card-bg)"
                stroke="var(--border-light)"
                strokeWidth="1.5"
                d="M150,14 C162,14 171,25 171,42 C171,52 168,62 163,68 C161,72 160,78 160,84 C168,88 180,92 191,97 C202,101 210,108 214,120 C217,132 219,152 221,172 C223,194 227,222 231,248 C234,266 236,282 236,294 C236,304 230,310 224,306 C219,302 217,292 215,280 C210,254 205,224 201,198 C199,180 196,158 193,136 C189,152 184,176 182,200 C182,216 186,232 189,248 C191,262 191,276 189,292 C188,318 186,344 181,368 C179,380 178,390 179,400 C182,414 184,432 183,448 C181,468 178,488 176,504 C180,510 186,514 189,520 C190,526 184,530 176,529 C168,528 163,522 162,512 C161,494 160,472 158,452 C157,436 158,418 159,404 C159,384 157,356 155,330 C154,310 152,292 151,280 L150,276 C148,292 146,310 145,330 C143,356 141,384 141,404 C142,418 143,436 142,452 C140,472 139,494 138,512 C137,522 132,528 124,529 C116,530 110,526 111,520 C114,514 120,510 124,504 C122,488 119,468 117,448 C116,432 118,414 121,400 C122,390 121,380 119,368 C114,344 112,318 111,292 C109,276 109,262 111,248 C114,232 118,216 118,200 C116,176 111,152 107,136 C104,158 101,180 99,198 C95,224 90,254 85,280 C83,292 81,302 76,306 C70,310 64,304 64,294 C64,282 66,266 69,248 C73,222 77,194 79,172 C81,152 83,132 86,120 C90,108 98,101 109,97 C120,92 132,88 140,84 C140,78 139,72 137,68 C132,62 129,52 129,42 C129,25 138,14 150,14 Z"
              />

              {/* Traps */}
              <g
                fill={getHeatColor(muscleValues.traps, hovered === 'traps')}
                stroke={hovered === 'traps' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'traps' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('traps')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M153,88 C162,90 178,94 192,100 C182,104 168,106 158,106 C155,100 154,93 153,88 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M153,88 C162,90 178,94 192,100 C182,104 168,106 158,106 C155,100 154,93 153,88 Z" />
                </g>
              </g>

              {/* Shoulders */}
              <g
                fill={getHeatColor(muscleValues.shoulders, hovered === 'shoulders')}
                stroke={hovered === 'shoulders' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'shoulders' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('shoulders')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M196,102 C206,104 213,112 215,126 C216,136 213,144 208,148 C202,144 196,132 193,118 C193,110 194,104 196,102 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M196,102 C206,104 213,112 215,126 C216,136 213,144 208,148 C202,144 196,132 193,118 C193,110 194,104 196,102 Z" />
                </g>
              </g>

              {/* Chest */}
              <g
                fill={getHeatColor(muscleValues.chest, hovered === 'chest')}
                stroke={hovered === 'chest' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'chest' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('chest')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M152,108 C166,106 182,110 191,120 C195,130 194,142 186,150 C176,156 162,156 154,150 C152,138 151,120 152,108 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M152,108 C166,106 182,110 191,120 C195,130 194,142 186,150 C176,156 162,156 154,150 C152,138 151,120 152,108 Z" />
                </g>
              </g>

              {/* Biceps */}
              <g
                fill={getHeatColor(muscleValues.biceps, hovered === 'biceps')}
                stroke={hovered === 'biceps' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'biceps' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('biceps')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M197,150 C205,148 211,156 213,170 C214,184 212,196 207,202 C201,198 197,184 195,170 C194,160 195,153 197,150 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M197,150 C205,148 211,156 213,170 C214,184 212,196 207,202 C201,198 197,184 195,170 C194,160 195,153 197,150 Z" />
                </g>
              </g>

              {/* Forearms */}
              <g
                fill={getHeatColor(muscleValues.forearms, hovered === 'forearms')}
                stroke={hovered === 'forearms' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'forearms' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('forearms')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M203,206 C210,203 219,208 223,220 C226,240 223,258 217,272 C212,274 206,270 204,256 C201,240 201,218 203,206 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M203,206 C210,203 219,208 223,220 C226,240 223,258 217,272 C212,274 206,270 204,256 C201,240 201,218 203,206 Z" />
                </g>
              </g>

              {/* Abs */}
              <g
                fill={getHeatColor(muscleValues.abs, hovered === 'abs')}
                stroke={hovered === 'abs' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'abs' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('abs')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M152,160 C156,158 160,158 163,160 L163,174 C159,176 155,176 152,174 Z" />
                <path d="M152,180 C156,178 160,178 163,180 L163,194 C159,196 155,196 152,194 Z" />
                <path d="M152,200 C156,198 160,198 163,200 L163,214 C159,216 155,216 152,214 Z" />
                <path d="M152,220 C156,218 160,218 163,220 L162,244 C158,254 154,256 152,256 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M152,160 C156,158 160,158 163,160 L163,174 C159,176 155,176 152,174 Z" />
                  <path d="M152,180 C156,178 160,178 163,180 L163,194 C159,196 155,196 152,194 Z" />
                  <path d="M152,200 C156,198 160,198 163,200 L163,214 C159,216 155,216 152,214 Z" />
                  <path d="M152,220 C156,218 160,218 163,220 L162,244 C158,254 154,256 152,256 Z" />
                </g>
              </g>

              {/* Obliques */}
              <g
                fill={getHeatColor(muscleValues.obliques, hovered === 'obliques')}
                stroke={hovered === 'obliques' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'obliques' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('obliques')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M166,160 C172,164 176,172 177,182 C173,182 168,178 166,172 Z" />
                <path d="M167,188 C173,192 177,200 178,212 C179,226 176,240 170,250 C167,240 165,220 165,204 C165,196 166,190 167,188 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M166,160 C172,164 176,172 177,182 C173,182 168,178 166,172 Z" />
                  <path d="M167,188 C173,192 177,200 178,212 C179,226 176,240 170,250 C167,240 165,220 165,204 C165,196 166,190 167,188 Z" />
                </g>
              </g>

              {/* Quads */}
              <g
                fill={getHeatColor(muscleValues.quads, hovered === 'quads')}
                stroke={hovered === 'quads' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'quads' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('quads')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M156,274 C170,268 184,276 188,296 C191,324 189,352 182,372 C176,380 163,380 158,370 C152,348 150,310 152,290 C153,282 154,277 156,274 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M156,274 C170,268 184,276 188,296 C191,324 189,352 182,372 C176,380 163,380 158,370 C152,348 150,310 152,290 C153,282 154,277 156,274 Z" />
                </g>
              </g>

              {/* Calves (Front) */}
              <g
                fill={getHeatColor(muscleValues.calves, hovered === 'calves')}
                stroke={hovered === 'calves' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'calves' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('calves')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M159,398 C168,394 176,400 178,416 C179,436 175,456 168,468 C163,470 159,464 158,450 C156,432 157,408 159,398 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M159,398 C168,394 176,400 178,416 C179,436 175,456 168,468 C163,470 159,464 158,450 C156,432 157,408 159,398 Z" />
                </g>
              </g>
            </svg>
          ) : (
            /* BACK SVG */
            <svg
              viewBox="0 0 300 560"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            >
              {/* Back Outline Base */}
              <path
                fill="var(--card-bg)"
                stroke="var(--border-light)"
                strokeWidth="1.5"
                d="M150,14 C162,14 171,25 171,42 C171,52 168,62 163,68 C161,72 160,78 160,84 C168,88 180,92 191,97 C202,101 210,108 214,120 C217,132 219,152 221,172 C223,194 227,222 231,248 C234,266 236,282 236,294 C236,304 230,310 224,306 C219,302 217,292 215,280 C210,254 205,224 201,198 C199,180 196,158 193,136 C189,152 184,176 182,200 C182,216 186,232 189,248 C191,262 191,276 189,292 C188,318 186,344 181,368 C179,380 178,390 179,400 C182,414 184,432 183,448 C181,468 178,488 176,504 C180,510 186,514 189,520 C190,526 184,530 176,529 C168,528 163,522 162,512 C161,494 160,472 158,452 C157,436 158,418 159,404 C159,384 157,356 155,330 C154,310 152,292 151,280 L150,276 C148,292 146,310 145,330 C143,356 141,384 141,404 C142,418 143,436 142,452 C140,472 139,494 138,512 C137,522 132,528 124,529 C116,530 110,526 111,520 C114,514 120,510 124,504 C122,488 119,468 117,448 C116,432 118,414 121,400 C122,390 121,380 119,368 C114,344 112,318 111,292 C109,276 109,262 111,248 C114,232 118,216 118,200 C116,176 111,152 107,136 C104,158 101,180 99,198 C95,224 90,254 85,280 C83,292 81,302 76,306 C70,310 64,304 64,294 C64,282 66,266 69,248 C73,222 77,194 79,172 C81,152 83,132 86,120 C90,108 98,101 109,97 C120,92 132,88 140,84 C140,78 139,72 137,68 C132,62 129,52 129,42 C129,25 138,14 150,14 Z"
              />

              {/* Traps (Back) */}
              <g
                fill={getHeatColor(muscleValues.traps, hovered === 'traps')}
                stroke={hovered === 'traps' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'traps' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('traps')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M150,66 C154,68 157,72 158,80 C170,86 186,92 197,100 C188,108 172,112 160,114 C158,132 154,158 151,176 C150,180 150,180 149,176 C146,158 142,132 140,114 C128,112 112,108 103,100 C114,92 130,86 142,80 C143,72 146,68 150,66 Z" />
              </g>

              {/* Rear Shoulders */}
              <g
                fill={getHeatColor(muscleValues.shoulders, hovered === 'shoulders')}
                stroke={hovered === 'shoulders' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'shoulders' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('shoulders')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M196,102 C206,104 213,112 215,126 C216,136 213,144 208,148 C202,144 196,132 193,118 C193,110 194,104 196,102 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M196,102 C206,104 213,112 215,126 C216,136 213,144 208,148 C202,144 196,132 193,118 C193,110 194,104 196,102 Z" />
                </g>
              </g>

              {/* Lats */}
              <g
                fill={getHeatColor(muscleValues.lats, hovered === 'lats')}
                stroke={hovered === 'lats' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'lats' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('lats')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M170,116 C180,114 190,118 194,126 C190,134 180,138 172,138 C169,130 169,122 170,116 Z" />
                <path d="M160,124 C173,132 186,140 193,152 C190,172 180,196 166,216 C161,222 158,218 158,208 C157,180 158,148 160,124 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M170,116 C180,114 190,118 194,126 C190,134 180,138 172,138 C169,130 169,122 170,116 Z" />
                  <path d="M160,124 C173,132 186,140 193,152 C190,172 180,196 166,216 C161,222 158,218 158,208 C157,180 158,148 160,124 Z" />
                </g>
              </g>

              {/* Lower Back */}
              <g
                fill={getHeatColor(muscleValues.lowerback, hovered === 'lowerback')}
                stroke={hovered === 'lowerback' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'lowerback' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('lowerback')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M150.5,180 C154,182 156,188 156,198 L155,234 C155,244 153,248 150.5,248 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M150.5,180 C154,182 156,188 156,198 L155,234 C155,244 153,248 150.5,248 Z" />
                </g>
              </g>

              {/* Triceps */}
              <g
                fill={getHeatColor(muscleValues.triceps, hovered === 'triceps')}
                stroke={hovered === 'triceps' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'triceps' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('triceps')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M197,150 C206,148 212,157 214,172 C215,186 212,198 206,204 C200,199 196,184 195,168 C194,158 195,152 197,150 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M197,150 C206,148 212,157 214,172 C215,186 212,198 206,204 C200,199 196,184 195,168 C194,158 195,152 197,150 Z" />
                </g>
              </g>

              {/* Glutes */}
              <g
                fill={getHeatColor(muscleValues.glutes, hovered === 'glutes')}
                stroke={hovered === 'glutes' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'glutes' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('glutes')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M152,252 C168,248 184,256 187,272 C189,288 181,300 168,302 C157,302 151,292 150,278 C150,268 151,258 152,252 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M152,252 C168,248 184,256 187,272 C189,288 181,300 168,302 C157,302 151,292 150,278 C150,268 151,258 152,252 Z" />
                </g>
              </g>

              {/* Hamstrings */}
              <g
                fill={getHeatColor(muscleValues.hamstrings, hovered === 'hamstrings')}
                stroke={hovered === 'hamstrings' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'hamstrings' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('hamstrings')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M157,306 C170,302 183,310 186,328 C188,350 184,372 177,386 C170,392 161,388 158,378 C153,356 154,324 157,306 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M157,306 C170,302 183,310 186,328 C188,350 184,372 177,386 C170,392 161,388 158,378 C153,356 154,324 157,306 Z" />
                </g>
              </g>

              {/* Calves (Back) */}
              <g
                fill={getHeatColor(muscleValues.calves, hovered === 'calves')}
                stroke={hovered === 'calves' ? '#FFFFFF' : 'rgba(0,0,0,0.4)'}
                strokeWidth={hovered === 'calves' ? 1.5 : 0.75}
                onMouseEnter={() => setHovered('calves')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
              >
                <path d="M157,398 C168,394 178,402 180,418 C182,436 177,452 170,460 C163,462 158,454 157,440 C155,424 155,408 157,398 Z" />
                <g transform="translate(300,0) scale(-1,1)">
                  <path d="M157,398 C168,394 178,402 180,418 C182,436 177,452 170,460 C163,462 158,454 157,440 C155,424 155,408 157,398 Z" />
                </g>
              </g>
            </svg>
          )}
        </div>

        {/* Hover Readout Tooltip */}
        <div style={{ position: 'absolute', bottom: 12, textAlign: 'center' }}>
          {hoveredInfo ? (
            <div>
              <span style={{ fontSize: 14, fontWeight: 900, color: getHeatColor(hoveredInfo.pct, true) }}>
                {hoveredInfo.label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginLeft: 8 }}>
                {hoveredInfo.pct}% volume load
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Hover or tap any muscle group to view load
            </span>
          )}
        </div>
      </div>

      {/* Heat Scale Legend */}
      <div style={{ marginBottom: 20, padding: '0 4px' }}>
        <div
          style={{
            height: 8,
            borderRadius: 9999,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.06), #3b82f6, #FFE100, #FF4757)',
            marginBottom: 6,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)' }}>
          <span>REST (0%)</span>
          <span>LIGHT (1-30%)</span>
          <span>MODERATE (31-65%)</span>
          <span>MAX (66%+)</span>
        </div>
      </div>

      {/* Muscle Load Breakdown List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
            Muscle Group Load Breakdown
          </h4>
          {canScrollDown && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#FFE100', display: 'flex', alignItems: 'center', gap: 4 }}>
              Scroll ↓
            </span>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div
            className="no-scrollbar"
            onScroll={handleListScroll}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}
          >
            {sortedRows.map((r) => {
              const isHov = hovered === r.key;
              return (
                <div
                  key={r.key}
                  onMouseEnter={() => setHovered(r.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr 45px',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: isHov ? 'var(--input-bg)' : 'transparent',
                    border: isHov ? '1px solid var(--border-light)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{r.label}</div>

                  <div style={{ height: 8, background: 'var(--input-bg)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 9999,
                        width: `${r.val}%`,
                        background: getHeatColor(r.val, false),
                        transition: 'width 0.4s ease, background 0.2s ease',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'monospace' }}>
                    {r.val}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom fade hint indicator */}
          {canScrollDown && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 36,
                background: 'linear-gradient(to top, var(--card-bg), transparent)',
                pointerEvents: 'none',
                borderRadius: '0 0 12px 12px',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
