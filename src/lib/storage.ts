import { Workout, Split, BodyWeightEntry, PersonalRecord, Template } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function migrateFromLocalStorage() {
  // Legacy migration no-op for Supabase mode
}

// ── Workout Functions ───────────────────────────────────────────────────────

export async function getWorkouts(includeBuddy: boolean = false): Promise<Workout[]> {
  if (!env.isSupabaseConfigured) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: workoutsData, error } = await supabase
    .from('workouts')
    .select(`
      id,
      name,
      started_at,
      completed_at,
      duration_minutes,
      notes,
      intensity,
      calories,
      supersets,
      buddy,
      is_buddy_session,
      buddy_name,
      workout_exercises (
        id,
        exercise_id,
        exercise_name,
        sort_order,
        workout_sets (
          id,
          set_number,
          weight,
          reps,
          completed
        )
      )
    `)
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  if (error || !workoutsData) {
    console.error('Error fetching workouts from Supabase:', error);
    return [];
  }

  const workouts: Workout[] = workoutsData.map((w: any) => ({
    id: w.id,
    name: w.name,
    startedAt: w.started_at,
    completedAt: w.completed_at,
    durationMinutes: w.duration_minutes,
    notes: w.notes,
    intensity: w.intensity,
    calories: w.calories,
    supersets: w.supersets,
    buddy: w.buddy,
    isBuddySession: w.is_buddy_session,
    buddyName: w.buddy_name,
    exercises: (w.workout_exercises || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((ex: any) => ({
        id: ex.id,
        exerciseId: ex.exercise_id,
        exerciseName: ex.exercise_name,
        sets: (ex.workout_sets || [])
          .sort((a: any, b: any) => a.set_number - b.set_number)
          .map((s: any) => ({
            id: s.id,
            setNumber: s.set_number,
            weight: Number(s.weight),
            reps: s.reps,
            completed: s.completed,
          })),
      })),
  }));

  return includeBuddy ? workouts : workouts.filter((w) => !w.buddy);
}

export async function saveWorkout(workout: Workout): Promise<Workout> {
  if (!env.isSupabaseConfigured) return workout;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return workout;

  // Insert main workout
  const { data: workoutRow, error: workoutErr } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      name: workout.name,
      started_at: workout.startedAt,
      completed_at: workout.completedAt,
      duration_minutes: workout.durationMinutes,
      notes: workout.notes,
      intensity: workout.intensity,
      calories: workout.calories,
      supersets: workout.supersets,
      buddy: workout.buddy || false,
      is_buddy_session: workout.isBuddySession || false,
      buddy_name: workout.buddyName,
    })
    .select()
    .single();

  if (workoutErr || !workoutRow) {
    console.error('Error saving workout to Supabase:', workoutErr);
    throw workoutErr;
  }

  // Insert exercises & sets
  for (let idx = 0; idx < workout.exercises.length; idx++) {
    const ex = workout.exercises[idx];
    const { data: exRow, error: exErr } = await supabase
      .from('workout_exercises')
      .insert({
        workout_id: workoutRow.id,
        exercise_id: ex.exerciseId,
        exercise_name: ex.exerciseName,
        sort_order: idx,
      })
      .select()
      .single();

    if (!exErr && exRow) {
      const setsToInsert = ex.sets.map((s) => ({
        workout_exercise_id: exRow.id,
        set_number: s.setNumber,
        weight: s.weight,
        reps: s.reps,
        completed: s.completed,
      }));

      if (setsToInsert.length > 0) {
        await supabase.from('workout_sets').insert(setsToInsert);
      }
    }
  }

  return {
    ...workout,
    id: workoutRow.id,
  };
}

export async function getWorkoutById(id: string | number): Promise<Workout | null> {
  const workouts = await getWorkouts(true);
  return workouts.find((w) => String(w.id) === String(id)) ?? null;
}

export async function deleteWorkout(id: string | number): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('workouts').delete().eq('id', id).eq('user_id', user.id);
}

// ── Split Functions ─────────────────────────────────────────────────────────

export async function getSplits(): Promise<Split[]> {
  if (!env.isSupabaseConfigured) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('splits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((s: any) => ({
    id: s.id,
    name: s.name,
    days: s.days || [],
    createdAt: s.created_at,
  }));
}

export async function saveSplit(split: Split): Promise<Split> {
  if (!env.isSupabaseConfigured) return split;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return split;

  const { data, error } = await supabase
    .from('splits')
    .upsert({
      id: split.id || undefined,
      user_id: user.id,
      name: split.name,
      days: split.days,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error saving split:', error);
    return split;
  }

  return {
    id: data.id,
    name: data.name,
    days: data.days,
    createdAt: data.created_at,
  };
}

export async function deleteSplit(id: string): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('splits').delete().eq('id', id).eq('user_id', user.id);
}

export async function getActiveSplit(): Promise<Split | null> {
  const activeId = await getActiveSplitId();
  if (!activeId) return null;
  const splits = await getSplits();
  return splits.find((s) => s.id === activeId) ?? null;
}

export async function getActiveSplitId(): Promise<string | null> {
  if (!env.isSupabaseConfigured) return null;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('user_settings')
    .select('active_split_id')
    .eq('user_id', user.id)
    .single();

  return data?.active_split_id ?? null;
}

export async function setActiveSplit(id: string): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, active_split_id: id, updated_at: new Date().toISOString() });
}

// ── Settings Functions ──────────────────────────────────────────────────────

export async function getSettings(): Promise<{ name: string }> {
  if (!env.isSupabaseConfigured) return { name: 'Athlete' };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { name: 'Athlete' };

  const { data } = await supabase
    .from('user_settings')
    .select('user_name')
    .eq('user_id', user.id)
    .single();

  return { name: data?.user_name || 'Athlete' };
}

export async function saveSettings(settings: { name: string }): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, user_name: settings.name, updated_at: new Date().toISOString() });
}

// ── Body Weight Functions ───────────────────────────────────────────────────

export async function getBodyWeights(): Promise<BodyWeightEntry[]> {
  if (!env.isSupabaseConfigured) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bodyweights')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true });

  if (error || !data) return [];

  return data.map((b: any) => ({
    id: b.id,
    weight: Number(b.weight),
    date: b.date,
  }));
}

export async function saveBodyWeight(weight: number): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('bodyweights').insert({
    user_id: user.id,
    weight,
    date: new Date().toISOString(),
  });
}

// ── Personal Record Functions ───────────────────────────────────────────────

export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  if (!env.isSupabaseConfigured) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('personal_records')
    .select('*')
    .eq('user_id', user.id);

  if (error || !data) return [];

  return data.map((pr: any) => ({
    id: pr.id,
    exerciseId: pr.exercise_id,
    exerciseName: pr.exercise_name,
    weight: Number(pr.weight),
    reps: pr.reps,
    date: pr.date,
  }));
}

export async function savePersonalRecord(pr: PersonalRecord): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('personal_records').upsert({
    user_id: user.id,
    exercise_id: pr.exerciseId,
    exercise_name: pr.exerciseName,
    weight: pr.weight,
    reps: pr.reps,
    date: pr.date || new Date().toISOString(),
  });
}

// ── Template Functions ───────────────────────────────────────────────────────

export async function getTemplates(): Promise<Template[]> {
  if (!env.isSupabaseConfigured) return [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((t: any) => ({
    id: t.id,
    name: t.name,
    exercises: t.exercises || [],
    supersets: t.supersets,
    lastUsed: t.last_used,
    createdAt: t.created_at,
  }));
}

export async function saveTemplate(template: Template): Promise<Template> {
  if (!env.isSupabaseConfigured) return template;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return template;

  const { data, error } = await supabase
    .from('templates')
    .upsert({
      id: template.id || undefined,
      user_id: user.id,
      name: template.name,
      exercises: template.exercises,
      supersets: template.supersets,
      last_used: template.lastUsed,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error saving template:', error);
    return template;
  }

  return {
    id: data.id,
    name: data.name,
    exercises: data.exercises,
    supersets: data.supersets,
    lastUsed: data.last_used,
    createdAt: data.created_at,
  };
}

export async function deleteTemplate(id: string): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('templates').delete().eq('id', id).eq('user_id', user.id);
}

export async function updateTemplateLastUsed(id: string): Promise<void> {
  if (!env.isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('templates')
    .update({ last_used: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
}
