import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ProgressDataPoint, PersonalRecord } from '@/lib/types';
import { isMemoryMode, getWorkouts } from '@/lib/memory-store';

// ─── GET /api/progress?exerciseId=xxx ────────────────────────────────
// Returns per-workout-date progress data and personal records for a
// specific exercise.
export async function GET(request: NextRequest) {
  try {
    const exerciseId = request.nextUrl.searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exerciseId query parameter is required' },
        { status: 400 }
      );
    }

    // ── In-memory fallback ──
    if (isMemoryMode()) {
      return NextResponse.json(computeProgressFromMemory(exerciseId));
    }

    // ── Neon path ──
    const sql = getDb();

    // Fetch all sets for this exercise across all workouts, joined with
    // the workout's started_at for date grouping.
    const rows = await sql`
      SELECT
        w.started_at,
        we.exercise_name,
        ws.weight,
        ws.reps,
        ws.completed
      FROM workout_sets ws
      JOIN workout_exercises we ON we.id = ws.workout_exercise_id
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.exercise_id = ${exerciseId}
        AND ws.completed = true
      ORDER BY w.started_at ASC
    `;

    // Group by date (YYYY-MM-DD)
    const dateMap = new Map<
      string,
      { maxWeight: number; totalVolume: number; totalSets: number }
    >();

    // Track PRs: best weight per rep count
    const prMap = new Map<
      number,
      { weight: number; date: string; exerciseName: string }
    >();

    let exerciseName = '';

    for (const row of rows) {
      const date = (row.started_at as Date).toISOString().split('T')[0];
      const weight = Number(row.weight);
      const reps = row.reps as number;
      exerciseName = row.exercise_name as string;

      // Progress data
      const existing = dateMap.get(date) || {
        maxWeight: 0,
        totalVolume: 0,
        totalSets: 0,
      };
      existing.maxWeight = Math.max(existing.maxWeight, weight);
      existing.totalVolume += weight * reps;
      existing.totalSets += 1;
      dateMap.set(date, existing);

      // PR tracking
      const currentPr = prMap.get(reps);
      if (!currentPr || weight > currentPr.weight) {
        prMap.set(reps, { weight, date, exerciseName });
      }
    }

    const data: ProgressDataPoint[] = Array.from(dateMap.entries()).map(
      ([date, vals]) => ({
        date,
        maxWeight: vals.maxWeight,
        totalVolume: vals.totalVolume,
        totalSets: vals.totalSets,
      })
    );

    const prs: PersonalRecord[] = Array.from(prMap.entries()).map(
      ([reps, info]) => ({
        exerciseName: info.exerciseName,
        weight: info.weight,
        reps,
        date: info.date,
      })
    );

    // Sort PRs by weight descending
    prs.sort((a, b) => b.weight - a.weight);

    return NextResponse.json({ data, prs });
  } catch (error) {
    console.error('GET /api/progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

function computeProgressFromMemory(exerciseId: string) {
  const workouts = getWorkouts();

  const dateMap = new Map<
    string,
    { maxWeight: number; totalVolume: number; totalSets: number }
  >();

  const prMap = new Map<
    number,
    { weight: number; date: string; exerciseName: string }
  >();

  for (const workout of workouts) {
    const date = workout.startedAt.split('T')[0];

    for (const exercise of workout.exercises) {
      if (exercise.exerciseId !== exerciseId) continue;

      for (const set of exercise.sets) {
        if (!set.completed) continue;

        // Progress
        const existing = dateMap.get(date) || {
          maxWeight: 0,
          totalVolume: 0,
          totalSets: 0,
        };
        existing.maxWeight = Math.max(existing.maxWeight, set.weight);
        existing.totalVolume += set.weight * set.reps;
        existing.totalSets += 1;
        dateMap.set(date, existing);

        // PRs
        const currentPr = prMap.get(set.reps);
        if (!currentPr || set.weight > currentPr.weight) {
          prMap.set(set.reps, {
            weight: set.weight,
            date,
            exerciseName: exercise.exerciseName,
          });
        }
      }
    }
  }

  const data: ProgressDataPoint[] = Array.from(dateMap.entries()).map(
    ([date, vals]) => ({
      date,
      maxWeight: vals.maxWeight,
      totalVolume: vals.totalVolume,
      totalSets: vals.totalSets,
    })
  );

  const prs: PersonalRecord[] = Array.from(prMap.entries()).map(
    ([reps, info]) => ({
      exerciseName: info.exerciseName,
      weight: info.weight,
      reps,
      date: info.date,
    })
  );

  prs.sort((a, b) => b.weight - a.weight);

  return { data, prs };
}
