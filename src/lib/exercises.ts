export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core' | 'Cardio';
  emoji: string;
  defaultSets: number;
  defaultReps: number;
  color: string;
}

export const EXERCISES: ExerciseDefinition[] = [
  { id: 'bench-press', name: 'Bench Press', category: 'Push', emoji: '🏋️', defaultSets: 4, defaultReps: 8, color: '#C8F135' },
  { id: 'overhead-press', name: 'Overhead Press', category: 'Push', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#C8F135' },
  { id: 'incline-db-press', name: 'Incline DB Press', category: 'Push', emoji: '🔥', defaultSets: 3, defaultReps: 10, color: '#C8F135' },
  { id: 'chest-fly', name: 'Chest Fly', category: 'Push', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#C8F135' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'Push', emoji: '💎', defaultSets: 3, defaultReps: 12, color: '#C8F135' },
  { id: 'lateral-raise', name: 'Lateral Raise', category: 'Push', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#C8F135' },
  { id: 'dips', name: 'Dips', category: 'Push', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#C8F135' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', category: 'Push', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#C8F135' },
  { id: 'pec-deck', name: 'Pec Deck', category: 'Push', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#C8F135' },
  { id: 'skull-crushers', name: 'Skull Crushers', category: 'Push', emoji: '💀', defaultSets: 3, defaultReps: 10, color: '#C8F135' },
  { id: 'front-raise', name: 'Front Raise', category: 'Push', emoji: '⬆️', defaultSets: 3, defaultReps: 15, color: '#C8F135' },
  { id: 'close-grip-bench', name: 'Close Grip Bench', category: 'Push', emoji: '🏋️', defaultSets: 3, defaultReps: 8, color: '#C8F135' },
  
  { id: 'deadlift', name: 'Deadlift', category: 'Pull', emoji: '🏗️', defaultSets: 4, defaultReps: 5, color: '#FFB4C8' },
  { id: 'barbell-row', name: 'Barbell Row', category: 'Pull', emoji: '🚣', defaultSets: 4, defaultReps: 8, color: '#FFB4C8' },
  { id: 'pull-up', name: 'Pull Up', category: 'Pull', emoji: '🧗', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', category: 'Pull', emoji: '🎯', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'bicep-curl', name: 'Bicep Curl', category: 'Pull', emoji: '💪', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'face-pull', name: 'Face Pull', category: 'Pull', emoji: '🎭', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'Pull', emoji: '🚣', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'Pull', emoji: '🛶', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'hammer-curl', name: 'Hammer Curl', category: 'Pull', emoji: '🔨', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'preacher-curl', name: 'Preacher Curl', category: 'Pull', emoji: '🙏', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'shrugs', name: 'Dumbbell Shrugs', category: 'Pull', emoji: '🤷', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', category: 'Pull', emoji: '📏', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  
  { id: 'squat', name: 'Squat', category: 'Legs', emoji: '🦵', defaultSets: 4, defaultReps: 6, color: '#B4F0FF' },
  { id: 'leg-press', name: 'Leg Press', category: 'Legs', emoji: '🦿', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'Legs', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'leg-curl', name: 'Leg Curl', category: 'Legs', emoji: '🔄', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'calf-raise', name: 'Calf Raise', category: 'Legs', emoji: '🦶', defaultSets: 4, defaultReps: 15, color: '#B4F0FF' },
  { id: 'front-squat', name: 'Front Squat', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 8, color: '#B4F0FF' },
  { id: 'hack-squat', name: 'Hack Squat', category: 'Legs', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'lunges', name: 'Walking Lunges', category: 'Legs', emoji: '🚶', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'Legs', emoji: '🔥', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'leg-extension', name: 'Leg Extension', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'hip-thrust', name: 'Hip Thrust', category: 'Legs', emoji: '🍑', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  
  { id: 'plank', name: 'Plank', category: 'Core', emoji: '🧘', defaultSets: 3, defaultReps: 60, color: '#E4B4FF' },
  { id: 'cable-crunch', name: 'Cable Crunch', category: 'Core', emoji: '🎯', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', category: 'Core', emoji: '🦵', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'Core', emoji: '🎡', defaultSets: 3, defaultReps: 10, color: '#E4B4FF' },
  { id: 'russian-twist', name: 'Russian Twist', category: 'Core', emoji: '🌪️', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'crunches', name: 'Crunches', category: 'Core', emoji: '💪', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'back-extension', name: 'Back Extension', category: 'Core', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' }
];

export const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core'] as const;

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISES.find(e => e.id === id);
}

export function getExercisesByCategory(category: string): ExerciseDefinition[] {
  if (category === 'All') return EXERCISES;
  return EXERCISES.filter(e => e.category === category);
}
