/**
 * In-memory storage fallback for when DATABASE_URL is not configured.
 * This allows the app to function immediately without a database.
 * Data persists only for the lifetime of the server process.
 */

import { Workout } from './types';

let workouts: Workout[] = [];
let nextWorkoutId = 1;
let nextExerciseId = 1;
let nextSetId = 1;

export function isMemoryMode(): boolean {
  return !process.env.DATABASE_URL;
}

export function getWorkouts(): Workout[] {
  return [...workouts].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export function getWorkoutById(id: number): Workout | undefined {
  return workouts.find((w) => w.id === id);
}

export function addWorkout(workout: Workout): Workout {
  const saved: Workout = {
    ...workout,
    id: nextWorkoutId++,
    exercises: workout.exercises.map((ex) => ({
      ...ex,
      id: nextExerciseId++,
      sets: ex.sets.map((s) => ({
        ...s,
        id: nextSetId++,
      })),
    })),
  };
  workouts.push(saved);
  return saved;
}

export function deleteWorkout(id: number): boolean {
  const index = workouts.findIndex((w) => w.id === id);
  if (index === -1) return false;
  workouts.splice(index, 1);
  return true;
}

export function clearAll(): void {
  workouts = [];
  nextWorkoutId = 1;
  nextExerciseId = 1;
  nextSetId = 1;
}
