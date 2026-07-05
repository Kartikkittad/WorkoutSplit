'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES, getExercisesByCategory, type ExerciseDefinition } from '@/lib/exercises';
import type { WorkoutSet } from '@/lib/types';
import RestTimer from '@/components/RestTimer';
import { useSettings } from '@/components/SettingsContext';

/* ── SVG Icons ── */
const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z" />
  </svg>
);

const TargetIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.5v-9l7 4.5-7 4.5z" />
  </svg>
);

const CheckCircleIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ── SVG Category Icons ── */
function getCategoryIcon(category: string, size = 20) {
  switch (category) {
    case 'Push':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
        </svg>
      );
    case 'Pull':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5S14.6 1.5 13.5 1.5 11.5 2.4 11.5 3.5s.9 2 2 2zM9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2 .61-3A7.06 7.06 0 0 0 19 13v-2a5.06 5.06 0 0 1-4.1-2l-1-1.6a2.06 2.06 0 0 0-1.7-1 1.76 1.76 0 0 0-.7.1L6 9v5h2V10.1l2.1-.8-1.7 8.1L4 16v2l5.89 1.38z" />
        </svg>
      );
    case 'Legs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.06 7.06 0 0 0 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 9v5h2v-3.8l1.4-.6L7 19h2.9z" />
        </svg>
      );
    case 'Core':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'Cardio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
        </svg>
      );
  }
}

/* -------------------------------------------------- */
/*  Local types                                        */
/* -------------------------------------------------- */
interface AddedExercise {
  exerciseId: string;
  exerciseName: string;
  category: string;
  color: string;
  sets: WorkoutSet[];
}

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
function LogWorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { weightUnit } = useSettings();

  const [workoutName, setWorkoutName] = useState('My Workout');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedExercises, setAddedExercises] = useState<AddedExercise[]>([]);
  const [showTimer, setShowTimer] = useState(false);
  const [startTime] = useState<Date>(() => new Date());
  const [saving, setSaving] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, { maxWeight: number, lastWeight: number, lastReps: number, lastSets: number }>>({});
  const [celebration, setCelebration] = useState<{ show: boolean; text: string; subtext: string }>({ show: false, text: '', subtext: '' });
  const [workoutFinishedStats, setWorkoutFinishedStats] = useState<{sets: number, volume: number, duration: number} | null>(null);

  /* — auto-add exercises from URL params and load history -------------------- */
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const addId = searchParams.get('add');
    const preset = searchParams.get('preset');
    const { EXERCISES: allExercises } = require('@/lib/exercises');

    let exercisesToAdd: typeof allExercises = [];
    let name = 'My Workout';

    if (addId) {
      // Single exercise
      const found = allExercises.find((e: { id: string }) => e.id === addId);
      if (found) {
        exercisesToAdd = [found];
        name = found.name;
      }
    } else if (preset) {
      // Preset workout
      const presetMap: Record<string, { name: string; categories: string[] }> = {
        upper: { name: 'Upper Body Workout', categories: ['Push', 'Pull'] },
        lower: { name: 'Lower Body Workout', categories: ['Legs'] },
        push: { name: 'Push Day', categories: ['Push'] },
        pull: { name: 'Pull Day', categories: ['Pull'] },
        legs: { name: 'Leg Day', categories: ['Legs'] },
        full: { name: 'Full Body', categories: ['Push', 'Pull', 'Legs', 'Core'] },
      };
      const p = presetMap[preset.toLowerCase()];
      if (p) {
        name = p.name;
        exercisesToAdd = allExercises.filter((e: { category: string }) =>
          p.categories.includes(e.category)
        );
      }
    }

    if (exercisesToAdd.length > 0) {
      setWorkoutName(name);
      setShowExercisePicker(false);
      setAddedExercises(
        exercisesToAdd.map((def: { id: string; name: string; category: string; color: string; defaultSets: number; defaultReps: number }) => ({
          exerciseId: def.id,
          exerciseName: def.name,
          category: def.category,
          color: def.color,
          sets: Array.from({ length: def.defaultSets }, (_, i) => ({
            setNumber: i + 1,
            weight: 0,
            reps: def.defaultReps,
            completed: false,
          })),
        }))
      );
    }

    import('@/lib/storage').then(async ({ getWorkouts }) => {
      const workouts = await getWorkouts();
      const history: Record<string, { maxWeight: number, lastWeight: number, lastReps: number, lastSets: number }> = {};
      
      // Sort workouts by date ascending so we process oldest to newest
      const sortedWorkouts = workouts.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
      
      for (const w of sortedWorkouts) {
        for (const ex of w.exercises) {
          if (!history[ex.exerciseId]) {
            history[ex.exerciseId] = { maxWeight: 0, lastWeight: 0, lastReps: 0, lastSets: 0 };
          }
          
          let maxInSession = 0;
          let lastSetReps = 0;
          let completedSetsCount = 0;
          
          for (const set of ex.sets) {
            if (set.completed && set.weight > 0) {
              maxInSession = Math.max(maxInSession, set.weight);
              lastSetReps = set.reps;
              completedSetsCount++;
            }
          }
          
          if (completedSetsCount > 0) {
            history[ex.exerciseId].maxWeight = Math.max(history[ex.exerciseId].maxWeight, maxInSession);
            history[ex.exerciseId].lastWeight = maxInSession;
            history[ex.exerciseId].lastReps = lastSetReps;
            history[ex.exerciseId].lastSets = completedSetsCount;
          }
        }
      }
      setExerciseHistory(history);
    });

  }, [searchParams, initialized]);

  /* — derived ---------------------------------------------- */
  const filteredExercises = getExercisesByCategory(selectedCategory);
  const hasCompletedSet = addedExercises.some((ex) =>
    ex.sets.some((s) => s.completed),
  );

  /* — handlers --------------------------------------------- */
  const addExercise = useCallback(
    (def: ExerciseDefinition) => {
      // prevent duplicates
      if (addedExercises.some((e) => e.exerciseId === def.id)) return;

      const sets: WorkoutSet[] = Array.from({ length: def.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: def.defaultReps,
        completed: false,
      }));

      setAddedExercises((prev) => [
        ...prev,
        { exerciseId: def.id, exerciseName: def.name, category: def.category, color: def.color, sets },
      ]);
      setShowExercisePicker(false);
    },
    [addedExercises],
  );

  const removeExercise = useCallback((exerciseId: string) => {
    setAddedExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  }, []);

  const updateSet = useCallback(
    (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: number) => {
      setAddedExercises((prev) =>
        prev.map((ex) =>
          ex.exerciseId === exerciseId
            ? {
                ...ex,
                sets: ex.sets.map((s, i) =>
                  i === setIndex ? { ...s, [field]: value } : s,
                ),
              }
            : ex,
        ),
      );
    },
    [],
  );

  const toggleSetComplete = useCallback((exerciseId: string, setIndex: number) => {
    setAddedExercises((prev) => {
      const updated = prev.map((ex) =>
        ex.exerciseId === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, completed: !s.completed } : s,
              ),
            }
          : ex,
      );
      
      const exercise = prev.find(e => e.exerciseId === exerciseId);
      const setBeforeUpdate = exercise?.sets[setIndex];
      const wasCompleted = setBeforeUpdate?.completed;
      
      // Auto-show rest timer when completing a set (not unchecking)
      if (!wasCompleted) {
        setShowTimer(true);
        
        // PR Detection (only when marking complete)
        const setWeight = setBeforeUpdate?.weight || 0;
        const setReps = setBeforeUpdate?.reps || 0;
        const previousMax = exerciseHistory[exerciseId]?.maxWeight || 0;
        
        if (setWeight > 0 && setWeight > previousMax) {
          // New PR!
          const diff = setWeight - previousMax;
          setCelebration({
            show: true,
            text: `New PR! ${exercise?.exerciseName} — ${setWeight}${weightUnit}`,
            subtext: previousMax > 0 ? `That's +${diff}${weightUnit} from your previous best!` : `Your first PR for this exercise!`,
          });
          
          // Auto-hide celebration after 3s
          setTimeout(() => setCelebration(c => ({ ...c, show: false })), 3000);
          
          // Save PR asynchronously
          import('@/lib/storage').then(async ({ savePersonalRecord }) => {
            await savePersonalRecord({
              exerciseId: exerciseId,
              exerciseName: exercise?.exerciseName || '',
              weight: setWeight,
              reps: setReps,
              date: new Date().toISOString()
            });
          });
          
          // Update local history so we don't trigger again in the same session
          setExerciseHistory(prevHistory => ({
            ...prevHistory,
            [exerciseId]: {
              ...prevHistory[exerciseId],
              maxWeight: setWeight
            }
          }));
        }
      }
      return updated;
    });
  }, [exerciseHistory]);

  const addSet = useCallback((exerciseId: string) => {
    setAddedExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  setNumber: ex.sets.length + 1,
                  weight: 0,
                  reps: ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : 10,
                  completed: false,
                },
              ],
            }
          : ex,
      ),
    );
  }, []);

  const removeSet = useCallback((exerciseId: string, setIndex: number) => {
    setAddedExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId
          ? {
              ...ex,
              sets: ex.sets
                .filter((_, i) => i !== setIndex)
                .map((s, i) => ({ ...s, setNumber: i + 1 })),
            }
          : ex,
      ),
    );
  }, []);

  const finishWorkout = async () => {
    if (saving || !hasCompletedSet) return;
    setSaving(true);

    try {
      const { saveWorkout } = await import('@/lib/storage');
      
      let setsCount = 0;
      let totalVol = 0;
      addedExercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed) {
            setsCount++;
            totalVol += s.weight * s.reps;
          }
        });
      });
      const duration = Math.round((Date.now() - startTime.getTime()) / 60000);

      const workout = {
        name: workoutName,
        startedAt: startTime.toISOString(),
        completedAt: new Date().toISOString(),
        durationMinutes: duration,
        exercises: addedExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets,
        })),
      };
      await saveWorkout(workout);
      setWorkoutFinishedStats({ sets: setsCount, volume: totalVol, duration });
      setTimeout(() => {
        router.push('/app');
      }, 5000);
    } catch {
      setSaving(false);
    }
  };

  /* — render ----------------------------------------------- */
  return (
    <div className="app-container" style={{ padding: '16px 0 160px' }}>
      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => router.push('/app')}
          aria-label="Go back"
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: 'var(--card-bg)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Log Workout</h1>
      </div>

      {/* ─── Workout Name ─── */}
      <div style={{ marginBottom: 24 }}>
        <label className="text-secondary" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          Workout Name
        </label>
        <input
          className="input-field"
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="e.g. Push Day, Leg Day…"
        />
      </div>

      {/* ─── Added Exercises ─── */}
      {addedExercises.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 className="section-heading" style={{ marginBottom: 16 }}>
            Exercises ({addedExercises.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {addedExercises.map((ex) => (
              <div className="card" key={ex.exerciseId}>
                {/* Exercise header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ex.color }}>
                      {getCategoryIcon(ex.category, 24)}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{ex.exerciseName}</span>
                  </div>
                  <button
                    onClick={() => removeExercise(ex.exerciseId)}
                    aria-label={`Remove ${ex.exerciseName}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid var(--border-light)',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Progressive Overload Tracker */}
                <div style={{
                  background: 'rgba(200, 241, 53, 0.05)',
                  border: '1px solid rgba(200, 241, 53, 0.2)',
                  borderRadius: 12,
                  padding: '12px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {exerciseHistory[ex.exerciseId]?.lastSets > 0 ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Last Time</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {exerciseHistory[ex.exerciseId].lastSets} × {exerciseHistory[ex.exerciseId].lastReps} × {exerciseHistory[ex.exerciseId].lastWeight}{weightUnit}
                        </span>
                      </div>
                      
                      <div style={{ height: 1, background: 'rgba(200, 241, 53, 0.15)', borderRadius: 1 }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <TargetIcon size={14} color="var(--lime)" /> Target
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {exerciseHistory[ex.exerciseId].lastSets} × {exerciseHistory[ex.exerciseId].lastReps} × {exerciseHistory[ex.exerciseId].lastWeight + 2.5}{weightUnit}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '4px 0' }}>
                      <FlameIcon size={16} color="var(--lime)" />
                      <span style={{ fontSize: 13, color: 'var(--lime)', fontWeight: 600 }}>First time — set your baseline!</span>
                    </div>
                  )}
                </div>

                {/* Column headers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 0 4px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                  <div style={{ width: 32, flexShrink: 0 }}>
                    <span className="text-secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Set</span>
                  </div>
                  <div style={{ width: 70, textAlign: 'center' }}>
                    <span className="text-secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Weight</span>
                  </div>
                  <span style={{ fontSize: 13, flexShrink: 0, visibility: 'hidden' }}>{weightUnit}</span>
                  <div style={{ width: 70, textAlign: 'center' }}>
                    <span className="text-secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Reps</span>
                  </div>
                  <span style={{ fontSize: 13, flexShrink: 0, visibility: 'hidden' }}>reps</span>
                  <div style={{ width: 36, flexShrink: 0 }} />
                </div>

                {/* Set rows */}
                {ex.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}
                  >
                    {/* Set number pill */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: set.completed ? 'var(--primary)' : 'var(--input-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      {setIndex + 1}
                    </div>

                    {/* Weight input */}
                    <input
                      type="number"
                      placeholder="0"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(ex.exerciseId, setIndex, 'weight', Number(e.target.value))}
                      style={{
                        width: 70,
                        height: 40,
                        borderRadius: 12,
                        background: 'var(--input-bg)',
                        border: 'none',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: 15,
                        fontFamily: 'inherit',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                    <span className="text-secondary" style={{ fontSize: 13, flexShrink: 0 }}>{weightUnit}</span>

                    {/* Reps input */}
                    <input
                      type="number"
                      placeholder="0"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(ex.exerciseId, setIndex, 'reps', Number(e.target.value))}
                      style={{
                        width: 70,
                        height: 40,
                        borderRadius: 12,
                        background: 'var(--input-bg)',
                        border: 'none',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: 15,
                        fontFamily: 'inherit',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                    <span className="text-secondary" style={{ fontSize: 13, flexShrink: 0 }}>reps</span>

                    {/* Complete toggle */}
                    <button
                      onClick={() => toggleSetComplete(ex.exerciseId, setIndex)}
                      aria-label={set.completed ? 'Mark incomplete' : 'Mark complete'}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: set.completed ? 'none' : '2px solid var(--border-light)',
                        background: set.completed ? 'var(--primary)' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={set.completed ? 'var(--text-primary)' : '#cbd5e1'} strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Add / Remove set buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => addSet(ex.exerciseId)}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 9999,
                      border: '1px solid var(--border-light)',
                      background: 'white',
                      fontWeight: 600,
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    + Add Set
                  </button>
                  {ex.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(ex.exerciseId, ex.sets.length - 1)}
                      style={{
                        height: 40,
                        borderRadius: 9999,
                        border: '1px solid var(--border-light)',
                        background: 'white',
                        fontWeight: 600,
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        padding: '0 16px',
                      }}
                    >
                      − Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Exercise Picker ─── */}
      <div style={{ marginBottom: 24 }}>
        {/* Toggle or always-visible header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-heading">Add Exercise</h2>
          {addedExercises.length > 0 && (
            <button
              onClick={() => setShowExercisePicker(!showExercisePicker)}
              style={{
                height: 36,
                paddingInline: 16,
                borderRadius: 9999,
                border: '1px solid var(--border-light)',
                background: showExercisePicker ? 'var(--primary)' : 'white',
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {showExercisePicker ? 'Hide' : 'Show'}
            </button>
          )}
        </div>

        {showExercisePicker && (
          <>
            {/* Category tabs */}
            <div className="scroll-row" style={{ marginBottom: 16 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    height: 40,
                    padding: '0 20px',
                    borderRadius: 9999,
                    border: selectedCategory === cat ? 'none' : '1px solid var(--border-light)',
                    background: selectedCategory === cat ? 'var(--primary)' : 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontFamily: 'inherit',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredExercises.map((def) => {
                const isAdded = addedExercises.some((e) => e.exerciseId === def.id);
                return (
                  <button
                    key={def.id}
                    onClick={() => addExercise(def)}
                    disabled={isAdded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 16,
                      border: 'none',
                      background: isAdded ? 'rgba(200, 241, 53, 0.12)' : 'var(--card-bg)',
                      boxShadow: isAdded ? 'none' : 'var(--shadow-card)',
                      cursor: isAdded ? 'default' : 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      opacity: isAdded ? 0.6 : 1,
                      transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                      minHeight: 56,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: def.color + '22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: def.color,
                      }}
                    >
                      {getCategoryIcon(def.category, 22)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                        {def.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {def.category} · {def.defaultSets}×{def.defaultReps}
                      </div>
                    </div>
                    {isAdded ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-dark)" strokeWidth={2.5} strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ─── Rest Timer ─── */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => setShowTimer(!showTimer)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '16px 20px',
            borderRadius: 'var(--radius-card)',
            border: 'none',
            background: 'var(--card-bg)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            minHeight: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              Rest Timer
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              transform: showTimer ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showTimer && (
          <div className="card" style={{ marginTop: 12, paddingTop: 28, paddingBottom: 28 }}>
            <RestTimer defaultSeconds={60} autoStart={true} onComplete={() => setShowTimer(false)} />
          </div>
        )}
      </div>

      {/* ─── Finish Button (fixed) ─── */}
      <div
        style={{
          position: 'fixed',
          bottom: 110,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 390,
          padding: '0 16px',
          zIndex: 100,
        }}
      >
        <button
          className="btn-primary"
          onClick={finishWorkout}
          disabled={!hasCompletedSet || saving}
          style={{
            width: '100%',
            opacity: hasCompletedSet && !saving ? 1 : 0.45,
            cursor: hasCompletedSet && !saving ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 24px rgba(200, 241, 53, 0.35)',
          }}
        >
          {saving ? 'Saving…' : 'Finish Workout'}
        </button>
      </div>

      {/* ─── PR Celebration Overlay ─── */}
      {celebration.show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out forwards',
          }}
        >
          {/* Confetti simulation using box-shadows in a pseudo-element is tricky in inline styles, 
              so we'll just add a few animated dot elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                background: 'var(--primary)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-100px)`,
                animation: 'explode 1s ease-out forwards',
                opacity: 0,
              }}
            />
          ))}
          <style>{`
            @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
            @keyframes explode { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-${Math.random() * 150 + 100}px); opacity: 0; } }
            @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          `}</style>
          
          <div style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', width: '100%', maxWidth: 400 }}>
            <div style={{ 
              background: 'rgba(200, 241, 53, 0.2)', 
              color: 'var(--primary)', 
              padding: '8px 16px', 
              borderRadius: 9999, 
              display: 'inline-block',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 24
            }}>
              Achievement Unlocked
            </div>
            <h2 style={{ color: 'white', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>
              {celebration.text}
            </h2>
            <p style={{ color: 'var(--primary)', fontSize: 16, fontWeight: 600, marginBottom: 32 }}>
              {celebration.subtext}
            </p>
            <button
              onClick={() => setCelebration(c => ({ ...c, show: false }))}
              style={{
                background: 'var(--primary)',
                color: '#0F172A',
                border: 'none',
                padding: '16px 32px',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                minWidth: 200,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>Let's gooo</span>
                <FlameIcon size={18} color="#0F172A" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ─── Workout Completion Overlay ─── */}
      {workoutFinishedStats && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0F172A',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out forwards',
          }}
        >
          <div style={{ marginBottom: 24, animation: 'bounce 1s ease-out', filter: 'drop-shadow(0 0 32px rgba(200, 241, 53, 0.6))' }}>
            <CheckCircleIcon size={72} color="var(--lime)" />
          </div>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 32, lineHeight: 1.1 }}>Workout Complete!</h1>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '32px 24px', width: '100%', maxWidth: 320, marginBottom: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Volume</p>
                <p style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{workoutFinishedStats.volume.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Sets</p>
                <p style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{workoutFinishedStats.sets}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Duration</p>
                <p style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>{workoutFinishedStats.duration} min</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/app')}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '16px',
              borderRadius: 9999,
              border: 'none',
              background: 'var(--lime)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(200, 241, 53, 0.2)',
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default function LogWorkoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>}>
      <LogWorkoutContent />
    </Suspense>
  );
}
