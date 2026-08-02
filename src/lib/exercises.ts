export interface ExerciseDefinition {
  id: string;
  name: string;
  category: 'Chest' | 'Shoulders' | 'Triceps' | 'Back' | 'Biceps' | 'Legs' | 'Glutes' | 'Core' | 'Forearms' | 'Cardio';
  emoji: string;
  defaultSets: number;
  defaultReps: number;
  color: string;
}

export const EXERCISES: ExerciseDefinition[] = [
  /* ── CHEST ── */
  { id: 'bench-press', name: 'Barbell Bench Press', category: 'Chest', emoji: '🏋️', defaultSets: 4, defaultReps: 8, color: '#FFE100' },
  { id: 'incline-barbell-press', name: 'Incline Barbell Bench Press', category: 'Chest', emoji: '🏋️‍♂️', defaultSets: 4, defaultReps: 8, color: '#FFE100' },
  { id: 'decline-bench-press', name: 'Decline Barbell Bench Press', category: 'Chest', emoji: '📉', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'flat-db-press', name: 'Flat Dumbbell Press', category: 'Chest', emoji: ' Dumbbell ', defaultSets: 4, defaultReps: 10, color: '#FFE100' },
  { id: 'incline-db-press', name: 'Incline DB Press', category: 'Chest', emoji: '🔥', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'chest-fly', name: 'Dumbbell Chest Fly', category: 'Chest', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-crossover', name: 'Cable Crossover Fly', category: 'Chest', emoji: '❌', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-low-to-high-fly', name: 'Cable Low-to-High Fly', category: 'Chest', emoji: '↗️', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'cable-high-to-low-fly', name: 'Cable High-to-Low Fly', category: 'Chest', emoji: '↘️', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'pec-deck', name: 'Pec Deck Machine Fly', category: 'Chest', emoji: '🦋', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', category: 'Chest', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'db-pullover', name: 'Dumbbell Pullover', category: 'Chest', emoji: '📐', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'push-ups', name: 'Standard Push-Ups', category: 'Chest', emoji: '🤸', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'diamond-pushups', name: 'Diamond Push-Ups', category: 'Chest', emoji: '💎', defaultSets: 3, defaultReps: 12, color: '#FFE100' },
  { id: 'landmine-press', name: 'Landmine Chest Press', category: 'Chest', emoji: '💣', defaultSets: 3, defaultReps: 10, color: '#FFE100' },
  { id: 'svend-press', name: 'Svend Press', category: 'Chest', emoji: '🍽️', defaultSets: 3, defaultReps: 15, color: '#FFE100' },
  { id: 'floor-press', name: 'Barbell Floor Press', category: 'Chest', emoji: '🛌', defaultSets: 3, defaultReps: 8, color: '#FFE100' },

  /* ── SHOULDERS ── */
  { id: 'overhead-press', name: 'Overhead Press (Barbell)', category: 'Shoulders', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#FF9F43' },
  { id: 'seated-db-shoulder-press', name: 'Seated DB Shoulder Press', category: 'Shoulders', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#FF9F43' },
  { id: 'arnold-press', name: 'Arnold Press', category: 'Shoulders', emoji: '🤖', defaultSets: 3, defaultReps: 10, color: '#FF9F43' },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', category: 'Shoulders', emoji: '⚙️', defaultSets: 3, defaultReps: 10, color: '#FF9F43' },
  { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', emoji: '🦅', defaultSets: 4, defaultReps: 15, color: '#FF9F43' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', category: 'Shoulders', emoji: '🎯', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'machine-lateral-raise', name: 'Machine Lateral Raise', category: 'Shoulders', emoji: '🤖', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'front-raise', name: 'Front Dumbbell Raise', category: 'Shoulders', emoji: '⬆️', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'barbell-upright-row', name: 'Barbell Upright Row', category: 'Shoulders', emoji: '🏋️', defaultSets: 3, defaultReps: 12, color: '#FF9F43' },
  { id: 'face-pull', name: 'Cable Face Pull', category: 'Shoulders', emoji: '🎭', defaultSets: 4, defaultReps: 15, color: '#FF9F43' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck (Rear Delt)', category: 'Shoulders', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'db-rear-delt-fly', name: 'Bent-Over DB Rear Delt Fly', category: 'Shoulders', emoji: '🦇', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'plate-front-raise', name: 'Plate Front Raise', category: 'Shoulders', emoji: '🍽️', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'cable-rear-delt-fly', name: 'Cable Rear Delt Fly', category: 'Shoulders', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'seated-lateral-raise', name: 'Seated Dumbbell Lateral Raise', category: 'Shoulders', emoji: '🪑', defaultSets: 3, defaultReps: 15, color: '#FF9F43' },
  { id: 'behind-the-neck-press', name: 'Smith Machine Behind Neck Press', category: 'Shoulders', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#FF9F43' },
  { id: 'lu-raise', name: 'Lu Raise / Y-Raise', category: 'Shoulders', emoji: '🙌', defaultSets: 3, defaultReps: 12, color: '#FF9F43' },

  /* ── TRICEPS ── */
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', category: 'Triceps', emoji: '🏋️', defaultSets: 3, defaultReps: 8, color: '#FECA57' },
  { id: 'tricep-pushdown', name: 'Tricep Rope Pushdown', category: 'Triceps', emoji: '💎', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'straight-bar-tricep-pushdown', name: 'Straight Bar Tricep Pushdown', category: 'Triceps', emoji: '💈', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'overhead-db-tricep-ext', name: 'Overhead DB Tricep Extension', category: 'Triceps', emoji: '🙌', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'overhead-cable-tricep-ext', name: 'Overhead Cable Tricep Extension', category: 'Triceps', emoji: '⚡', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'single-arm-overhead-cable-ext', name: 'Single-Arm Cable Tricep Extension', category: 'Triceps', emoji: '⚡', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'skull-crushers', name: 'Skull Crushers (EZ Bar)', category: 'Triceps', emoji: '💀', defaultSets: 3, defaultReps: 10, color: '#FECA57' },
  { id: 'tricep-kickback', name: 'Cable Tricep Kickback', category: 'Triceps', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#FECA57' },
  { id: 'bench-dips', name: 'Bench Dips', category: 'Triceps', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#FECA57' },
  { id: 'dips', name: 'Parallel Bar Dips', category: 'Triceps', emoji: '💪', defaultSets: 3, defaultReps: 10, color: '#FECA57' },
  { id: 'jm-press', name: 'JM Press (Barbell)', category: 'Triceps', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#FECA57' },

  /* ── BACK ── */
  { id: 'deadlift', name: 'Conventional Deadlift', category: 'Back', emoji: '🏗️', defaultSets: 4, defaultReps: 5, color: '#FFB4C8' },
  { id: 'rack-pulls', name: 'Rack Pulls', category: 'Back', emoji: '🧱', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'barbell-row', name: 'Bent-Over Barbell Row', category: 'Back', emoji: '🚣', defaultSets: 4, defaultReps: 8, color: '#FFB4C8' },
  { id: 'pendlay-row', name: 'Pendlay Row', category: 'Back', emoji: '💥', defaultSets: 3, defaultReps: 6, color: '#FFB4C8' },
  { id: 'yates-row', name: 'Underhand Yates Row', category: 'Back', emoji: '🚣‍♂️', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 't-bar-row', name: 'T-Bar Row', category: 'Back', emoji: '🛶', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'single-arm-db-row', name: 'Single-Arm Dumbbell Row', category: 'Back', emoji: '🏋️‍♂️', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'chest-supported-db-row', name: 'Chest Supported DB Row', category: 'Back', emoji: '🛋️', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'seated-cable-row', name: 'Seated Cable Row (V-Bar)', category: 'Back', emoji: '🚣', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'pull-up', name: 'Wide Grip Pull Up', category: 'Back', emoji: '🧗', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'chin-up', name: 'Underhand Chin Up', category: 'Back', emoji: '🧗‍♂️', defaultSets: 3, defaultReps: 8, color: '#FFB4C8' },
  { id: 'lat-pulldown', name: 'Lat Pulldown (Wide Grip)', category: 'Back', emoji: '🎯', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'neutral-lat-pulldown', name: 'Close Grip Lat Pulldown', category: 'Back', emoji: '🔽', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'reverse-lat-pulldown', name: 'Underhand Lat Pulldown', category: 'Back', emoji: '🔄', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Cable Pulldown', category: 'Back', emoji: '📏', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'shrugs', name: 'Dumbbell Shrugs', category: 'Back', emoji: '🤷', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'barbell-shrugs', name: 'Barbell Shrugs', category: 'Back', emoji: '🏋️', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'back-extension', name: 'Hyperextension / Back Extension', category: 'Back', emoji: '🦅', defaultSets: 3, defaultReps: 15, color: '#FFB4C8' },
  { id: 'good-mornings', name: 'Barbell Good Mornings', category: 'Back', emoji: '☀️', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'meadows-row', name: 'Meadows Row', category: 'Back', emoji: '🚣', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'seal-row', name: 'Seal Row', category: 'Back', emoji: '🦭', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },
  { id: 'machine-row', name: 'Machine Row', category: 'Back', emoji: '🤖', defaultSets: 3, defaultReps: 12, color: '#FFB4C8' },
  { id: 'inverted-row', name: 'Inverted Row / Australian Pull-Up', category: 'Back', emoji: '🔄', defaultSets: 3, defaultReps: 10, color: '#FFB4C8' },

  /* ── BICEPS ── */
  { id: 'bicep-curl', name: 'Barbell Bicep Curl', category: 'Biceps', emoji: '💪', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'incline-db-curl', name: 'Incline Dumbbell Bicep Curl', category: 'Biceps', emoji: '📐', defaultSets: 3, defaultReps: 10, color: '#FF6B6B' },
  { id: 'hammer-curl', name: 'Dumbbell Hammer Curl', category: 'Biceps', emoji: '🔨', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'cable-rope-hammer-curl', name: 'Cable Rope Hammer Curl', category: 'Biceps', emoji: '🧶', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'preacher-curl', name: 'EZ Bar Preacher Curl', category: 'Biceps', emoji: '🙏', defaultSets: 3, defaultReps: 10, color: '#FF6B6B' },
  { id: 'concentration-curl', name: 'Concentration Curl', category: 'Biceps', emoji: '🎯', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'cable-bicep-curl', name: 'Cable Bicep Curl', category: 'Biceps', emoji: '🔌', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'spider-curl', name: 'Dumbbell Spider Curl', category: 'Biceps', emoji: '🕷️', defaultSets: 3, defaultReps: 10, color: '#FF6B6B' },
  { id: 'zottman-curl', name: 'Zottman Bicep Curl', category: 'Biceps', emoji: '🔄', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'machine-preacher-curl', name: 'Machine Preacher Curl', category: 'Biceps', emoji: '🤖', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'drag-curl', name: 'Barbell Drag Curl', category: 'Biceps', emoji: '🏋️', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'bayesian-curl', name: 'Cable Bayesian Curl', category: 'Biceps', emoji: '⚡', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },
  { id: 'cross-body-curl', name: 'Cross Body Hammer Curl', category: 'Biceps', emoji: '🔨', defaultSets: 3, defaultReps: 12, color: '#FF6B6B' },

  /* ── LEGS ── */
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
  { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', category: 'Legs', emoji: '🏋️', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'stiff-leg-deadlift', name: 'Stiff-Legged Deadlift', category: 'Legs', emoji: '📏', defaultSets: 3, defaultReps: 10, color: '#B4F0FF' },
  { id: 'lying-leg-curl', name: 'Lying Leg Curl Machine', category: 'Legs', emoji: '🔄', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl Machine', category: 'Legs', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#B4F0FF' },
  { id: 'calf-raise', name: 'Standing Calf Raise', category: 'Legs', emoji: '🦶', defaultSets: 4, defaultReps: 15, color: '#B4F0FF' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', category: 'Legs', emoji: '🦶', defaultSets: 4, defaultReps: 15, color: '#B4F0FF' },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise', category: 'Legs', emoji: '🫏', defaultSets: 3, defaultReps: 15, color: '#B4F0FF' },
  { id: 'tibialis-raise', name: 'Tibialis Raise (Shin)', category: 'Legs', emoji: '🦵', defaultSets: 3, defaultReps: 20, color: '#B4F0FF' },

  /* ── GLUTES ── */
  { id: 'hip-thrust', name: 'Barbell Hip Thrust', category: 'Glutes', emoji: '🍑', defaultSets: 4, defaultReps: 10, color: '#A29BFE' },
  { id: 'glute-bridge', name: 'Bodyweight Glute Bridge', category: 'Glutes', emoji: '🌉', defaultSets: 3, defaultReps: 15, color: '#A29BFE' },
  { id: 'cable-glute-kickback', name: 'Cable Glute Kickback', category: 'Glutes', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#A29BFE' },
  { id: 'hip-abductor', name: 'Hip Abductor Machine', category: 'Glutes', emoji: '↔️', defaultSets: 3, defaultReps: 15, color: '#A29BFE' },
  { id: 'hip-adductor', name: 'Hip Adductor Machine', category: 'Glutes', emoji: '◀️▶️', defaultSets: 3, defaultReps: 15, color: '#A29BFE' },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', category: 'Glutes', emoji: '🏋️', defaultSets: 3, defaultReps: 5, color: '#A29BFE' },
  { id: 'smith-hip-thrust', name: 'Smith Machine Hip Thrust', category: 'Glutes', emoji: '🍑', defaultSets: 4, defaultReps: 10, color: '#A29BFE' },
  { id: 'frog-pumps', name: 'Frog Pumps', category: 'Glutes', emoji: '🐸', defaultSets: 3, defaultReps: 20, color: '#A29BFE' },
  { id: 'single-leg-hip-thrust', name: 'Single Leg Hip Thrust', category: 'Glutes', emoji: '🍑', defaultSets: 3, defaultReps: 12, color: '#A29BFE' },
  { id: 'step-ups', name: 'Dumbbell Step Ups', category: 'Glutes', emoji: '🪜', defaultSets: 3, defaultReps: 10, color: '#A29BFE' },
  { id: 'curtsy-lunge', name: 'Curtsy Lunge', category: 'Glutes', emoji: '💃', defaultSets: 3, defaultReps: 12, color: '#A29BFE' },
  { id: 'cable-pull-through', name: 'Cable Pull Through', category: 'Glutes', emoji: '⚡', defaultSets: 3, defaultReps: 15, color: '#A29BFE' },

  /* ── CORE ── */
  { id: 'cable-crunch', name: 'Kneeling Cable Crunch', category: 'Core', emoji: '🎯', defaultSets: 4, defaultReps: 15, color: '#E4B4FF' },
  { id: 'hanging-leg-raise', name: 'Hanging Straight Leg Raise', category: 'Core', emoji: '🦵', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'hanging-knee-raise', name: 'Hanging Knee Raise / Tuck', category: 'Core', emoji: '🦵', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'captains-chair-raise', name: 'Captain\'s Chair Leg Raise', category: 'Core', emoji: '🪑', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'Core', emoji: '🎡', defaultSets: 3, defaultReps: 10, color: '#E4B4FF' },
  { id: 'russian-twist', name: 'Weighted Russian Twist', category: 'Core', emoji: '🌪️', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'decline-situp', name: 'Decline Weighted Sit-Up', category: 'Core', emoji: '📉', defaultSets: 3, defaultReps: 15, color: '#E4B4FF' },
  { id: 'bicycle-crunches', name: 'Bicycle Crunches', category: 'Core', emoji: '🚲', defaultSets: 3, defaultReps: 20, color: '#E4B4FF' },
  { id: 'cable-woodchopper', name: 'Cable Woodchopper (Obliques)', category: 'Core', emoji: '🪓', defaultSets: 3, defaultReps: 12, color: '#E4B4FF' },
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

  /* ── FOREARMS ── */
  { id: 'wrist-curls', name: 'Barbell Wrist Curls (Forearms)', category: 'Forearms', emoji: '✊', defaultSets: 3, defaultReps: 15, color: '#78E08F' },
  { id: 'reverse-wrist-curls', name: 'Barbell Reverse Wrist Curls', category: 'Forearms', emoji: '🖐️', defaultSets: 3, defaultReps: 15, color: '#78E08F' },
  { id: 'farmers-walk', name: 'Farmer\'s Carry / Walk', category: 'Forearms', emoji: '🚜', defaultSets: 3, defaultReps: 45, color: '#78E08F' },
  { id: 'plate-pinch', name: 'Plate Pinch Hold', category: 'Forearms', emoji: '🍽️', defaultSets: 3, defaultReps: 30, color: '#78E08F' },
  { id: 'dead-hang', name: 'Dead Hang', category: 'Forearms', emoji: '🧗', defaultSets: 3, defaultReps: 60, color: '#78E08F' },
  { id: 'towel-hang', name: 'Towel Hang', category: 'Forearms', emoji: '🧖', defaultSets: 3, defaultReps: 30, color: '#78E08F' },
  { id: 'finger-curls', name: 'Finger Curls', category: 'Forearms', emoji: '🖐️', defaultSets: 3, defaultReps: 15, color: '#78E08F' },
  { id: 'behind-back-wrist-curl', name: 'Behind the Back Wrist Curl', category: 'Forearms', emoji: '✊', defaultSets: 3, defaultReps: 15, color: '#78E08F' },
  { id: 'gripper', name: 'Hand Gripper', category: 'Forearms', emoji: '✊', defaultSets: 3, defaultReps: 15, color: '#78E08F' },
  { id: 'fat-grip-hold', name: 'Fat Grip Dumbbell Hold', category: 'Forearms', emoji: '🏋️', defaultSets: 3, defaultReps: 30, color: '#78E08F' },
  { id: 'wrist-roller', name: 'Wrist Roller', category: 'Forearms', emoji: '🗞️', defaultSets: 3, defaultReps: 3, color: '#78E08F' },

  /* ── CARDIO ── */
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

export const CATEGORIES = ['All', 'Chest', 'Shoulders', 'Triceps', 'Back', 'Biceps', 'Legs', 'Glutes', 'Core', 'Forearms', 'Cardio'] as const;

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
