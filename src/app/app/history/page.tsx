'use client';

import { useState, useEffect } from 'react';
import WorkoutCard from '@/components/WorkoutCard';
import { Workout } from '@/lib/types';

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    import('@/lib/storage').then(({ getWorkouts }) => {
      setWorkouts(getWorkouts());
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
    <div style={{ paddingTop: 16 }}>
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
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <svg width={48} height={48} viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16z"/></svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>No workouts yet</p>
          <p className="text-secondary">Complete a workout to see it here</p>
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
                  deleteWorkout(String(workout.id));
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
