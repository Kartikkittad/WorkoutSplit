'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ProgressCircle from '@/components/ProgressCircle';
import ExerciseCard from '@/components/ExerciseCard';
import LineChart from '@/components/LineChart';
import { EXERCISES } from '@/lib/exercises';
import { Workout, BodyWeightEntry } from '@/lib/types';

/* ── SVG Icon Components (Filled) ── */
const BellIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1v.7A7 7 0 0 1 19 10.5v3.09l1.45 2.9A1 1 0 0 1 19.55 18H4.45a1 1 0 0 1-.9-1.51L5 13.59V10.5A7 7 0 0 1 11 3.7V3a1 1 0 0 1 1-1zM9.17 20a3 3 0 0 0 5.66 0H9.17z" />
  </svg>
);

const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z" />
  </svg>
);

const DumbbellIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
  </svg>
);

const ClockIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z" />
  </svg>
);

const TargetIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.5v-9l7 4.5-7 4.5z" />
  </svg>
);

const LayersIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L2 7l10 5 10-5L12 2z" />
    <path d="M2 17l10 5 10-5" opacity="0.7" />
    <path d="M2 12l10 5 10-5" opacity="0.85" />
  </svg>
);

/* ── Category Icon helper ── */
function getCategoryIcon(category: string) {
  switch (category) {
    case 'Push':
      return <DumbbellIcon size={20} color="#7a9a0a" />;
    case 'Pull':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#c74080">
          <path d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5S14.6 1.5 13.5 1.5 11.5 2.4 11.5 3.5s.9 2 2 2zM9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2 .61-3A7.06 7.06 0 0 0 19 13v-2a5.06 5.06 0 0 1-4.1-2l-1-1.6a2.06 2.06 0 0 0-1.7-1 1.76 1.76 0 0 0-.7.1L6 9v5h2V10.1l2.1-.8-1.7 8.1L4 16v2l5.89 1.38z" />
        </svg>
      );
    case 'Legs':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#0a8aaa">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.06 7.06 0 0 0 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 9v5h2v-3.8l1.4-.6L7 19h2.9z" />
        </svg>
      );
    case 'Core':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#9a50d0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    default:
      return <DumbbellIcon size={20} />;
  }
}


export default function HomePage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Athlete');
  const [activeSplit, setActiveSplit] = useState<{ name: string; days: { name: string; exerciseIds: string[] }[] } | null>(null);
  const [bodyWeights, setBodyWeights] = useState<BodyWeightEntry[]>([]);
  const [currentWeightInput, setCurrentWeightInput] = useState<string>('');

  useEffect(() => {
    import('@/lib/seed').then(({ seedSampleData }) => {
      seedSampleData();
      return import('@/lib/storage');
    }).then(({ getWorkouts, getActiveSplit, getSettings, getBodyWeights }) => {
      setWorkouts(getWorkouts());
      setActiveSplit(getActiveSplit());
      setUserName(getSettings().name);
      
      const weights = getBodyWeights();
      setBodyWeights(weights);
      
      // Pre-fill input if there's a weight logged today
      const today = new Date().toISOString().split('T')[0];
      const todaysWeight = weights.find(w => w.date === today);
      if (todaysWeight) {
        setCurrentWeightInput(todaysWeight.weight.toString());
      }
      
      setLoading(false);
    });
  }, []);

  const handleSaveBodyWeight = async () => {
    const weight = parseFloat(currentWeightInput);
    if (isNaN(weight) || weight <= 0) return;
    
    const { saveBodyWeight, getBodyWeights } = await import('@/lib/storage');
    saveBodyWeight(weight);
    setBodyWeights(getBodyWeights());
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const todaysWorkouts = workouts.filter(w => new Date(w.startedAt).toDateString() === today);
  const todaysExercises = todaysWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const totalSetsToday = todaysWorkouts.reduce((sum, w) => 
    sum + w.exercises.reduce((s, ex) => s + ex.sets.filter(set => set.completed).length, 0), 0);
  const completionPercent = todaysWorkouts.length > 0 ? Math.min(Math.round((totalSetsToday / Math.max(todaysWorkouts.reduce((s,w) => s + w.exercises.reduce((a,e) => a + e.sets.length, 0), 0), 1)) * 100), 100) : 0;

  // KPI calculations
  // Duration in minutes from completed workouts
  const totalDuration = todaysWorkouts.reduce((sum, w) => {
    if (w.completedAt) {
      return sum + Math.round((new Date(w.completedAt).getTime() - new Date(w.startedAt).getTime()) / 60000);
    }
    return sum;
  }, 0);

  // Calorie estimate using MET method:
  // Weight training MET ≈ 5.5, assuming ~75kg bodyweight
  // Formula: calories = MET × bodyweight(kg) × duration(hours)
  // Fallback: volume-based estimate when no duration available
  const caloriesBurned = totalDuration > 0
    ? Math.round(5.5 * 75 * (totalDuration / 60))
    : todaysWorkouts.reduce((sum, w) =>
        sum + w.exercises.reduce((s, ex) =>
          s + ex.sets.reduce((setSum, set) =>
            setSum + (set.completed ? Math.round(set.weight * set.reps * 0.05) : 0), 0), 0), 0);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Recent exercises from history for "Today's Exercises" section
  const recentExerciseIds = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.exerciseId)))].slice(0, 5);

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Page Header — Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/icon-192.png" alt="WorkoutSplit" width={40} height={40} style={{ borderRadius: 12 }} />
          <div>
            <p className="text-secondary" style={{ marginBottom: 2 }}>{greeting}</p>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{userName}</h1>
          </div>
        </div>
        <button 
          style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
          aria-label="Notifications"
        >
          <BellIcon size={20} />
        </button>
      </div>

      {/* Workout Progress Card — Lime accent */}
      <div 
        className="card" 
        style={{ background: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => router.push('/app/log')}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>Workout Progress!</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Today&apos;s Workout</h2>
          <p style={{ fontSize: 13, fontWeight: 500 }}>
            {todaysExercises > 0 ? `${todaysExercises} exercises completed` : 'No exercises yet — tap to start!'}
          </p>
        </div>
        <ProgressCircle 
          percentage={completionPercent} 
          size={72} 
          strokeWidth={7} 
          color="var(--text-primary)"
          bgColor="rgba(0,0,0,0.1)"
        >
          <span style={{ fontSize: 16, fontWeight: 800 }}>{completionPercent}%</span>
        </ProgressCircle>
      </div>

      {/* ── Body Weight Tracker ── */}
      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Body Weight</h2>
          <span className="text-secondary" style={{ fontSize: 13, fontWeight: 600 }}>Trend (Last 7d)</span>
        </div>
        
        {bodyWeights.length > 1 ? (
          <div style={{ marginBottom: 16 }}>
            <LineChart 
              data={bodyWeights.map(w => ({ label: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: w.weight }))} 
              color="#38bdf8" 
              height={80} 
              hideAxes={true} 
            />
          </div>
        ) : (
          <p className="text-secondary" style={{ fontSize: 13, marginBottom: 16 }}>Log more weights to see your trend!</p>
        )}
        
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            step="0.1"
            value={currentWeightInput}
            onChange={(e) => setCurrentWeightInput(e.target.value)}
            placeholder="Weight (kg)"
            style={{
              flex: 1,
              background: 'var(--input-bg)',
              border: 'none',
              borderRadius: 12,
              padding: '0 16px',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSaveBodyWeight}
            disabled={!currentWeightInput || isNaN(parseFloat(currentWeightInput))}
            style={{
              background: 'var(--primary)',
              color: '#0F172A',
              border: 'none',
              borderRadius: 12,
              padding: '0 20px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              opacity: (!currentWeightInput || isNaN(parseFloat(currentWeightInput))) ? 0.5 : 1,
            }}
          >
            Log Weight
          </button>
        </div>
      </div>

      {/* ── Create Split CTA (if no active split) ── */}
      {!loading && !activeSplit && (
        <div
          className="card"
          onClick={() => router.push('/app/create')}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white', marginBottom: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 16,
          }}
          role="button"
          tabIndex={0}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'rgba(200,241,53,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="#C8F135">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Create Your First Split</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>Set up your workout routine to get started</p>
          </div>
        </div>
      )}

      {/* ── KPI Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,140,50,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FlameIcon size={20} color="#ff8c32" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{caloriesBurned}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Calories</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(200,241,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LayersIcon size={20} color="#7a9a0a" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{totalSetsToday}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Sets</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClockIcon size={20} color="#38bdf8" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{totalDuration > 0 ? `${totalDuration}m` : '-'}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Duration</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TargetIcon size={20} color="#a855f7" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{todaysExercises}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Exercises</p>
          </div>
        </div>
      </div>

      {/* Today's Exercises Section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="section-heading">
            Today&apos;s Exercises{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>({todaysExercises})</span>
          </h2>
          <button 
            className="text-secondary" 
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => router.push('/app/history')}
          >
            See all
          </button>
        </div>
        
        {todaysWorkouts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <DumbbellIcon size={36} color="var(--text-secondary)" />
            </div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No workouts today yet</p>
            <p className="text-secondary" style={{ marginBottom: 16 }}>Start your first workout to track progress</p>
            <button className="btn-primary" onClick={() => router.push('/app/log')}>Start Workout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todaysWorkouts.map((workout, i) => (
              <div key={i} className="card card-hover" onClick={() => router.push('/app/history')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{workout.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 9999, background: 'rgba(200,241,53,0.2)' }}>
                    {workout.exercises.length} exercises
                  </span>
                </div>
                {workout.exercises.slice(0, 3).map((ex, j) => {
                  const exerciseDef = EXERCISES.find(e => e.id === ex.exerciseId);
                  return (
                    <div
                      key={j}
                      onClick={(e) => { e.stopPropagation(); router.push(`/app/progress?exercise=${ex.exerciseId}`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: j < Math.min(workout.exercises.length, 3) - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: exerciseDef ? `${exerciseDef.color}20` : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getCategoryIcon(exerciseDef?.category || 'Push')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{ex.exerciseName}</p>
                        <p className="text-secondary" style={{ fontSize: 12 }}>{ex.sets.filter(s => s.completed).length}/{ex.sets.length} sets</p>
                      </div>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="var(--text-secondary)">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Workout — Dark card */}
      <div 
        className="card card-hover" 
        style={{ background: 'var(--nav-bg)', color: 'white', marginBottom: 28, cursor: 'pointer', padding: 24 }}
        onClick={() => router.push('/app/log?preset=upper')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.7 }}>
              <ClockIcon size={13} color="rgba(255,255,255,0.7)" /> 90min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.7 }}>
              <FlameIcon size={13} color="rgba(255,255,255,0.7)" /> 1,200kcal
            </span>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upper Body Workout</h2>
        <p style={{ fontSize: 13, opacity: 0.6 }}>Bench Press, Overhead Press, Rows &amp; more</p>
      </div>

      {/* Popular Exercises — Horizontal scroll */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="section-heading">Popular Exercises</h2>
          <button 
            className="text-secondary" 
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => router.push('/app/log')}
          >
            See all
          </button>
        </div>
        <div className="scroll-row">
          {EXERCISES.slice(0, 6).map(ex => {
            // Count real workout data for this exercise
            const exerciseWorkouts = workouts.filter(w =>
              w.exercises.some(e => e.exerciseId === ex.id)
            );
            const totalMin = exerciseWorkouts.reduce((sum, w) => {
              if (w.durationMinutes) return sum + w.durationMinutes;
              return sum;
            }, 0);

            return (
              <ExerciseCard
                key={ex.id}
                icon={getCategoryIcon(ex.category)}
                name={ex.name}
                workoutCount={exerciseWorkouts.length}
                duration={totalMin}
                color={ex.color}
                onClick={() => router.push(`/app/log?add=${ex.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
