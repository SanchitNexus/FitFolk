import type { WorkoutTemplate, Workout } from '../../types';

export const seedWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Push Day - Chest & Shoulders',
    description: 'A complete push workout targeting chest, shoulders, and triceps.',
    difficulty: 'intermediate',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    estimatedDuration: 55,
    createdBy: 'user-sarah',
    exercises: [
      { exerciseId: 'ex-1', exerciseName: 'Bench Press', sets: [{ id: 's1', reps: 8, weight: 70, isCompleted: false }, { id: 's2', reps: 8, weight: 70, isCompleted: false }, { id: 's3', reps: 8, weight: 70, isCompleted: false }, { id: 's4', reps: 6, weight: 75, isCompleted: false }], restSeconds: 120, notes: 'Focus on controlled eccentric' },
      { exerciseId: 'ex-3', exerciseName: 'Overhead Press', sets: [{ id: 's5', reps: 10, weight: 40, isCompleted: false }, { id: 's6', reps: 10, weight: 40, isCompleted: false }, { id: 's7', reps: 8, weight: 42.5, isCompleted: false }], restSeconds: 90 },
      { exerciseId: 'ex-incline', exerciseName: 'Incline Dumbbell Press', sets: [{ id: 's8', reps: 10, weight: 28, isCompleted: false }, { id: 's9', reps: 10, weight: 28, isCompleted: false }, { id: 's10', reps: 10, weight: 28, isCompleted: false }], restSeconds: 90 },
      { exerciseId: 'ex-lat', exerciseName: 'Lateral Raise', sets: [{ id: 's11', reps: 15, weight: 10, isCompleted: false }, { id: 's12', reps: 15, weight: 10, isCompleted: false }, { id: 's13', reps: 12, weight: 12, isCompleted: false }], restSeconds: 60 },
      { exerciseId: 'ex-tri', exerciseName: 'Tricep Pushdown', sets: [{ id: 's14', reps: 12, weight: 25, isCompleted: false }, { id: 's15', reps: 12, weight: 25, isCompleted: false }, { id: 's16', reps: 10, weight: 27.5, isCompleted: false }], restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-2',
    title: 'Pull Day - Back & Biceps',
    description: 'Build a strong back and biceps with this pull-focused session.',
    difficulty: 'intermediate',
    muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
    estimatedDuration: 50,
    createdBy: 'user-marcus',
    exercises: [
      { exerciseId: 'ex-2', exerciseName: 'Deadlift', sets: [{ id: 's17', reps: 5, weight: 140, isCompleted: false }, { id: 's18', reps: 5, weight: 140, isCompleted: false }, { id: 's19', reps: 3, weight: 160, isCompleted: false }], restSeconds: 180 },
      { exerciseId: 'ex-row', exerciseName: 'Barbell Row', sets: [{ id: 's20', reps: 8, weight: 80, isCompleted: false }, { id: 's21', reps: 8, weight: 80, isCompleted: false }, { id: 's22', reps: 8, weight: 80, isCompleted: false }], restSeconds: 120 },
      { exerciseId: 'ex-pullup', exerciseName: 'Pull-ups', sets: [{ id: 's23', reps: 8, isCompleted: false }, { id: 's24', reps: 7, isCompleted: false }, { id: 's25', reps: 6, isCompleted: false }], restSeconds: 90 },
      { exerciseId: 'ex-curl', exerciseName: 'Dumbbell Curl', sets: [{ id: 's26', reps: 12, weight: 14, isCompleted: false }, { id: 's27', reps: 12, weight: 14, isCompleted: false }, { id: 's28', reps: 10, weight: 16, isCompleted: false }], restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-3',
    title: 'Leg Day - Quads & Hamstrings',
    description: 'Never skip leg day! Complete lower body session.',
    difficulty: 'intermediate',
    muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
    estimatedDuration: 60,
    createdBy: 'user-luna',
    exercises: [
      { exerciseId: 'ex-4', exerciseName: 'Squat', sets: [{ id: 's29', reps: 5, weight: 120, isCompleted: false }, { id: 's30', reps: 5, weight: 120, isCompleted: false }, { id: 's31', reps: 5, weight: 120, isCompleted: false }, { id: 's32', reps: 3, weight: 130, isCompleted: false }], restSeconds: 180 },
      { exerciseId: 'ex-rdl', exerciseName: 'Romanian Deadlift', sets: [{ id: 's33', reps: 10, weight: 80, isCompleted: false }, { id: 's34', reps: 10, weight: 80, isCompleted: false }, { id: 's35', reps: 10, weight: 80, isCompleted: false }], restSeconds: 90 },
      { exerciseId: 'ex-lunge', exerciseName: 'Walking Lunges', sets: [{ id: 's36', reps: 12, weight: 20, isCompleted: false }, { id: 's37', reps: 12, weight: 20, isCompleted: false }, { id: 's38', reps: 12, weight: 20, isCompleted: false }], restSeconds: 60 },
      { exerciseId: 'ex-legcurl', exerciseName: 'Leg Curl', sets: [{ id: 's39', reps: 12, weight: 40, isCompleted: false }, { id: 's40', reps: 12, weight: 40, isCompleted: false }, { id: 's41', reps: 12, weight: 40, isCompleted: false }], restSeconds: 60 },
    ],
  },
  {
    id: 'tmpl-4',
    title: 'Full Body Beginner',
    description: 'Perfect for beginners - hit every major muscle group in one session.',
    difficulty: 'beginner',
    muscleGroups: ['Full Body'],
    estimatedDuration: 40,
    createdBy: 'user-sarah',
    exercises: [
      { exerciseId: 'ex-goblet', exerciseName: 'Goblet Squat', sets: [{ id: 's42', reps: 12, weight: 12, isCompleted: false }, { id: 's43', reps: 12, weight: 12, isCompleted: false }, { id: 's44', reps: 12, weight: 12, isCompleted: false }], restSeconds: 60 },
      { exerciseId: 'ex-pushup', exerciseName: 'Push-ups', sets: [{ id: 's45', reps: 10, isCompleted: false }, { id: 's46', reps: 10, isCompleted: false }, { id: 's47', reps: 8, isCompleted: false }], restSeconds: 60 },
      { exerciseId: 'ex-row2', exerciseName: 'Dumbbell Row', sets: [{ id: 's48', reps: 10, weight: 12, isCompleted: false }, { id: 's49', reps: 10, weight: 12, isCompleted: false }, { id: 's50', reps: 10, weight: 12, isCompleted: false }], restSeconds: 60 },
      { exerciseId: 'ex-plank', exerciseName: 'Plank', sets: [{ id: 's51', duration: 30, isCompleted: false }, { id: 's52', duration: 30, isCompleted: false }, { id: 's53', duration: 30, isCompleted: false }], restSeconds: 45 },
    ],
  },
  {
    id: 'tmpl-5',
    title: '5K Run Training',
    description: 'Interval running session to build speed and endurance for a 5K.',
    difficulty: 'beginner',
    muscleGroups: ['Cardio', 'Legs'],
    estimatedDuration: 35,
    createdBy: 'user-aisha',
    exercises: [
      { exerciseId: 'ex-warmup', exerciseName: 'Easy Jog Warm-up', sets: [{ id: 's54', duration: 300, isCompleted: false }], restSeconds: 0 },
      { exerciseId: 'ex-interval', exerciseName: 'Running Intervals (400m)', sets: [{ id: 's55', duration: 120, isCompleted: false }, { id: 's56', duration: 120, isCompleted: false }, { id: 's57', duration: 120, isCompleted: false }, { id: 's58', duration: 120, isCompleted: false }], restSeconds: 90, notes: 'Run at 80% effort, jog recovery' },
      { exerciseId: 'ex-cooldown', exerciseName: 'Cool-down Jog', sets: [{ id: 's59', duration: 300, isCompleted: false }], restSeconds: 0 },
    ],
  },
];

export const seedWorkouts: Workout[] = [
  {
    id: 'wk-1', userId: 'user-marcus', title: 'Heavy Pull Day', duration: 62,
    date: '2026-10-24', isTemplate: false, isCompleted: true, calories: 420,
    exercises: [
      { id: 'we-1', exerciseId: 'ex-2', exerciseName: 'Deadlift', sets: [{ id: 'ws1', reps: 5, weight: 180, isCompleted: true }, { id: 'ws2', reps: 3, weight: 185, isCompleted: true }, { id: 'ws3', reps: 1, weight: 190, isCompleted: true }], restSeconds: 180 },
      { id: 'we-2', exerciseId: 'ex-row', exerciseName: 'Barbell Row', sets: [{ id: 'ws4', reps: 8, weight: 90, isCompleted: true }, { id: 'ws5', reps: 8, weight: 90, isCompleted: true }, { id: 'ws6', reps: 6, weight: 95, isCompleted: true }], restSeconds: 120 },
    ],
  },
  {
    id: 'wk-2', userId: 'user-priya', title: 'Morning Bodyweight', duration: 28,
    date: '2026-10-24', isTemplate: false, isCompleted: true, calories: 180,
    exercises: [
      { id: 'we-3', exerciseId: 'ex-pushup', exerciseName: 'Push-ups', sets: [{ id: 'ws7', reps: 10, isCompleted: true }, { id: 'ws8', reps: 8, isCompleted: true }], restSeconds: 60 },
      { id: 'we-4', exerciseId: 'ex-plank', exerciseName: 'Plank', sets: [{ id: 'ws9', duration: 45, isCompleted: true }, { id: 'ws10', duration: 40, isCompleted: true }], restSeconds: 45 },
    ],
  },
  {
    id: 'wk-3', userId: 'user-luna', title: 'Squat Focus', duration: 75,
    date: '2026-10-23', isTemplate: false, isCompleted: true, calories: 510,
    exercises: [
      { id: 'we-5', exerciseId: 'ex-4', exerciseName: 'Squat', sets: [{ id: 'ws11', reps: 5, weight: 130, isCompleted: true }, { id: 'ws12', reps: 5, weight: 135, isCompleted: true }, { id: 'ws13', reps: 3, weight: 140, isCompleted: true }, { id: 'ws14', reps: 1, weight: 145, isCompleted: true }], restSeconds: 240 },
    ],
  },
  {
    id: 'wk-4', userId: 'user-sarah', title: 'Client Demo - Full Body', duration: 45,
    date: '2026-10-22', isTemplate: false, isCompleted: true, calories: 340,
    exercises: [
      { id: 'we-6', exerciseId: 'ex-goblet', exerciseName: 'Goblet Squat', sets: [{ id: 'ws15', reps: 12, weight: 16, isCompleted: true }, { id: 'ws16', reps: 12, weight: 16, isCompleted: true }], restSeconds: 60 },
    ],
  },
  {
    id: 'wk-5', userId: 'user-aisha', title: 'Morning 10K', duration: 52,
    date: '2026-10-24', isTemplate: false, isCompleted: true, calories: 620,
    exercises: [
      { id: 'we-7', exerciseId: 'ex-run', exerciseName: '10K Run', sets: [{ id: 'ws17', distance: 10000, duration: 3120, isCompleted: true }], restSeconds: 0 },
    ],
  },
  {
    id: 'wk-6', userId: 'user-marcus', title: 'Push Day', duration: 58,
    date: '2026-10-22', isTemplate: false, isCompleted: true, calories: 380,
    exercises: [
      { id: 'we-8', exerciseId: 'ex-1', exerciseName: 'Bench Press', sets: [{ id: 'ws18', reps: 8, weight: 100, isCompleted: true }, { id: 'ws19', reps: 8, weight: 105, isCompleted: true }, { id: 'ws20', reps: 5, weight: 110, isCompleted: true }], restSeconds: 120 },
    ],
  },
  {
    id: 'wk-7', userId: 'user-priya', title: 'Evening Walk + Stretch', duration: 35,
    date: '2026-10-23', isTemplate: false, isCompleted: true, calories: 120,
    exercises: [
      { id: 'we-9', exerciseId: 'ex-walk', exerciseName: 'Brisk Walking', sets: [{ id: 'ws21', duration: 1500, distance: 3000, isCompleted: true }], restSeconds: 0 },
    ],
  },
  {
    id: 'wk-8', userId: 'user-alex', title: 'Yoga Flow', duration: 45,
    date: '2026-10-24', isTemplate: false, isCompleted: true, calories: 180,
    exercises: [
      { id: 'we-10', exerciseId: 'ex-yoga', exerciseName: 'Vinyasa Flow', sets: [{ id: 'ws22', duration: 2700, isCompleted: true }], restSeconds: 0 },
    ],
  },
  {
    id: 'wk-9', userId: 'user-luna', title: 'Bench & Accessories', duration: 50,
    date: '2026-10-21', isTemplate: false, isCompleted: true, calories: 320,
    exercises: [
      { id: 'we-11', exerciseId: 'ex-1', exerciseName: 'Bench Press', sets: [{ id: 'ws23', reps: 5, weight: 75, isCompleted: true }, { id: 'ws24', reps: 5, weight: 80, isCompleted: true }, { id: 'ws25', reps: 3, weight: 85, isCompleted: true }], restSeconds: 150 },
    ],
  },
  {
    id: 'wk-10', userId: 'user-mike', title: 'Speed & Agility', duration: 40,
    date: '2026-10-24', isTemplate: false, isCompleted: true, calories: 450,
    exercises: [
      { id: 'we-12', exerciseId: 'ex-sprint', exerciseName: 'Sprint Intervals', sets: [{ id: 'ws26', duration: 15, isCompleted: true }, { id: 'ws27', duration: 15, isCompleted: true }, { id: 'ws28', duration: 15, isCompleted: true }, { id: 'ws29', duration: 15, isCompleted: true }, { id: 'ws30', duration: 15, isCompleted: true }, { id: 'ws31', duration: 15, isCompleted: true }], restSeconds: 45 },
    ],
  },
];
