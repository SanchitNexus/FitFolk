// ============================================================
// FitFolk Seed Data - Exercises
// ============================================================
import type { Exercise } from '../../types';

export const seedExercises: Exercise[] = [
  // --- Chest ---
  {
    id: 'ex-bench-press',
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    category: 'strength',
    equipment: 'Barbell, Flat Bench',
    instructions: [
      'Lie flat on a bench with your feet firmly on the floor.',
      'Grip the barbell slightly wider than shoulder-width apart.',
      'Unrack the bar and lower it slowly to your mid-chest.',
      'Press the bar back up to full arm extension without locking elbows.',
      'Keep your shoulder blades retracted throughout the movement.',
    ],
    safetyNotes: [
      'Always use a spotter for heavy sets.',
      'Do not bounce the bar off your chest.',
      'Keep your wrists straight and aligned with forearms.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-dumbbell-fly',
    name: 'Dumbbell Chest Fly',
    muscleGroup: 'Chest',
    category: 'strength',
    equipment: 'Dumbbells, Flat Bench',
    instructions: [
      'Lie flat on a bench holding dumbbells above your chest with a slight bend in elbows.',
      'Lower the dumbbells in a wide arc until you feel a stretch in your chest.',
      'Squeeze your chest to bring the dumbbells back to the starting position.',
      'Maintain the same slight bend in your elbows throughout.',
    ],
    safetyNotes: [
      'Do not go too heavy — this is an isolation exercise.',
      'Stop lowering if you feel pain in your shoulders.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-push-up',
    name: 'Push-Up',
    muscleGroup: 'Chest',
    category: 'bodyweight',
    equipment: 'None',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Keep your body in a straight line from head to heels.',
      'Lower your chest toward the floor by bending your elbows.',
      'Push back up to the starting position.',
      'Exhale as you push up, inhale as you lower down.',
    ],
    safetyNotes: [
      'Modify on knees if you cannot maintain proper form.',
      'Do not let your hips sag or pike up.',
    ],
    difficulty: 'beginner',
  },

  // --- Back ---
  {
    id: 'ex-deadlift',
    name: 'Conventional Deadlift',
    muscleGroup: 'Back',
    category: 'strength',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Hinge at hips and bend knees to grip the bar just outside your legs.',
      'Brace your core, flatten your back, and drive through your heels to stand up.',
      'Lock out at the top with hips fully extended and shoulders back.',
      'Lower the bar by hinging at the hips first, then bending the knees.',
    ],
    safetyNotes: [
      'Keep the bar close to your body throughout the lift.',
      'Never round your lower back under load.',
      'Start light and master form before adding weight.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-pull-up',
    name: 'Pull-Up',
    muscleGroup: 'Back',
    category: 'bodyweight',
    equipment: 'Pull-Up Bar',
    instructions: [
      'Hang from a pull-up bar with an overhand grip, hands shoulder-width apart.',
      'Engage your lats and pull your chest toward the bar.',
      'Squeeze at the top, chin above the bar.',
      'Lower yourself slowly to a full hang.',
    ],
    safetyNotes: [
      'Avoid swinging or kipping unless intentional.',
      'Use a band for assistance if needed.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-barbell-row',
    name: 'Barbell Bent-Over Row',
    muscleGroup: 'Back',
    category: 'strength',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet shoulder-width apart, holding a barbell with an overhand grip.',
      'Hinge forward at the hips until your torso is roughly 45 degrees.',
      'Pull the barbell toward your lower chest/upper abdomen.',
      'Squeeze your shoulder blades together at the top.',
      'Lower the bar under control.',
    ],
    safetyNotes: [
      'Keep your back flat — do not round your spine.',
      'Do not use momentum to swing the weight up.',
    ],
    difficulty: 'intermediate',
  },

  // --- Legs ---
  {
    id: 'ex-back-squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    category: 'strength',
    equipment: 'Barbell, Squat Rack',
    instructions: [
      'Position the barbell on your upper traps and step back from the rack.',
      'Stand with feet slightly wider than shoulder-width, toes slightly turned out.',
      'Brace your core and squat down by pushing your hips back and bending knees.',
      'Descend until your thighs are at least parallel to the floor.',
      'Drive through your heels to stand back up.',
    ],
    safetyNotes: [
      'Always use a squat rack with safety pins.',
      'Do not let your knees cave inward.',
      'Keep your chest up and core braced.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift',
    muscleGroup: 'Legs',
    category: 'strength',
    equipment: 'Barbell or Dumbbells',
    instructions: [
      'Stand tall holding the barbell at hip height with an overhand grip.',
      'With a slight bend in your knees, hinge at the hips pushing them backward.',
      'Lower the bar along your legs until you feel a strong hamstring stretch.',
      'Drive your hips forward to return to standing.',
    ],
    safetyNotes: [
      'Keep the bar close to your body.',
      'Do not round your lower back.',
      'Focus on the hip hinge, not bending your knees.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-lunges',
    name: 'Walking Lunges',
    muscleGroup: 'Legs',
    category: 'bodyweight',
    equipment: 'None (optional: Dumbbells)',
    instructions: [
      'Stand tall with feet together.',
      'Step forward with one leg and lower your hips until both knees are at 90 degrees.',
      'Push off your front foot and step the back leg forward into the next lunge.',
      'Keep your torso upright and core engaged throughout.',
    ],
    safetyNotes: [
      'Do not let your front knee extend past your toes excessively.',
      'Keep your balance — look straight ahead.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-leg-press',
    name: 'Leg Press',
    muscleGroup: 'Legs',
    category: 'strength',
    equipment: 'Leg Press Machine',
    instructions: [
      'Sit in the leg press machine with your back flat against the pad.',
      'Place your feet shoulder-width apart on the platform.',
      'Release the safety handles and lower the platform by bending your knees.',
      'Press the platform back up without fully locking your knees.',
    ],
    safetyNotes: [
      'Do not lock out your knees at the top.',
      'Keep your lower back pressed against the pad.',
      'Do not go too deep if you have knee issues.',
    ],
    difficulty: 'beginner',
  },

  // --- Shoulders ---
  {
    id: 'ex-overhead-press',
    name: 'Barbell Overhead Press',
    muscleGroup: 'Shoulders',
    category: 'strength',
    equipment: 'Barbell',
    instructions: [
      'Stand with feet shoulder-width apart, barbell at collarbone height.',
      'Grip the bar slightly wider than shoulder-width.',
      'Press the bar overhead until arms are fully extended.',
      'Lower the bar back to collarbone height under control.',
      'Keep your core tight and avoid excessive back arch.',
    ],
    safetyNotes: [
      'Do not lean back excessively — this can stress the lower back.',
      'Start with lighter weight to master form.',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'ex-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    category: 'strength',
    equipment: 'Dumbbells',
    instructions: [
      'Stand with dumbbells at your sides, palms facing inward.',
      'With a slight bend in your elbows, raise both arms out to the sides.',
      'Lift until your arms are parallel to the floor.',
      'Lower slowly under control.',
    ],
    safetyNotes: [
      'Do not swing the weights — use controlled movement.',
      'Keep the weight moderate to protect your rotator cuff.',
    ],
    difficulty: 'beginner',
  },

  // --- Arms ---
  {
    id: 'ex-barbell-curl',
    name: 'Barbell Bicep Curl',
    muscleGroup: 'Arms',
    category: 'strength',
    equipment: 'Barbell or EZ-Bar',
    instructions: [
      'Stand with feet shoulder-width apart, holding the bar with an underhand grip.',
      'Keep your elbows pinned to your sides.',
      'Curl the bar up toward your shoulders by contracting your biceps.',
      'Lower the bar slowly back to the starting position.',
    ],
    safetyNotes: [
      'Avoid swinging your body for momentum.',
      'Do not hyperextend your wrists.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-tricep-dip',
    name: 'Tricep Dip',
    muscleGroup: 'Arms',
    category: 'bodyweight',
    equipment: 'Dip Bars or Bench',
    instructions: [
      'Grip the dip bars and support your body with arms extended.',
      'Lower your body by bending your elbows until they reach about 90 degrees.',
      'Keep your elbows close to your body to target triceps.',
      'Press back up to full arm extension.',
    ],
    safetyNotes: [
      'Do not go too deep if you have shoulder issues.',
      'Keep your body upright for tricep focus.',
    ],
    difficulty: 'intermediate',
  },

  // --- Core ---
  {
    id: 'ex-plank',
    name: 'Plank',
    muscleGroup: 'Core',
    category: 'bodyweight',
    equipment: 'None',
    instructions: [
      'Start in a forearm plank position with elbows directly under shoulders.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core and glutes — do not let your hips sag.',
      'Hold the position for the prescribed duration.',
    ],
    safetyNotes: [
      'Stop if you feel lower back pain.',
      'Breathe normally throughout the hold.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raise',
    muscleGroup: 'Core',
    category: 'bodyweight',
    equipment: 'Pull-Up Bar',
    instructions: [
      'Hang from a pull-up bar with an overhand grip.',
      'Keeping your legs straight, raise them until they are parallel to the floor.',
      'Hold briefly at the top, then lower slowly.',
      'Avoid swinging — use your abs, not momentum.',
    ],
    safetyNotes: [
      'Bend your knees if the straight-leg version is too difficult.',
      'Ensure a strong grip before starting.',
    ],
    difficulty: 'advanced',
  },
  {
    id: 'ex-russian-twist',
    name: 'Russian Twist',
    muscleGroup: 'Core',
    category: 'bodyweight',
    equipment: 'None (optional: Medicine Ball or Dumbbell)',
    instructions: [
      'Sit on the floor with knees bent, feet off the ground.',
      'Lean back slightly to engage your core.',
      'Rotate your torso to one side, then the other.',
      'Move in a controlled manner, keeping your core tight.',
    ],
    safetyNotes: [
      'Avoid excessive speed — focus on the rotation.',
      'Keep your spine neutral, do not round your back.',
    ],
    difficulty: 'beginner',
  },

  // --- Cardio ---
  {
    id: 'ex-running',
    name: 'Treadmill / Outdoor Running',
    muscleGroup: 'Cardio',
    category: 'cardio',
    equipment: 'Treadmill or Running Shoes',
    instructions: [
      'Start with a 5-minute walking warm-up.',
      'Gradually increase pace to your target running speed.',
      'Maintain an upright posture with relaxed shoulders.',
      'Land mid-foot and keep a steady cadence.',
      'Cool down with 5 minutes of walking.',
    ],
    safetyNotes: [
      'Wear proper running shoes that fit well.',
      'Stay hydrated, especially in hot conditions.',
      'Increase weekly mileage by no more than 10%.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-jump-rope',
    name: 'Jump Rope',
    muscleGroup: 'Cardio',
    category: 'cardio',
    equipment: 'Jump Rope',
    instructions: [
      'Hold the handles with a relaxed grip, elbows close to your body.',
      'Swing the rope using your wrists, not your arms.',
      'Jump with both feet, landing softly on the balls of your feet.',
      'Keep jumps low — just enough to clear the rope.',
    ],
    safetyNotes: [
      'Jump on a forgiving surface to reduce joint impact.',
      'Start with short intervals if you are a beginner.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-rowing',
    name: 'Rowing Machine',
    muscleGroup: 'Cardio',
    category: 'cardio',
    equipment: 'Rowing Machine',
    instructions: [
      'Sit on the rower and strap your feet in securely.',
      'Grab the handle with an overhand grip.',
      'Drive with your legs first, then lean back and pull the handle to your lower chest.',
      'Return by extending arms, leaning forward, then bending knees.',
      'Maintain a smooth, rhythmic stroke.',
    ],
    safetyNotes: [
      'Do not yank the handle — use legs for power.',
      'Keep your back straight throughout the stroke.',
    ],
    difficulty: 'beginner',
  },

  // --- Flexibility ---
  {
    id: 'ex-downward-dog',
    name: 'Downward Facing Dog',
    muscleGroup: 'Flexibility',
    category: 'flexibility',
    equipment: 'Yoga Mat',
    instructions: [
      'Start on hands and knees with hands slightly in front of shoulders.',
      'Tuck your toes and lift your hips up and back.',
      'Straighten your legs as much as comfortable, pressing heels toward the floor.',
      'Press your chest gently toward your thighs.',
      'Hold for 30-60 seconds, breathing deeply.',
    ],
    safetyNotes: [
      'Bend your knees if your hamstrings are tight.',
      'Do not force your heels to the ground.',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'ex-pigeon-pose',
    name: 'Pigeon Pose',
    muscleGroup: 'Flexibility',
    category: 'flexibility',
    equipment: 'Yoga Mat',
    instructions: [
      'From downward dog, bring your right knee forward behind your right wrist.',
      'Extend your left leg straight back behind you.',
      'Square your hips toward the front of the mat.',
      'Walk your hands forward and lower your torso over your front leg.',
      'Hold for 30-60 seconds, then switch sides.',
    ],
    safetyNotes: [
      'Use a blanket under your hip for support if needed.',
      'Do not force the stretch — ease into it gradually.',
    ],
    difficulty: 'intermediate',
  },
];
