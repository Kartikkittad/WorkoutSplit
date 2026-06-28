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
  exerciseName: string;
  weight: number;
  reps: number;
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
