# FitFolk — Your fitness. Your people. Your progress.

> A zero-cost, investor-ready fitness social network prototype built with React, TypeScript, and Tailwind CSS.

---

## 1. Product Overview

**FitFolk** is a fitness-first social network combining community connection, verified health education, interactive workout logging, and macro nutrition tracking. 

Designed to combine the viral engagement of an Instagram-style visual feed with credible, evidence-based fitness tools, FitFolk empowers users ranging from absolute beginners to competitive athletes and licensed dietitians.

- **Working Brand Tagline:** *Your fitness. Your people. Your progress.*
- **Core Architecture:** 100% client-side, zero-cost, serverless static web application.
- **Persistence:** High-fidelity browser `localStorage` layer with one-click demo data reset.

---

## 2. Key Features

- **Interactive Social Feed:**
  - Distinct feed modes: **For You**, **Following**, and **Recommended**.
  - Dynamic post cards supporting photos, Reels, structured workouts, nutrition logs, community polls, before-and-after transformations, and educational articles with scientific citations.
  - Interactive like, comment, share, bookmark, and follow toggles with immediate state feedback.
- **24-Hour Stories & Vertical Reels:**
  - Horizontal story strip with auto-advancing slide viewer and interactive story polls.
  - TikTok/Reels-style full-screen video player with up/down navigation, sound toggles, and form safety annotations.
- **Workout Tracker & Active Session Engine:**
  - Real-time workout logger with set-by-set weight, reps, duration, and completion tracking.
  - Interactive rest timer with audible/visual countdown.
  - Searchable exercise library categorized by muscle group with safety warnings and execution cues.
  - Pre-built training templates (Push, Pull, Legs, 5K Run, Beginner Full Body).
- **Nutrition & Macro Tracker:**
  - Daily calorie progress against personalized targets.
  - Macronutrient breakdown (Protein, Carbohydrates, Fats).
  - Quick-add food logging with serving adjustments and searchable food database.
  - One-click hydration water logger (+250ml quick increments).
  - Saved meal prep and batch cooking recipes.
- **Community Fitness Q&A:**
  - Searchable question repository with topic tags.
  - Verified professional badges for qualified personal trainers and dietitians.
  - Upvoting, accepted answer indicators, and anonymous posting for beginners.
- **Fitness Challenges & Milestones:**
  - 30-Day Push-up Challenge, Hydration Week, and 10K Daily Steps streaks.
  - Live progress check-ins, achievement badges, and demonstration leaderboards.
- **Live Broadcast Rooms (Simulated):**
  - "Live Now" trainer workshops with real-time viewer counters, interactive chat stream, and host Q&A submission.
- **Investor Guided Tour:**
  - 6-step modal walkthrough communicating the business proposition, market positioning, and roadmap.

---

## 3. Technology Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript 5.6
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **Navigation:** React Router 6 (BrowserRouter)
- **Icons:** Lucide React
- **Storage:** Browser `localStorage` with JSON serialization & error recovery
- **Zero-Cost Guarantee:** No paid APIs, no backend server, no database subscription required.

---

## 4. Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher) or pnpm / yarn

---

## 5. Quick Start & Development

1. **Clone or navigate to the project directory:**
   ```bash
   cd fitfolk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 6. Production Build & Preview

1. **Compile TypeScript and create an optimized production bundle:**
   ```bash
   npm run build
   ```

2. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 7. Project Structure

```text
fitfolk/
├── public/
│   ├── favicon.svg                # Brand icon
│   └── assets/                    # Bundled brand assets
├── src/
│   ├── app/
│   │   ├── App.tsx                # App root & context providers
│   │   ├── router.tsx             # Route definitions
│   │   └── providers/
│   │       ├── DemoContext.tsx    # Global state & user actions
│   │       ├── ThemeContext.tsx   # Dark / Light theme toggle
│   │       └── ToastContext.tsx   # Toast notification system
│   ├── components/
│   │   ├── common/                # Avatar, Modal, Badge, Tabs, ConfirmDialog
│   │   ├── dialogs/               # ReportDialog
│   │   ├── layout/                # Sidebar, MobileHeader, MobileNav, RightSidebar, AppLayout
│   │   └── posts/                 # PostCard, CommentSection, ShareDialog, CreatePostDialog
│   ├── data/
│   │   ├── seed/                  # Seed users, posts, exercises, workouts, nutrition, social
│   │   └── demoData.ts            # State aggregator & graph initialization
│   ├── features/
│   │   ├── challenges/            # Fitness challenges & leaderboards
│   │   ├── community/             # Q&A questions, answers, and upvoting
│   │   ├── explore/               # Search, trending topics, and discovery tiles
│   │   ├── feed/                  # Primary social feed & story strip
│   │   ├── live/                  # Simulated live broadcast rooms & chat
│   │   ├── messages/              # Direct messaging & conversation lists
│   │   ├── notifications/         # Notification centre & safety alerts
│   │   ├── nutrition/             # Macro and calorie food tracker
│   │   ├── profiles/              # User profiles, personal bests, and follow lists
│   │   ├── reels/                 # Vertical short-form fitness video feed
│   │   ├── saved/                 # Bookmarked posts collection
│   │   ├── settings/              # Privacy, safety, export, and reset controls
│   │   ├── stories/               # 24-hour story viewer and creator
│   │   ├── tour/                  # 6-step interactive investor walkthrough
│   │   └── workouts/              # Workout tracker, timer, and exercise library
│   ├── hooks/                     # useDebounce, useLocalStorage, useMediaQuery
│   ├── lib/
│   │   └── storage.ts             # LocalStorage persistence & migration
│   ├── styles/
│   │   └── globals.css            # Custom CSS & Tailwind definitions
│   ├── types/
│   │   └── index.ts               # Core TypeScript definitions
│   └── main.tsx                   # React DOM entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 8. Demo Personas & Interactive Exploration

Use the **Demo Switcher** in the top banner or sidebar to test FitFolk through different viewpoints:

1. **Priya Sharma (`@priya_fitstart`):** Beginner 3 months into fitness, documenting her journey.
2. **Marcus Chen (`@iron_marcus`):** Strength enthusiast chasing a 200kg deadlift.
3. **Sarah Williams (`@coach_sarah`):** Verified ACE & NASM Certified Personal Trainer.
4. **Dr. Raj Patel (`@nutrition_raj`):** Verified Registered Dietitian Nutritionist (RDN).
5. **Zoe Martinez (`@zoe_moves`):** Fitness content creator posting dance & HIIT Reels.
6. **Aisha Mohammed (`@running_aisha`):** Marathon runner and morning yoga practitioner.
7. **Jake Thompson (`@curious_jake`):** Community member asking beginner form questions.
8. **Coach Mike Rivera (`@coachmike_pro`):** Collegiate strength & conditioning coach.
9. **Luna Kim (`@luna_lifts`):** Competitive powerlifter in the 63kg class.
10. **Alex Rivera (`@alex_wellness`):** Mindful mobility and plant-based nutrition creator.

---

## 9. Data Persistence & One-Click Reset

- All likes, bookmarks, comments, new posts, logged workouts, added foods, and privacy settings automatically persist in `localStorage`.
- To restore the original demonstration data:
  1. Click **Reset** on the top demo banner, or
  2. Navigate to **Settings > Demo Data Management > Reset Demo Data**.

---

## 10. Simulated vs. Production Capabilities

To keep this prototype **100% free with zero infrastructure cost**, several backend systems are faithfully simulated on the client:

| Feature | Prototype Status | Production Roadmap |
|---|---|---|
| **Social Feed & Liking** | ✅ Fully Functional (Local) | PostgreSQL / Redis Feed Cluster |
| **Workout Logging & Timers** | ✅ Fully Functional | Cloud Sync + HealthKit / Google Fit API |
| **Nutrition & Macro Tracking** | ✅ Fully Functional | USDA FoodData Central API sync |
| **Authentication & Accounts** | ⚡ Instant Demo Switcher | OAuth 2.0 / Supabase / Auth0 |
| **Live Broadcast Video** | ⚡ Simulated Room & Chat | WebRTC / HLS Live Video Infrastructure |
| **Direct Messaging** | ⚡ Local Reactive Threads | WebSockets / Matrix Protocol |
| **Professional Verification** | ⚡ Seeded Badges & Citations | Manual License & ID Verification Review |
| **AI Form Advice** | ⚡ Local Heuristics & Tips | Ollama / Gemini Vision API |

---

## 11. Free Static Deployment Guide

Because FitFolk compiles to pure static HTML/JS/CSS, it can be deployed on any 100% free hosting tier in under 2 minutes:

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Visit [vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your FitFolk repository.
4. Keep the default settings (Framework: Vite, Build: `npm run build`, Output: `dist`).
5. Click **Deploy**. Your app will be live on an HTTPS `*.vercel.app` domain.

### Deploy to Netlify
1. Push your code to GitHub.
2. Log into [netlify.com](https://www.netlify.com/) and select **Import an existing project**.
3. Set Build command to `npm run build` and Publish directory to `dist`.
4. Add a `public/_redirects` file with `/*  /index.html  200` for client-side routing.

### Deploy via Cloudflare Pages
1. Log into the Cloudflare Dashboard and go to **Workers & Pages > Create application > Pages**.
2. Connect your Git repository.
3. Select the **Vite** framework preset and click **Save and Deploy**.

---

## 12. License & Disclaimers

FitFolk is a concept prototype designed for investor presentations, academic evaluation, and UX demonstration. Fictional usernames, credentials, and testimonials are illustrative examples and do not constitute real medical or dietary prescriptions.
