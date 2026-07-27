'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  requestNotificationPermission,
  updateRestNotification,
  triggerRestCompletion,
  clearRestNotification,
  playWarningVibration,
} from '@/lib/restNotifier';

interface RestTimerProps {
  defaultSeconds?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

const PRESETS = [30, 60, 90, 120];

export default function RestTimer({ defaultSeconds = 90, autoStart = false, onComplete }: RestTimerProps) {
  const [totalTime, setTotalTime] = useState(defaultSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      updateRestNotification(timeLeft, totalTime);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            triggerRestCompletion();
            onComplete?.();
            return 0;
          }
          if (prev === 11) {
            playWarningVibration();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
      if (!isRunning && timeLeft > 0) {
        clearRestNotification();
      }
    }

    return clearTimer;
  }, [isRunning, timeLeft, totalTime, clearTimer, onComplete]);

  // Auto-start on mount when autoStart is true
  useEffect(() => {
    if (autoStart) {
      setIsRunning(true);
      requestNotificationPermission();
    }
  }, [autoStart]);


  const handleStartPause = () => {
    if (timeLeft === 0) {
      // Reset then start
      setTimeLeft(totalTime);
      setIsRunning(true);
      requestNotificationPermission();
    } else {
      setIsRunning((prev) => {
        const next = !prev;
        if (next) requestNotificationPermission();
        else clearRestNotification();
        return next;
      });
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setTimeLeft(totalTime);
    clearRestNotification();
  };

  const handlePreset = (seconds: number) => {
    clearTimer();
    setIsRunning(false);
    setTotalTime(seconds);
    setTimeLeft(seconds);
    clearRestNotification();
  };


  // SVG ring setup
  const size = 200;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circumference - progress * circumference;
  const center = size / 2;

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="rest-timer">
      {/* Timer circle */}
      <div className="rest-timer-circle" style={{ width: size, height: size }}>
        <svg
          className="rest-timer-svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="rest-timer-bg"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="rest-timer-fg"
            cx={center}
            cy={center}
            r={radius}
            stroke="#FFE100"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="rest-timer-time">{display}</div>
      </div>

      {/* Preset buttons */}
      <div className="rest-timer-presets">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            className={`rest-timer-preset${totalTime === preset ? ' active' : ''}`}
            onClick={() => handlePreset(preset)}
          >
            {preset}s
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="rest-timer-controls">
        <button className="btn-primary" onClick={handleStartPause}>
          {isRunning ? 'Pause' : timeLeft === 0 ? 'Restart' : 'Start'}
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
