export interface WorkoutSet {
  id?: number;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id?: number;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id?: string | number;
  name: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  notes?: string;
  exercises: WorkoutExercise[];
}

export interface ProgressDataPoint {
  date: string;
  maxWeight: number;
  totalVolume: number;
  totalSets: number;
}

export interface PersonalRecord {
  id?: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface BodyWeightEntry {
  id: string;
  weight: number;
  date: string;
}

export interface SplitDay {
  name: string;
  exerciseIds: string[];
}

export interface Split {
  id: string;
  name: string;
  days: SplitDay[];
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  lastUsed?: string;
  createdAt: string;
}

