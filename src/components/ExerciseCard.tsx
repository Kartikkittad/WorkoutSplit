'use client';

interface ExerciseCardProps {
  icon: React.ReactNode;
  name: string;
  workoutCount: number;
  duration: number;
  color: string;
  onClick?: () => void;
}

export default function ExerciseCard({
  icon,
  name,
  workoutCount,
  duration,
  color,
  onClick,
}: ExerciseCardProps) {
  return (
    <div
      className="exercise-card"
      style={{ backgroundColor: `${color}33` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <div
        className="exercise-card-emoji"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="exercise-card-name">{name}</div>
      <div className="exercise-card-meta">
        {workoutCount} workout{workoutCount !== 1 ? 's' : ''}
      </div>
      <div className="exercise-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z" />
        </svg>
        {duration} min
      </div>
    </div>
  );
}
