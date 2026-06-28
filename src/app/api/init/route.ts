import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { isMemoryMode } from '@/lib/memory-store';

// ─── POST /api/init ──────────────────────────────────────────────────
// Initializes the database schema. Safe to call multiple times
// (uses IF NOT EXISTS). In memory mode, returns immediately.
export async function POST() {
  try {
    // ── In-memory fallback ──
    if (isMemoryMode()) {
      return NextResponse.json({
        success: true,
        mode: 'memory' as const,
        message: 'Running in memory mode — no database configured.',
      });
    }

    // ── Neon path ──
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS workouts (
        id            SERIAL PRIMARY KEY,
        name          TEXT NOT NULL,
        started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at  TIMESTAMPTZ,
        duration_minutes INTEGER,
        notes         TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id            SERIAL PRIMARY KEY,
        workout_id    INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
        exercise_id   TEXT NOT NULL,
        exercise_name TEXT NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS workout_sets (
        id                   SERIAL PRIMARY KEY,
        workout_exercise_id  INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
        set_number           INTEGER NOT NULL,
        weight               NUMERIC(8,2) NOT NULL DEFAULT 0,
        reps                 INTEGER NOT NULL DEFAULT 0,
        completed            BOOLEAN NOT NULL DEFAULT false
      )
    `;

    // Optional: index to speed up progress queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id
      ON workout_exercises(exercise_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id
      ON workout_exercises(workout_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id
      ON workout_sets(workout_exercise_id)
    `;

    return NextResponse.json({
      success: true,
      mode: 'neon' as const,
      message: 'Database schema initialized successfully.',
    });
  } catch (error) {
    console.error('POST /api/init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: String(error) },
      { status: 500 }
    );
  }
}
