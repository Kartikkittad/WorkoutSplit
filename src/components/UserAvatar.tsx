'use client';

import { useState } from 'react';

interface UserAvatarProps {
  user: {
    email?: string;
    user_metadata?: {
      avatar_url?: string;
      picture?: string;
      full_name?: string;
      name?: string;
    };
  } | null;
  size?: number;
  className?: string;
}

export default function UserAvatar({ user, size = 44, className = '' }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const photoUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'User';

  const initial = displayName.charAt(0).toUpperCase();

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={displayName}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--border-light, #111111)',
          flexShrink: 0,
        }}
        className={className}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#FFE100',
        color: '#111111',
        fontWeight: 800,
        fontSize: Math.round(size * 0.42),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--border-light, #111111)',
        boxShadow: '1px 1px 0 #111111',
        flexShrink: 0,
        fontFamily: "'Archivo Black', sans-serif",
      }}
      className={className}
    >
      {initial}
    </div>
  );
}
