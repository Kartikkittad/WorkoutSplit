'use client';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export default function ProgressCircle({
  percentage,
  size = 80,
  strokeWidth = 8,
  color = '#C8F135',
  bgColor = 'rgba(0,0,0,0.1)',
  children,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;
  const center = size / 2;

  return (
    <div className="progress-circle-container" style={{ width: size, height: size }}>
      <svg
        className="progress-circle-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="progress-circle-bg"
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Foreground arc */}
        <circle
          className="progress-circle-fg"
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {children && (
        <div className="progress-circle-content">
          {children}
        </div>
      )}
    </div>
  );
}
