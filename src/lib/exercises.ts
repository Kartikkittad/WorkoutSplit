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
  /* ── PUSH (CHEST, SHOULDERS, TRICEPS) ── */
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'Push', emoji: '🏋️', defaultSets: 4, defaultReps: 8, color: '#FFE100' },
  { id: 'incline-barbell-press', name: 'Incline Barbell Bench Press', category: 'Push', emoji: '🏋️‍♂️', defaultSets: 4, defaultReps: 8, color: '#FFE100' },
  { id: 'decline-bench-press', name: 'Decline Barbell Bench Press', category: 'Push', emoji: '📉', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'flat-db-press', name: 'Flat Dumbbell Press', category: 'Push', emoji: ' Dumbbell ', defaultSets: 4, defaultReps: 10, color: '#FFE100' },
  { id: 'incline-db-press', name: 'Incline DB Press', category: 'Push', emoji: '🔥', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'chest-fly', name: 'Dumbbell Chest Fly', category: 'Push', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-crossover', name: 'Cable Crossover Fly', category: 'Push', emoji: '❌', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-low-to-high-fly', name: 'Cable Low-to-High Fly', category: 'Push', emoji: '↗️', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-high-to-low-fly', name: 'Cable High-to-Low Fly', category: 'Push', emoji: '↘️', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'pec-deck', name: 'Pec Deck Machine Fly', category: 'Push', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', category: 'Push', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'db-pullover', name: 'Dumbbell Pullover', category: 'Push', emoji: '📐', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'push-ups', name: 'Standard Push-Ups', category: 'Push', emoji: '🤸', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'diamond-pushups', name: 'Diamond Push-Ups', category: 'Push', emoji: '💎', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'landmine-press', name: 'Landmine Chest Press', category: 'Push', emoji: '💣', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  
  /* Shoulders */
  { id: 'overhead-press', name: 'Overhead Press (Barbell)', category: 'Push', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'seated-db-shoulder-press', name: 'Seated DB Shoulder Press', category: 'Push', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'arnold-press', name: 'Arnold Press', category: 'Push', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', category: 'Push', emoji: '⚙️', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Push', emoji: '🦅', defaultSets: 4, defaultReps: 15, color: '#FFE100' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'Push', emoji: '🎯', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'machine-lateral-raise', name: 'Machine Lateral Raise', category: 'Push', emoji: '🤖', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'front-raise', name: 'Front Dumbbell Raise', category: 'Push', emoji: '⬆️', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'barbell-upright-row', name: 'Barbell Upright Row', category: 'Push', emoji: '🏋️', defaultSets: 3, defaultReps: 12, color: '#FFE100' },

  /* Triceps */
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', category: 'Push', emoji: '🏋️', defaultSets: 3, defaultReps: 8, color: '#FFE100' },
  { id: 'tricep-pushdown', name: 'Tricep Rope Pushdown', category: 'Push', emoji: '💎', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'straight-bar-tricep-pushdown', name: 'Straight Bar Tricep Pushdown', category: 'Push', emoji: '💈', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'overhead-db-tricep-ext', name: 'Overhead DB Tricep Extension', category: 'Push', emoji: '🙌', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'overhead-cable-tricep-ext', name: 'Overhead Cable Tricep Extension', category: 'Push', emoji: '⚡', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'single-arm-overhead-cable-ext', name: 'Single-Arm Cable Tricep Extension', category: 'Push', emoji: '⚡', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'skull-crushers', name: 'Skull Crushers (EZ Bar)', category: 'Push', emoji: '💀', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'tricep-kickback', name: 'Cable Tricep Kickback', category: 'Push', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'bench-dips', name: 'Bench Dips', category: 'Push', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'dips', name: 'Parallel Bar Dips', category: 'Push', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'jm-press', name: 'JM Press (Barbell)', category: 'Push', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#FFE100' },

  /* ── PULL (BACK, BICEPS, REAR DELTS, TRAPS, FOREARMS) ── */
  { id: 'deadlift', name: 'Conventional Deadlift', category: 'Pull', emoji: '🏗️', defaultSets: 4, defaultReps: 5, color: '#FFB4C8' },
  { id: 'rack-pulls', name: 'Rack Pulls', category: 'Pull', emoji: '🧱', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'barbell-row', name: 'Bent-Over Barbell Row', category: 'Pull', emoji: '🚣', defaultSets: 4, defaultReps: 8, color: '#FFB4C8' },
  { id: 'pendlay-row', name: 'Pendlay Row', category: 'Pull', emoji: '💥', defaultSets: 3, defaultReps: 6, color: '#FFB4C8' },
  { id: 'yates-row', name: 'Underhand Yates Row', category: 'Pull', emoji: '🚣‍♂️', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'Pull', emoji: '🛶', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'single-arm-db-row', name: 'Single-Arm Dumbbell Row', category: 'Pull', emoji: '🏋️‍♂️', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'chest-supported-db-row', name: 'Chest Supported DB Row', category: 'Pull', emoji: '🛋️', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'seated-cable-row', name: 'Seated Cable Row (V-Bar)', category: 'Pull', emoji: '🚣', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'pull-up', name: 'Wide Grip Pull Up', category: 'Pull', emoji: '🧗', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'chin-up', name: 'Underhand Chin Up', category: 'Pull', emoji: '🧗‍♂️', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'lat-pulldown', name: 'Lat Pulldown (Wide Grip)', category: 'Pull', emoji: '🎯', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'neutral-lat-pulldown', name: 'Close Grip Lat Pulldown', category: 'Pull', emoji: '🔽', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'reverse-lat-pulldown', name: 'Underhand Lat Pulldown', category: 'Pull', emoji: '🔄', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Cable Pulldown', category: 'Pull', emoji: '📏', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },

  /* Rear Delts & Traps */
  { id: 'face-pull', name: 'Cable Face Pull', category: 'Pull', emoji: '🎭', defaultSets: 4, defaultReps: 15, color: '#FFB4C8' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck (Rear Delt)', category: 'Pull', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'db-rear-delt-fly', name: 'Bent-Over DB Rear Delt Fly', category: 'Pull', emoji: '🦇', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'shrugs', name: 'Dumbbell Shrugs', category: 'Pull', emoji: '🤷', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'barbell-shrugs', name: 'Barbell Shrugs', category: 'Pull', emoji: '🏋️', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },

  /* Biceps & Forearms */
  { id: 'bicep-curl', name: 'Barbell Bicep Curl', category: 'Pull', emoji: '💪', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Bicep Curl', category: 'Pull', emoji: '📐', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'hammer-curl', name: 'Dumbbell Hammer Curl', category: 'Pull', emoji: '🔨', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'cable-rope-hammer-curl', name: 'Cable Rope Hammer Curl', category: 'Pull', emoji: '🧶', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'preacher-curl', name: 'EZ Bar Preacher Curl', category: 'Pull', emoji: '🙏', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'concentration-curl', name: 'Concentration Curl', category: 'Pull', emoji: '🎯', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'cable-bicep-curl', name: 'Cable Bicep Curl', category: 'Pull', emoji: '🔌', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'spider-curl', name: 'Dumbbell Spider Curl', category: 'Pull', emoji: '🕷️', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'zottman-curl', name: 'Zottman Bicep Curl', category: 'Pull', emoji: '🔄', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'wrist-curls', name: 'Barbell Wrist Curls (Forearms)', category: 'Pull', emoji: '✊', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'reverse-wrist-curls', name: 'Barbell Reverse Wrist Curls', category: 'Pull', emoji: '🖐️', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'farmers-walk', name: 'Farmer\'s Carry / Walk', category: 'Pull', emoji: '🚜', defaultSets: 3, defaultReps: 45, color: '#FFB4C8' },

  /* ── LEGS (QUADS, HAMSTRINGS, GLUTES, CALVES) ── */
  { id: 'squat', name: 'Barbell Back Squat', category: 'Legs', emoji: '🦵', defaultSets: 4, defaultReps: 6, color: '#B4F0FF' },
  { id: 'front-squat', name: 'Front Squat (Barbell)', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 8, color: '#B4F0FF' },
  { id: 'goblet-squat', name: 'DB / Kettlebell Goblet Squat', category: 'Legs', emoji: '🍷', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'box-squat', name: 'Barbell Box Squat', category: 'Legs', emoji: '📦', defaultSets: 3, defaultReps: 8, color: '#B4F0FF' },
  { id: 'zercher-squat', name: 'Zercher Squat', category: 'Legs', emoji: '🏋️‍♂️', defaultSets: 3, defaultReps: 8, color: '#B4F0FF' },
  { id: 'leg-press', name: 'Leg Press Machine', category: 'Legs', emoji: '🦿', defaultSets: 4, defaultReps: 10, color: '#B4F0FF' },
  { id: 'hack-squat', name: 'Hack Squat Machine', category: 'Legs', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'leg-extension', name: 'Leg Extension Machine', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'lunges', name: 'Walking Dumbbell Lunges', category: 'Legs', emoji: '🚶', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'reverse-lunge', name: 'Barbell Reverse Lunge', category: 'Legs', emoji: '⬅️', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'Legs', emoji: '🔥', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  
  /* Hamstrings & Glutes */
  { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', category: 'Legs', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'stiff-leg-deadlift', name: 'Stiff-Legged Deadlift', category: 'Legs', emoji: '📏', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'lying-leg-curl', name: 'Lying Leg Curl Machine', category: 'Legs', emoji: '🔄', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl Machine', category: 'Legs', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'hip-thrust', name: 'Barbell Hip Thrust', category: 'Legs', emoji: '🍑', defaultSets: 4, defaultReps: 10, color: '#B4F0FF' },
  { id: 'glute-bridge', name: 'Bodyweight Glute Bridge', category: 'Legs', emoji: '🌉', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'cable-glute-kickback', name: 'Cable Glute Kickback', category: 'Legs', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'hip-abductor', name: 'Hip Abductor Machine', category: 'Legs', emoji: '↔️', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'hip-adductor', name: 'Hip Adductor Machine', category: 'Legs', emoji: '◀️▶️', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },

  /* Calves */
  { id: 'calf-raise', name: 'Standing Calf Raise', category: 'Legs', emoji: '🦶', defaultSets: 4, defaultReps: 15, color: '#B4F0FF' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'Legs', emoji: '🦶', defaultSets: 4, defaultReps: 15, color: '#B4F0FF' },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise', category: 'Legs', emoji: '🫏', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'tibialis-raise', name: 'Tibialis Raise (Shin)', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 20, color: '#B4F0FF' },

  /* ── ABS & CORE (UPPER ABS, LOWER ABS, OBLIQUES, DEEP CORE) ── */
  { id: 'cable-crunch', name: 'Kneeling Cable Crunch', category: 'Core', emoji: '🎯', defaultSets: 4, defaultReps: 15, color: '#E4B4FF' },
  { id: 'hanging-leg-raise', name: 'Hanging Straight Leg Raise', category: 'Core', emoji: '🦵', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'hanging-knee-raise', name: 'Hanging Knee Raise / Tuck', category: 'Core', emoji: '🦵', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'captains-chair-raise', name: 'Captain\'s Chair Leg Raise', category: 'Core', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'Core', emoji: '🎡', defaultSets: 3, defaultReps: 10, color: '#E4B4FF' },
  { id: 'russian-twist', name: 'Weighted Russian Twist', category: 'Core', emoji: '🌪️', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'decline-situp', name: 'Decline Weighted Sit-Up', category: 'Core', emoji: '📉', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', category: 'Core', emoji: '🚲', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'cable-woodchopper', name: 'Cable Woodchopper (Obliques)', category: 'Core', emoji: '🪓', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'db-side-bend', name: 'Dumbbell Side Bend', category: 'Core', emoji: '🔔', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'pallof-press', name: 'Cable Pallof Press', category: 'Core', emoji: '🛡️', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'plank', name: 'Elbow Plank (Hold)', category: 'Core', emoji: '🧘', defaultSets: 3, defaultReps: 60, color: '#E4B4FF' },
  { id: 'side-plank', name: 'Side Plank (Hold)', category: 'Core', emoji: '🧘‍♂️', defaultSets: 3, defaultReps: 45, color: '#E4B4FF' },
  { id: 'hollow-body-hold', name: 'Hollow Body Hold', category: 'Core', emoji: '🍌', defaultSets: 3, defaultReps: 45, color: '#E4B4FF' },
  { id: 'mountain-climbers', name: 'Mountain Climbers', category: 'Core', emoji: '🏔️', defaultSets: 3, defaultReps: 30, color: '#E4B4FF' },
  { id: 'flutter-kicks', name: 'Flutter Kicks', category: 'Core', emoji: '🏊', defaultSets: 3, defaultReps: 30, color: '#E4B4FF' },
  { id: 'v-ups', name: 'V-Ups (Jackknives)', category: 'Core', emoji: '✌️', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'deadbug', name: 'Deadbug', category: 'Core', emoji: '🪲', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'dragon-flag', name: 'Dragon Flag', category: 'Core', emoji: '🐉', defaultSets: 3, defaultReps: 8, color: '#E4B4FF' },
  { id: 'crunches', name: 'Floor Crunches', category: 'Core', emoji: '💪', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'back-extension', name: 'Hyperextension / Back Extension', category: 'Core', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'good-mornings', name: 'Barbell Good Mornings', category: 'Core', emoji: '☀️', defaultSets: 3, defaultReps: 10, color: '#E4B4FF' },

  /* ── CARDIO & CONDITIONING ── */
  { id: 'treadmill', name: 'Treadmill Run / Walk', category: 'Cardio', emoji: '🏃', defaultSets: 1, defaultReps: 20, color: '#FFD1B4' },
  { id: 'stairmaster', name: 'Stairmaster / Stair Climber', category: 'Cardio', emoji: '🪜', defaultSets: 1, defaultReps: 15, color: '#FFD1B4' },
  { id: 'rowing-machine', name: 'Rowing Machine (Erg)', category: 'Cardio', emoji: '🚣‍♂️', defaultSets: 1, defaultReps: 15, color: '#FFD1B4' },
  { id: 'assault-bike', name: 'Assault Bike / Air Bike', category: 'Cardio', emoji: '🚴', defaultSets: 1, defaultReps: 15, color: '#FFD1B4' },
  { id: 'elliptical', name: 'Elliptical Trainer', category: 'Cardio', emoji: '🏃‍♂️', defaultSets: 1, defaultReps: 20, color: '#FFD1B4' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'Cardio', emoji: '🪢', defaultSets: 3, defaultReps: 100, color: '#FFD1B4' },
  { id: 'kettlebell-swing', name: 'Kettlebell Swings', category: 'Cardio', emoji: '🔔', defaultSets: 3, defaultReps: 20, color: '#FFD1B4' },
  { id: 'sled-push', name: 'Prowler Sled Push / Pull', category: 'Cardio', emoji: '🛷', defaultSets: 3, defaultReps: 30, color: '#FFD1B4' },
  { id: 'battle-ropes', name: 'Battle Ropes Slam', category: 'Cardio', emoji: '🌊', defaultSets: 3, defaultReps: 30, color: '#FFD1B4' },
  { id: 'burpees', name: 'Burpees', category: 'Cardio', emoji: '🔥', defaultSets: 3, defaultReps: 15, color: '#FFD1B4' },
];

export const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Cardio'] as const;

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISES.find(e => e.id === id);
}

export function getExercisesByCategory(category: string): ExerciseDefinition[] {
  if (category === 'All') return EXERCISES;
  return EXERCISES.filter(e => e.category === category);
}

export function searchExercises(query: string, category: string = 'All'): ExerciseDefinition[] {
  let list = getExercisesByCategory(category);
  if (!query.trim()) return list;
  const q = query.toLowerCase().trim();
  return list.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );
}
