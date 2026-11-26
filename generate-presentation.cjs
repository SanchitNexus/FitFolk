// ============================================================
// FitFolk Official 10-Slide Presentation Generator (PPTX)
// Generates a modern, high-impact PowerPoint presentation deck
// ============================================================
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new PptxGenJS();

// Presentation Properties
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
pptx.author = 'FitFolk Development Team';
pptx.company = 'FitFolk';
pptx.title = 'FitFolk - Edge-Synchronized Social Fitness Ecosystem';
pptx.subject = 'Project Presentation & Technical Architecture';

// Color Palette
const COLORS = {
  bg: '0B0E14',         // Dark Obsidian
  cardBg: '151922',     // Elevated Dark Surface
  border: '2A3142',     // Subtle Border
  lime: '99FF00',       // Brand Neon Lime
  blue: '0095F6',       // Instagram Royal Blue
  textLight: 'FFFFFF',   // Pure White
  textMuted: '94A3B8',   // Slate Muted Text
  accentOrange: 'FF6B6B',// Coral Red Accent
  accentPurple: 'A855F7',// Purple
};

const LOGO_PATH = path.resolve(__dirname, 'public', 'assets', 'presentation', 'fitfolk-logo.jpg');
const SCREENSHOT_JOIN = path.resolve(__dirname, 'public', 'assets', 'presentation', 'screenshot-mobile-join.jpg');
const SCREENSHOT_FEED = path.resolve(__dirname, 'public', 'assets', 'presentation', 'screenshot-feed-post.png');
const SCREENSHOT_HOME = path.resolve(__dirname, 'public', 'assets', 'presentation', 'screenshot-feed-home.png');

// Helper: Common slide header
function addSlideHeader(slide, category, title, subtitle) {
  // Category Pill / Tag
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.4,
    w: 8.4,
    h: 0.3,
    fontSize: 10,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
  });

  // Main Title
  slide.addText(title, {
    x: 0.8,
    y: 0.65,
    w: 8.4,
    h: 0.5,
    fontSize: 22,
    fontFace: 'Arial',
    color: COLORS.textLight,
    bold: true,
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8,
      y: 1.15,
      w: 8.4,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  }

  // Header separator line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.5,
    w: 8.4,
    h: 0.02,
    fill: { color: COLORS.border },
    line: { color: COLORS.border, width: 0 },
  });
}

// ============================================================
// SLIDE 1: Title Slide
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  // Background ambient card
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 0.6,
    w: 8.8,
    h: 4.425,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.border, width: 1.5 },
  });

  // Brand Logo
  if (fs.existsSync(LOGO_PATH)) {
    slide.addImage({
      path: LOGO_PATH,
      x: 1.2,
      y: 1.1,
      w: 1.4,
      h: 1.4,
    });
  }

  // App Title
  slide.addText([
    { text: 'Fit', options: { color: COLORS.textLight, bold: true, fontSize: 44, fontFace: 'Arial' } },
    { text: 'folk', options: { color: COLORS.lime, bold: true, fontSize: 44, fontFace: 'Arial' } },
  ], {
    x: 2.8,
    y: 1.1,
    w: 5.5,
    h: 0.7,
  });

  // Tagline
  slide.addText('Your Fitness. Your People. Your Progress.', {
    x: 2.8,
    y: 1.75,
    w: 6.0,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: COLORS.blue,
    bold: true,
  });

  // Description / Mission
  slide.addText('An Edge-Synchronized Social Fitness Ecosystem & On-Device AI Coaching Platform. Built with zero cloud costs, multi-device real-time synchronization, and local LLM intelligence.', {
    x: 2.8,
    y: 2.2,
    w: 6.0,
    h: 0.9,
    fontSize: 12,
    fontFace: 'Arial',
    color: COLORS.textMuted,
  });

  // Highlight Badges / Metadata
  const badges = [
    { text: '⚡ React 18 & TypeScript', color: COLORS.blue },
    { text: '🧠 Ollama Local AI LLM', color: COLORS.lime },
    { text: '🔄 Server-Sent Events Sync', color: COLORS.accentOrange },
    { text: '🌍 Cloudflare Tunnel', color: COLORS.accentPurple },
  ];

  badges.forEach((b, idx) => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.2 + (idx * 1.9),
      y: 3.5,
      w: 1.8,
      h: 0.5,
      fill: { color: '1A202C' },
      line: { color: b.color, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(b.text, {
      x: 1.2 + (idx * 1.9),
      y: 3.5,
      w: 1.8,
      h: 0.5,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLORS.textLight,
      bold: true,
      align: 'center',
      valign: 'middle',
    });
  });

  // Footer / Presenter Info
  slide.addText('Full-Stack Web Engineering Project  |  Comprehensive Technical Overview', {
    x: 1.2,
    y: 4.3,
    w: 7.6,
    h: 0.3,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textMuted,
    align: 'center',
  });

  slide.addNotes('Welcome everyone! Today I am proud to present FitFolk — an edge-synchronized social fitness ecosystem. FitFolk combines the vibrant community feel of Instagram with high-precision workout and macro tracking, and brings a private on-device conversational AI fitness coach powered by Ollama. Over the next 10 slides, we will dive into what it does, how it is made, and answer the technical questions behind its architecture.');
}

// ============================================================
// SLIDE 2: Problem vs Solution
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Industry Analysis', 'The Problem vs. The FitFolk Solution', 'Why modern fitness apps fail and how FitFolk reimagines the user experience');

  // Left Card: The Problem
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: 'DC2626', width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('❌ CURRENT FITNESS APP CHALLENGES', {
    x: 1.0,
    y: 1.9,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: 'EF4444',
    bold: true,
  });

  const problemPoints = [
    '• Fragmented Tooling: Users jump across Instagram for motivation, MyFitnessPal for calories, and notes for lifts.',
    '• Heavy Subscription Costs: Premium apps charge $10-$25/month for basic set logging or meal insights.',
    '• Fitness Misinformation: Commercial feeds lack credential verification, leading to dangerous form and fad diets.',
    '• Cloud Data Lock-in: Heavy cloud dependencies cause slowdowns, outages, and privacy concerns.',
  ];

  slide.addText(problemPoints.join('\n\n'), {
    x: 1.0,
    y: 2.3,
    w: 3.6,
    h: 2.7,
    fontSize: 10,
    fontFace: 'Arial',
    color: COLORS.textMuted,
  });

  // Right Card: The FitFolk Solution
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.2,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.lime, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('✅ THE FITFOLK INNOVATION', {
    x: 5.4,
    y: 1.9,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
  });

  const solutionPoints = [
    '• All-In-One Unified Ecosystem: Seamlessly merges social reels, 24h stories, set-by-set logging, and macro nutrition.',
    '• $0 Cloud Costs: Real-time multi-device sync engineered via Server-Sent Events and local edge persistence.',
    '• Verified Professional Authority: Credential badges for CSCS trainers, Registered Dietitians, and Doctors.',
    '• Autonomous Local AI Coach: On-demand biomechanical and nutrition advice with zero latency and complete privacy.',
  ];

  slide.addText(solutionPoints.join('\n\n'), {
    x: 5.4,
    y: 2.3,
    w: 3.6,
    h: 2.7,
    fontSize: 10,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  slide.addNotes('When evaluating current fitness applications, we noticed three major pain points: tool fragmentation, expensive monthly subscriptions, and widespread unverified advice. FitFolk solves this by unifying social media, lift tracking, and certified sports science into a zero-cost, edge-synchronized application with an on-device AI trainer.');
}

// ============================================================
// SLIDE 3: Core Features & User Journey
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Platform Capabilities', 'Core Features & User Ecosystem', 'A complete end-to-end fitness journey designed for community engagement');

  const features = [
    {
      title: '📸 Social Feed & Reels',
      color: COLORS.blue,
      desc: 'Instagram-inspired feed with 24-hour stories, video reels, photo posts, like/comment threads, bookmarking, and private post archiving.',
    },
    {
      title: '🏋️ Workout & PR Logger',
      color: COLORS.lime,
      desc: 'Set-by-set strength tracker with RPE, rest countdowns, compound exercise library (Bench, Squat, Deadlift), and Personal Record spotlights.',
    },
    {
      title: '🥗 Macro & Nutrition Science',
      color: COLORS.accentOrange,
      desc: 'Personalized caloric maintenance and cutting calculations, protein/carb/fat targets by body weight, and nutrient-dense meal prep recipe cards.',
    },
    {
      title: '🤝 Community Q&A & Badges',
      color: COLORS.accentPurple,
      desc: 'Verified professional answer badges (CSCS, ACE, RDN), monthly fitness challenges, live broadcast reminders, and follow networks.',
    },
  ];

  features.forEach((f, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = 0.8 + (col * 4.4);
    const y = 1.7 + (row * 1.8);

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 4.0,
      h: 1.6,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });

    slide.addText(f.title, {
      x: x + 0.2,
      y: y + 0.15,
      w: 3.6,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      color: f.color,
      bold: true,
    });

    slide.addText(f.desc, {
      x: x + 0.2,
      y: y + 0.55,
      w: 3.6,
      h: 0.95,
      fontSize: 10,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  });

  slide.addNotes('FitFolk is built on four core pillars: First, an Instagram-style social feed with reels and stories. Second, an evidence-based workout logger tracking weight, reps, and PRs. Third, precision nutrition science with customized macro calculations. Fourth, a trusted community Q&A board where answers from certified trainers and dietitians are verified.');
}

// ============================================================
// SLIDE 4: Technical Stack & Programming Languages
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Technical Architecture', 'Programming Languages & Core Frameworks', 'Answers: "What languages and technologies does FitFolk use to operate?"');

  // Left Column: Frontend Languages & Frameworks
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.blue, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('💻 FRONTEND ARCHITECTURE', {
    x: 1.0,
    y: 1.85,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.blue,
    bold: true,
  });

  const frontendTech = [
    '• TypeScript 5.x: 100% strictly typed codebase ensuring complete type safety across 50+ components, domain entities, and network payloads.',
    '• React 18: Modern functional component architecture with hooks (useContext, useMemo, useCallback) and custom responsive hooks.',
    '• Tailwind CSS 3.x: Utility-first styling with custom Instagram gradients, dark/light themes, and mobile-first touch optimization.',
    '• React Router v6: Dynamic client-side routing with route guards, guest isolation, and deep URL linking.',
  ];

  slide.addText(frontendTech.join('\n\n'), {
    x: 1.0,
    y: 2.25,
    w: 3.6,
    h: 2.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  // Right Column: Runtime & Tooling
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.2,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.lime, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('⚙️ RUNTIME, SERVER & TOOLING', {
    x: 5.4,
    y: 1.85,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
  });

  const backendTech = [
    '• Node.js (v24 LTS): Server-side JavaScript runtime powering custom middleware, binary file streaming, and real-time broadcasts.',
    '• Vite 6 Build Engine: Ultra-fast Hot Module Replacement (HMR) and optimized Rollup tree-shaken production bundles.',
    '• Lucide Icons: Accessible, pixel-perfect SVG iconography designed for fitness, social interactions, and navigation.',
    '• HTML5 & CSS3 Standards: PWA compliant with touch-gesture responsiveness, viewport scaling, and Web Share APIs.',
  ];

  slide.addText(backendTech.join('\n\n'), {
    x: 5.4,
    y: 2.25,
    w: 3.6,
    h: 2.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  slide.addNotes('If technical reviewers ask what language FitFolk is written in: The entire application is written in TypeScript and React 18, styled using Tailwind CSS, and compiled using Vite 6. On the backend runtime, we use Node.js to power custom HTTP streaming middleware, event dispatching, and tunnel management without requiring third-party cloud hosting.');
}

// ============================================================
// SLIDE 5: Database & Storage Architecture
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Data Engineering', 'Database & Storage Architecture', 'Answers: "What database does it use and how are photos & profiles saved?"');

  const tiers = [
    {
      tier: 'TIER 1: Client Storage',
      name: 'Browser LocalStorage (v4)',
      color: COLORS.blue,
      desc: 'Provides sub-millisecond query speed and offline resilience. Persists active user session, UI preferences, dark/light theme, and cached profiles directly in browser storage.',
    },
    {
      tier: 'TIER 2: Local Server Database',
      name: 'Server-Data JSON Store',
      color: COLORS.lime,
      desc: 'Centralized atomic file-system database (server-data.json) managed by custom Vite middleware. Handles persistent storage of multi-device user signups, credentials, and social posts.',
    },
    {
      tier: 'TIER 3: Binary Media Store',
      name: 'Dynamic Uploads Filesystem',
      color: COLORS.accentOrange,
      desc: 'Decodes base64 photos and video reels directly to public/uploads/ with timestamped hashes. Serves binary streams with MIME-type headers (image/jpeg, video/mp4).',
    },
  ];

  tiers.forEach((t, idx) => {
    const y = 1.7 + (idx * 1.15);

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y,
      w: 8.4,
      h: 1.0,
      fill: { color: COLORS.cardBg },
      line: { color: t.color, width: 1.5 },
      rectRadius: 0.1,
    });

    slide.addText(t.tier.toUpperCase(), {
      x: 1.0,
      y: y + 0.1,
      w: 3.5,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: t.color,
      bold: true,
    });

    slide.addText(t.name, {
      x: 1.0,
      y: y + 0.35,
      w: 3.5,
      h: 0.35,
      fontSize: 12,
      fontFace: 'Arial',
      color: COLORS.textLight,
      bold: true,
    });

    slide.addText(t.desc, {
      x: 4.4,
      y: y + 0.1,
      w: 4.6,
      h: 0.8,
      fontSize: 9.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  });

  // Architectural benefit callout
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 5.15,
    w: 8.4,
    h: 0.35,
    fill: { color: '1E293B' },
    line: { color: COLORS.border, width: 0.5 },
  });

  slide.addText('💡 Architectural Advantage: $0 monthly hosting bills, complete user privacy, zero vendor lock-in, and instant local network performance.', {
    x: 0.9,
    y: 5.15,
    w: 8.2,
    h: 0.35,
    fontSize: 9,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
    align: 'center',
    valign: 'middle',
  });

  slide.addNotes('A central question often asked is: What database does FitFolk use? FitFolk employs a 3-tier local edge architecture. Client-side state is cached in browser LocalStorage. Central data across devices is stored in a structured JSON database managed via Vite middleware, and media files are streamed as raw binaries from disk. This eliminates paid cloud database dependencies entirely.');
}

// ============================================================
// SLIDE 6: Real-Time Sync & Networking Architecture
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Distributed Systems', 'Real-Time Sync & Worldwide Tunneling', 'Answers: "How does it synchronize across multiple phones and PCs live?"');

  const components = [
    {
      title: '1. Server-Sent Events (SSE)',
      tag: 'LIVE EVENT BROADCAST',
      color: COLORS.lime,
      bullets: [
        'Persistent unidirectional HTTP connection (/api/events).',
        'Broadcasts instant mutations: user_registered, post_created, post_deleted, post_archived, follow_toggled.',
        'Zero polling overhead; reduces battery and network drain on smartphones.',
      ],
    },
    {
      title: '2. Multi-Tab BroadcastChannel',
      tag: 'IN-BROWSER BUS',
      color: COLORS.blue,
      bullets: [
        'Native HTML5 BroadcastChannel API (fitfolk_network_sync).',
        'Instantly coordinates multiple tabs in the same browser window.',
        'Prevents duplicate REST requests and ensures synchronized active sessions.',
      ],
    },
    {
      title: '3. Cloudflare Worldwide Tunnel',
      tag: 'GLOBAL REACHABILITY',
      color: COLORS.accentOrange,
      bullets: [
        'Automated reverse-proxy runner (start-tunnel.cjs).',
        'Tunnels localhost:5173 to an encrypted trycloudflare.com edge URL.',
        'Direct phone QR scan access over 4G/5G without port-forwarding or router configs.',
      ],
    },
  ];

  components.forEach((c, idx) => {
    const x = 0.8 + (idx * 2.9);
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.7,
      w: 2.7,
      h: 3.5,
      fill: { color: COLORS.cardBg },
      line: { color: c.color, width: 1.5 },
      rectRadius: 0.12,
    });

    slide.addText(c.tag, {
      x: x + 0.15,
      y: 1.85,
      w: 2.4,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: c.color,
      bold: true,
    });

    slide.addText(c.title, {
      x: x + 0.15,
      y: 2.1,
      w: 2.4,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Arial',
      color: COLORS.textLight,
      bold: true,
    });

    slide.addText(c.bullets.map(b => '• ' + b).join('\n\n'), {
      x: x + 0.15,
      y: 2.55,
      w: 2.4,
      h: 2.5,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  });

  slide.addNotes('How does multi-device synchronization work? We engineered a reactive pipeline combining three technologies: Server-Sent Events push new users and posts to all connected phones in real time; the BroadcastChannel API coordinates open browser tabs; and Cloudflare quick tunnels create an encrypted global URL so friends can scan a QR code and join on 4G or 5G.');
}

// ============================================================
// SLIDE 7: AI Coach & Machine Learning Architecture
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Artificial Intelligence', 'AI Coach & Neural LLM Integration', 'Answers: "What AI model does FitFolk use and how does it generate answers?"');

  // Left Card: 3-Tier AI Stack
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 5.2,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.lime, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('🧠 3-TIER CONVERSATIONAL AI PIPELINE', {
    x: 1.0,
    y: 1.85,
    w: 4.8,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
  });

  const aiTiers = [
    '• Tier 1: Local Ollama LLM (Port 11434): Directly communicates with open-source foundational models (Llama 3.2 3B, Mistral 7B, Phi-3). Delivers 100% private, on-device coaching with customized system prompts.',
    '• Tier 2: Neural Cloud Fallback: Seamlessly transitions to neural text APIs when local Ollama is offline or running on mobile hardware.',
    '• Tier 3: Dynamic Conversational Fitness Brain: Context-aware sports science rule engine providing instant sub-10ms guidance tailored to the user\'s name, lift mechanics, caloric deficits, and recovery.',
  ];

  slide.addText(aiTiers.join('\n\n'), {
    x: 1.0,
    y: 2.2,
    w: 4.8,
    h: 2.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  // Right Column: Domain Capabilities
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.2,
    y: 1.7,
    w: 3.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.blue, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('🎯 COACH CAPABILITIES', {
    x: 6.4,
    y: 1.85,
    w: 2.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.blue,
    bold: true,
  });

  const capabilities = [
    '🏋️ Compound Lift Cues (Squat, Bench, Deadlift setup & bar path)',
    '🥗 Precision Macro & Calorie Math (Cutting/bulking targets by weight)',
    '⚡ Custom Training Splits (PPL, Upper/Lower, 3-to-6 day plans)',
    '🛡️ Injury & Soreness Advice (DOMS relief, warm-up diagnostics)',
    '💬 Natural Chit-Chat & Daily Motivation',
  ];

  slide.addText(capabilities.join('\n\n'), {
    x: 6.4,
    y: 2.2,
    w: 2.6,
    h: 2.8,
    fontSize: 8.5,
    fontFace: 'Arial',
    color: COLORS.textMuted,
  });

  slide.addNotes('What model does the AI Coach use? FitFolk implements a multi-tiered conversational architecture. If Ollama is running locally on port 11434, it queries open-source models like Llama 3.2 or Mistral with a specialized fitness coach prompt. When local inference is unavailable, it gracefully falls back to a neural cloud endpoint and our built-in sports science intelligence brain.');
}

// ============================================================
// SLIDE 8: Security, Privacy & Access Control
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Security Engineering', 'Privacy, Security & Access Control', 'Hardened protections preventing unauthorized access and data leakage');

  const securityFeatures = [
    {
      title: '🔒 Zero-Session Guest Isolation',
      desc: 'Unauthenticated visitors on shared links cannot access private feeds, notification bells, or messages. They are strictly restricted to the clean /login or /join onboarding view.',
      color: COLORS.blue,
    },
    {
      title: '🛡️ Device Authorization (deviceAuth.ts)',
      desc: '1-Click demo profiles and developer account switchers are strictly visible on the host development machine (localhost) and completely hidden from public shared links.',
      color: COLORS.lime,
    },
    {
      title: '📱 Secret Owner Phone Unlock',
      desc: 'Allows developers to unlock testing personas on personal mobile devices by tapping the brand logo 5 times or visiting with ?owner=true, while remaining 100% hidden to guests.',
      color: COLORS.accentOrange,
    },
    {
      title: '📦 Instagram Archive & Permanent Delete',
      desc: 'Authors can archive posts (hiding them from public feeds into a private archive tab) or permanently delete posts with a confirmation modal and server-wide synchronization.',
      color: COLORS.accentPurple,
    },
  ];

  securityFeatures.forEach((s, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = 0.8 + (col * 4.4);
    const y = 1.7 + (row * 1.8);

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 4.0,
      h: 1.6,
      fill: { color: COLORS.cardBg },
      line: { color: s.color, width: 1.5 },
      rectRadius: 0.1,
    });

    slide.addText(s.title, {
      x: x + 0.2,
      y: y + 0.15,
      w: 3.6,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Arial',
      color: s.color,
      bold: true,
    });

    slide.addText(s.desc, {
      x: x + 0.2,
      y: y + 0.55,
      w: 3.6,
      h: 0.95,
      fontSize: 9,
      fontFace: 'Arial',
      color: COLORS.textMuted,
    });
  });

  slide.addNotes('Security and privacy were top priorities in recent iterations. We closed several critical loopholes: visiting via a shared link no longer leaks notifications or active sessions; demo accounts are strictly hidden from external users via deviceAuth; and users have full Instagram-style control to archive or delete their posts.');
}

// ============================================================
// SLIDE 9: Visual Showcase & App Screenshots
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'UI / UX Design', 'Application Interface & Live Screenshots', 'Pixel-perfect dark luxury aesthetics with fluid responsive interactions');

  // Left Screenshot: Mobile Join View
  if (fs.existsSync(SCREENSHOT_JOIN)) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.65,
      w: 2.6,
      h: 3.65,
      fill: { color: '000000' },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });
    slide.addImage({
      path: SCREENSHOT_JOIN,
      x: 0.9,
      y: 1.75,
      w: 2.4,
      h: 3.1,
    });
    slide.addText('Mobile Join & Sign Up Interface', {
      x: 0.8,
      y: 4.95,
      w: 2.6,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLORS.lime,
      bold: true,
      align: 'center',
    });
  }

  // Middle Screenshot: Feed & Post
  if (fs.existsSync(SCREENSHOT_FEED)) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 3.65,
      y: 1.65,
      w: 2.7,
      h: 3.65,
      fill: { color: '000000' },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });
    slide.addImage({
      path: SCREENSHOT_FEED,
      x: 3.75,
      y: 1.75,
      w: 2.5,
      h: 3.1,
    });
    slide.addText('Workout Post & Stories Carousel', {
      x: 3.65,
      y: 4.95,
      w: 2.7,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLORS.blue,
      bold: true,
      align: 'center',
    });
  }

  // Right Screenshot / Desktop Feed Home
  if (fs.existsSync(SCREENSHOT_HOME)) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.55,
      y: 1.65,
      w: 2.65,
      h: 3.65,
      fill: { color: '000000' },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });
    slide.addImage({
      path: SCREENSHOT_HOME,
      x: 6.65,
      y: 1.75,
      w: 2.45,
      h: 3.1,
    });
    slide.addText('Interactive Desktop Feed Layout', {
      x: 6.55,
      y: 4.95,
      w: 2.65,
      h: 0.3,
      fontSize: 8.5,
      fontFace: 'Arial',
      color: COLORS.accentOrange,
      bold: true,
      align: 'center',
    });
  }

  slide.addNotes('Here you can see the application running across different viewports. On the left is the mobile join and profile creation screen with persona selection; in the center is the social feed with 24-hour stories and workout completion cards; and on the right is the full desktop layout with quick sidebars.');
}

// ============================================================
// SLIDE 10: Conclusion & Future Roadmap
// ============================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, 'Project Milestones', 'Roadmap, Impact & Conclusion', 'Summary of deliverables and future evolution of the FitFolk platform');

  // Left Column: Key Deliverables
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.lime, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('🏆 KEY ACHIEVEMENTS', {
    x: 1.0,
    y: 1.85,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.lime,
    bold: true,
  });

  const achievements = [
    '• Zero-Cost Edge PWA: Full social fitness functionality delivered without recurring database or cloud hosting bills.',
    '• Reactive Multi-Device Sync: Real-time user signups, follows, and photo posts synchronized over SSE and REST.',
    '• Privacy-Preserving AI Coach: Seamless integration with local Ollama LLMs and sports science heuristics.',
    '• Professional Credential Standards: Built-in verification badges elevating evidence-based fitness advice.',
  ];

  slide.addText(achievements.join('\n\n'), {
    x: 1.0,
    y: 2.2,
    w: 3.6,
    h: 2.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  // Right Column: Future Roadmap
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.2,
    y: 1.7,
    w: 4.0,
    h: 3.5,
    fill: { color: COLORS.cardBg },
    line: { color: COLORS.blue, width: 1.5 },
    rectRadius: 0.15,
  });

  slide.addText('🚀 FUTURE ROADMAP', {
    x: 5.4,
    y: 1.85,
    w: 3.6,
    h: 0.3,
    fontSize: 11,
    fontFace: 'Arial',
    color: COLORS.blue,
    bold: true,
  });

  const roadmap = [
    '• Native App Store Packaging: Wrap PWA via Capacitor for native iOS App Store and Google Play distribution.',
    '• Computer Vision Form Analysis: In-browser camera exercise form checks using TensorFlow.js and PoseNet.',
    '• Wearables HealthKit Sync: Bi-directional synchronization with Apple Watch, Garmin, and Google Health Connect.',
    '• Group Video Challenges: WebRTC-powered live synchronized group workout classes.',
  ];

  slide.addText(roadmap.join('\n\n'), {
    x: 5.4,
    y: 2.2,
    w: 3.6,
    h: 2.8,
    fontSize: 9.5,
    fontFace: 'Arial',
    color: COLORS.textLight,
  });

  slide.addNotes('In conclusion, FitFolk proves that a full-scale, real-time social fitness application with local artificial intelligence can be built cost-effectively, securely, and with exceptional performance. Future enhancements will include computer vision form checking and wearable health sync. Thank you all for your time — I am now open to any questions!');
}

// Generate the PPTX File
const outputPath = path.resolve(__dirname, 'FitFolk-Presentation.pptx');
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`\x1b[32m✓ Successfully generated 10-slide presentation at: ${outputPath}\x1b[0m`);
  })
  .catch((err) => {
    console.error('❌ Failed to generate presentation:', err);
  });
