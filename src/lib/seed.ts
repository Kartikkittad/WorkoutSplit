import { db } from './dexie';
import { EXERCISES } from './exercises';

export async function seedSampleData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // 1. Seed the exercise library if it is empty
    const count = await db.exercises_library.count();
    if (count === 0) {
      const exerciseSeeds = EXERCISES.map(ex => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        emoji: ex.emoji,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps,
        color: ex.color
      }));
      await db.exercises_library.bulkPut(exerciseSeeds);
    }

    // 2. Set default settings if they don't exist
    // @ts-ignore
    let setting = await db.settings.get("rest_timer");
    if (!setting) {
      setting = await db.settings.where('key').equals('rest_timer').first();
    }
    
    if (!setting) {
      await db.settings.put({ key: 'rest_timer', value: 60 });
    }

    // Also populate settings for settings context standard keys
    const restTimerDuration = await db.settings.where('key').equals('restTimerDuration').first();
    if (!restTimerDuration) {
      await db.settings.put({ key: 'restTimerDuration', value: 60 });
    }

    const weightUnit = await db.settings.where('key').equals('weightUnit').first();
    if (!weightUnit) {
      await db.settings.put({ key: 'weightUnit', value: 'kg' });
    }

    const onboardingComplete = await db.settings.where('key').equals('onboarding_complete').first();
    if (!onboardingComplete) {
      await db.settings.put({ key: 'onboarding_complete', value: false });
    }
  } catch (e) {
    console.error('Database initialization failed:', e);
  }
}
