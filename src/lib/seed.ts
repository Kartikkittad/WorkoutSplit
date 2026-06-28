import type { Workout, WorkoutExercise, WorkoutSet, Split } from '@/lib/types';

// ── Storage keys (must match storage.ts) ────────────────────────────────────
const WORKOUTS_KEY = 'workoutsplit_workouts';
const SPLITS_KEY = 'workoutsplit_splits';
const ACTIVE_SPLIT_KEY = 'workoutsplit_active_split';

// ── Exercise catalogue (id → display name + weight range) ───────────────────
interface ExerciseSpec {
  name: string;
  minWeight: number;
  maxWeight: number;
  minReps: number;
  maxReps: number;
}

const EXERCISE_SPECS: Record<string, ExerciseSpec> = {
  'bench-press':       { name: 'Bench Press',       minWeight: 60,  maxWeight: 80,  minReps: 6,  maxReps: 10 },
  'overhead-press':    { name: 'Overhead Press',     minWeight: 30,  maxWeight: 50,  minReps: 6,  maxReps: 10 },
  'incline-db-press':  { name: 'Incline DB Press',   minWeight: 18,  maxWeight: 30,  minReps: 8,  maxReps: 12 },
  'chest-fly':         { name: 'Chest Fly',          minWeight: 10,  maxWeight: 18,  minReps: 10, maxReps: 15 },
  'tricep-pushdown':   { name: 'Tricep Pushdown',    minWeight: 15,  maxWeight: 30,  minReps: 10, maxReps: 15 },
  'lateral-raise':     { name: 'Lateral Raise',      minWeight: 8,   maxWeight: 15,  minReps: 12, maxReps: 15 },
  'deadlift':          { name: 'Deadlift',           minWeight: 100, maxWeight: 140, minReps: 3,  maxReps: 6  },
  'barbell-row':       { name: 'Barbell Row',        minWeight: 50,  maxWeight: 70,  minReps: 6,  maxReps: 10 },
  'pull-up':           { name: 'Pull Up',            minWeight: 0,   maxWeight: 20,  minReps: 5,  maxReps: 10 },
  'lat-pulldown':      { name: 'Lat Pulldown',       minWeight: 40,  maxWeight: 65,  minReps: 8,  maxReps: 12 },
  'bicep-curl':        { name: 'Bicep Curl',         minWeight: 10,  maxWeight: 20,  minReps: 8,  maxReps: 12 },
  'face-pull':         { name: 'Face Pull',          minWeight: 15,  maxWeight: 25,  minReps: 12, maxReps: 15 },
  'squat':             { name: 'Squat',              minWeight: 80,  maxWeight: 120, minReps: 5,  maxReps: 8  },
  'leg-press':         { name: 'Leg Press',          minWeight: 120, maxWeight: 200, minReps: 8,  maxReps: 12 },
  'romanian-deadlift': { name: 'Romanian Deadlift',  minWeight: 60,  maxWeight: 100, minReps: 8,  maxReps: 12 },
  'leg-curl':          { name: 'Leg Curl',           minWeight: 30,  maxWeight: 50,  minReps: 10, maxReps: 15 },
  'calf-raise':        { name: 'Calf Raise',         minWeight: 40,  maxWeight: 80,  minReps: 12, maxReps: 20 },
};

// ── Workout templates ───────────────────────────────────────────────────────
interface WorkoutTemplate {
  name: string;
  exerciseIds: string[];
}

const PUSH_DAY: WorkoutTemplate = {
  name: 'Push Day',
  exerciseIds: ['bench-press', 'overhead-press', 'incline-db-press', 'tricep-pushdown', 'lateral-raise'],
};

const PULL_DAY: WorkoutTemplate = {
  name: 'Pull Day',
  exerciseIds: ['deadlift', 'barbell-row', 'pull-up', 'lat-pulldown', 'bicep-curl'],
};

const LEG_DAY: WorkoutTemplate = {
  name: 'Leg Day',
  exerciseIds: ['squat', 'leg-press', 'romanian-deadlift', 'leg-curl', 'calf-raise'],
};

const UPPER_BODY: WorkoutTemplate = {
  name: 'Upper Body',
  exerciseIds: ['bench-press', 'barbell-row', 'overhead-press', 'pull-up', 'lateral-raise'],
};

const FULL_BODY: WorkoutTemplate = {
  name: 'Full Body',
  exerciseIds: ['squat', 'bench-press', 'barbell-row', 'overhead-press'],
};

// Rotation used to schedule workouts across the month
const ROTATION: WorkoutTemplate[] = [
  PUSH_DAY, PULL_DAY, LEG_DAY,
  PUSH_DAY, PULL_DAY, LEG_DAY,
  UPPER_BODY, PUSH_DAY, PULL_DAY,
  LEG_DAY, FULL_BODY, PUSH_DAY,
  PULL_DAY, LEG_DAY,
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Deterministic-ish seeded random based on a simple hash so the data is
 *  consistent within a single seed run but still looks organic. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

// ── Core generator ──────────────────────────────────────────────────────────

function generateWorkouts(): Workout[] {
  const rand = seededRandom(42);
  const now = new Date();
  const workouts: Workout[] = [];

  // Spread 14 workouts over the past 30 days (~3-4 per week)
  // Build a pool of candidate training days, then pick from them
  const trainingDays: Date[] = [];
  for (let daysAgo = 29; daysAgo >= 1; daysAgo--) {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    // Skip roughly 3 days per week (rest days — typically some weekend days + one mid-week)
    const dow = d.getDay(); // 0=Sun … 6=Sat
    const isRestDay =
      dow === 0 || // Sunday — rest
      (dow === 3 && rand() > 0.4) || // Wednesday — sometimes rest
      (dow === 6 && rand() > 0.5); // Saturday — sometimes rest
    if (!isRestDay) trainingDays.push(d);
  }

  // Take at most 14 days from our pool
  const selectedDays = trainingDays.slice(0, 14);

  selectedDays.forEach((day, index) => {
    const template = ROTATION[index % ROTATION.length];
    // progression factor: 0 → 1 across the month (earlier workouts = lighter)
    const progression = index / (selectedDays.length - 1);

    // Pick workout time — morning (6-9 AM) or evening (5-8 PM)
    const isMorning = rand() > 0.45;
    const startHour = isMorning ? randInt(rand, 6, 9) : randInt(rand, 17, 20);
    const startMin = randInt(rand, 0, 55);
    const startDate = new Date(day);
    startDate.setHours(startHour, startMin, randInt(rand, 0, 59), 0);

    const durationMin = randInt(rand, 45, 75);
    const endDate = new Date(startDate.getTime() + durationMin * 60000);

    // Sometimes pick 4 exercises instead of all 5
    const exerciseCount = rand() > 0.3 ? template.exerciseIds.length : Math.max(3, template.exerciseIds.length - 1);
    const exerciseIds = template.exerciseIds.slice(0, exerciseCount);

    const exercises: WorkoutExercise[] = exerciseIds.map((exId) => {
      const spec = EXERCISE_SPECS[exId];
      if (!spec) return null;

      const numSets = randInt(rand, 3, 4);
      // Base weight increases with progression (progressive overload)
      const weightRange = spec.maxWeight - spec.minWeight;
      const baseWeight = spec.minWeight + weightRange * (0.3 + progression * 0.6);

      const sets: WorkoutSet[] = [];
      for (let s = 1; s <= numSets; s++) {
        // Slight weight variation per set (± 2.5-5 kg)
        const setWeight = roundTo(baseWeight + (rand() - 0.5) * 5, 2.5);
        const clampedWeight = Math.max(spec.minWeight, Math.min(spec.maxWeight, setWeight));

        // Reps — heavier sets tend toward lower reps
        const repTarget = randInt(rand, spec.minReps, spec.maxReps);
        // Last set sometimes gets fewer reps (fatigue)
        const reps = s === numSets && rand() > 0.6 ? Math.max(spec.minReps, repTarget - randInt(rand, 1, 2)) : repTarget;

        // Most sets completed; occasionally the last set or a random set is not
        let completed = true;
        if (s === numSets && rand() > 0.75) completed = false;
        if (s > 1 && rand() > 0.92) completed = false;

        sets.push({
          setNumber: s,
          weight: clampedWeight,
          reps,
          completed,
        });
      }

      return {
        exerciseId: exId,
        exerciseName: spec.name,
        sets,
      } satisfies WorkoutExercise;
    }).filter(Boolean) as WorkoutExercise[];

    workouts.push({
      id: uid(),
      name: template.name,
      startedAt: startDate.toISOString(),
      completedAt: endDate.toISOString(),
      durationMinutes: durationMin,
      exercises,
    });
  });

  return workouts;
}

function generateSplit(): { split: Split; id: string } {
  const id = uid();
  const split: Split = {
    id,
    name: 'Push Pull Legs',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
    days: [
      {
        name: 'Push',
        exerciseIds: ['bench-press', 'overhead-press', 'chest-fly', 'tricep-pushdown', 'lateral-raise'],
      },
      {
        name: 'Pull',
        exerciseIds: ['deadlift', 'barbell-row', 'pull-up', 'lat-pulldown', 'bicep-curl'],
      },
      {
        name: 'Legs',
        exerciseIds: ['squat', 'leg-press', 'romanian-deadlift', 'leg-curl', 'calf-raise'],
      },
    ],
  };

  return { split, id };
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Injects realistic sample workout and split data into localStorage.
 * Skips seeding if there are already 3 or more workouts stored.
 */
export function seedSampleData(): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(WORKOUTS_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as unknown[];
      if (Array.isArray(parsed) && parsed.length >= 3) return; // already has data
    }
  } catch {
    // corrupted data — overwrite it
  }

  // Seed workouts
  const workouts = generateWorkouts();
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));

  // Seed split (only if none exist)
  try {
    const existingSplits = localStorage.getItem(SPLITS_KEY);
    if (existingSplits) {
      const parsed = JSON.parse(existingSplits) as unknown[];
      if (Array.isArray(parsed) && parsed.length > 0) return;
    }
  } catch {
    // overwrite
  }

  const { split, id } = generateSplit();
  localStorage.setItem(SPLITS_KEY, JSON.stringify([split]));
  localStorage.setItem(ACTIVE_SPLIT_KEY, id);
}
