'use client';

import { useState, useCallback, useEffect, Suspense, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EXERCISES, CATEGORIES, getExercisesByCategory, type ExerciseDefinition } from '@/lib/exercises';
import type { WorkoutSet, Template, Split, Workout, SplitDay } from '@/lib/types';
import RestTimer from '@/components/RestTimer';
import { useSettings } from '@/components/SettingsContext';

/* ── SVG Icons ── */
const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z" />
  </svg>
);

const TargetIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.5v-9l7 4.5-7 4.5z" />
  </svg>
);

const CheckCircleIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ClipboardFilledIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H10v-2h4v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const SaveFilledIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);

const LinkIcon = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

/* ── SVG Category Icons ── */
function getCategoryIcon(category: string, size = 20) {
  switch (category) {
    case 'Push':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
        </svg>
      );
    case 'Pull':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5S14.6 1.5 13.5 1.5 11.5 2.4 11.5 3.5s.9 2 2 2zM9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2 .61-3A7.06 7.06 0 0 0 19 13v-2a5.06 5.06 0 0 1-4.1-2l-1-1.6a2.06 2.06 0 0 0-1.7-1 1.76 1.76 0 0 0-.7.1L6 9v5h2V10.1l2.1-.8-1.7 8.1L4 16v2l5.89 1.38z" />
        </svg>
      );
    case 'Legs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.06 7.06 0 0 0 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 9v5h2v-3.8l1.4-.6L7 19h2.9z" />
        </svg>
      );
    case 'Core':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    case 'Cardio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
        </svg>
      );
  }
}

/* -------------------------------------------------- */
/*  Local types                                        */
/* -------------------------------------------------- */
interface AddedExercise {
  exerciseId: string;
  exerciseName: string;
  category: string;
  color: string;
  sets: WorkoutSet[];
  buddySets?: WorkoutSet[];
}

/* -------------------------------------------------- */
/*  Component                                          */
/* -------------------------------------------------- */
function LogWorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { weightUnit, buddyName, userGender } = useSettings();

  const [workoutName, setWorkoutName] = useState('My Workout');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedExercises, setAddedExercises] = useState<AddedExercise[]>([]);
  const [startTime] = useState<Date>(() => new Date());
  const [saving, setSaving] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, { maxWeight: number, lastWeight: number, lastReps: number, lastSets: number }>>({});
  const [celebration, setCelebration] = useState<{ show: boolean; text: string; subtext: string }>({ show: false, text: '', subtext: '' });
  const [workoutFinishedStats, setWorkoutFinishedStats] = useState<{sets: number, volume: number, duration: number} | null>(null);

  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [saveAsTemplateName, setSaveAsTemplateName] = useState('');
  const [showSaveTemplatePrompt, setShowSaveTemplatePrompt] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateSaved, setTemplateSaved] = useState(false);

  // New features states
  const [supersets, setSupersets] = useState<string[][]>([]);
  const [activeSplit, setActiveSplit] = useState<Split | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [finishedWorkout, setFinishedWorkout] = useState<Workout | null>(null);

  // Buddy Mode & Intensity Rating states
  const [buddyModeActive, setBuddyModeActive] = useState(false);
  const [intensityRating, setIntensityRating] = useState<number | null>(null);
  const [showIntensityRatingOverlay, setShowIntensityRatingOverlay] = useState(false);

  const buddyStats = useMemo(() => {
    if (!buddyModeActive) return null;
    let setsCount = 0;
    let totalVol = 0;
    addedExercises.forEach(ex => {
      (ex.buddySets || []).forEach(s => {
        if (s.completed) {
          setsCount++;
          totalVol += s.weight * s.reps;
        }
      });
    });
    return { sets: setsCount, volume: totalVol };
  }, [addedExercises, buddyModeActive]);

  // Superset selection on log screen
  const [showAddSupersetModal, setShowAddSupersetModal] = useState(false);
  const [selectedSupersetExercises, setSelectedSupersetExercises] = useState<string[]>([]);

  const addSupersetOnLog = useCallback((exId1: string, exId2: string) => {
    setSupersets(prev => {
      const cleaned = prev.filter(pair => !pair.includes(exId1) && !pair.includes(exId2));
      return [...cleaned, [exId1, exId2]];
    });
  }, []);

  const removeSupersetOnLog = useCallback((exerciseId: string) => {
    setSupersets(prev => prev.filter(pair => !pair.includes(exerciseId)));
  }, []);

  // Bottom Sheet state
  const [logSheet, setLogSheet] = useState<{
    exerciseId: string;
    setIndex: number;
    weight: number;
    reps: number;
    isBuddy?: boolean;
  } | null>(null);

  // Plate Calculator state
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [barbellWeight, setBarbellWeight] = useState(20);

  // Rest Timer state
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [restTotal, setRestTotal] = useState(60);
  const [restExpanded, setRestExpanded] = useState(false);

  // Long press set menu
  const [longPressedSet, setLongPressedSet] = useState<{ exerciseId: string; setIndex: number; x: number; y: number; isBuddy?: boolean } | null>(null);

  // Refs for pointer holds
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load active split
  useEffect(() => {
    import('@/lib/storage').then(async ({ getActiveSplit }) => {
      setActiveSplit(await getActiveSplit());
    });
  }, []);

  // When buddyModeActive toggles to true, initialize buddySets for any exercise that lacks them
  useEffect(() => {
    if (buddyModeActive) {
      setAddedExercises(prev =>
        prev.map(ex => {
          if (!ex.buddySets || ex.buddySets.length === 0) {
            return {
              ...ex,
              buddySets: ex.sets.map(s => ({
                setNumber: s.setNumber,
                weight: s.weight,
                reps: s.reps,
                completed: false
              }))
            };
          }
          return ex;
        })
      );
    }
  }, [buddyModeActive]);

  // Rest Timer Interval Countdown and Vibration
  useEffect(() => {
    if (!restActive || restSeconds <= 0) return;

    const interval = setInterval(() => {
      setRestSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRestActive(false);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([300, 100, 300, 100, 300]);
          }
          return 0;
        }

        if (prev === 11) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 100, 100]);
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restActive, restSeconds]);

  const loadTemplatesList = useCallback(async () => {
    const { getTemplates } = await import('@/lib/storage');
    setTemplates(await getTemplates());
  }, []);

  const handleDeleteTemplate = useCallback(async (id: string) => {
    const { deleteTemplate } = await import('@/lib/storage');
    await deleteTemplate(id);
    const { getTemplates } = await import('@/lib/storage');
    setTemplates(await getTemplates());
  }, []);

  const handleLoadTemplate = useCallback(async (template: Template) => {
    setWorkoutName(template.name);
    setAddedExercises(
      template.exercises.map((ex) => {
        const sets = ex.sets.map((s) => ({
          ...s,
          completed: false,
        }));
        return {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          category: EXERCISES.find(e => e.id === ex.exerciseId)?.category || 'Push',
          color: EXERCISES.find(e => e.id === ex.exerciseId)?.color || '#C8F135',
          sets,
          buddySets: sets.map(s => ({ ...s }))
        };
      })
    );
    setSupersets(template.supersets || []);
    setShowTemplates(false);
    setShowExercisePicker(false);
    const { updateTemplateLastUsed } = await import('@/lib/storage');
    await updateTemplateLastUsed(template.id);
  }, []);

  const handleLoadSplitDay = useCallback(async (day: SplitDay) => {
    setWorkoutName(day.name);
    setAddedExercises(
      day.exerciseIds.map((exId) => {
        const def = EXERCISES.find(e => e.id === exId);
        const sets = Array.from({ length: def?.defaultSets || 3 }, (_, i) => ({
          setNumber: i + 1,
          weight: 0,
          reps: def?.defaultReps || 10,
          completed: false,
        }));
        return {
          exerciseId: exId,
          exerciseName: def?.name || exId,
          category: def?.category || 'Push',
          color: def?.color || '#C8F135',
          sets,
          buddySets: sets.map(s => ({ ...s }))
        };
      })
    );
    setSupersets(day.supersets || []);
    setShowTemplates(false);
    setShowExercisePicker(false);
  }, []);

  const handleSaveAsTemplate = useCallback(async () => {
    if (!saveAsTemplateName.trim() || templateSaving) return;
    setTemplateSaving(true);
    try {
      const { saveTemplate, generateId } = await import('@/lib/storage');
      const template = {
        id: generateId(),
        name: saveAsTemplateName.trim(),
        exercises: addedExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map((s) => ({
            setNumber: s.setNumber,
            weight: s.weight,
            reps: s.reps,
            completed: false,
          })),
        })),
        supersets: supersets,
        createdAt: new Date().toISOString(),
      };
      await saveTemplate(template);
      setTemplateSaved(true);
      setShowSaveTemplatePrompt(false);
    } catch (e) {
      console.error(e);
    } finally {
      setTemplateSaving(false);
    }
  }, [saveAsTemplateName, addedExercises, templateSaving, supersets]);

  /* — auto-add exercises from URL params and load history -------------------- */
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const addId = searchParams.get('add');
    const preset = searchParams.get('preset');
    const { EXERCISES: allExercises } = require('@/lib/exercises');

    let exercisesToAdd: typeof allExercises = [];
    let name = 'My Workout';

    if (addId) {
      // Single exercise
      const found = allExercises.find((e: { id: string }) => e.id === addId);
      if (found) {
        exercisesToAdd = [found];
        name = found.name;
      }
    } else if (preset) {
      // Preset workout
      const presetMap: Record<string, { name: string; categories: string[] }> = {
        upper: { name: 'Upper Body Workout', categories: ['Push', 'Pull'] },
        lower: { name: 'Lower Body Workout', categories: ['Legs'] },
        push: { name: 'Push Day', categories: ['Push'] },
        pull: { name: 'Pull Day', categories: ['Pull'] },
        legs: { name: 'Leg Day', categories: ['Legs'] },
        full: { name: 'Full Body', categories: ['Push', 'Pull', 'Legs', 'Core'] },
      };
      const p = presetMap[preset.toLowerCase()];
      if (p) {
        name = p.name;
        exercisesToAdd = allExercises.filter((e: { category: string }) =>
          p.categories.includes(e.category)
        );
      }
    }

    if (exercisesToAdd.length > 0) {
      setWorkoutName(name);
      setShowExercisePicker(false);
      setAddedExercises(
        exercisesToAdd.map((def: { id: string; name: string; category: string; color: string; defaultSets: number; defaultReps: number }) => ({
          exerciseId: def.id,
          exerciseName: def.name,
          category: def.category,
          color: def.color,
          sets: Array.from({ length: def.defaultSets }, (_, i) => ({
            setNumber: i + 1,
            weight: 0,
            reps: def.defaultReps,
            completed: false,
          })),
        }))
      );
    }

    import('@/lib/storage').then(async ({ getWorkouts }) => {
      const workouts = await getWorkouts();
      const history: Record<string, { maxWeight: number, lastWeight: number, lastReps: number, lastSets: number }> = {};
      
      // Sort workouts by date ascending so we process oldest to newest
      const sortedWorkouts = workouts.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
      
      for (const w of sortedWorkouts) {
        for (const ex of w.exercises) {
          if (!history[ex.exerciseId]) {
            history[ex.exerciseId] = { maxWeight: 0, lastWeight: 0, lastReps: 0, lastSets: 0 };
          }
          
          let maxInSession = 0;
          let lastSetReps = 0;
          let completedSetsCount = 0;
          
          for (const set of ex.sets) {
            if (set.completed && set.weight > 0) {
              maxInSession = Math.max(maxInSession, set.weight);
              lastSetReps = set.reps;
              completedSetsCount++;
            }
          }
          
          if (completedSetsCount > 0) {
            history[ex.exerciseId].maxWeight = Math.max(history[ex.exerciseId].maxWeight, maxInSession);
            history[ex.exerciseId].lastWeight = maxInSession;
            history[ex.exerciseId].lastReps = lastSetReps;
            history[ex.exerciseId].lastSets = completedSetsCount;
          }
        }
      }
      setExerciseHistory(history);
    });

  }, [searchParams, initialized]);

  // Helper to adjust number values in weight/reps pickers
  const adjustVal = useCallback((direction: 'up' | 'down', amount: number, type: 'weight' | 'reps') => {
    setLogSheet(prev => {
      if (!prev) return null;
      if (type === 'weight') {
        const nextVal = Math.max(0, prev.weight + (direction === 'up' ? amount : -amount));
        return { ...prev, weight: nextVal };
      } else {
        const nextVal = Math.max(1, prev.reps + (direction === 'up' ? amount : -amount));
        return { ...prev, reps: nextVal };
      }
    });
  }, []);

  const handlePointerDown = (direction: 'up' | 'down', type: 'weight' | 'reps') => {
    const isWeight = type === 'weight';
    const amount = isWeight ? 2.5 : 1;
    const longAmount = isWeight ? 5.0 : 2;
    
    adjustVal(direction, amount, type);
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        adjustVal(direction, longAmount, type);
      }, 150);
      holdIntervalRef.current = interval;
    }, 500);
    holdTimeoutRef.current = timer;
  };

  const handlePointerUp = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // Trigger Rest Timer
  const triggerRestTimer = useCallback(() => {
    const duration = typeof window !== 'undefined' ? parseInt(localStorage.getItem('setting_restTimerDuration') || '90', 10) : 90;
    setRestSeconds(duration);
    setRestTotal(duration);
    setRestActive(true);
  }, []);

  // Log set from bottom sheet
  const logSetFromSheet = useCallback((exerciseId: string, setIndex: number, weight: number, reps: number, isBuddy: boolean = false) => {
    setAddedExercises(prev => prev.map(ex => {
      if (ex.exerciseId !== exerciseId) return ex;
      
      let nextSets = isBuddy ? [...(ex.buddySets || [])] : [...ex.sets];
      if (setIndex >= 0 && setIndex < nextSets.length) {
        nextSets[setIndex] = {
          ...nextSets[setIndex],
          weight,
          reps,
          completed: true,
        };
      } else {
        nextSets.push({
          setNumber: nextSets.length + 1,
          weight,
          reps,
          completed: true,
        });
      }
      
      // Auto start rest timer or do superset check
      setTimeout(() => {
        const pair = supersets.find(p => p.includes(exerciseId));
        if (pair) {
          const otherId = pair.find(id => id !== exerciseId)!;
          const otherEx = prev.find(e => e.exerciseId === otherId);
          if (isBuddy) {
            const thisCompletedCount = nextSets.filter(s => s.completed).length;
            const otherCompletedCount = (otherEx?.buddySets || []).filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          } else {
            const thisCompletedCount = nextSets.filter(s => s.completed).length;
            const otherCompletedCount = otherEx?.sets.filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          }
        } else {
          triggerRestTimer();
        }
      }, 0);

      if (isBuddy) {
        return {
          ...ex,
          buddySets: nextSets,
        };
      } else {
        return {
          ...ex,
          sets: nextSets,
        };
      }
    }));
    
    setLogSheet(null);
  }, [supersets, triggerRestTimer]);

  // Repeat last set instantly
  const repeatLastSet = useCallback((exerciseId: string, isBuddy: boolean = false) => {
    setAddedExercises(prev => prev.map(ex => {
      if (ex.exerciseId !== exerciseId) return ex;
      const targetSets = isBuddy ? (ex.buddySets || []) : ex.sets;
      const lastCompletedSet = [...targetSets].reverse().find(s => s.completed) || targetSets[targetSets.length - 1];
      if (!lastCompletedSet) return ex;
      
      const firstUncompletedIndex = targetSets.findIndex(s => !s.completed);
      let nextSets = [...targetSets];
      
      if (firstUncompletedIndex !== -1) {
        nextSets[firstUncompletedIndex] = {
          ...nextSets[firstUncompletedIndex],
          weight: lastCompletedSet.weight,
          reps: lastCompletedSet.reps,
          completed: true,
        };
      } else {
        nextSets.push({
          setNumber: nextSets.length + 1,
          weight: lastCompletedSet.weight,
          reps: lastCompletedSet.reps,
          completed: true,
        });
      }
      
      // Auto start rest timer or do superset check
      setTimeout(() => {
        const pair = supersets.find(p => p.includes(exerciseId));
        if (pair) {
          const otherId = pair.find(id => id !== exerciseId)!;
          const otherEx = prev.find(e => e.exerciseId === otherId);
          if (isBuddy) {
            const thisCompletedCount = nextSets.filter(s => s.completed).length;
            const otherCompletedCount = (otherEx?.buddySets || []).filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          } else {
            const thisCompletedCount = nextSets.filter(s => s.completed).length;
            const otherCompletedCount = otherEx?.sets.filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          }
        } else {
          triggerRestTimer();
        }
      }, 0);

      if (isBuddy) {
        return {
          ...ex,
          buddySets: nextSets,
        };
      } else {
        return {
          ...ex,
          sets: nextSets,
        };
      }
    }));
  }, [supersets, triggerRestTimer]);

  const handleOpenLogSheet = useCallback((exerciseId: string, isBuddy: boolean = false) => {
    const ex = addedExercises.find(e => e.exerciseId === exerciseId);
    if (!ex) return;
    
    const targetSets = isBuddy ? (ex.buddySets || []) : ex.sets;
    const firstUncompletedIndex = targetSets.findIndex(s => !s.completed);
    
    let prefilledWeight = 0;
    let prefilledReps = 10;
    
    const lastCompletedSet = [...targetSets].reverse().find(s => s.completed);
    if (lastCompletedSet) {
      prefilledWeight = lastCompletedSet.weight;
      prefilledReps = lastCompletedSet.reps;
    } else {
      const history = exerciseHistory[exerciseId];
      if (history) {
        prefilledWeight = history.lastWeight;
        prefilledReps = history.lastReps;
      } else {
        const def = EXERCISES.find(e => e.id === exerciseId);
        if (def) {
          prefilledReps = def.defaultReps;
        }
      }
    }
    
    setLogSheet({
      exerciseId,
      setIndex: firstUncompletedIndex !== -1 ? firstUncompletedIndex : targetSets.length,
      weight: prefilledWeight,
      reps: prefilledReps,
      isBuddy
    });
  }, [addedExercises, exerciseHistory]);

  const deleteSetAtIndex = useCallback((exerciseId: string, setIndex: number, isBuddy: boolean = false) => {
    setAddedExercises(prev => prev.map(ex => {
      if (ex.exerciseId !== exerciseId) return ex;
      if (isBuddy) {
        const buddySets = ex.buddySets || [];
        return {
          ...ex,
          buddySets: buddySets
            .filter((_, idx) => idx !== setIndex)
            .map((s, i) => ({ ...s, setNumber: i + 1 })),
        };
      } else {
        return {
          ...ex,
          sets: ex.sets
            .filter((_, idx) => idx !== setIndex)
            .map((s, i) => ({ ...s, setNumber: i + 1 })),
        };
      }
    }));
    setLongPressedSet(null);
  }, []);

  const startEditSetFromMenu = useCallback((exerciseId: string, setIndex: number, isBuddy: boolean = false) => {
    const ex = addedExercises.find(e => e.exerciseId === exerciseId);
    if (!ex) return;
    const targetSet = isBuddy ? ex.buddySets?.[setIndex] : ex.sets[setIndex];
    if (!targetSet) return;
    
    setLogSheet({
      exerciseId,
      setIndex,
      weight: targetSet.weight,
      reps: targetSet.reps,
      isBuddy
    });
    setLongPressedSet(null);
  }, [addedExercises]);

  const handleSetPillPointerDown = useCallback((e: React.PointerEvent, exerciseId: string, setIndex: number, isBuddy: boolean = false) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    longPressTimeoutRef.current = setTimeout(() => {
      setLongPressedSet({ exerciseId, setIndex, x: clientX, y: clientY, isBuddy });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600);
  }, []);

  const handleSetPillPointerUp = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  }, []);

  const calculatePlates = useCallback((target: number, bar: number) => {
    let weightPerSide = (target - bar) / 2;
    if (weightPerSide <= 0) return [];
    
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const result: { plate: number; count: number }[] = [];
    
    for (const plate of availablePlates) {
      if (weightPerSide >= plate) {
        const count = Math.floor(weightPerSide / plate);
        result.push({ plate, count });
        weightPerSide %= plate;
      }
    }
    return result;
  }, []);

  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = touchStartY.current - e.touches[0].clientY;
    if (diff > 40) {
      setRestActive(false);
    }
  }, []);

  /* — derived ---------------------------------------------- */
  const filteredExercises = getExercisesByCategory(selectedCategory);
  const hasCompletedSet = addedExercises.some((ex) =>
    ex.sets.some((s) => s.completed),
  );
  const isPickerVisible = showExercisePicker || addedExercises.length === 0;

  const renderedItems = useMemo(() => {
    const items: ({ type: 'single'; exercise: AddedExercise } | { type: 'superset'; exercises: [AddedExercise, AddedExercise] })[] = [];
    const processedIds = new Set<string>();

    for (const ex of addedExercises) {
      if (processedIds.has(ex.exerciseId)) continue;

      const ss = supersets.find(pair => pair.includes(ex.exerciseId));
      if (ss) {
        const ex1 = addedExercises.find(e => e.exerciseId === ss[0]);
        const ex2 = addedExercises.find(e => e.exerciseId === ss[1]);

        if (ex1 && ex2) {
          items.push({ type: 'superset', exercises: [ex1, ex2] });
          processedIds.add(ex1.exerciseId);
          processedIds.add(ex2.exerciseId);
          continue;
        }
      }

      items.push({ type: 'single', exercise: ex });
      processedIds.add(ex.exerciseId);
    }

    return items;
  }, [addedExercises, supersets]);

  /* — handlers --------------------------------------------- */
  const addExercise = useCallback(
    (def: ExerciseDefinition) => {
      // prevent duplicates
      if (addedExercises.some((e) => e.exerciseId === def.id)) return;

      const sets: WorkoutSet[] = Array.from({ length: def.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        weight: 0,
        reps: def.defaultReps,
        completed: false,
      }));

      setAddedExercises((prev) => [
        ...prev,
        {
          exerciseId: def.id,
          exerciseName: def.name,
          category: def.category,
          color: def.color,
          sets,
          buddySets: sets.map(s => ({ ...s }))
        },
      ]);
      setShowExercisePicker(false);
    },
    [addedExercises],
  );

  const removeExercise = useCallback((exerciseId: string) => {
    setAddedExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
    setSupersets((prev) => prev.filter((pair) => !pair.includes(exerciseId)));
  }, []);

  const updateSet = useCallback(
    (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: number, isBuddy: boolean = false) => {
      setAddedExercises((prev) =>
        prev.map((ex) => {
          if (ex.exerciseId !== exerciseId) return ex;
          if (isBuddy) {
            const buddySets = ex.buddySets || [];
            return {
              ...ex,
              buddySets: buddySets.map((s, i) =>
                i === setIndex ? { ...s, [field]: value } : s,
              ),
            };
          } else {
            return {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === setIndex ? { ...s, [field]: value } : s,
              ),
            };
          }
        }),
      );
    },
    [],
  );

  const toggleSetComplete = useCallback((exerciseId: string, setIndex: number, isBuddy: boolean = false) => {
    setAddedExercises((prev) => {
      const updated = prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        if (isBuddy) {
          const buddySets = ex.buddySets || [];
          return {
            ...ex,
            buddySets: buddySets.map((s, i) =>
              i === setIndex ? { ...s, completed: !s.completed } : s,
            ),
          };
        } else {
          return {
            ...ex,
            sets: ex.sets.map((s, i) =>
              i === setIndex ? { ...s, completed: !s.completed } : s,
            ),
          };
        }
      });
      
      const exercise = prev.find(e => e.exerciseId === exerciseId);
      const setBeforeUpdate = isBuddy ? exercise?.buddySets?.[setIndex] : exercise?.sets[setIndex];
      const wasCompleted = setBeforeUpdate?.completed;
      
      // Auto-show rest timer when completing a set (not unchecking)
      if (!wasCompleted) {
        const pair = supersets.find(p => p.includes(exerciseId));
        if (pair) {
          const otherId = pair.find(id => id !== exerciseId)!;
          const otherEx = prev.find(e => e.exerciseId === otherId);
          if (isBuddy) {
            const thisCompletedCount = ((exercise?.buddySets || []).filter(s => s.completed).length || 0) + 1;
            const otherCompletedCount = (otherEx?.buddySets || []).filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          } else {
            const thisCompletedCount = (exercise?.sets.filter(s => s.completed).length || 0) + 1;
            const otherCompletedCount = otherEx?.sets.filter(s => s.completed).length || 0;
            if (thisCompletedCount === otherCompletedCount) {
              triggerRestTimer();
            }
          }
        } else {
          triggerRestTimer();
        }
        
        // PR Detection (only for user sets)
        if (!isBuddy) {
          const setWeight = setBeforeUpdate?.weight || 0;
          const setReps = setBeforeUpdate?.reps || 0;
          const previousMax = exerciseHistory[exerciseId]?.maxWeight || 0;
          
          if (setWeight > 0 && setWeight > previousMax) {
            // New PR!
            const diff = setWeight - previousMax;
            setCelebration({
              show: true,
              text: `New PR! ${exercise?.exerciseName} — ${setWeight}${weightUnit}`,
              subtext: previousMax > 0 ? `That's +${diff}${weightUnit} from your previous best!` : `Your first PR for this exercise!`,
            });
            
            // Auto-hide celebration after 3s
            setTimeout(() => setCelebration(c => ({ ...c, show: false })), 3000);
            
            // Save PR asynchronously
            import('@/lib/storage').then(async ({ savePersonalRecord }) => {
              await savePersonalRecord({
                exerciseId: exerciseId,
                exerciseName: exercise?.exerciseName || '',
                weight: setWeight,
                reps: setReps,
                date: new Date().toISOString()
              });
            });
            
            // Update local history
            setExerciseHistory(prevHistory => ({
              ...prevHistory,
              [exerciseId]: {
                ...prevHistory[exerciseId],
                maxWeight: setWeight
              }
            }));
          }
        }
      }
      return updated;
    });
  }, [exerciseHistory, supersets, weightUnit]);

  const addSet = useCallback((exerciseId: string, isBuddy: boolean = false) => {
    setAddedExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        if (isBuddy) {
          const buddySets = ex.buddySets || [];
          return {
            ...ex,
            buddySets: [
              ...buddySets,
              {
                setNumber: buddySets.length + 1,
                weight: 0,
                reps: buddySets.length > 0 ? buddySets[buddySets.length - 1].reps : 10,
                completed: false,
              },
            ],
          };
        } else {
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                setNumber: ex.sets.length + 1,
                weight: 0,
                reps: ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].reps : 10,
                completed: false,
              },
            ],
          };
        }
      }),
    );
  }, []);

  const removeSet = useCallback((exerciseId: string, setIndex: number, isBuddy: boolean = false) => {
    setAddedExercises((prev) =>
      prev.map((ex) => {
        if (ex.exerciseId !== exerciseId) return ex;
        if (isBuddy) {
          const buddySets = ex.buddySets || [];
          return {
            ...ex,
            buddySets: buddySets
              .filter((_, i) => i !== setIndex)
              .map((s, i) => ({ ...s, setNumber: i + 1 })),
          };
        } else {
          return {
            ...ex,
            sets: ex.sets
              .filter((_, i) => i !== setIndex)
              .map((s, i) => ({ ...s, setNumber: i + 1 })),
          };
        }
      }),
    );
  }, []);

  const calculateCaloriesBurned = async (totalVolume: number, durationMinutes: number, gender: string | null) => {
    const { getBodyWeights } = await import('@/lib/storage');
    const weights = await getBodyWeights();
    const latestWeight = weights.length > 0 ? weights[weights.length - 1].weight : 70;
    
    // MET
    let met = 3.5;
    if (totalVolume >= 3000 && totalVolume <= 6000) {
      met = 5.0;
    } else if (totalVolume > 6000) {
      met = 6.5;
    }
    
    // gender multiplier
    const genderMultiplier = gender === 'Female' ? 0.9 : 1.0;
    
    const durationHours = durationMinutes / 60;
    const calories = met * latestWeight * durationHours * genderMultiplier;
    
    return Math.round(calories);
  };

  const finishWorkout = async () => {
    if (saving || !hasCompletedSet) return;
    // Show intensity overlay first
    setIntensityRating(null);
    setShowIntensityRatingOverlay(true);
  };

  const handleFinishIntensityRating = async (rating: number | null) => {
    setShowIntensityRatingOverlay(false);
    setSaving(true);
    try {
      let setsCount = 0;
      let totalVol = 0;
      addedExercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed) {
            setsCount++;
            totalVol += s.weight * s.reps;
          }
        });
      });
      const duration = Math.round((Date.now() - startTime.getTime()) / 60000);

      // MET calories calculation for User
      const userCalories = await calculateCaloriesBurned(totalVol, duration, userGender || null);

      const workout = {
        name: workoutName,
        startedAt: startTime.toISOString(),
        completedAt: new Date().toISOString(),
        durationMinutes: duration,
        exercises: addedExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.filter(s => s.completed),
        })).filter(ex => ex.sets.length > 0),
        supersets: supersets,
        intensity: rating || undefined,
        calories: userCalories,
        buddy: buddyModeActive ? false : undefined,
        isBuddySession: buddyModeActive ? true : undefined,
        buddyName: buddyModeActive ? (buddyName || 'Buddy') : undefined
      };
      
      setFinishedWorkout(workout);
      setWorkoutFinishedStats({ sets: setsCount, volume: totalVol, duration });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWorkoutNotesAndExit = async () => {
    if (!finishedWorkout) return;
    try {
      const { saveWorkout } = await import('@/lib/storage');
      
      // Save User's workout
      await saveWorkout({
        ...finishedWorkout,
        notes: workoutNotes.trim() || undefined,
      });

      // If Buddy Mode is active, save Buddy's workout too
      if (buddyModeActive) {
        let buddySetsCount = 0;
        let buddyTotalVol = 0;
        const buddyExercises = addedExercises.map((ex) => {
          const completedSets = (ex.buddySets || []).filter(s => s.completed);
          completedSets.forEach(s => {
            buddySetsCount++;
            buddyTotalVol += s.weight * s.reps;
          });
          return {
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: completedSets,
          };
        }).filter(ex => ex.sets.length > 0);

        if (buddyExercises.length > 0) {
          const buddyCalories = await calculateCaloriesBurned(buddyTotalVol, finishedWorkout.durationMinutes || 0, 'Male');

          await saveWorkout({
            name: `${workoutName} (${buddyName || 'Buddy'})`,
            startedAt: finishedWorkout.startedAt,
            completedAt: finishedWorkout.completedAt,
            durationMinutes: finishedWorkout.durationMinutes,
            exercises: buddyExercises,
            supersets: finishedWorkout.supersets,
            notes: `Buddy session with ${finishedWorkout.name}.${workoutNotes.trim() ? ` Notes: ${workoutNotes.trim()}` : ''}`,
            intensity: finishedWorkout.intensity,
            calories: buddyCalories,
            buddy: true,
            isBuddySession: true,
            buddyName: buddyName || 'Buddy'
          });
        }
      }

      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  /* — render ----------------------------------------------- */
  return (
    <div className="app-container" style={{ padding: '24px 16px 96px' }}>
      {/* ─── Page Header ─── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            aria-label="Go back"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--card-bg)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Log Workout</h1>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setBuddyModeActive(!buddyModeActive)}
            style={{
              height: 38,
              padding: '0 12px',
              borderRadius: 9999,
              border: 'none',
              background: buddyModeActive ? '#06b6d4' : 'var(--input-bg)',
              color: buddyModeActive ? 'white' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span>👥 Buddy</span>
          </button>
          
          <button
            onClick={() => {
              setShowTemplates(true);
              loadTemplatesList();
            }}
            style={{
              height: 38,
              padding: '0 12px',
              borderRadius: 9999,
              border: '1px solid var(--border-light)',
              background: 'var(--card-bg)',
              fontWeight: 700,
              fontSize: 12,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <ClipboardFilledIcon size={14} />
            <span>Templates</span>
          </button>
        </div>
      </div>

      {buddyModeActive && (
        <div style={{
          background: 'rgba(6, 182, 212, 0.1)',
          color: '#0891b2',
          padding: '8px 16px',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
        }}>
          <span>👥 Buddy Mode Active</span>
          {buddyName && <span style={{ opacity: 0.7 }}>· Training with {buddyName}</span>}
        </div>
      )}

      {buddyModeActive && !buddyName ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '40px 24px',
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{ fontSize: 48 }}>👥</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Add your buddy's name first</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            To use Buddy Mode, please enter your workout buddy's name in Settings first.
          </p>
          <button
            onClick={() => router.push('/app/settings')}
            style={{
              padding: '12px 24px',
              borderRadius: 9999,
              border: 'none',
              background: 'var(--lime)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: 'var(--shadow-button)'
            }}
          >
            Go to Settings
          </button>
        </div>
      ) : (
        <>

      {/* ─── Workout Name ─── */}
      <div style={{ marginBottom: 24 }}>
        <label className="text-secondary" style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
          Workout Name
        </label>
        <input
          className="input-field"
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="e.g. Push Day, Leg Day…"
        />
      </div>

      {/* ─── Added Exercises ─── */}
      {addedExercises.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="section-heading" style={{ margin: 0 }}>
              Exercises ({addedExercises.length})
            </h2>
            {addedExercises.length >= 2 && (
              <button
                onClick={() => {
                  setSelectedSupersetExercises([]);
                  setShowAddSupersetModal(true);
                }}
                style={{
                  fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                  background: 'var(--lime)', border: 'none', borderRadius: 9999,
                  padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <LinkIcon size={14} color="var(--text-primary)" /> Add Superset
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {renderedItems.map((item, itemIdx) => {
              if (item.type === 'single') {
                const ex = item.exercise;
                const hasLoggedSet = ex.sets.some(s => s.completed);
                const history = exerciseHistory[ex.exerciseId];
                
                return (
                  <div className="card" key={ex.exerciseId} style={{ position: 'relative', background: 'transparent', border: '1px solid var(--border-light)', boxShadow: 'none' }}>
                    {/* Exercise Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ex.color, flexShrink: 0 }}>
                          {getCategoryIcon(ex.category, 20)}
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ex.exerciseName}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                          background: `${ex.color}20`, color: ex.color, flexShrink: 0
                        }}>
                          {ex.category}
                        </span>
                      </div>
                      <button
                        onClick={() => removeExercise(ex.exerciseId)}
                        style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 4 }}
                      >
                        Remove
                      </button>
                    </div>

                    {buddyModeActive ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12, position: 'relative' }}>
                        {/* Divider */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: '#E2E8F0', transform: 'translateX(-50%)' }} />

                        {/* LEFT Column — You */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }} />
                            You
                          </p>

                          {history && history.lastSets > 0 ? (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
                              Last: {history.lastWeight}{weightUnit}×{history.lastReps}
                            </p>
                          ) : (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, fontStyle: 'italic' }}>
                              First time
                            </p>
                          )}

                          <div className="scroll-row" style={{ gap: 6, marginBottom: 12, paddingBottom: 4 }}>
                            {ex.sets.map((set, setIdx) => {
                              const isSetPillCompleted = set.completed;
                              return (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, ex.exerciseId, setIdx, false)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0,
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    background: isSetPillCompleted ? 'var(--lime)' : 'var(--input-bg)',
                                    border: '1px solid ' + (isSetPillCompleted ? 'transparent' : 'var(--border-light)'),
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    fontWeight: 700,
                                    fontSize: 11,
                                  }}
                                  onClick={() => {
                                    setLogSheet({
                                      exerciseId: ex.exerciseId,
                                      setIndex: setIdx,
                                      weight: set.weight,
                                      reps: set.reps,
                                      isBuddy: false
                                    });
                                  }}
                                >
                                  <span>{set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}</span>
                                  {isSetPillCompleted && <span style={{ fontSize: 9 }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button
                              onClick={() => handleOpenLogSheet(ex.exerciseId, false)}
                              style={{
                                height: 38, borderRadius: 9999, border: 'none',
                                background: 'var(--lime)', color: 'var(--text-primary)', fontWeight: 800,
                                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                                boxShadow: '0 2px 6px rgba(200,241,53,0.15)',
                              }}
                            >
                              + Log Set
                            </button>
                            {ex.sets.some(s => s.completed) && (
                              <button
                                onClick={() => repeatLastSet(ex.exerciseId, false)}
                                style={{
                                  height: 38, borderRadius: 9999, border: '1px solid var(--lime)',
                                  background: 'transparent', color: 'var(--text-primary)', fontWeight: 700,
                                  cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                                }}
                              >
                                Repeat Last
                              </button>
                            )}
                          </div>
                        </div>

                        {/* RIGHT Column — Buddy */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4' }} />
                            {buddyName || 'Buddy'}
                          </p>

                          {history && history.lastSets > 0 ? (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
                              Last: {history.lastWeight}{weightUnit}×{history.lastReps}
                            </p>
                          ) : (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500, fontStyle: 'italic' }}>
                              First time
                            </p>
                          )}

                          <div className="scroll-row" style={{ gap: 6, marginBottom: 12, paddingBottom: 4 }}>
                            {(ex.buddySets || []).map((set, setIdx) => {
                              const isSetPillCompleted = set.completed;
                              return (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, ex.exerciseId, setIdx, true)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0,
                                    padding: '6px 10px',
                                    borderRadius: 8,
                                    background: isSetPillCompleted ? '#06b6d4' : 'var(--input-bg)',
                                    border: '1px solid ' + (isSetPillCompleted ? 'transparent' : 'var(--border-light)'),
                                    color: isSetPillCompleted ? 'white' : 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    fontWeight: 700,
                                    fontSize: 11,
                                  }}
                                  onClick={() => {
                                    setLogSheet({
                                      exerciseId: ex.exerciseId,
                                      setIndex: setIdx,
                                      weight: set.weight,
                                      reps: set.reps,
                                      isBuddy: true
                                    });
                                  }}
                                >
                                  <span>{set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}</span>
                                  {isSetPillCompleted && <span style={{ fontSize: 9 }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button
                              onClick={() => handleOpenLogSheet(ex.exerciseId, true)}
                              style={{
                                height: 38, borderRadius: 9999, border: 'none',
                                background: '#06b6d4', color: 'white', fontWeight: 800,
                                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                                boxShadow: '0 2px 6px rgba(6,182,212,0.15)',
                              }}
                            >
                              + Log Set
                            </button>
                            {(ex.buddySets || []).some(s => s.completed) && (
                              <button
                                onClick={() => repeatLastSet(ex.exerciseId, true)}
                                style={{
                                  height: 38, borderRadius: 9999, border: '1px solid #06b6d4',
                                  background: 'transparent', color: 'var(--text-primary)', fontWeight: 700,
                                  cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                                }}
                              >
                                Repeat Last
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Progressive Overload Hint */}
                        {history && history.lastSets > 0 ? (
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 500 }}>
                            Last: {history.lastWeight}{weightUnit} × {history.lastReps} — Target: {history.lastWeight + 2.5}{weightUnit} × {history.lastReps}
                          </p>
                        ) : (
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 500, fontStyle: 'italic' }}>
                            First time doing this exercise. Set your baseline!
                          </p>
                        )}

                        {/* Logged Set Pills Scroll Row */}
                        {ex.sets.length > 0 && (
                          <div className="scroll-row" style={{ gap: 8, marginBottom: 16, paddingBottom: 4 }}>
                            {ex.sets.map((set, setIdx) => {
                              const isSetPillCompleted = set.completed;
                              return (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, ex.exerciseId, setIdx, false)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0,
                                    padding: '8px 14px',
                                    borderRadius: 12,
                                    background: isSetPillCompleted ? 'var(--lime)' : 'var(--input-bg)',
                                    border: '1px solid ' + (isSetPillCompleted ? 'transparent' : 'var(--border-light)'),
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    fontWeight: 700,
                                    fontSize: 12,
                                  }}
                                  onClick={() => {
                                    setLogSheet({
                                      exerciseId: ex.exerciseId,
                                      setIndex: setIdx,
                                      weight: set.weight,
                                      reps: set.reps,
                                      isBuddy: false
                                    });
                                  }}
                                >
                                  <span>S{set.setNumber}: {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'} × {set.reps}</span>
                                  {isSetPillCompleted && <span style={{ fontSize: 10 }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Card Actions */}
                        <div style={{ display: 'flex', gap: 10 }}>
                          {hasLoggedSet && (
                            <button
                              onClick={() => repeatLastSet(ex.exerciseId, false)}
                              style={{
                                flex: 1, height: 48, borderRadius: 9999, border: '1px solid var(--lime)',
                                background: 'transparent', color: 'var(--text-primary)', fontWeight: 700,
                                cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                              }}
                            >
                              Repeat Last Set
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenLogSheet(ex.exerciseId, false)}
                            style={{
                              flex: 2, height: 48, borderRadius: 9999, border: 'none',
                              background: 'var(--lime)', color: 'var(--text-primary)', fontWeight: 800,
                              cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                              boxShadow: '0 4px 12px rgba(200,241,53,0.15)',
                            }}
                          >
                            + Log Set
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              } else {
                // Superset Card
                const [exA, exB] = item.exercises;
                const hasLoggedSetA = exA.sets.some(s => s.completed);
                const hasLoggedSetB = exB.sets.some(s => s.completed);
                const historyA = exerciseHistory[exA.exerciseId];
                const historyB = exerciseHistory[exB.exerciseId];

                return (
                  <div
                    className="card"
                    key={`${exA.exerciseId}-${exB.exerciseId}`}
                    style={{
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      background: 'transparent',
                      boxShadow: 'none',
                      position: 'relative',
                    }}
                  >
                    {/* Superset Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LinkIcon size={18} color="#0891b2" />
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 1 }}>
                          Superset
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => removeSupersetOnLog(exA.exerciseId)}
                          style={{ border: 'none', background: 'none', color: '#0891b2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Unlink
                        </button>
                      </div>
                    </div>

                    {buddyModeActive ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12, position: 'relative' }}>
                        {/* Divider */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: '#E2E8F0', transform: 'translateX(-50%)' }} />

                        {/* LEFT Column — You */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 12 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }} />
                            You
                          </p>

                          {/* Exercise A */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exA.exerciseName}</div>
                            <div className="scroll-row" style={{ gap: 4, marginBottom: 6, paddingBottom: 2 }}>
                              {exA.sets.map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, exA.exerciseId, setIdx, false)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0, padding: '4px 8px', borderRadius: 6,
                                    background: set.completed ? '#22d3ee' : 'var(--input-bg)',
                                    color: set.completed ? 'white' : 'var(--text-primary)',
                                    fontWeight: 700, fontSize: 10, cursor: 'pointer',
                                  }}
                                  onClick={() => setLogSheet({ exerciseId: exA.exerciseId, setIndex: setIdx, weight: set.weight, reps: set.reps, isBuddy: false })}
                                >
                                  {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleOpenLogSheet(exA.exerciseId, false)}
                                style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', background: '#22d3ee', color: 'white', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}
                              >
                                + Log A
                              </button>
                              {hasLoggedSetA && (
                                <button
                                  onClick={() => repeatLastSet(exA.exerciseId, false)}
                                  style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #22d3ee', background: 'transparent', color: '#0891b2', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}
                                >
                                  Rep
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Exercise B */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exB.exerciseName}</div>
                            <div className="scroll-row" style={{ gap: 4, marginBottom: 6, paddingBottom: 2 }}>
                              {exB.sets.map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, exB.exerciseId, setIdx, false)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0, padding: '4px 8px', borderRadius: 6,
                                    background: set.completed ? '#22d3ee' : 'var(--input-bg)',
                                    color: set.completed ? 'white' : 'var(--text-primary)',
                                    fontWeight: 700, fontSize: 10, cursor: 'pointer',
                                  }}
                                  onClick={() => setLogSheet({ exerciseId: exB.exerciseId, setIndex: setIdx, weight: set.weight, reps: set.reps, isBuddy: false })}
                                >
                                  {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleOpenLogSheet(exB.exerciseId, false)}
                                style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', background: '#22d3ee', color: 'white', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}
                              >
                                + Log B
                              </button>
                              {hasLoggedSetB && (
                                <button
                                  onClick={() => repeatLastSet(exB.exerciseId, false)}
                                  style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #22d3ee', background: 'transparent', color: '#0891b2', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}
                                >
                                  Rep
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT Column — Buddy */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: 12 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4' }} />
                            {buddyName || 'Buddy'}
                          </p>

                          {/* Exercise A */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exA.exerciseName}</div>
                            <div className="scroll-row" style={{ gap: 4, marginBottom: 6, paddingBottom: 2 }}>
                              {(exA.buddySets || []).map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, exA.exerciseId, setIdx, true)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0, padding: '4px 8px', borderRadius: 6,
                                    background: set.completed ? '#06b6d4' : 'var(--input-bg)',
                                    color: set.completed ? 'white' : 'var(--text-primary)',
                                    fontWeight: 700, fontSize: 10, cursor: 'pointer',
                                  }}
                                  onClick={() => setLogSheet({ exerciseId: exA.exerciseId, setIndex: setIdx, weight: set.weight, reps: set.reps, isBuddy: true })}
                                >
                                  {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleOpenLogSheet(exA.exerciseId, true)}
                                style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', background: '#06b6d4', color: 'white', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}
                              >
                                + Log A
                              </button>
                              {(exA.buddySets || []).some(s => s.completed) && (
                                <button
                                  onClick={() => repeatLastSet(exA.exerciseId, true)}
                                  style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #06b6d4', background: 'transparent', color: '#0891b2', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}
                                >
                                  Rep
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Exercise B */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exB.exerciseName}</div>
                            <div className="scroll-row" style={{ gap: 4, marginBottom: 6, paddingBottom: 2 }}>
                              {(exB.buddySets || []).map((set, setIdx) => (
                                <div
                                  key={setIdx}
                                  onPointerDown={(e) => handleSetPillPointerDown(e, exB.exerciseId, setIdx, true)}
                                  onPointerUp={handleSetPillPointerUp}
                                  onPointerLeave={handleSetPillPointerUp}
                                  style={{
                                    flexShrink: 0, padding: '4px 8px', borderRadius: 6,
                                    background: set.completed ? '#06b6d4' : 'var(--input-bg)',
                                    color: set.completed ? 'white' : 'var(--text-primary)',
                                    fontWeight: 700, fontSize: 10, cursor: 'pointer',
                                  }}
                                  onClick={() => setLogSheet({ exerciseId: exB.exerciseId, setIndex: setIdx, weight: set.weight, reps: set.reps, isBuddy: true })}
                                >
                                  {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'}×{set.reps}
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleOpenLogSheet(exB.exerciseId, true)}
                                style={{ flex: 1, height: 32, borderRadius: 8, border: 'none', background: '#06b6d4', color: 'white', fontWeight: 800, fontSize: 10, cursor: 'pointer' }}
                              >
                                + Log B
                              </button>
                              {(exB.buddySets || []).some(s => s.completed) && (
                                <button
                                  onClick={() => repeatLastSet(exB.exerciseId, true)}
                                  style={{ height: 32, padding: '0 6px', borderRadius: 8, border: '1px solid #06b6d4', background: 'transparent', color: '#0891b2', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}
                                >
                                  Rep
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Exercise A */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{exA.exerciseName}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 9999, background: `${exA.color}15`, color: exA.color }}>{exA.category}</span>
                          </div>

                          {historyA && historyA.lastSets > 0 ? (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
                              Last: {historyA.lastWeight}{weightUnit} × {historyA.lastReps} · Target: {historyA.lastWeight + 2.5}{weightUnit} × {historyA.lastReps}
                            </p>
                          ) : (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontStyle: 'italic' }}>Set baseline</p>
                          )}

                          {/* Logged pills for A */}
                          {exA.sets.length > 0 && (
                            <div className="scroll-row" style={{ gap: 6, marginBottom: 4, paddingBottom: 2 }}>
                              {exA.sets.map((set, setIdx) => {
                                const isCompleted = set.completed;
                                return (
                                  <div
                                    key={setIdx}
                                    onPointerDown={(e) => handleSetPillPointerDown(e, exA.exerciseId, setIdx, false)}
                                    onPointerUp={handleSetPillPointerUp}
                                    onPointerLeave={handleSetPillPointerUp}
                                    style={{
                                      flexShrink: 0, padding: '6px 12px', borderRadius: 10,
                                      background: isCompleted ? '#22d3ee' : 'var(--input-bg)',
                                      border: '1px solid ' + (isCompleted ? 'transparent' : 'var(--border-light)'),
                                      color: isCompleted ? 'white' : 'var(--text-primary)',
                                      display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                                      fontWeight: 700, fontSize: 11,
                                    }}
                                    onClick={() => {
                                      setLogSheet({
                                        exerciseId: exA.exerciseId,
                                        setIndex: setIdx,
                                        weight: set.weight,
                                        reps: set.reps,
                                        isBuddy: false
                                      });
                                    }}
                                  >
                                    <span>S{set.setNumber}: {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'} × {set.reps}</span>
                                    {isCompleted && <span>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Divider line */}
                        <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />

                        {/* Exercise B */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{exB.exerciseName}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 9999, background: `${exB.color}15`, color: exB.color }}>{exB.category}</span>
                          </div>

                          {historyB && historyB.lastSets > 0 ? (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
                              Last: {historyB.lastWeight}{weightUnit} × {historyB.lastReps} · Target: {historyB.lastWeight + 2.5}{weightUnit} × {historyB.lastReps}
                            </p>
                          ) : (
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, fontStyle: 'italic' }}>Set baseline</p>
                          )}

                          {/* Logged pills for B */}
                          {exB.sets.length > 0 && (
                            <div className="scroll-row" style={{ gap: 6, marginBottom: 4, paddingBottom: 2 }}>
                              {exB.sets.map((set, setIdx) => {
                                const isCompleted = set.completed;
                                return (
                                  <div
                                    key={setIdx}
                                    onPointerDown={(e) => handleSetPillPointerDown(e, exB.exerciseId, setIdx, false)}
                                    onPointerUp={handleSetPillPointerUp}
                                    onPointerLeave={handleSetPillPointerUp}
                                    style={{
                                      flexShrink: 0, padding: '6px 12px', borderRadius: 10,
                                      background: isCompleted ? '#22d3ee' : 'var(--input-bg)',
                                      border: '1px solid ' + (isCompleted ? 'transparent' : 'var(--border-light)'),
                                      color: isCompleted ? 'white' : 'var(--text-primary)',
                                      display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                                      fontWeight: 700, fontSize: 11,
                                    }}
                                    onClick={() => {
                                      setLogSheet({
                                        exerciseId: exB.exerciseId,
                                        setIndex: setIdx,
                                        weight: set.weight,
                                        reps: set.reps,
                                        isBuddy: false
                                      });
                                    }}
                                  >
                                    <span>S{set.setNumber}: {set.weight > 0 ? `${set.weight}${weightUnit}` : '-'} × {set.reps}</span>
                                    {isCompleted && <span>✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Unified actions grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                          {/* Actions for A */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button
                              onClick={() => handleOpenLogSheet(exA.exerciseId, false)}
                              style={{
                                height: 40, borderRadius: 14, border: 'none',
                                background: '#22d3ee', color: 'white', fontWeight: 800,
                                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                              }}
                            >
                              + Log Set A
                            </button>
                            {hasLoggedSetA && (
                              <button
                                onClick={() => repeatLastSet(exA.exerciseId, false)}
                                style={{
                                  height: 32, borderRadius: 10, border: '1px solid #22d3ee',
                                  background: 'transparent', color: '#0891b2', fontWeight: 700,
                                  cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                                }}
                              >
                                Repeat Set A
                              </button>
                            )}
                          </div>

                          {/* Actions for B */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button
                              onClick={() => handleOpenLogSheet(exB.exerciseId, false)}
                              style={{
                                height: 40, borderRadius: 14, border: 'none',
                                background: '#22d3ee', color: 'white', fontWeight: 800,
                                cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                              }}
                            >
                              + Log Set B
                            </button>
                            {hasLoggedSetB && (
                              <button
                                onClick={() => repeatLastSet(exB.exerciseId, false)}
                                style={{
                                  height: 32, borderRadius: 10, border: '1px solid #22d3ee',
                                  background: 'transparent', color: '#0891b2', fontWeight: 700,
                                  cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                                }}
                              >
                                Repeat Set B
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* ─── Exercise Picker ─── */}
      <div style={{ marginBottom: 24 }}>
        {/* Toggle or always-visible header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-heading">Add Exercise</h2>
          {addedExercises.length > 0 && (
            <button
              onClick={() => setShowExercisePicker(!isPickerVisible)}
              style={{
                height: 36,
                paddingInline: 16,
                borderRadius: 9999,
                border: '1px solid var(--border-light)',
                background: isPickerVisible ? 'var(--primary)' : 'white',
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isPickerVisible ? 'Hide' : 'Show'}
            </button>
          )}
        </div>

        {isPickerVisible && (
          <>
            {/* Category tabs */}
            <div className="scroll-row" style={{ marginBottom: 16 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    height: 40,
                    padding: '0 20px',
                    borderRadius: 9999,
                    border: selectedCategory === cat ? 'none' : '1px solid var(--border-light)',
                    background: selectedCategory === cat ? 'var(--primary)' : 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    fontFamily: 'inherit',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredExercises.map((def) => {
                const isAdded = addedExercises.some((e) => e.exerciseId === def.id);
                return (
                  <button
                    key={def.id}
                    onClick={() => addExercise(def)}
                    disabled={isAdded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 16,
                      border: 'none',
                      background: isAdded ? 'rgba(200, 241, 53, 0.12)' : 'var(--card-bg)',
                      boxShadow: isAdded ? 'none' : 'var(--shadow-card)',
                      cursor: isAdded ? 'default' : 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      opacity: isAdded ? 0.6 : 1,
                      transition: 'transform 0.1s ease, box-shadow 0.15s ease',
                      minHeight: 56,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: def.color + '22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: def.color,
                      }}
                    >
                      {getCategoryIcon(def.category, 22)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                        {def.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {def.category} · {def.defaultSets}×{def.defaultReps}
                      </div>
                    </div>
                    {isAdded ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-dark)" strokeWidth={2.5} strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ─── Rest Timer Action Card ─── */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => {
            if (restActive) {
              setRestExpanded(true);
            } else {
              triggerRestTimer();
              setRestExpanded(true);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '16px 20px',
            borderRadius: 'var(--radius-card)',
            border: 'none',
            background: 'var(--card-bg)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            minHeight: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
              {restActive ? `Resting — ${Math.floor(restSeconds / 60)}:${(restSeconds % 60).toString().padStart(2, '0')}` : 'Start Rest Timer'}
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', background: 'var(--lime)', padding: '4px 12px', borderRadius: 9999 }}>
            {restActive ? 'Expand' : 'Start'}
          </span>
        </button>
      </div>

      {/* ─── Finish Button (fixed) ─── */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 390,
          padding: '0 16px',
          zIndex: 100,
        }}
      >
        <button
          className="btn-primary"
          onClick={finishWorkout}
          disabled={!hasCompletedSet || saving}
          style={{
            width: '100%',
            opacity: hasCompletedSet && !saving ? 1 : 0.45,
            cursor: hasCompletedSet && !saving ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 24px rgba(200, 241, 53, 0.35)',
          }}
        >
          {saving ? 'Saving…' : 'Finish Workout'}
        </button>
      </div>
    </>)}

      {/* ─── PR Celebration Overlay ─── */}
      {celebration.show && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out forwards',
          }}
        >
          {/* Confetti simulation using box-shadows in a pseudo-element is tricky in inline styles, 
              so we'll just add a few animated dot elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                background: 'var(--primary)',
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-100px)`,
                animation: 'explode 1s ease-out forwards',
                opacity: 0,
              }}
            />
          ))}
          <style>{`
            @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(8px); } }
            @keyframes explode { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-${Math.random() * 150 + 100}px); opacity: 0; } }
            @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          `}</style>
          
          <div style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', width: '100%', maxWidth: 400 }}>
            <div style={{ 
              background: 'rgba(200, 241, 53, 0.2)', 
              color: 'var(--primary)', 
              padding: '8px 16px', 
              borderRadius: 9999, 
              display: 'inline-block',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: 24
            }}>
              Achievement Unlocked
            </div>
            <h2 style={{ color: 'white', fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: 900, marginBottom: 12, lineHeight: 1.2 }}>
              {celebration.text}
            </h2>
            <p style={{ color: 'var(--primary)', fontSize: 16, fontWeight: 600, marginBottom: 32 }}>
              {celebration.subtext}
            </p>
            <button
              onClick={() => setCelebration(c => ({ ...c, show: false }))}
              style={{
                background: 'var(--primary)',
                color: '#0F172A',
                border: 'none',
                padding: '16px 32px',
                borderRadius: 9999,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer',
                minWidth: 200,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>Let's gooo</span>
                <FlameIcon size={18} color="#0F172A" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ─── Intensity Rating Overlay ─── */}
      {showIntensityRatingOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: 'slideUp 0.3s ease-out forwards',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            @keyframes pulseScale {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1.1); }
            }
          `}</style>
          
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            How was today's session?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 40 }}>
            Rate the intensity of your workout
          </p>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 50, justifyContent: 'center' }}>
            {[
              { rating: 1, emoji: '😴', label: 'Easy' },
              { rating: 2, emoji: '😐', label: 'OK' },
              { rating: 3, emoji: '💪', label: 'Good' },
              { rating: 4, emoji: '🔥', label: 'Hard' },
              { rating: 5, emoji: '⚡', label: 'Beast' },
            ].map(item => {
              const isSelected = intensityRating === item.rating;
              return (
                <button
                  key={item.rating}
                  onClick={() => setIntensityRating(item.rating)}
                  style={{
                    border: 'none',
                    background: isSelected ? 'var(--lime)' : 'transparent',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    animation: isSelected ? 'pulseScale 0.3s ease-out' : 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 8px 16px rgba(200, 241, 53, 0.4)' : 'none',
                  }}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              );
            })}
          </div>
          
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button
              onClick={() => handleFinishIntensityRating(intensityRating)}
              disabled={intensityRating === null}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 9999,
                border: 'none',
                background: intensityRating !== null ? 'var(--lime)' : 'var(--input-bg)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: 16,
                fontFamily: 'inherit',
                cursor: intensityRating !== null ? 'pointer' : 'not-allowed',
                boxShadow: intensityRating !== null ? '0 8px 32px rgba(200, 241, 53, 0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Done
            </button>
            
            <button
              onClick={() => handleFinishIntensityRating(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textDecoration: 'underline'
              }}
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ─── Workout Completion Overlay ─── */}
      {workoutFinishedStats && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-out forwards',
            overflowY: 'auto'
          }}
        >
          <div style={{ marginBottom: 12, animation: 'bounce 1s ease-out', filter: 'drop-shadow(0 0 32px rgba(200, 241, 53, 0.6))' }}>
            <CheckCircleIcon size={72} color="var(--lime)" />
          </div>
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>Workout Complete!</h1>

          {/* Calories Flame Banner */}
          {finishedWorkout && finishedWorkout.calories !== undefined && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 48, marginBottom: 4, filter: 'drop-shadow(0 4px 12px rgba(239, 68, 68, 0.2))' }}>🔥</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'white' }}>{finishedWorkout.calories} cal</span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>estimated calories burned</span>
            </div>
          )}
          
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 24, padding: '24px 20px', width: '100%', maxWidth: 320, marginBottom: 20, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Volume</p>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{workoutFinishedStats.volume.toLocaleString()}{weightUnit}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Sets</p>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{workoutFinishedStats.sets}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Duration</p>
                <p style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>{workoutFinishedStats.duration} min</p>
              </div>
            </div>
          </div>

          {/* Buddy Session Comparison */}
          {buddyModeActive && buddyStats && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 20,
              padding: 16,
              width: '100%',
              maxWidth: 320,
              marginBottom: 20,
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'left'
            }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 800, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4 }}>
                👥 Buddy Comparison
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
                    You: {workoutFinishedStats.sets} sets · {workoutFinishedStats.volume.toLocaleString()}{weightUnit}
                  </span>
                  {workoutFinishedStats.volume >= buddyStats.volume && (
                    <span style={{ fontSize: 15 }}>🏆</span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
                    {buddyName || 'Buddy'}: {buddyStats.sets} sets · {buddyStats.volume.toLocaleString()}{weightUnit}
                  </span>
                  {buddyStats.volume >= workoutFinishedStats.volume && (
                    <span style={{ fontSize: 15 }}>🏆</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Notes per Workout */}
          <div style={{ width: '100%', maxWidth: 320, marginBottom: 20, textAlign: 'left' }}>
            <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              How did it feel today?
            </label>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Record energy levels, focus, accomplishments, or notes…"
              style={{
                width: '100%',
                height: 80,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                padding: '10px 12px',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleSaveWorkoutNotesAndExit}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '14px',
              borderRadius: 9999,
              border: 'none',
              background: 'var(--lime)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 15,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(200, 241, 53, 0.2)',
            }}
          >
            Back to Home
          </button>
          
          <button
            onClick={() => {
              if (templateSaved) return;
              setSaveAsTemplateName(workoutName);
              setShowSaveTemplatePrompt(true);
            }}
            disabled={templateSaved}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: '14px',
              borderRadius: 9999,
              border: templateSaved ? 'none' : '1px solid rgba(255,255,255,0.2)',
              background: templateSaved ? 'rgba(200, 241, 53, 0.15)' : 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: templateSaved ? 'var(--lime)' : 'white',
              fontWeight: 700,
              fontSize: 15,
              fontFamily: 'inherit',
              cursor: templateSaved ? 'default' : 'pointer',
              marginTop: 10,
              transition: 'all 0.2s ease',
              opacity: templateSaved ? 0.9 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {templateSaved ? (
              <span>Template Saved! ✓</span>
            ) : (
              <>
                <SaveFilledIcon size={18} color="white" />
                <span>Save as Template</span>
              </>
            )}
          </button>
        </div>
      )}
      {/* ─── Templates Drawer/Overlay ─── */}
      {showTemplates && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#F8FAFC', // Slate 50 background for clean light look
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            animation: 'fadeIn 0.2s ease-out forwards',
            maxWidth: 390,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Workout Templates</h2>
            <button
              onClick={() => setShowTemplates(false)}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: 'none',
                background: 'white',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth={2.5} strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Active Split Days Section */}
          {activeSplit && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Active Split Days ({activeSplit.name})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeSplit.days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadSplitDay(day)}
                    className="card card-hover"
                    style={{
                      padding: '14px 16px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', border: 'none',
                      background: 'white',
                      fontFamily: 'inherit', textAlign: 'left', width: '100%',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700 }}>{day.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {day.exerciseIds.length} exercises · {(day.supersets || []).length} supersets
                      </p>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            Saved Templates
          </h3>

          {templates.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
              <div style={{ marginBottom: 16, color: '#94a3b8' }}>
                <ClipboardFilledIcon size={64} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No templates yet</h3>
              <p className="text-secondary" style={{ fontSize: 14 }}>Save a workout as a template to reuse it</p>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 40 }}>
              {templates.map(tmpl => (
                <div
                  key={tmpl.id}
                  className="card card-hover"
                  style={{ cursor: 'pointer', padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}
                  onClick={() => handleLoadTemplate(tmpl)}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tmpl.name}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {tmpl.exercises.length} exercises · {tmpl.lastUsed ? `Last used: ${new Date(tmpl.lastUsed).toLocaleDateString()}` : 'Never used'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(tmpl.id);
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ef4444',
                      flexShrink: 0
                    }}
                    aria-label="Delete template"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Save Template Prompt Modal ─── */}
      {showSaveTemplatePrompt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            zIndex: 11000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 320,
              textAlign: 'left',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>Save Template</h3>
            <p className="text-secondary" style={{ fontSize: 13, marginBottom: 16 }}>Enter a name to save this workout structure for future logs.</p>
            <input
              type="text"
              value={saveAsTemplateName}
              onChange={(e) => setSaveAsTemplateName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && saveAsTemplateName.trim()) handleSaveAsTemplate(); }}
              placeholder="Template Name"
              autoFocus
              className="input-field"
              style={{ marginBottom: 20, width: '100%' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowSaveTemplatePrompt(false)}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 9999,
                  border: '1px solid var(--border-light)',
                  background: 'white',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'inherit',
                }}>
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                disabled={!saveAsTemplateName.trim() || templateSaving}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 9999,
                  border: 'none',
                  background: 'var(--lime)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  opacity: saveAsTemplateName.trim() ? 1 : 0.5
                }}
              >
                {templateSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── Gym-Friendly Quick Log Bottom Sheet ─── */}
      {logSheet && (() => {
        const exDef = EXERCISES.find(e => e.id === logSheet.exerciseId) || { name: 'Exercise' };
        
        return (
          <div
            onClick={() => setLogSheet(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              animation: 'fadeIn 0.2s ease-out forwards',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                padding: '24px 20px 34px',
                width: '100%',
                maxWidth: 390,
                boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border-light)', margin: '0 auto 20px' }} />

              <h3 style={{ fontSize: 18, fontWeight: 900, textAlign: 'center', marginBottom: 24, color: 'var(--text-primary)' }}>
                {exDef.name}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                {/* Weight Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                    Weight ({weightUnit})
                  </span>
                  
                  <button
                    onPointerDown={() => handlePointerDown('up', 'weight')}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                      width: 56, height: 44, border: 'none', background: 'var(--input-bg)',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ▲
                  </button>

                  <input
                    type="number"
                    step="0.1"
                    value={logSheet.weight === 0 ? '' : logSheet.weight}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setLogSheet(prev => prev ? { ...prev, weight: isNaN(val) ? 0 : val } : null);
                    }}
                    style={{
                      fontSize: 40, fontWeight: 800, textAlign: 'center', border: 'none',
                      outline: 'none', width: '100%', margin: '12px 0', fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                    }}
                  />

                  <button
                    onPointerDown={() => handlePointerDown('down', 'weight')}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                      width: 56, height: 44, border: 'none', background: 'var(--input-bg)',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ▼
                  </button>

                  <button
                    onClick={() => setShowPlateCalc(true)}
                    style={{
                      border: 'none', background: 'none', color: '#0891b2', fontSize: 12,
                      fontWeight: 700, marginTop: 14, cursor: 'pointer', display: 'flex',
                      alignItems: 'center', gap: 4, fontFamily: 'inherit',
                    }}
                  >
                    Plates Breakdown
                  </button>
                </div>

                {/* Reps Column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                    Reps
                  </span>
                  
                  <button
                    onPointerDown={() => handlePointerDown('up', 'reps')}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                      width: 56, height: 44, border: 'none', background: 'var(--input-bg)',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ▲
                  </button>

                  <input
                    type="number"
                    value={logSheet.reps === 0 ? '' : logSheet.reps}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setLogSheet(prev => prev ? { ...prev, reps: isNaN(val) ? 0 : val } : null);
                    }}
                    style={{
                      fontSize: 40, fontWeight: 800, textAlign: 'center', border: 'none',
                      outline: 'none', width: '100%', margin: '12px 0', fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                    }}
                  />

                  <button
                    onPointerDown={() => handlePointerDown('down', 'reps')}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                      width: 56, height: 44, border: 'none', background: 'var(--input-bg)',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)', fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>

              <button
                onClick={() => setLogSheet(null)}
                style={{
                  width: '100%', border: 'none', background: 'none', color: '#ef4444',
                  fontWeight: 700, fontSize: 14, marginBottom: 14, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => logSetFromSheet(logSheet.exerciseId, logSheet.setIndex, logSheet.weight, logSheet.reps, !!logSheet.isBuddy)}
                style={{
                  width: '100%', height: 56, borderRadius: 9999, border: 'none',
                  background: 'var(--lime)', color: 'var(--text-primary)', fontWeight: 800,
                  fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 8px 24px rgba(200,241,53,0.3)',
                }}
              >
                Log Set ✓
              </button>
            </div>
          </div>
        );
      })()}

      {/* ─── Plate Calculator Overlay Modal ─── */}
      {showPlateCalc && logSheet && (() => {
        const targetWeight = logSheet.weight;
        const plateBreakdown = calculatePlates(targetWeight, barbellWeight);
        
        return (
          <div
            onClick={() => setShowPlateCalc(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, animation: 'fadeIn 0.2s ease-out forwards',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white', borderRadius: 24, padding: 24,
                width: '100%', maxWidth: 320, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                boxSizing: 'border-box',
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, color: 'var(--text-primary)' }}>
                Plate Calculator
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Breakdown of plates needed per side of the bar.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Barbell Weight</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    value={barbellWeight === 0 ? '' : barbellWeight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setBarbellWeight(isNaN(val) ? 0 : val);
                    }}
                    style={{
                      width: 60, height: 36, borderRadius: 10, border: '1px solid var(--border-light)',
                      textAlign: 'center', fontWeight: 700, fontSize: 14, outline: 'none',
                      background: 'var(--input-bg)', color: 'var(--text-primary)',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{weightUnit}</span>
                </div>
              </div>

              <div style={{
                background: 'var(--input-bg)', borderRadius: 16, padding: 16,
                marginBottom: 24, textAlign: 'center', border: '1px solid var(--border-light)',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                  Target: {targetWeight}{weightUnit}
                </p>
                
                {plateBreakdown.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Each Side:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                      {plateBreakdown.map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 10px', borderRadius: 8, background: 'white',
                            border: '1px solid var(--border-light)', fontSize: 12,
                            fontWeight: 700, color: 'var(--text-primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                          }}
                        >
                          {item.count}× {item.plate}kg
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', margin: '8px 0' }}>
                    Weight is less than barbell weight!
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowPlateCalc(false)}
                style={{
                  width: '100%', height: 48, borderRadius: 9999, border: 'none',
                  background: 'var(--text-primary)', color: 'white', fontWeight: 800,
                  fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Close Calculator
              </button>
            </div>
          </div>
        );
      })()}

      {/* ─── Long Press Set Actions Menu ─── */}
      {longPressedSet && (
        <div
          onClick={() => setLongPressedSet(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 5000,
            background: 'transparent',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: Math.min(longPressedSet.y, typeof window !== 'undefined' ? window.innerHeight - 120 : longPressedSet.y),
              left: Math.min(longPressedSet.x, typeof window !== 'undefined' ? window.innerWidth - 160 : longPressedSet.x),
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-light)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 5001,
              width: 140,
              animation: 'fadeIn 0.15s ease-out forwards',
            }}
          >
            <button
              onClick={() => startEditSetFromMenu(longPressedSet.exerciseId, longPressedSet.setIndex, !!longPressedSet.isBuddy)}
              style={{
                padding: '10px 12px', background: 'none', border: 'none',
                textAlign: 'left', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)',
                borderRadius: 10,
              }}
            >
              Edit Set
            </button>
            <button
              onClick={() => deleteSetAtIndex(longPressedSet.exerciseId, longPressedSet.setIndex, !!longPressedSet.isBuddy)}
              style={{
                padding: '10px 12px', background: 'none', border: 'none',
                textAlign: 'left', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', color: '#ef4444',
                borderRadius: 10,
              }}
            >
              Delete Set
            </button>
          </div>
        </div>
      )}

      {/* ─── Add Superset Modal Overlay (Log Page) ─── */}
      {showAddSupersetModal && (
        <div
          onClick={() => setShowAddSupersetModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, animation: 'fadeIn 0.2s ease-out forwards',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 24, padding: 24,
              width: '100%', maxWidth: 340, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              maxHeight: '80dvh', display: 'flex', flexDirection: 'column',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <LinkIcon size={18} color="var(--text-primary)" /> Link Superset
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Select exactly 2 exercises from your current list to pair them.
            </p>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, paddingRight: 4 }}>
              {addedExercises.map(ex => {
                const isChosen = selectedSupersetExercises.includes(ex.exerciseId);
                const isAlreadyInAnotherSuperset = supersets.some(ss => ss.includes(ex.exerciseId));
                return (
                  <button
                    key={ex.exerciseId}
                    disabled={isAlreadyInAnotherSuperset}
                    onClick={() => {
                      if (isChosen) {
                        setSelectedSupersetExercises(prev => prev.filter(id => id !== ex.exerciseId));
                      } else {
                        if (selectedSupersetExercises.length >= 2) return;
                        setSelectedSupersetExercises(prev => [...prev, ex.exerciseId]);
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderRadius: 14, border: isChosen ? '2px solid #06b6d4' : '1px solid var(--border-light)',
                      background: isChosen ? 'rgba(6,182,212,0.04)' : (isAlreadyInAnotherSuperset ? 'var(--input-bg)' : 'white'),
                      opacity: isAlreadyInAnotherSuperset ? 0.5 : 1,
                      cursor: isAlreadyInAnotherSuperset ? 'default' : 'pointer',
                      fontFamily: 'inherit', textAlign: 'left', width: '100%',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      border: '2px solid ' + (isChosen ? '#06b6d4' : 'var(--border-light)'),
                      background: isChosen ? '#06b6d4' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isChosen && <span style={{ color: 'white', fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{ex.exerciseName}</p>
                      {isAlreadyInAnotherSuperset && (
                        <p style={{ fontSize: 11, color: '#0891b2', fontWeight: 600 }}>Already in a superset</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowAddSupersetModal(false)}
                style={{
                  flex: 1, height: 48, borderRadius: 9999, border: '1px solid var(--border-light)',
                  background: 'white', color: 'var(--text-primary)', fontWeight: 700,
                  cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                disabled={selectedSupersetExercises.length !== 2}
                onClick={() => {
                  addSupersetOnLog(selectedSupersetExercises[0], selectedSupersetExercises[1]);
                  setShowAddSupersetModal(false);
                }}
                style={{
                  flex: 1, height: 48, borderRadius: 9999, border: 'none',
                  background: selectedSupersetExercises.length === 2 ? '#06b6d4' : 'var(--input-bg)',
                  color: selectedSupersetExercises.length === 2 ? 'white' : 'var(--text-secondary)',
                  fontWeight: 700, cursor: selectedSupersetExercises.length === 2 ? 'pointer' : 'default',
                  fontSize: 14, fontFamily: 'inherit',
                }}
              >
                Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Floating Rest Timer Pill ─── */}
      {restActive && restSeconds > 0 && !restExpanded && (
        <div
          onClick={() => setRestExpanded(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1500,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '10px 24px',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontSize: 14,
            animation: 'slideDown 0.3s ease-out',
            boxSizing: 'border-box',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Rest {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}</span>
        </div>
      )}

      {/* ─── Fullscreen Rest Timer Overlay ─── */}
      {restActive && restExpanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease-out forwards',
            color: 'white',
          }}
        >
          <button
            onClick={() => setRestExpanded(false)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
            Resting
          </p>

          <div style={{
            fontSize: 72,
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: 40,
            textShadow: '0 0 20px rgba(255,255,255,0.2)',
          }}>
            {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
            <button
              onClick={() => setRestSeconds(prev => Math.max(0, prev - 30))}
              style={{
                width: 72,
                height: 50,
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              -30s
            </button>
            <button
              onClick={() => setRestSeconds(prev => prev + 30)}
              style={{
                width: 72,
                height: 50,
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              +30s
            </button>
          </div>

          <button
            onClick={() => {
              setRestActive(false);
              setRestExpanded(false);
            }}
            style={{
              padding: '16px 40px',
              borderRadius: 9999,
              background: 'var(--lime)',
              color: 'var(--text-primary)',
              border: 'none',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(200, 241, 53, 0.3)',
            }}
          >
            Skip Rest
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function LogWorkoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>}>
      <LogWorkoutContent />
    </Suspense>
  );
}
