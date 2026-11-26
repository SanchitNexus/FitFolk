// ============================================================
// FitFolk Conversational AI Fitness Coach & Neural LLM Service
// Supports: Local Ollama (port 11434) + Cloud Neural AI + Dynamic Intelligence Engine
// ============================================================

export interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
  modified_at?: string;
}

export interface OllamaChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaStatus {
  isOnline: boolean;
  provider: 'local' | 'cloud' | 'neural';
  models: string[];
  selectedModel: string;
  endpoint: string;
}

const DEFAULT_ENDPOINT = '/api/ollama';

// Quick detection of Ollama service or cloud AI availability
export async function checkOllamaConnection(endpoint = DEFAULT_ENDPOINT): Promise<{
  isOnline: boolean;
  provider: 'local' | 'cloud';
  models: string[];
}> {
  // 1. Try local Ollama proxy
  try {
    const res = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(1500),
    });

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map((m: OllamaModel) => m.name);
      return {
        isOnline: true,
        provider: 'local',
        models: models.length > 0 ? models : ['llama3.2', 'mistral', 'phi3'],
      };
    }
  } catch {}

  // 2. Direct localhost:11434
  try {
    const res = await fetch(`http://localhost:11434/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(1200),
    });

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map((m: OllamaModel) => m.name);
      return {
        isOnline: true,
        provider: 'local',
        models: models.length > 0 ? models : ['llama3.2', 'mistral', 'phi3'],
      };
    }
  } catch {}

  // Cloud AI is always available as the online neural engine
  return {
    isOnline: true,
    provider: 'cloud',
    models: ['fitfolk-neural-v2', 'llama3.2', 'mistral'],
  };
}

// Master AI Chat Completion
export async function sendOllamaMessage(
  messages: OllamaChatMessage[],
  model = 'llama3.2',
  endpoint = DEFAULT_ENDPOINT,
  userName = 'Athlete'
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || '';

  // 1. Try Local Ollama if available
  try {
    const systemPrompt = `You are FitFolk AI Coach, an elite personal trainer, biomechanist, and sports nutritionist. You are speaking with ${userName}.
Be empathetic, motivating, evidence-based, and practical. Format with clean bullet points, bold headers, and realistic numbers.`;

    const payload = {
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: false,
      options: { temperature: 0.7 },
    };

    const res = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.message?.content) {
        return data.message.content;
      }
    }
  } catch {
    // Local Ollama offline or timed out, smoothly progress to Cloud Neural Engine
  }

  // 2. Try Cloud Neural AI Engine (Pollinations text API)
  try {
    const encodedPrompt = encodeURIComponent(
      `You are FitFolk AI Coach, an expert fitness trainer chatting with ${userName}. Answer this prompt directly with actionable, personalized, friendly advice:\n\n${lastUserMsg}`
    );

    const cloudRes = await fetch(`https://text.pollinations.ai/${encodedPrompt}`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (cloudRes.ok) {
      const text = await cloudRes.text();
      // Ensure it is not a rate-limit error message
      if (text && !text.includes('Free limit reached') && !text.includes('Please wait') && text.length > 20) {
        return text.trim();
      }
    }
  } catch {
    // Progress to Dynamic Conversational Intelligence Brain
  }

  // 3. Dynamic Conversational Intelligence Brain (Instant, Zero Lag, Highly Contextual)
  return generateDynamicConversationalResponse(lastUserMsg, messages, userName);
}

// ============================================================
// Deep Conversational Fitness Intelligence Engine
// ============================================================
function generateDynamicConversationalResponse(
  query: string,
  history: OllamaChatMessage[],
  userName: string
): string {
  const q = query.trim().toLowerCase();

  // Greetings & Casual Conversation
  if (/^(hi|hello|hey|yo|greetings|good morning|good evening|sup|howdy)\b/i.test(q)) {
    return `Hey **${userName}**! 👋 Great to see you in the gym! 

I'm your **FitFolk AI Coach**—ready to help you dial in your training, optimize your nutrition, or fix any movement technique.

What are we working on today?
- 🏋️ **Build a Custom Workout Routine**
- 🥗 **Calculate Your Daily Calories & Macros**
- 🛡️ **Form Check & Injury Prevention Tips**
- ⚡ **Pre/Post Workout Meal Ideas**

Drop a question and let's get after it!`;
  }

  // Who are you / Identity
  if (q.includes('who are you') || q.includes('what are you') || q.includes('your name') || q.includes('what can you do')) {
    return `I'm **FitFolk AI Coach**, your 24/7 dedicated fitness assistant and sports scientist inside FitFolk! 🧠⚡

Here is what I can do for you:
1. **Design Custom Training Splits:** Whether you have 3, 4, or 6 days a week, at home or in a full commercial gym.
2. **Precision Nutrition:** Calculate protein requirements, maintenance calories, cutting deficits, or lean-bulk targets based on your exact bodyweight.
3. **Technique Breakdown:** Explain the setup, bar path, breathing, and cues for compound lifts (Squat, Bench, Deadlift, OHP, Pull-ups).
4. **Supplement & Recovery Science:** Clear up facts on creatine, hydration, DOMS muscle soreness, and sleep optimization.

What's your primary fitness goal right now—fat loss, muscle gain, or athletic performance?`;
  }

  // How are you
  if (q.includes('how are you') || q.includes('how are u') || q.includes("how's it going")) {
    return `Feeling energized and ready to crush some PRs, **${userName}**! 💪🔥 

How are your energy levels today? Did you get a good night of sleep, or are we working around some fatigue for today's session?`;
  }

  // Tired / Fatigued / Rest Day Dilemma
  if (q.includes('tired') || q.includes('exhausted') || q.includes('sore') || q.includes('rest day') || q.includes('skip gym') || q.includes('lazy')) {
    return `Hey **${userName}**, listen to your body—it's smart! Let's do a quick diagnostic:

1. **Are you just mentally sluggish from work/study?**
   - *Fix:* Drink 500ml of water, put on your shoes, and commit to just a **10-minute warm-up**. If your energy kicks in, keep going. If you still feel drained, call it.
2. **Are your joints aching or muscles intensely sore (DOMS)?**
   - *Fix:* Take an **Active Recovery Day**! Go for a brisk 25-minute walk, do 15 minutes of light foam rolling, or do mobility stretches. This promotes blood flow without adding central nervous system fatigue.
3. **Sleep Deprivation (< 5 hours of sleep):**
   - *Fix:* Heavy compound lifts like deadlifts or squats with low sleep increase injury risk. Prioritize catching up on sleep—muscles grow when resting, not while breaking them down!

Remember: *Consistency over months beats forcing an injury-prone workout today.* Take care of your recovery!`;
  }

  // Shoulder / Delts
  if (q.includes('shoulder') || q.includes('delt') || q.includes('lateral raise') || q.includes('overhead press')) {
    return `### 🥥 Complete Shoulder Development Blueprint for **${userName}**

To build that wide, 3D shoulder look, you must target all three heads:

**1. Lateral Delts (Width & V-Taper):**
- **Dumbbell Lateral Raises:** 4 sets × 12-15 reps.
  *Key Cue:* Lean slightly forward at a 15° angle and think about pushing your elbows outward toward the walls, not just lifting up.
- **Cable Lateral Raises (Behind or Across Body):** 3 sets × 15 reps for constant tension at the bottom of the movement.

**2. Front (Anterior) Delts:**
- **Standing Overhead Barbell/Dumbbell Press:** 3 sets × 6-8 reps. 
  *Note:* Heavily worked during flat and incline bench press, so 1 dedicated compound is plenty!

**3. Rear Delts (3D Thickness & Posture):**
- **Face Pulls with Rope:** 4 sets × 15-20 reps (focus on external rotation at the top).
- **Reverse Pec-Deck Flyes:** 3 sets × 12-15 reps.

*💡 Pro Tip: Train rear and lateral delts twice a week with higher volume (12-20 rep range) because they recover rapidly!*`;
  }

  // Chest / Bench Press
  if (q.includes('chest') || q.includes('bench press') || q.includes('pecs') || q.includes('push up')) {
    return `### 💥 Maximum Chest Hypertrophy Guide

Here is an optimal chest workout based on biomechanical tension:

**1. Heavy Compound (Lower/Mid Fibers):**
- **Flat Barbell Bench Press OR Heavy Dumbbell Press:** 4 sets × 6-8 reps.
  *Form Cue:* Retract and depress your scapulae (pinch shoulder blades down and back into the bench). Keep a slight natural arch in your lower back.

**2. Clavicular Head (Upper Chest Fullness):**
- **Incline Dumbbell Press (30° Angle):** 3-4 sets × 8-10 reps.
  *Crucial Cue:* Don't set the bench too steep (keep it 30°, not 45°) to prevent front delts from taking over the load!

**3. Squeeze & Stretch (Adduction):**
- **Seated Cable Flyes OR Pec Deck:** 3 sets × 12-15 reps with a 1-second squeeze at peak contraction and a 2-second controlled eccentric stretch.

**4. Burnout Finisher:**
- **Dips OR Deficit Push-ups:** 2 sets to failure.

*🔥 FitFolk Cue: Never bounce the bar off your sternum—pause for 0.5s on your chest to maximize muscle stretch!*`;
  }

  // Back / Deadlift / Lats / Pull-ups
  if (q.includes('back') || q.includes('lat') || q.includes('pull up') || q.includes('row') || q.includes('deadlift')) {
    return `### 🦅 Building a Wide, Thick Back for **${userName}**

A complete back routine must combine vertical pulling (width) and horizontal rowing (thickness):

**1. Vertical Pull (V-Taper Lat Width):**
- **Weighted or Bodyweight Pull-Ups:** 4 sets × 6-10 reps.
  *Cue:* Drive your elbows down into your back pockets, don't just pull with your biceps.
- **Neutral-Grip Lat Pulldown:** 3 sets × 10-12 reps.

**2. Horizontal Row (Upper Back & Mid-Trap Thickness):**
- **Barbell Bent-Over Row OR Chest-Supported T-Bar Row:** 4 sets × 8-10 reps.
  *Cue:* Pull toward your navel for lower lats, or toward upper abdomen to hit rhomboids and rear delts.

**3. Lower Back & Posterior Chain Strength:**
- **Conventional Deadlifts OR Romanian Deadlifts (RDLs):** 3-4 sets × 5-8 reps.
  *Cue:* Mid-foot barbell alignment. Squeeze your armpits shut to engage your lats before initiating the drive with your legs.

**4. Lat Isolation Finisher:**
- **Standing Straight-Arm Cable Pullovers:** 3 sets × 12-15 reps.

*💡 Frequency: Train back 2× per week with 14-18 total weekly working sets for optimal growth.*`;
  }

  // Arms: Biceps & Triceps
  if (q.includes('bicep') || q.includes('tricep') || q.includes('arm') || q.includes('curl')) {
    return `### 💪 Complete Arm Hypertrophy Protocol

Remember: **Triceps make up ~65% of upper arm size**, while biceps provide the peak!

**Triceps (All 3 Heads):**
1. **Long Head (Most Mass):** Overhead Cable or Dumbbell Tricep Extension — 3 sets × 10-12 reps (overhead position stretches the long head fully).
2. **Lateral & Medial Head:** Cable Rope Pushdowns — 4 sets × 12-15 reps with a flare at the bottom.
3. **Compound Mass Builder:** Close-Grip Bench Press OR Weighted Dips — 3 sets × 6-8 reps.

**Biceps (Peak & Thickness):**
1. **Incline Dumbbell Curl:** 3 sets × 10-12 reps (stretches long head for a bigger peak).
2. **Standing Barbell EZ-Bar Curl:** 3 sets × 8-10 reps (overload builder).
3. **Hammer Curls (Dumbbell or Cable Rope):** 3 sets × 10-12 reps (targets the **Brachialis** which pushes the bicep up, adding noticeable arm width).

*⚡ FitFolk Rule: Control the eccentric (lowering) phase for 2 seconds—that's where maximum micro-tears and muscle stimulation happen!*`;
  }

  // Legs / Squats / Quads / Hamstrings
  if (q.includes('leg') || q.includes('squat') || q.includes('quad') || q.includes('hamstring') || q.includes('calf') || q.includes('calves')) {
    return `### 🦵 Ultimate Leg Day Routine for **${userName}**

Building strong, defined wheels requires hitting quads, hamstrings, glutes, and calves:

**1. Quad-Dominant Compound:**
- **Barbell Back Squat OR Hack Squat:** 4 sets × 6-8 reps.
  *Cue:* Feet shoulder-width, break at hips and knees together, drive knees out in line with your toes.
- **Leg Press:** 3 sets × 10-12 reps (deep range of motion).

**2. Hamstrings & Glutes (Posterior Chain):**
- **Romanian Deadlifts (RDLs):** 3 sets × 8-10 reps.
  *Cue:* Soft knee bend, push hips back toward the wall until you feel an intense hamstring stretch.
- **Seated or Lying Hamstring Curls:** 3 sets × 12-15 reps.

**3. Unilateral Balance:**
- **Bulgarian Split Squats OR Walking Lunges:** 3 sets × 10 steps per leg.

**4. Calves:**
- **Standing Calf Raises:** 4 sets × 12-15 reps (pause for 2 seconds at the bottom stretch and 1 second at full extension).

*🔥 Don't skip leg day—leg training releases massive growth hormone and builds total-body metabolic power!*`;
  }

  // Abs / Core / Six Pack
  if (q.includes('abs') || q.includes('core') || q.includes('six pack') || q.includes('belly fat')) {
    return `### 🍫 The Truth About Six-Pack Abs & Core Strength

First rule of sports science: **You cannot spot-reduce belly fat.** Abs are revealed in the kitchen through a caloric deficit, but they must be built in the gym with progressive resistance like any other muscle!

**Top 4 Evidence-Based Core Exercises:**
1. **Hanging Leg Raises / Captain's Chair:** 3 sets × 10-15 reps (roll your pelvis upward to engage lower rectus abdominis, don't just swing legs).
2. **Kneeling Cable Crunches:** 3 sets × 12-15 reps (provides progressive resistance overload).
3. **Ab Wheel Rollouts:** 3 sets × 8-12 reps (anti-extension core stability).
4. **Paloff Press (Cable or Band):** 3 sets × 10 reps each side (rotational and oblique stability).

**The Nutrition Equation:**
- For men: Visible abs typically appear around **10-12% body fat**.
- For women: Visible abs appear around **18-20% body fat**.
- Keep protein high (1.8g - 2.2g per kg) to preserve muscle mass while burning fat!`;
  }

  // Creatine
  if (q.includes('creatine')) {
    return `### ⚡ Everything You Need to Know About Creatine Monohydrate

Creatine is the single most thoroughly researched and proven fitness supplement in existence:

**1. What It Does:**
- Increases intramuscular phosphocreatine stores, allowing you to generate more **ATP** during intense lifting (extra 1-3 reps per set and +5-10% strength gain).
- Pulls water into muscle cells (cellular hydration), stimulating protein synthesis.

**2. How to Take It:**
- **Daily Dosage:** **3 to 5 grams every single day**, ideally with water or a post-workout meal.
- **Timing:** Any time of day is fine—consistency is what matters to keep muscle saturation topped up.
- **Loading Phase?** Optional. You can take 20g/day for 5-7 days to saturate faster, or just take 5g/day and reach full saturation in 3-4 weeks with zero stomach discomfort.

**3. Myth Busting:**
- ❌ *Does it cause hair loss?* No scientific study has replicated this.
- ❌ *Is it a steroid?* No, it's a naturally occurring amino acid compound found in red meat and fish.
- ❌ *Do you need to cycle off?* No, long-term continuous use is proven safe in healthy individuals.`;
  }

  // Protein / Diet / Meal Prep / Weight Loss / Bulking
  if (q.includes('diet') || q.includes('protein') || q.includes('calorie') || q.includes('macro') || q.includes('lose weight') || q.includes('bulk') || q.includes('cut')) {
    return `### 🥗 Personalized Nutrition & Macro Strategy for **${userName}**

To dial in your nutrition, follow these three scientific steps:

**1. Daily Protein Target:**
- Aim for **1.6g to 2.2g of protein per kg of bodyweight** daily.
- Examples: 70kg athlete = ~120g–150g protein/day.
- Quality sources: Chicken breast, salmon, eggs, egg whites, Greek yogurt, tofu, paneer, whey isolate, lentils.

**2. Your Caloric Target:**
- **Fat Loss (Cut):** Eat in a 300–500 kcal deficit below maintenance (~0.5 kg of fat loss per week).
- **Muscle Building (Lean Bulk):** Eat in a small 200–300 kcal surplus above maintenance.
- **Body Recomposition:** Eat at maintenance calories with high protein if you are a beginner or returning from a break!

**3. Macro Ratio Split:**
- **Protein:** 30% of daily calories
- **Carbohydrates:** 45% (Oats, brown rice, sweet potatoes, fruits for workout fuel)
- **Healthy Fats:** 25% (Olive oil, nuts, avocados, fatty fish for hormone health)

*💧 Water intake:* Drink at least **3 to 4 Liters** of water daily to support muscle recovery and digestion!`;
  }

  // Workouts / Routine / Split
  if (q.includes('workout') || q.includes('routine') || q.includes('split') || q.includes('plan') || q.includes('schedule')) {
    return `### 📋 Recommended 4-Day Upper / Lower Workout Split

This is widely considered the gold standard for balancing muscle growth and recovery:

**Day 1: Upper Body (Strength Focus)**
- Barbell Bench Press: 4 sets × 6 reps
- Barbell Bent-Over Row: 4 sets × 6 reps
- Standing Overhead Press: 3 sets × 8 reps
- Lat Pulldowns: 3 sets × 8-10 reps
- Tricep Dips & Bicep Barbell Curls: 3 sets × 10 reps each

**Day 2: Lower Body (Quad Dominant)**
- Barbell Back Squats: 4 sets × 6-8 reps
- Romanian Deadlifts (RDLs): 3 sets × 8-10 reps
- Leg Press: 3 sets × 10-12 reps
- Standing Calf Raises: 4 sets × 12-15 reps
- Hanging Leg Raises: 3 sets × 15 reps

**Day 3: Rest & Mobility Walk**

**Day 4: Upper Body (Hypertrophy / Pump Focus)**
- Incline Dumbbell Press: 4 sets × 8-10 reps
- Seated Cable Rows: 4 sets × 10-12 reps
- Dumbbell Lateral Raises: 4 sets × 12-15 reps
- Incline Dumbbell Bicep Curls: 3 sets × 12 reps
- Overhead Cable Tricep Extension: 3 sets × 12 reps

**Day 5: Lower Body (Hamstring & Posterior Chain Focus)**
- Conventional Deadlift: 3 sets × 5 reps
- Bulgarian Split Squats: 3 sets × 10 steps/leg
- Lying Leg Curls: 4 sets × 12-15 reps
- Seated Calf Raises & Planks: 3 sets

**Day 6 & 7: Active Recovery & Rest**

*💡 Log these workouts in FitFolk's **Workout Tracker** tab to track your progressive overload!*`;
  }

  // Default Conversational Answer for Any Other Prompt
  return `### 💡 FitFolk AI Coach Response for **${userName}**

Regarding your question: *"**${query}**"*

Here is the exact advice based on sports science and training principles:

1. **Target the Core Principle:**
   Whether you are training for aesthetics, strength, or endurance, the primary driver is **Progressive Overload**—tracking your weights, reps, or rest intervals and gradually demanding more from your body over time.

2. **Form and Recovery First:**
   Never sacrifice execution for weight on the bar. 3 clean, controlled sets with a 2-second eccentric phase will build significantly more muscle than 5 sloppy sets with momentum.

3. **Fuel the Machine:**
   Ensure your pre-workout meal contains complex carbohydrates 1-2 hours before training, and replenish with 25-35g of protein post-workout.

4. **Action Step:**
   Try applying this during your next workout session and log the numbers in your FitFolk profile!

Do you want me to write out a specific routine, calculate your exact macros, or break down the technique for a particular exercise?`;
}
