'use client';

import { useState, useEffect } from 'react';
import WorkoutCard from '@/components/WorkoutCard';
import { Workout } from '@/lib/types';

const ClipboardIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  </svg>
);

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    import('@/lib/storage').then(async ({ getWorkouts }) => {
      setWorkouts(await getWorkouts());
      setLoading(false);
    });
  }, []);

  // Filter workouts
  const now = new Date();
  const filteredWorkouts = workouts.filter(w => {
    if (filter === 'all') return true;
    const date = new Date(w.startedAt);
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return filter === 'week' ? diffDays <= 7 : diffDays <= 30;
  });

  // Stats
  const totalWorkouts = filteredWorkouts.length;
  const totalExercises = filteredWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const totalSets = filteredWorkouts.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets.length, 0),
    0
  );

  const filters: { label: string; value: 'week' | 'month' | 'all' }[] = [
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div style={{ padding: '24px 16px 96px' }}>
      {/* Header */}
      <h1 className="section-heading" style={{ fontSize: 24, marginBottom: 20 }}>
        Workout History
      </h1>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '10px 20px',
              borderRadius: 9999,
              border: filter === f.value ? 'none' : '1px solid var(--border-light)',
              background: filter === f.value ? 'var(--primary)' : 'white',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
          marginBottom: 24,
          padding: '20px 16px',
        }}
      >
        <div>
          <p style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{totalWorkouts}</p>
          <p className="text-secondary" style={{ fontSize: 12, marginTop: 4 }}>
            Workouts
          </p>
        </div>
        <div style={{ width: 1, background: 'var(--border-light)' }} />
        <div>
          <p style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{totalExercises}</p>
          <p className="text-secondary" style={{ fontSize: 12, marginTop: 4 }}>
            Exercises
          </p>
        </div>
        <div style={{ width: 1, background: 'var(--border-light)' }} />
        <div>
          <p style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{totalSets}</p>
          <p className="text-secondary" style={{ fontSize: 12, marginTop: 4 }}>
            Total Sets
          </p>
        </div>
      </div>

      {/* Workout List */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: 'var(--text-secondary)',
          }}
        >
          <p style={{ fontSize: 16 }}>Loading...</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', textAlign: 'center' }}>
          <div style={{ marginBottom: 16, filter: 'drop-shadow(0 8px 24px rgba(200, 241, 53, 0.4))' }}>
            <ClipboardIcon size={64} color="var(--lime)" />
          </div>
          <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text-primary)' }}>No workouts logged yet</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Finish your first workout to see it here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredWorkouts.map((workout, i) => (
            <WorkoutCard
              key={workout.id || i}
              workout={workout}
              onDelete={async () => {
                if (workout.id) {
                  const { deleteWorkout } = await import('@/lib/storage');
                  await deleteWorkout(String(workout.id));
                  setWorkouts(prev => prev.filter(w => w.id !== workout.id));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
