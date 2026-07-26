'use client';

import React from 'react';

interface LogoIconProps {
  size?: number;
  mode?: 'light' | 'dark' | 'auto';
  className?: string;
  style?: React.CSSProperties;
}

export default function LogoIcon({ size = 40, mode = 'auto', className, style }: LogoIconProps) {
  // In light mode, the W is dark #111111; in dark mode, the W is solid WHITE #FFFFFF.
  // When mode is 'auto', CSS variables handle the dynamic theme swap automatically!
  const wColor = mode === 'dark' ? '#FFFFFF' : mode === 'light' ? '#111111' : 'var(--logo-w-color, #FFFFFF)';
  const boltBorder = mode === 'dark' ? '#FFFFFF' : mode === 'light' ? '#111111' : 'var(--logo-bolt-border, #FFFFFF)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {/* Bold White "W" Lettermark */}
      <path
        d="M12 20 L31 80 L50 32 L69 80 L88 20 L74 20 L60 62 L48 24 L38 24 L26 62 L14 20 Z"
        fill={wColor}
      />
      {/* Bright Electric Yellow Thunderbolt with White Outline */}
      <path
        d="M58 10 L35 50 L49 50 L41 90 L65 42 L51 42 Z"
        fill="#FFE100"
        stroke={boltBorder}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
