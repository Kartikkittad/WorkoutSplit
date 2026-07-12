'use client';

import React from 'react';

interface BodyHeatmapSVGProps {
  muscleCounts: Record<string, number>;
  view: 'front' | 'back';
}

export default function BodyHeatmapSVG({ muscleCounts, view }: BodyHeatmapSVGProps) {
  const getColor = (muscle: string) => {
    const count = muscleCounts[muscle] || 0;
    if (count === 0) return '#B4DEC4';
    if (count === 1) return '#FFDA6B';
    if (count === 2) return '#FF9F43';
    return '#EE5A24';
  };

  const N = '#B4DEC4';  // Neutral / untrained mint green
  const S = '#6AAE7B';  // Stroke / contour line color
  const sw = 0.8;       // Base stroke width

  if (view === 'front') {
    return (
      <svg viewBox="0 0 200 440" width="auto" height="300" style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
        {/* ── HEAD ── */}
        <path d="M100,8 C113,8 118,18 118,28 C118,40 112,48 108,50 L108,52 C106,56 104,58 100,58 C96,58 94,56 92,52 L92,50 C88,48 82,40 82,28 C82,18 87,8 100,8Z" fill={N} stroke={S} strokeWidth={sw} />
        {/* Face line */}
        <path d="M92,30 C96,34 100,36 100,36 C100,36 104,34 108,30" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── NECK ── */}
        <path d="M92,52 L90,66 L110,66 L108,52" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        {/* Sternocleidomastoid lines */}
        <path d="M94,54 L92,64" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M106,54 L108,64" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── TRAPEZIUS (visible from front, maps to Back) ── */}
        <path d="M90,60 C82,62 68,68 56,74 L62,80 C72,74 84,68 90,64Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
        <path d="M110,60 C118,62 132,68 144,74 L138,80 C128,74 116,68 110,64Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />

        {/* ── LEFT DELTOID ── */}
        <path d="M56,74 C46,78 34,86 32,96 C30,104 34,110 40,110 L60,104 C64,96 66,86 64,78Z" fill={getColor('Shoulders')} stroke={S} strokeWidth={sw} />
        {/* Deltoid contour lines */}
        <path d="M46,80 C42,88 40,96 42,104" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M54,78 C52,86 52,94 54,102" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── RIGHT DELTOID ── */}
        <path d="M144,74 C154,78 166,86 168,96 C170,104 166,110 160,110 L140,104 C136,96 134,86 136,78Z" fill={getColor('Shoulders')} stroke={S} strokeWidth={sw} />
        <path d="M154,80 C158,88 160,96 158,104" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M146,78 C148,86 148,94 146,102" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── LEFT PECTORAL ── */}
        <path d="M64,78 C66,76 80,74 99,74 L99,120 C92,124 78,122 72,116 C66,110 62,94 64,78Z" fill={getColor('Chest')} stroke={S} strokeWidth={sw} />
        {/* Pec contour lines */}
        <path d="M70,86 C78,84 88,82 98,82" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M68,96 C76,94 86,92 98,92" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── RIGHT PECTORAL ── */}
        <path d="M136,78 C134,76 120,74 101,74 L101,120 C108,124 122,122 128,116 C134,110 138,94 136,78Z" fill={getColor('Chest')} stroke={S} strokeWidth={sw} />
        <path d="M130,86 C122,84 112,82 102,82" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M132,96 C124,94 114,92 102,92" fill="none" stroke={S} strokeWidth={0.35} />

        {/* Chest center line */}
        <line x1="100" y1="74" x2="100" y2="120" stroke={S} strokeWidth={0.4} />

        {/* ── SERRATUS ANTERIOR (Core) ── */}
        <path d="M64,102 L60,106 L62,110 L60,114 L62,118 L60,122 L64,126 L70,122 L70,102Z" fill={getColor('Core')} stroke={S} strokeWidth={0.4} />
        <path d="M136,102 L140,106 L138,110 L140,114 L138,118 L140,122 L136,126 L130,122 L130,102Z" fill={getColor('Core')} stroke={S} strokeWidth={0.4} />

        {/* ── LEFT BICEP ── */}
        <path d="M40,110 C36,118 32,136 30,154 C28,166 32,172 36,172 L50,172 C54,172 56,166 54,154 C52,136 58,118 60,104Z" fill={getColor('Biceps')} stroke={S} strokeWidth={sw} />
        {/* Bicep contour */}
        <path d="M42,120 C40,134 38,150 40,164" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── RIGHT BICEP ── */}
        <path d="M160,110 C164,118 168,136 170,154 C172,166 168,172 164,172 L150,172 C146,172 144,166 146,154 C148,136 142,118 140,104Z" fill={getColor('Biceps')} stroke={S} strokeWidth={sw} />
        <path d="M158,120 C160,134 162,150 160,164" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── LEFT FOREARM ── */}
        <path d="M30,172 C26,188 22,206 20,222 C18,232 22,238 26,238 L42,238 C46,238 48,232 46,222 C44,206 48,188 50,172Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
        <path d="M34,178 C32,194 30,210 30,226" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M42,178 C42,194 40,210 38,226" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── RIGHT FOREARM ── */}
        <path d="M170,172 C174,188 178,206 180,222 C182,232 178,238 174,238 L158,238 C154,238 152,232 154,222 C156,206 152,188 150,172Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
        <path d="M166,178 C168,194 170,210 170,226" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M158,178 C158,194 160,210 162,226" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── LEFT HAND ── */}
        <path d="M20,238 C16,248 12,258 14,266 C16,272 22,276 30,276 L36,276 C42,276 46,272 44,266 C42,258 42,248 42,238Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        {/* Fingers */}
        <path d="M18,264 L14,276" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M24,266 L22,278" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M30,266 L30,280" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M36,266 L36,278" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── RIGHT HAND ── */}
        <path d="M180,238 C184,248 188,258 186,266 C184,272 178,276 170,276 L164,276 C158,276 154,272 156,266 C158,258 158,248 158,238Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        <path d="M182,264 L186,276" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M176,266 L178,278" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M170,266 L170,280" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M164,266 L164,278" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── ABDOMINALS (Core) ── */}
        {/* Six-pack blocks */}
        <rect x="82" y="122" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        <rect x="102" y="122" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        <rect x="82" y="138" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        <rect x="102" y="138" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        <rect x="82" y="154" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        <rect x="102" y="154" width="16" height="14" rx="2" fill={getColor('Core')} stroke={S} strokeWidth={0.45} />
        {/* Linea alba (center line) */}
        <line x1="100" y1="120" x2="100" y2="174" stroke={S} strokeWidth={0.5} />

        {/* ── OBLIQUES (Core) ── */}
        <path d="M70,120 C66,134 64,150 66,170 L80,174 L80,120Z" fill={getColor('Core')} stroke={S} strokeWidth={0.5} />
        <path d="M130,120 C134,134 136,150 134,170 L120,174 L120,120Z" fill={getColor('Core')} stroke={S} strokeWidth={0.5} />
        {/* Oblique contour lines */}
        <path d="M70,130 L78,128" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M68,140 L78,138" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M66,150 L78,148" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M66,160 L78,158" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M130,130 L122,128" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M132,140 L122,138" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M134,150 L122,148" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M134,160 L122,158" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── HIP / PELVIS ── */}
        <path d="M66,172 C64,182 64,194 70,208 L80,222 C88,228 96,230 100,230 C104,230 112,228 120,222 L130,208 C136,194 136,182 134,172Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        {/* Hip V-lines (inguinal crease) */}
        <path d="M74,176 C78,194 84,212 92,226" fill="none" stroke={S} strokeWidth={0.4} />
        <path d="M126,176 C122,194 116,212 108,226" fill="none" stroke={S} strokeWidth={0.4} />
        {/* Iliac crest hint */}
        <path d="M68,178 C74,180 80,178 86,174" fill="none" stroke={S} strokeWidth={0.3} />
        <path d="M132,178 C126,180 120,178 114,174" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── LEFT QUAD ── */}
        <path d="M70,212 C66,232 62,260 64,292 C66,312 72,328 78,334 L96,334 C100,326 100,312 100,292 C100,260 96,232 92,224Z" fill={getColor('Quads')} stroke={S} strokeWidth={sw} />
        {/* Quad muscle separations */}
        <path d="M76,220 C74,248 72,280 76,318" fill="none" stroke={S} strokeWidth={0.4} />
        <path d="M86,222 C84,250 84,282 86,324" fill="none" stroke={S} strokeWidth={0.4} />
        {/* Vastus medialis teardrop */}
        <path d="M92,310 C94,318 96,326 96,332" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── RIGHT QUAD ── */}
        <path d="M130,212 C134,232 138,260 136,292 C134,312 128,328 122,334 L104,334 C100,326 100,312 100,292 C100,260 104,232 108,224Z" fill={getColor('Quads')} stroke={S} strokeWidth={sw} />
        <path d="M124,220 C126,248 128,280 124,318" fill="none" stroke={S} strokeWidth={0.4} />
        <path d="M114,222 C116,250 116,282 114,324" fill="none" stroke={S} strokeWidth={0.4} />
        <path d="M108,310 C106,318 104,326 104,332" fill="none" stroke={S} strokeWidth={0.35} />

        {/* ── KNEES ── */}
        <ellipse cx="84" cy="340" rx="14" ry="8" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        <ellipse cx="116" cy="340" rx="14" ry="8" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        {/* Kneecaps */}
        <ellipse cx="84" cy="338" rx="6" ry="4" fill={N} stroke={S} strokeWidth={0.3} />
        <ellipse cx="116" cy="338" rx="6" ry="4" fill={N} stroke={S} strokeWidth={0.3} />

        {/* ── LEFT SHIN / TIBIALIS ── */}
        <path d="M70,346 C68,366 66,386 68,406 C70,414 76,420 82,422 L90,422 C96,422 98,416 96,406 C94,386 96,366 96,346Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
        {/* Shin contour (tibialis anterior) */}
        <path d="M78,350 C76,370 76,394 78,414" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M88,350 C88,370 88,394 88,414" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── RIGHT SHIN / TIBIALIS ── */}
        <path d="M130,346 C132,366 134,386 132,406 C130,414 124,420 118,422 L110,422 C104,422 102,416 104,406 C106,386 104,366 104,346Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
        <path d="M122,350 C124,370 124,394 122,414" fill="none" stroke={S} strokeWidth={0.35} />
        <path d="M112,350 C112,370 112,394 112,414" fill="none" stroke={S} strokeWidth={0.3} />

        {/* ── FEET ── */}
        <path d="M68,422 C64,430 62,436 66,440 L96,440 C100,436 98,430 94,422Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        <path d="M132,422 C136,430 138,436 134,440 L104,440 C100,436 102,430 106,422Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
        {/* Toe lines */}
        <path d="M72,436 L72,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M78,436 L78,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M84,436 L84,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M90,436 L90,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M110,436 L110,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M116,436 L116,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M122,436 L122,440" fill="none" stroke={S} strokeWidth={0.25} />
        <path d="M128,436 L128,440" fill="none" stroke={S} strokeWidth={0.25} />

        {/* ── FRONT LABEL ── */}
        <text x="100" y="456" textAnchor="middle" fill={S} fontSize="9" fontWeight="600" fontFamily="inherit">FRONT</text>
      </svg>
    );
  }

  // ═══════════════════════════════════════
  // BACK VIEW
  // ═══════════════════════════════════════
  return (
    <svg viewBox="0 0 200 440" width="auto" height="300" style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
      {/* ── HEAD ── */}
      <path d="M100,8 C113,8 118,18 118,28 C118,40 112,48 108,50 L108,52 C106,56 104,58 100,58 C96,58 94,56 92,52 L92,50 C88,48 82,40 82,28 C82,18 87,8 100,8Z" fill={N} stroke={S} strokeWidth={sw} />

      {/* ── NECK ── */}
      <path d="M92,52 L90,66 L110,66 L108,52" fill={N} stroke={S} strokeWidth={sw * 0.5} />
      <path d="M96,54 C98,58 100,62 100,66" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── TRAPEZIUS (Back - prominent from rear) ── */}
      <path d="M90,58 C82,62 70,66 56,74 L56,82 C64,84 76,80 86,76 L90,72Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      <path d="M110,58 C118,62 130,66 144,74 L144,82 C136,84 124,80 114,76 L110,72Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      {/* Trap contour lines */}
      <path d="M92,62 C84,66 76,70 68,76" fill="none" stroke={S} strokeWidth={0.3} />
      <path d="M108,62 C116,66 124,70 132,76" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── LEFT REAR DELTOID ── */}
      <path d="M56,74 C46,78 34,86 32,96 C30,104 34,110 40,110 L58,104 C62,96 64,86 62,78Z" fill={getColor('Shoulders')} stroke={S} strokeWidth={sw} />
      <path d="M48,80 C44,88 42,96 44,106" fill="none" stroke={S} strokeWidth={0.35} />

      {/* ── RIGHT REAR DELTOID ── */}
      <path d="M144,74 C154,78 166,86 168,96 C170,104 166,110 160,110 L142,104 C138,96 136,86 138,78Z" fill={getColor('Shoulders')} stroke={S} strokeWidth={sw} />
      <path d="M152,80 C156,88 158,96 156,106" fill="none" stroke={S} strokeWidth={0.35} />

      {/* ── UPPER BACK (Infraspinatus / Teres) ── */}
      <path d="M62,78 L98,74 L98,104 L72,116 C66,108 62,94 62,78Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      <path d="M138,78 L102,74 L102,104 L128,116 C134,108 138,94 138,78Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      {/* Spine */}
      <line x1="100" y1="66" x2="100" y2="174" stroke={S} strokeWidth={0.6} />
      {/* Back muscle contour lines */}
      <path d="M68,88 C78,86 88,84 98,84" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M132,88 C122,86 112,84 102,84" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M70,98 C78,96 88,94 98,94" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M130,98 C122,96 112,94 102,94" fill="none" stroke={S} strokeWidth={0.35} />

      {/* ── LATS (Latissimus Dorsi) ── */}
      <path d="M64,104 C60,114 58,128 62,148 L72,152 L80,138 C80,124 76,114 72,104Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      <path d="M136,104 C140,114 142,128 138,148 L128,152 L120,138 C120,124 124,114 128,104Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.6} />
      {/* Lat contour */}
      <path d="M66,114 C64,126 64,138 66,148" fill="none" stroke={S} strokeWidth={0.3} />
      <path d="M134,114 C136,126 136,138 134,148" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── LOWER BACK (Erector Spinae) ── */}
      <path d="M72,116 L98,104 L98,174 L78,174 C72,162 68,140 72,116Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.5} />
      <path d="M128,116 L102,104 L102,174 L122,174 C128,162 132,140 128,116Z" fill={getColor('Back')} stroke={S} strokeWidth={sw * 0.5} />
      {/* Erector spinae lines */}
      <path d="M92,108 C90,130 88,150 90,170" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M108,108 C110,130 112,150 110,170" fill="none" stroke={S} strokeWidth={0.35} />

      {/* ── LEFT TRICEP ── */}
      <path d="M40,110 C36,118 32,136 30,154 C28,166 32,172 36,172 L50,172 C54,172 56,166 54,154 C52,136 56,118 58,104Z" fill={getColor('Triceps')} stroke={S} strokeWidth={sw} />
      {/* Tricep heads */}
      <path d="M44,116 C42,132 40,150 42,166" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M50,112 C50,130 48,150 48,166" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── RIGHT TRICEP ── */}
      <path d="M160,110 C164,118 168,136 170,154 C172,166 168,172 164,172 L150,172 C146,172 144,166 146,154 C148,136 144,118 142,104Z" fill={getColor('Triceps')} stroke={S} strokeWidth={sw} />
      <path d="M156,116 C158,132 160,150 158,166" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M150,112 C150,130 152,150 152,166" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── LEFT FOREARM ── */}
      <path d="M30,172 C26,188 22,206 20,222 C18,232 22,238 26,238 L42,238 C46,238 48,232 46,222 C44,206 48,188 50,172Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
      <path d="M36,178 C34,196 32,214 32,230" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── RIGHT FOREARM ── */}
      <path d="M170,172 C174,188 178,206 180,222 C182,232 178,238 174,238 L158,238 C154,238 152,232 154,222 C156,206 152,188 150,172Z" fill={N} stroke={S} strokeWidth={sw * 0.7} />
      <path d="M164,178 C166,196 168,214 168,230" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── HANDS ── */}
      <path d="M20,238 C16,248 12,258 14,266 C16,272 22,276 30,276 L36,276 C42,276 46,272 44,266 C42,258 42,248 42,238Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
      <path d="M180,238 C184,248 188,258 186,266 C184,272 178,276 170,276 L164,276 C158,276 154,272 156,266 C158,258 158,248 158,238Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />

      {/* ── GLUTES ── */}
      <path d="M66,172 C64,184 66,198 72,210 L98,214 L98,174Z" fill={getColor('Glutes')} stroke={S} strokeWidth={sw * 0.6} />
      <path d="M134,172 C136,184 134,198 128,210 L102,214 L102,174Z" fill={getColor('Glutes')} stroke={S} strokeWidth={sw * 0.6} />
      {/* Glute crease */}
      <line x1="100" y1="174" x2="100" y2="214" stroke={S} strokeWidth={0.5} />
      {/* Glute contour */}
      <path d="M74,180 C72,192 74,204 80,212" fill="none" stroke={S} strokeWidth={0.35} />
      <path d="M126,180 C128,192 126,204 120,212" fill="none" stroke={S} strokeWidth={0.35} />

      {/* ── LEFT HAMSTRING ── */}
      <path d="M70,214 C66,234 62,260 64,292 C66,312 72,328 78,334 L96,334 C100,326 100,312 100,292 C100,260 96,234 92,218Z" fill={getColor('Hamstrings')} stroke={S} strokeWidth={sw} />
      {/* Hamstring muscle separations (biceps femoris / semitendinosus) */}
      <path d="M78,222 C76,250 74,280 78,320" fill="none" stroke={S} strokeWidth={0.4} />
      <path d="M88,220 C86,250 86,282 88,326" fill="none" stroke={S} strokeWidth={0.4} />

      {/* ── RIGHT HAMSTRING ── */}
      <path d="M130,214 C134,234 138,260 136,292 C134,312 128,328 122,334 L104,334 C100,326 100,312 100,292 C100,260 104,234 108,218Z" fill={getColor('Hamstrings')} stroke={S} strokeWidth={sw} />
      <path d="M122,222 C124,250 126,280 122,320" fill="none" stroke={S} strokeWidth={0.4} />
      <path d="M112,220 C114,250 114,282 112,326" fill="none" stroke={S} strokeWidth={0.4} />

      {/* ── KNEES ── */}
      <ellipse cx="84" cy="340" rx="14" ry="8" fill={N} stroke={S} strokeWidth={sw * 0.5} />
      <ellipse cx="116" cy="340" rx="14" ry="8" fill={N} stroke={S} strokeWidth={sw * 0.5} />

      {/* ── LEFT CALF (Gastrocnemius) ── */}
      <path d="M70,346 C66,358 64,374 66,392 C68,406 72,416 80,422 L88,422 C96,416 98,406 96,392 C94,374 96,358 96,346Z" fill={getColor('Calves')} stroke={S} strokeWidth={sw * 0.7} />
      {/* Calf heads (medial / lateral gastrocnemius) */}
      <path d="M80,350 C78,366 76,384 78,406" fill="none" stroke={S} strokeWidth={0.4} />
      {/* Soleus line */}
      <path d="M74,380 C74,394 76,408 78,416" fill="none" stroke={S} strokeWidth={0.3} />
      <path d="M90,380 C90,394 88,408 86,416" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── RIGHT CALF ── */}
      <path d="M130,346 C134,358 136,374 134,392 C132,406 128,416 120,422 L112,422 C104,416 102,406 104,392 C106,374 104,358 104,346Z" fill={getColor('Calves')} stroke={S} strokeWidth={sw * 0.7} />
      <path d="M120,350 C122,366 124,384 122,406" fill="none" stroke={S} strokeWidth={0.4} />
      <path d="M126,380 C126,394 124,408 122,416" fill="none" stroke={S} strokeWidth={0.3} />
      <path d="M110,380 C110,394 112,408 114,416" fill="none" stroke={S} strokeWidth={0.3} />

      {/* ── FEET ── */}
      <path d="M68,422 C64,430 62,436 66,440 L96,440 C100,436 98,430 94,422Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />
      <path d="M132,422 C136,430 138,436 134,440 L104,440 C100,436 102,430 106,422Z" fill={N} stroke={S} strokeWidth={sw * 0.5} />

      {/* ── BACK LABEL ── */}
      <text x="100" y="456" textAnchor="middle" fill={S} fontSize="9" fontWeight="600" fontFamily="inherit">BACK</text>
    </svg>
  );
}
