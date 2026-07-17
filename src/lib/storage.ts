import { Workout, Split, BodyWeightEntry, PersonalRecord, Template } from "@/lib/types";
import { db } from "./dexie";

// ── Types ───────────────────────────────────────────────────────────────────
interface Settings {
  name: string;
}

const DEFAULT_SETTINGS: Settings = { name: "Athlete" };

// ── Helpers ─────────────────────────────────────────────────────────────────

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** 
 * One-time migration from localStorage to Dexie.
 * We can call this during app initialization.
 */
export async function migrateFromLocalStorage() {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) return;
  
  const STORAGE_KEYS = {
    WORKOUTS: "workoutsplit_workouts",
    SPLITS: "workoutsplit_splits",
    ACTIVE_SPLIT: "workoutsplit_active_split",
    SETTINGS: "workoutsplit_settings",
    BODYWEIGHT: "workoutsplit_bodyweight",
    PRS: "workoutsplit_prs",
  };

  const migratedKey = "workoutsplit_migrated_to_dexie";
  if (localStorage.getItem(migratedKey)) return;

  try {
    const workouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || "[]");
    if (workouts.length) await db.workouts.bulkPut(workouts);

    const splits = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPLITS) || "[]");
    if (splits.length) await db.splits.bulkPut(splits);

    const activeSplit = localStorage.getItem(STORAGE_KEYS.ACTIVE_SPLIT);
    if (activeSplit) await db.settings.put({ key: 'active_split', value: activeSplit });

    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || "null");
    if (settings) {
      for (const [k, v] of Object.entries(settings)) {
        await db.settings.put({ key: k, value: v });
      }
    }

    const bodyweights = JSON.parse(localStorage.getItem(STORAGE_KEYS.BODYWEIGHT) || "[]");
    if (bodyweights.length) await db.bodyweights.bulkPut(bodyweights);

    const prs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRS) || "[]");
    if (prs.length) await db.prs.bulkPut(prs);

    localStorage.setItem(migratedKey, "true");
  } catch (e) {
    console.error("Migration failed:", e);
  }
}

// ── Workout Functions ───────────────────────────────────────────────────────

export async function getWorkouts(includeBuddy: boolean = false): Promise<Workout[]> {
  const workouts = await db.workouts.toArray();
  const filtered = includeBuddy ? workouts : workouts.filter(w => !w.buddy);
  return filtered.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

export async function saveWorkout(workout: Workout): Promise<Workout> {
  const saved: Workout = {
    ...workout,
    id: workout.id || generateId(),
  };
  await db.workouts.put(saved);
  return saved;
}

export async function getWorkoutById(id: string | number): Promise<Workout | null> {
  const workout = await db.workouts.get(id);
  return workout ?? null;
}

export async function deleteWorkout(id: string | number): Promise<void> {
  await db.workouts.delete(id);
}

// ── Split Functions ─────────────────────────────────────────────────────────

export async function getSplits(): Promise<Split[]> {
  return await db.splits.toArray();
}

export async function saveSplit(split: Split): Promise<Split> {
  const saved: Split = {
    ...split,
    id: split.id || generateId(),
    createdAt: split.createdAt || new Date().toISOString(),
  };
  await db.splits.put(saved);
  return saved;
}

export async function deleteSplit(id: string): Promise<void> {
  await db.splits.delete(id);
  const activeSplit = await getActiveSplitId();
  if (activeSplit === id) {
    await db.settings.where('key').equals('active_split').delete();
  }
}

export async function getActiveSplit(): Promise<Split | null> {
  const activeId = await getActiveSplitId();
  if (!activeId) return null;
  const split = await db.splits.get(activeId);
  return split ?? null;
}

export async function getActiveSplitId(): Promise<string | null> {
  const active = await db.settings.where('key').equals('active_split').first();
  return active ? active.value : null;
}

export async function setActiveSplit(id: string): Promise<void> {
  await db.settings.put({ key: 'active_split', value: id });
}

// ── Settings Functions ──────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const nameSetting = await db.settings.where('key').equals('name').first();
  return {
    name: nameSetting ? nameSetting.value : DEFAULT_SETTINGS.name,
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await db.settings.put({ key: 'name', value: settings.name });
}

// ── Body Weight Functions ───────────────────────────────────────────────────

export async function getBodyWeights(): Promise<BodyWeightEntry[]> {
  const entries = await db.bodyweights.toArray();
  return entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function saveBodyWeight(weight: number): Promise<void> {
  const date = new Date().toISOString();
  await db.bodyweights.put({ id: generateId(), weight, date });
}

// ── Personal Record Functions ───────────────────────────────────────────────

export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  return await db.prs.toArray();
}

export async function savePersonalRecord(pr: PersonalRecord): Promise<void> {
  const existing = await db.prs.where('exerciseId').equals(pr.exerciseId).first();
  if (existing) {
    await db.prs.put({ ...existing, ...pr });
  } else {
    await db.prs.put({ id: generateId(), ...pr });
  }
}

// ── Template Functions ───────────────────────────────────────────────────────

export async function getTemplates(): Promise<Template[]> {
  const templates = await db.templates.toArray();
  return templates.sort((a, b) => {
    const aTime = a.lastUsed ? new Date(a.lastUsed).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.lastUsed ? new Date(b.lastUsed).getTime() : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
}

export async function saveTemplate(template: Template): Promise<Template> {
  const saved: Template = {
    ...template,
    id: template.id || generateId(),
    createdAt: template.createdAt || new Date().toISOString(),
  };
  await db.templates.put(saved);
  return saved;
}

export async function deleteTemplate(id: string): Promise<void> {
  await db.templates.delete(id);
}

export async function updateTemplateLastUsed(id: string): Promise<void> {
  const template = await db.templates.get(id);
  if (template) {
    template.lastUsed = new Date().toISOString();
    await db.templates.put(template);
  }
}

