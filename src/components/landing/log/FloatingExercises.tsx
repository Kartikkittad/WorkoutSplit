'use client';

import MockExerciseRow, { type ExerciseRow } from './MockExerciseRow';

const POPPED: ExerciseRow[] = [
  { name: 'Barbell Bench Press', meta: 'Push · 4 sets × 8 reps', icon: '🏋️', added: true },
  { name: 'Incline Dumbbell Press', meta: 'Push · 4 sets × 10 reps', icon: '🏋️' },
];

/** Two exercise rows lifted out of the picker — they break past both bezels. */
export default function FloatingExercises() {
  return (
    <div className="log-float-exercises" style={{ position: 'absolute', zIndex: 30, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {POPPED.map((ex) => (
        <MockExerciseRow key={ex.name} ex={ex} elevated />
      ))}
    </div>
  );
}
