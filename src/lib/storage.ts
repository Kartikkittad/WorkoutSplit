import type { Workout, Split } from "@/lib/types";

// ── Storage Keys ────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  WORKOUTS: "workoutsplit_workouts",
  SPLITS: "workoutsplit_splits",
  ACTIVE_SPLIT: "workoutsplit_active_split",
  SETTINGS: "workoutsplit_settings",
} as const;

// ── Types ───────────────────────────────────────────────────────────────────
interface Settings {
  name: string;
}

const DEFAULT_SETTINGS: Settings = { name: "Athlete" };

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true when running in a browser (not during SSR). */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Generates a unique string id using a timestamp + random suffix. */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Type-safe wrapper around localStorage.getItem + JSON.parse. */
function readStore<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Type-safe wrapper around localStorage.setItem + JSON.stringify. */
function writeStore<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or other write error — fail silently.
  }
}

// ── Workout Functions ───────────────────────────────────────────────────────

/** Get all workouts sorted by startedAt descending (most recent first). */
export function getWorkouts(): Workout[] {
  const workouts = readStore<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  return workouts.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

/**
 * Save a workout to localStorage.
 * Auto-generates an id if one is not already set.
 * If a workout with the same id exists it will be updated; otherwise it is appended.
 */
export function saveWorkout(workout: Workout): Workout {
  const workouts = readStore<Workout[]>(STORAGE_KEYS.WORKOUTS, []);

  const saved: Workout = {
    ...workout,
    id: workout.id || generateId(),
  };

  const idx = workouts.findIndex((w) => w.id === saved.id);
  if (idx !== -1) {
    workouts[idx] = saved;
  } else {
    workouts.push(saved);
  }

  writeStore(STORAGE_KEYS.WORKOUTS, workouts);
  return saved;
}

/** Find a single workout by its id. Returns null when not found. */
export function getWorkoutById(id: string): Workout | null {
  const workouts = readStore<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  return workouts.find((w) => String(w.id) === id) ?? null;
}

/** Delete a workout by id. No-op if the id does not exist. */
export function deleteWorkout(id: string): void {
  const workouts = readStore<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
  writeStore(
    STORAGE_KEYS.WORKOUTS,
    workouts.filter((w) => String(w.id) !== id)
  );
}

// ── Split Functions ─────────────────────────────────────────────────────────

/** Get all saved splits. */
export function getSplits(): Split[] {
  return readStore<Split[]>(STORAGE_KEYS.SPLITS, []);
}

/**
 * Save a split to localStorage.
 * Auto-generates an id if one is not already set.
 * If a split with the same id exists it will be updated; otherwise it is appended.
 */
export function saveSplit(split: Split): Split {
  const splits = readStore<Split[]>(STORAGE_KEYS.SPLITS, []);

  const saved: Split = {
    ...split,
    id: split.id || generateId(),
    createdAt: split.createdAt || new Date().toISOString(),
  };

  const idx = splits.findIndex((s) => s.id === saved.id);
  if (idx !== -1) {
    splits[idx] = saved;
  } else {
    splits.push(saved);
  }

  writeStore(STORAGE_KEYS.SPLITS, splits);
  return saved;
}

/** Delete a split by id. Also clears the active split if it matches. */
export function deleteSplit(id: string): void {
  const splits = readStore<Split[]>(STORAGE_KEYS.SPLITS, []);
  writeStore(
    STORAGE_KEYS.SPLITS,
    splits.filter((s) => s.id !== id)
  );

  // Clear active split reference if it was the deleted one.
  if (isBrowser()) {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_SPLIT);
    if (activeId === id) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SPLIT);
    }
  }
}

/** Get the currently active split, or null if none is set. */
export function getActiveSplit(): Split | null {
  if (!isBrowser()) return null;
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_SPLIT);
  if (!activeId) return null;

  const splits = getSplits();
  return splits.find((s) => s.id === activeId) ?? null;
}

/** Mark a split as the active split by its id. */
export function setActiveSplit(id: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SPLIT, id);
}

// ── Settings Functions ──────────────────────────────────────────────────────

/** Get app settings. Returns defaults when nothing is stored. */
export function getSettings(): Settings {
  return readStore<Settings>(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
}

/** Persist app settings to localStorage. */
export function saveSettings(settings: Settings): void {
  writeStore(STORAGE_KEYS.SETTINGS, settings);
}
