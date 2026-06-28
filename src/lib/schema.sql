-- WorkoutSplit Database Schema

CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id SERIAL PRIMARY KEY,
  workout_exercise_id INTEGER REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(10,2),
  reps INTEGER,
  completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_workouts_started_at ON workouts(started_at DESC);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_sets_exercise_id ON workout_sets(workout_exercise_id);
