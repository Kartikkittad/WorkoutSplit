'use client';

import React from 'react';
import HugeIcon from './HugeIcon';

interface ExerciseCardProps {
  icon?: React.ReactNode;
  name: string;
  category?: string;
  workoutCount: number;
  duration: number;
  color: string;
  onClick?: () => void;
}

export default function ExerciseCard({
  icon,
  name,
  category = 'Chest',
  workoutCount,
  duration,
  color,
  onClick,
}: ExerciseCardProps) {
  return (
    <div
      className="exercise-card"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: `2px solid ${color}`,
        borderRadius: 20,
        padding: '16px 14px',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <div
        className="exercise-card-emoji"
        style={{
          backgroundColor: color,
          color: '#111111',
          width: 44,
          height: 44,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        {icon ? icon : <HugeIcon name={name} category={category} size={22} color="#111111" strokeWidth={2.5} />}
      </div>
      <div className="exercise-card-name" style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: 'var(--text-primary)' }}>
        {name}
      </div>
      <div className="exercise-card-meta" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {workoutCount} workout{workoutCount !== 1 ? 's' : ''}
      </div>
      <div className="exercise-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z" />
        </svg>
        {duration} min
      </div>
    </div>
  );
}
