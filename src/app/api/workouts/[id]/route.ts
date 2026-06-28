import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Workout, WorkoutExercise, WorkoutSet } from '@/lib/types';
import {
  isMemoryMode,
  getWorkoutById as memGetWorkoutById,
  deleteWorkout as memDeleteWorkout,
} from '@/lib/memory-store';

// ─── GET /api/workouts/[id] ─────────────────────────────────────────
// Returns a single workout with full exercises and sets.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid workout id' }, { status: 400 });
    }

    // ── In-memory fallback ──
    if (isMemoryMode()) {
      const workout = memGetWorkoutById(id);
      if (!workout) {
        return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
      }
      return NextResponse.json({ workout });
    }

    // ── Neon path ──
    const sql = getDb();

    const workoutRows = await sql`
      SELECT id, name, started_at, completed_at, duration_minutes, notes
      FROM workouts
      WHERE id = ${id}
    `;

    if (workoutRows.length === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const row = workoutRows[0];

    const exerciseRows = await sql`
      SELECT id, exercise_id, exercise_name
      FROM workout_exercises
      WHERE workout_id = ${row.id}
      ORDER BY id
    `;

    const exercises: WorkoutExercise[] = [];

    for (const exRow of exerciseRows) {
      const setRows = await sql`
        SELECT id, set_number, weight, reps, completed
        FROM workout_sets
        WHERE workout_exercise_id = ${exRow.id}
        ORDER BY set_number
      `;

      const sets: WorkoutSet[] = setRows.map((s) => ({
        id: s.id as number,
        setNumber: s.set_number as number,
        weight: Number(s.weight),
        reps: s.reps as number,
        completed: s.completed as boolean,
      }));

      exercises.push({
        id: exRow.id as number,
        exerciseId: exRow.exercise_id as string,
        exerciseName: exRow.exercise_name as string,
        sets,
      });
    }

    const workout: Workout = {
      id: row.id as number,
      name: row.name as string,
      startedAt: (row.started_at as Date).toISOString(),
      completedAt: row.completed_at
        ? (row.completed_at as Date).toISOString()
        : undefined,
      durationMinutes: row.duration_minutes as number | undefined,
      notes: (row.notes as string) || undefined,
      exercises,
    };

    return NextResponse.json({ workout });
  } catch (error) {
    console.error('GET /api/workouts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/workouts/[id] ───────────────────────────────────────
// Deletes a workout and all its exercises/sets (cascaded in DB).
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid workout id' }, { status: 400 });
    }

    // ── In-memory fallback ──
    if (isMemoryMode()) {
      const deleted = memDeleteWorkout(id);
      if (!deleted) {
        return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // ── Neon path ──
    const sql = getDb();

    // Delete sets first, then exercises, then the workout (respects FK order)
    const exerciseRows = await sql`
      SELECT id FROM workout_exercises WHERE workout_id = ${id}
    `;

    for (const exRow of exerciseRows) {
      await sql`DELETE FROM workout_sets WHERE workout_exercise_id = ${exRow.id}`;
    }

    await sql`DELETE FROM workout_exercises WHERE workout_id = ${id}`;

    const result = await sql`
      DELETE FROM workouts WHERE id = ${id} RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/workouts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
}
