'use client';

import { useState } from 'react';
import { useSettings } from './SettingsContext';

import { Workout } from '@/lib/types';

interface WorkoutCardProps {
  workout: Workout;
  onDelete?: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { weightUnit } = useSettings();
  const { name, startedAt, exercises, durationMinutes, notes, intensity, calories, isBuddySession } = workout;

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0
  );

  // Colored left border based on intensity:
  // 1-2: slate border, 3: blue border, 4: lime border, 5: orange border (#F97316)
  let borderLeftColor = undefined;
  if (intensity) {
    if (intensity <= 2) borderLeftColor = '4px solid #64748B';
    else if (intensity === 3) borderLeftColor = '4px solid #3B82F6';
    else if (intensity === 4) borderLeftColor = '4px solid #C8F135';
    else if (intensity === 5) borderLeftColor = '4px solid #F97316';
  }

  return (
    <div className="card" style={{ overflow: 'hidden', borderLeft: borderLeftColor }}>
      {/* Header — clickable to expand */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', padding: 0 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 2 }}>
              {formatDate(startedAt)} · {formatTime(startedAt)}
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
              {name} {isBuddySession && <span style={{ fontSize: 14 }} title="Buddy Session">👥</span>}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {calories && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 9999,
                background: 'rgba(249,115,22,0.1)', color: '#F97316', display: 'flex', alignItems: 'center', gap: 2
              }}>
                🔥 {Math.round(calories)} cal
              </span>
            )}
            <svg
              width={18} height={18} viewBox="0 0 24 24" fill="var(--text-secondary)"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
            background: 'rgba(200,241,53,0.15)', color: 'var(--text-primary)',
          }}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
            background: 'rgba(56,189,248,0.1)', color: 'var(--text-primary)',
          }}>
            {completedSets}/{totalSets} sets
          </span>
          {durationMinutes && durationMinutes > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
              background: 'rgba(168,85,247,0.1)', color: 'var(--text-primary)',
            }}>
              {durationMinutes} min
            </span>
          )}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div style={{
          marginTop: 14, paddingTop: 14,
          borderTop: '1px solid var(--border-light)',
        }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ marginBottom: i < exercises.length - 1 ? 14 : 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                {ex.exerciseName}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Set header */}
                <div style={{ display: 'flex', gap: 0, fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <span style={{ width: 36 }}>Set</span>
                  <span style={{ flex: 1 }}>Weight</span>
                  <span style={{ flex: 1 }}>Reps</span>
                  <span style={{ width: 24 }}></span>
                </div>
                {ex.sets.map((set, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    fontSize: 13, fontWeight: 500,
                    padding: '4px 0',
                    opacity: set.completed ? 1 : 0.5,
                  }}>
                    <span style={{ width: 36, color: 'var(--text-secondary)', fontSize: 12 }}>{j + 1}</span>
                    <span style={{ flex: 1 }}>{set.weight > 0 ? `${set.weight} ${weightUnit}` : '-'}</span>
                    <span style={{ flex: 1 }}>{set.reps}</span>
                    <span style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                      {set.completed ? (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="#7a9a0a">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      ) : (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="#d1d5db">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Workout Notes */}
          {notes && (
            <div style={{
              marginTop: 14, padding: '12px 16px', borderRadius: 16,
              background: 'var(--input-bg)', border: '1px solid var(--border-light)',
              textAlign: 'left',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4, letterSpacing: 0.5 }}>
                Session Notes
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                &ldquo;{notes}&rdquo;
              </p>
            </div>
          )}

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              style={{
                marginTop: 14, width: '100%', padding: '10px',
                border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12,
                background: 'rgba(239,68,68,0.06)', color: '#ef4444',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Delete Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
