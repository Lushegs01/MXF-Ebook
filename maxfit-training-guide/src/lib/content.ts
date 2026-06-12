/**
 * Static content catalog for the app: exercises, workouts, categories and
 * nutrition plans. This is editorial content (not user data), so it lives in
 * code rather than Firestore. User-specific data (weight logs, completed
 * workouts, profile) lives in Firestore via src/lib/db.ts.
 */

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Exercise {
  id: string;
  name: string;
  target: string;
  difficulty: Difficulty;
  sets: number;
  reps: string;
  rest: number; // seconds
  image: string;
  instructions: string[];
  commonMistake: string;
}

export interface Workout {
  id: string;
  title: string;
  categoryId: string;
  duration: number; // minutes
  intensity: Difficulty;
  image: string;
  exerciseIds: string[];
}

export interface Category {
  id: string;
  title: string;
  image: string;
}

export interface Meal {
  name: string;
  calories: number;
  items: string[];
}

export interface NutritionPlan {
  id: string;
  title: string;
  calories: number;
  image: string;
  description: string;
  macros: { protein: number; carbs: number; fat: number }; // grams
  meals: Meal[];
}

// Reuse a small set of known-good images so nothing renders broken.
const IMG = {
  chest: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  muscle: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  fatLoss: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  cardio: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop',
  legs: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
  mealProtein: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
  mealLean: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
};

const EXERCISE_LIST: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    target: 'Chest, Triceps',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    rest: 90,
    image: IMG.chest,
    instructions: [
      'Lie flat on the bench with your eyes under the bar and feet planted.',
      'Grip the bar slightly wider than shoulder-width and unrack it.',
      'Lower the bar to mid-chest, then press back up until arms are straight.',
    ],
    commonMistake: 'Flaring the elbows out to 90°. Keep them tucked at roughly 45° to protect the shoulders.',
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    target: 'Upper Chest, Shoulders',
    difficulty: 'Intermediate',
    sets: 3,
    reps: '10-12',
    rest: 60,
    image: IMG.muscle,
    instructions: [
      'Set the bench to a 30-45° incline and sit back with a dumbbell in each hand.',
      'Start with the dumbbells at chest level, palms facing forward.',
      'Press up and slightly together, then lower under control.',
    ],
    commonMistake: 'Setting the incline too high, which turns it into a shoulder press.',
  },
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    target: 'Quads, Glutes, Hamstrings',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    rest: 120,
    image: IMG.legs,
    instructions: [
      'Rest the bar on your upper back with feet shoulder-width apart.',
      'Brace your core and lower your hips down and back.',
      'Descend until thighs are parallel, then drive through your heels to stand.',
    ],
    commonMistake: 'Letting the knees cave inward. Keep them tracking over your toes.',
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    target: 'Back, Glutes, Hamstrings',
    difficulty: 'Advanced',
    sets: 4,
    reps: '5',
    rest: 150,
    image: IMG.legs,
    instructions: [
      'Stand with mid-foot under the bar, hips back, and grip just outside your knees.',
      'Brace, flatten your back, and drive through the floor to lift.',
      'Lock out at the top with hips fully extended, then lower under control.',
    ],
    commonMistake: 'Rounding the lower back. Keep a neutral spine and brace hard before pulling.',
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    target: 'Back, Biceps',
    difficulty: 'Intermediate',
    sets: 3,
    reps: 'AMRAP',
    rest: 90,
    image: IMG.muscle,
    instructions: [
      'Hang from the bar with an overhand grip slightly wider than shoulders.',
      'Pull your elbows down and back until your chin clears the bar.',
      'Lower under control to a full hang and repeat.',
    ],
    commonMistake: 'Kipping or swinging. Keep the movement strict and controlled.',
  },
  {
    id: 'overhead-press',
    name: 'Standing Overhead Press',
    target: 'Shoulders, Triceps',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '6-8',
    rest: 90,
    image: IMG.chest,
    instructions: [
      'Hold the bar at shoulder height with hands just outside shoulder-width.',
      'Brace your glutes and core, then press the bar straight overhead.',
      'Lock out with the bar over your mid-foot, then lower to the shoulders.',
    ],
    commonMistake: 'Leaning back excessively. Squeeze your glutes to keep the torso upright.',
  },
  {
    id: 'barbell-row',
    name: 'Bent-Over Barbell Row',
    target: 'Back, Rear Delts',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '8-10',
    rest: 90,
    image: IMG.muscle,
    instructions: [
      'Hinge at the hips with a flat back, holding the bar at arm’s length.',
      'Row the bar to your lower ribs, driving the elbows back.',
      'Squeeze the shoulder blades, then lower under control.',
    ],
    commonMistake: 'Standing too upright and using momentum. Keep the torso near parallel.',
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    target: 'Quads, Glutes',
    difficulty: 'Beginner',
    sets: 3,
    reps: '12 / leg',
    rest: 60,
    image: IMG.legs,
    instructions: [
      'Step forward into a lunge until both knees are at 90°.',
      'Drive through the front heel to bring the back leg through.',
      'Step directly into the next lunge and continue alternating.',
    ],
    commonMistake: 'Letting the front knee drift far past the toes. Keep your weight in the heel.',
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    target: 'Hamstrings, Glutes',
    difficulty: 'Intermediate',
    sets: 3,
    reps: '10',
    rest: 90,
    image: IMG.legs,
    instructions: [
      'Hold the bar at your hips with a soft bend in the knees.',
      'Push your hips back, sliding the bar down your thighs.',
      'Feel a hamstring stretch, then drive your hips forward to stand.',
    ],
    commonMistake: 'Bending the knees too much, turning it into a squat instead of a hinge.',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    target: 'Full Body, Cardio',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '15',
    rest: 45,
    image: IMG.cardio,
    instructions: [
      'Drop into a squat and place your hands on the floor.',
      'Kick your feet back into a plank and lower your chest.',
      'Jump your feet back in and explode up into a jump.',
    ],
    commonMistake: 'Letting the hips sag in the plank. Keep your core tight throughout.',
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    target: 'Core, Cardio',
    difficulty: 'Beginner',
    sets: 4,
    reps: '40s',
    rest: 30,
    image: IMG.cardio,
    instructions: [
      'Start in a high plank with hands under your shoulders.',
      'Drive one knee toward your chest, then switch quickly.',
      'Keep a steady rhythm without letting your hips rise.',
    ],
    commonMistake: 'Bouncing the hips up and down. Keep them level and your core braced.',
  },
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    target: 'Legs, Power',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '12',
    rest: 45,
    image: IMG.legs,
    instructions: [
      'Lower into a quarter-to-half squat with your chest up.',
      'Explode straight up, extending fully through the hips.',
      'Land softly with bent knees and immediately reset.',
    ],
    commonMistake: 'Landing with stiff, straight legs. Absorb the landing softly.',
  },
  {
    id: 'plank',
    name: 'Plank',
    target: 'Core',
    difficulty: 'Beginner',
    sets: 3,
    reps: '60s',
    rest: 45,
    image: IMG.cardio,
    instructions: [
      'Rest on your forearms with elbows under your shoulders.',
      'Form a straight line from head to heels and brace your core.',
      'Hold the position, breathing steadily, for the full time.',
    ],
    commonMistake: 'Letting the hips sag or pike up. Keep a flat line through the body.',
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl',
    target: 'Biceps',
    difficulty: 'Beginner',
    sets: 3,
    reps: '12',
    rest: 45,
    image: IMG.muscle,
    instructions: [
      'Stand with a dumbbell in each hand, palms facing forward.',
      'Curl the weights up while keeping your elbows pinned to your sides.',
      'Squeeze at the top, then lower slowly.',
    ],
    commonMistake: 'Swinging the torso to lift the weight. Keep the movement strict.',
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    target: 'Triceps',
    difficulty: 'Beginner',
    sets: 3,
    reps: '12',
    rest: 45,
    image: IMG.chest,
    instructions: [
      'Grip parallel bars or a bench edge with arms straight.',
      'Lower your body by bending the elbows to about 90°.',
      'Press back up until your arms are fully extended.',
    ],
    commonMistake: 'Dipping too low and straining the shoulders. Stop around 90° at the elbow.',
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    target: 'Posterior Chain, Cardio',
    difficulty: 'Intermediate',
    sets: 4,
    reps: '20',
    rest: 45,
    image: IMG.cardio,
    instructions: [
      'Stand over the kettlebell, hinge at the hips, and grip the handle.',
      'Hike it back between your legs, then snap your hips forward.',
      'Let the bell float to chest height, then control it back down.',
    ],
    commonMistake: 'Squatting and lifting with the arms. Power the swing with an explosive hip hinge.',
  },
];

const WORKOUT_LIST: Workout[] = [
  {
    id: 'upper-body-power',
    title: 'Upper Body Power',
    categoryId: 'muscle-gain',
    duration: 50,
    intensity: 'Advanced',
    image: IMG.chest,
    exerciseIds: ['bench-press', 'incline-db-press', 'overhead-press', 'barbell-row', 'pull-up', 'tricep-dip'],
  },
  {
    id: 'lower-body-explosiveness',
    title: 'Lower Body Explosiveness',
    categoryId: 'strength',
    duration: 45,
    intensity: 'Advanced',
    image: IMG.legs,
    exerciseIds: ['squat', 'romanian-deadlift', 'walking-lunge', 'jump-squat'],
  },
  {
    id: 'full-body-strength',
    title: 'Full Body Strength',
    categoryId: 'strength',
    duration: 60,
    intensity: 'Advanced',
    image: IMG.muscle,
    exerciseIds: ['squat', 'bench-press', 'deadlift', 'barbell-row', 'overhead-press'],
  },
  {
    id: 'fat-burner-hiit',
    title: 'Fat Burner HIIT',
    categoryId: 'cardio',
    duration: 30,
    intensity: 'Intermediate',
    image: IMG.cardio,
    exerciseIds: ['burpee', 'mountain-climber', 'jump-squat', 'kettlebell-swing', 'plank'],
  },
  {
    id: 'core-crusher',
    title: 'Core Crusher',
    categoryId: 'fat-loss',
    duration: 20,
    intensity: 'Beginner',
    image: IMG.fatLoss,
    exerciseIds: ['plank', 'mountain-climber', 'burpee'],
  },
  {
    id: 'arm-builder',
    title: 'Arm Builder',
    categoryId: 'muscle-gain',
    duration: 35,
    intensity: 'Beginner',
    image: IMG.muscle,
    exerciseIds: ['bicep-curl', 'tricep-dip', 'pull-up', 'overhead-press'],
  },
  {
    id: 'hiit-shred',
    title: 'HIIT Shred',
    categoryId: 'cardio',
    duration: 25,
    intensity: 'Intermediate',
    image: IMG.cardio,
    exerciseIds: ['jump-squat', 'burpee', 'kettlebell-swing', 'mountain-climber'],
  },
  {
    id: 'lean-machine',
    title: 'Lean Machine',
    categoryId: 'fat-loss',
    duration: 40,
    intensity: 'Intermediate',
    image: IMG.fatLoss,
    exerciseIds: ['walking-lunge', 'romanian-deadlift', 'kettlebell-swing', 'plank', 'mountain-climber'],
  },
];

const CATEGORY_LIST: Category[] = [
  { id: 'fat-loss', title: 'Fat Loss', image: IMG.fatLoss },
  { id: 'muscle-gain', title: 'Muscle Gain', image: IMG.muscle },
  { id: 'strength', title: 'Strength', image: IMG.legs },
  { id: 'cardio', title: 'Cardio', image: IMG.cardio },
];

const NUTRITION_LIST: NutritionPlan[] = [
  {
    id: 'high-protein',
    title: 'High Protein Meals',
    calories: 2400,
    image: IMG.mealProtein,
    description: 'Built to maximise muscle protein synthesis while keeping you full. Ideal alongside strength and muscle-gain programs.',
    macros: { protein: 200, carbs: 220, fat: 70 },
    meals: [
      { name: 'Breakfast', calories: 550, items: ['4 egg omelette with spinach', 'Greek yogurt with berries', 'Black coffee'] },
      { name: 'Lunch', calories: 700, items: ['Grilled chicken breast', 'Brown rice', 'Mixed greens with olive oil'] },
      { name: 'Snack', calories: 350, items: ['Protein shake', 'Handful of almonds'] },
      { name: 'Dinner', calories: 800, items: ['Salmon fillet', 'Sweet potato', 'Steamed broccoli'] },
    ],
  },
  {
    id: 'fat-loss-guide',
    title: 'Fat Loss Guide',
    calories: 1800,
    image: IMG.mealLean,
    description: 'A moderate calorie deficit with high protein to preserve muscle while shedding fat. Pairs well with HIIT and cardio sessions.',
    macros: { protein: 160, carbs: 150, fat: 55 },
    meals: [
      { name: 'Breakfast', calories: 400, items: ['Egg-white scramble', 'Oats with cinnamon', 'Green tea'] },
      { name: 'Lunch', calories: 550, items: ['Turkey and avocado wrap', 'Side salad'] },
      { name: 'Snack', calories: 250, items: ['Cottage cheese', 'Apple'] },
      { name: 'Dinner', calories: 600, items: ['Lean steak', 'Quinoa', 'Roasted vegetables'] },
    ],
  },
  {
    id: 'lean-bulk',
    title: 'Lean Bulk',
    calories: 3000,
    image: IMG.muscle,
    description: 'A controlled calorie surplus for steady muscle gain with minimal fat. Best when training hard 5+ days a week.',
    macros: { protein: 210, carbs: 330, fat: 90 },
    meals: [
      { name: 'Breakfast', calories: 700, items: ['Oats with banana and peanut butter', 'Whole eggs', 'Milk'] },
      { name: 'Lunch', calories: 850, items: ['Beef and rice bowl', 'Avocado', 'Mixed veg'] },
      { name: 'Snack', calories: 550, items: ['Mass-gainer shake', 'Trail mix'] },
      { name: 'Dinner', calories: 900, items: ['Chicken thighs', 'Pasta', 'Olive oil and parmesan'] },
    ],
  },
];

// --- Lookups -------------------------------------------------------------

const exerciseById = new Map(EXERCISE_LIST.map((e) => [e.id, e]));
const workoutById = new Map(WORKOUT_LIST.map((w) => [w.id, w]));
const nutritionById = new Map(NUTRITION_LIST.map((n) => [n.id, n]));

export function getExercise(id: string | undefined): Exercise | undefined {
  return id ? exerciseById.get(id) : undefined;
}

export function getWorkout(id: string | undefined): Workout | undefined {
  return id ? workoutById.get(id) : undefined;
}

export function getWorkoutExercises(workout: Workout): Exercise[] {
  return workout.exerciseIds.map((id) => exerciseById.get(id)).filter((e): e is Exercise => !!e);
}

export function getAllWorkouts(): Workout[] {
  return WORKOUT_LIST;
}

export function getWorkoutsByCategory(categoryId: string): Workout[] {
  return WORKOUT_LIST.filter((w) => w.categoryId === categoryId);
}

export function getCategories(): (Category & { count: number })[] {
  return CATEGORY_LIST.map((c) => ({
    ...c,
    count: WORKOUT_LIST.filter((w) => w.categoryId === c.id).length,
  }));
}

export function getCategory(id: string): Category | undefined {
  return CATEGORY_LIST.find((c) => c.id === id);
}

export function searchWorkouts(query: string, difficulty?: Difficulty | null, categoryId?: string | null): Workout[] {
  const q = query.trim().toLowerCase();
  return WORKOUT_LIST.filter((w) => {
    if (categoryId && w.categoryId !== categoryId) return false;
    if (difficulty && w.intensity !== difficulty) return false;
    if (!q) return true;
    const cat = getCategory(w.categoryId)?.title.toLowerCase() ?? '';
    return w.title.toLowerCase().includes(q) || cat.includes(q);
  });
}

/** Deterministic "workout of the day" so the Home card is stable per calendar day. */
export function getTodaysWorkout(): Workout {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return WORKOUT_LIST[dayOfYear % WORKOUT_LIST.length];
}

export function getNutritionPlans(): NutritionPlan[] {
  return NUTRITION_LIST;
}

export function getNutritionPlan(id: string | undefined): NutritionPlan | undefined {
  return id ? nutritionById.get(id) : undefined;
}

export const WEEKLY_WORKOUT_GOAL = 5;
