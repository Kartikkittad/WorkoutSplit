<div align="center">
  <img src="public/logo.png" width="110" alt="WorkoutSplit logo" />

  <h1>WorkoutSplit</h1>

  <p><strong>Track every lift. Chase every PR. Built for the gym floor.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Google-Auth-4285F4?style=for-the-badge&logo=google" alt="Google Auth" />
    <img src="https://img.shields.io/badge/Cloudflare-Turnstile-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare Turnstile" />
    <img src="https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa" alt="PWA" />
  </p>

  <p>
    <a href="https://workoutsplit.netlify.app">🚀 Live Demo</a> ·
    <a href="https://github.com/Kartikkittad/WorkoutSplit/issues">🐛 Report Bug</a> ·
    <a href="https://github.com/Kartikkittad/WorkoutSplit/issues">💡 Request Feature</a>
  </p>
</div>

## The Problem

Every gym-goer knows the pain: fitness apps that demand expensive monthly subscriptions, harvest personal data, bombard you with ads between sets, and weigh in at hundreds of megabytes. On the other hand, logging workouts in a plain Notes app is tedious, manual, and does not calculate progressive overload or track personal records automatically.

## The Solution

**WorkoutSplit** is a free, high-performance Progressive Web App (PWA) designed to do one thing exceptionally well: **track your workouts**. Powered by **Supabase PostgreSQL** for real-time cloud sync and 1-click **Google Sign-In** protected by **Cloudflare Turnstile**, your workout history, custom splits, and personal records sync seamlessly across all your devices.

## Who is this for

- **Serious lifters** who want a fast, distraction-free logging tool on the gym floor.
- **Athletes who want seamless multi-device sync** without manual export/import hassles.
- **Gym-goers** who want quick, 1-click Google authentication protected against spam.

## Features

### 🏋️ Core Tracking & Logging

- **Workout Split Builder**: Design custom workout routines (Push/Pull/Legs, Upper/Lower, or custom days) and set active splits.
- **Gym-Friendly Logger**: Quick set logging with smooth input sheets designed for one-handed operation on the gym floor.
- **Set Checkmark Undoing & Weight Editing**: Tap checkmarks `✓` to undo completed sets on-the-fly; tap set weight/reps to edit values instantly.
- **"Repeat Last Set" & Superset Connector**: Duplicate previous set values in 1-tap and link paired exercise supersets with visual connector badges.
- **Custom Exercise Creation**: Add custom exercises with category pickers (Push, Pull, Legs, Core, Cardio).
- **Auto Rest Timer**: Floating timer with circular SVG countdown and vibration alerts when your rest finishes.
- **Plate Calculator**: Tells you exactly what plates to load on the barbell for any given weight target.

### 🔒 Cloud Sync & Security

- **1-Click Google Sign-In**: Instant login via Supabase OAuth.
- **Cloudflare Turnstile CAPTCHA**: Non-intrusive bot protection to keep authentication secure and spam-free.
- **PostgreSQL Database Storage**: All workouts, routines, splits, and records saved securely with Row Level Security (RLS).
- **Theme-Aware Profile Avatars**: Seamless user profile cards with referrer-safe Google avatar integration.

### 🎨 Visual & Theme System

- **Hugeicons SVG Vector System**: 100% clean vector stroke SVGs tailored to exercise names and muscle categories.
- **Dual-Theme High Contrast**: Perfect contrast across Light and Dark modes with bold black `#111111` text on yellow `#FFE100` action buttons.
- **2D Muscle Heatmap**: Interactive 2D muscle group heatmap visualizer to inspect targeted muscle activation.

### 📈 Progressive Overload & Analytics

- **Target Calibration**: Automatically suggests weight and reps based on your last logged session (e.g. `Last: 60kg × 8 · Target: 62.5kg × 8`).
- **Real-Time PR Detection**: Alerts you with a celebration overlay when you hit a new personal record.
- **Custom SVG Analytics**: High-performance interactive line charts showing Max Weight, Volume, and total sets over time.
- **Calories Burned Estimation**: MET-based calculation tailored to your body weight and gender.

## Tech Stack

| Layer            | Technology                   | Purpose                                    |
| ---------------- | ---------------------------- | ------------------------------------------ |
| **Framework**    | Next.js 16 (App Router)      | Core React-based app framework             |
| **Language**     | TypeScript 5                 | Safe, type-safe development                |
| **Database**     | Supabase (PostgreSQL)        | Real-time cloud database & RLS security    |
| **Auth**         | Supabase Auth (Google OAuth) | 1-click single sign-on                     |
| **Security**     | Cloudflare Turnstile CAPTCHA | Bot & spam protection                      |
| **Styling**      | Vanilla CSS                  | Fast, lightweight UI design system         |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase Project & Cloudflare Turnstile Keys

### Environment Setup

Create a `.env.local` file in your root folder:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kartikkittad/WorkoutSplit.git
   cd WorkoutSplit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run SQL Migrations:
   Copy the queries in `supabase/migrations/00001_initial_schema.sql` and run them in your Supabase Dashboard SQL Editor.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open the application: [http://localhost:3000](http://localhost:3000)

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

<div align="center">
  <p>Built with 💪 by Kartik Kittad</p>
</div>
