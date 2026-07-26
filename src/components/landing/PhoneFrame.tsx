'use client';

import React from 'react';

/**
 * Realistic iPhone shell — titanium band, dynamic island, side buttons.
 * `cropped` cuts the device off at the bottom so it bleeds out of the section.
 * Children are rendered inside the screen (already clipped to the bezel radius).
 */
export default function PhoneFrame({
  width = 320,
  height = 700,
  cropped = false,
  cropTop = false,
  screenBg = '#ffffff',
  children,
  style,
}: {
  width?: number;
  height?: number | string;
  /** Cut the device off at the bottom. */
  cropped?: boolean;
  /** Cut the device off at the top too (hides the dynamic island). */
  cropTop?: boolean;
  /** Screen background — set for dark-mode mockups. */
  screenBg?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const scale = width / 320;
  const band = 56 * scale;
  const screen = 44 * scale;
  const framePad = 11 * scale;

  const corners = (r: number) =>
    `${cropTop ? 0 : r}px ${cropTop ? 0 : r}px ${cropped ? 0 : r}px ${cropped ? 0 : r}px`;

  const bandRadius = corners(band);
  const innerRadius = corners(band - 2);
  const screenRadius = corners(screen);

  return (
    <div style={{ position: 'relative', width, height, flexShrink: 0, ...style }}>
      {/* ── Side buttons (left: silent + volume) ── */}
      <div style={{ position: 'absolute', left: -3, top: 108 * scale, width: 3, height: 26 * scale, background: '#2b2b2b', borderRadius: '3px 0 0 3px' }} />
      <div style={{ position: 'absolute', left: -4, top: 160 * scale, width: 4, height: 50 * scale, background: '#2b2b2b', borderRadius: '3px 0 0 3px' }} />
      <div style={{ position: 'absolute', left: -4, top: 222 * scale, width: 4, height: 50 * scale, background: '#2b2b2b', borderRadius: '3px 0 0 3px' }} />
      {/* ── Side button (right: power) ── */}
      <div style={{ position: 'absolute', right: -4, top: 196 * scale, width: 4, height: 74 * scale, background: '#2b2b2b', borderRadius: '0 3px 3px 0' }} />

      {/* ── Titanium band ── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: bandRadius,
          padding: 2,
          paddingTop: cropTop ? 0 : 2,
          paddingBottom: cropped ? 0 : 2,
          boxSizing: 'border-box',
          background: 'linear-gradient(145deg, #6e6e6e 0%, #2a2a2a 22%, #8d8d8d 50%, #2a2a2a 78%, #6e6e6e 100%)',
        }}
      >
        {/* ── Black frame ── */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: innerRadius,
            background: '#0a0a0a',
            padding: framePad,
            paddingTop: cropTop ? 0 : framePad,
            paddingBottom: cropped ? 0 : framePad,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* ── Screen ── */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: screenRadius,
              overflow: 'hidden',
              background: screenBg,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>

          {/* ── Dynamic island ── */}
          {!cropTop && <div
            style={{
              position: 'absolute',
              top: framePad + 9 * scale,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 92 * scale,
              height: 27 * scale,
              background: '#0a0a0a',
              borderRadius: 999,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 9 * scale,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: 7 * scale,
                height: 7 * scale,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #2f4f6f, #05070a 70%)',
              }}
            />
          </div>}
        </div>
      </div>
    </div>
  );
}
