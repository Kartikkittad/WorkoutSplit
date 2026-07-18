---
## Project Details

Name: WorkoutSplit
Version: v1.0.2
Tagline: Track every lift. Chase every PR. Built for the gym floor.
Type: Progressive Web App (PWA)
Stack: Next.js 14, TypeScript, Tailwind CSS, Dexie.js (IndexedDB)
Deployment: Netlify
---

## README Structure — build exactly this:

### 1. Hero Section

<div align="center">

# 🏋️ WorkoutSplit

### Track every lift. Chase every PR. Built for the gym floor.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38BDF8?style=for-the-badge&logo=tailwindcss)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify)
![Version](https://img.shields.io/badge/Version-v1.0.2-lime?style=for-the-badge)

[🚀 Live Demo](https://workoutsplit.netlify.app) ·
[🐛 Report Bug](https://github.com/yourusername/workoutsplit/issues) ·
[💡 Request Feature](https://github.com/yourusername/workoutsplit/issues)

<!-- Add app screenshot here -->

</div>

---

### 2. About Section

WorkoutSplit is a progressive web app built for serious
gym goers who want to track progressive overload, chase
PRs, and actually see their progress over time.

No login required. No internet needed in the gym.
Install it on your home screen and it works like a
native app — because it is one.

Built by a developer who was tired of noting workouts
in Notes app.

---

### 3. Features

## 🏋️ Core Tracking

- Workout split creator (Push/Pull/Legs, Upper/Lower, custom)
- Gym friendly set logging with smooth bottom sheet UI
- Big number pickers built for sweaty hands, one thumb
- Repeat last set in one tap — most used action in gym
- Superset support with chain grouping 🔗
- Built in rest timer with vibration alerts
- Plate calculator — know exactly what to load on the bar

## 📈 Progressive Overload Engine

- Auto suggests weight increase based on your last session
- Shows "Last time: 60kg × 8 · Target today: 62.5kg × 8 🎯"
- Tracks every set across every session historically

## 🏆 PR Detection & Celebration

- Detects personal records automatically in real time
- Fullscreen celebration overlay when you hit a new PR 🎉
- Complete PR history with dates and weights
- Shareable PR card — built for Instagram and WhatsApp stories

## 📊 Progress & Analytics

- Exercise progress line charts (powered by Recharts)
- Muscle group heatmap — visualize what you trained this week
- Estimated calories burned per session (MET based formula)
- Workout intensity rating (😴 Easy → ⚡ Beast mode)
- Body weight tracker with 14 day trend chart
- Weekly calories summary on home screen

## 🔥 Motivation & Streaks

- Consecutive workout streak tracker
- Milestone celebrations at 3, 7, 30 days
- Weekly training summary on home screen

## 📋 Workout Management

- Save workouts as reusable templates
- Load templates in one tap on any day
- Complete workout history with expandable sessions
- Notes per workout — log how you felt
- Export all data as CSV

## ⚙️ Settings & Personalisation

- Name and gender setup in onboarding
- Weight unit toggle kg / lbs (converts automatically)
- Default rest timer customisation
- Reset all data option

## 📱 PWA Features

- Install on iPhone or Android home screen
- Works fully offline — no internet needed in gym
- Vibration alerts for rest timer
- Native share sheet for PR cards
- No login, no account, no subscription

---

### 4. Tech Stack

| Layer      | Technology              | Purpose                  |
| ---------- | ----------------------- | ------------------------ |
| Framework  | Next.js 14 (App Router) | Core PWA framework       |
| Language   | TypeScript              | Type safety              |
| Styling    | Tailwind CSS            | UI design                |
| Storage    | Dexie.js (IndexedDB)    | Offline local database   |
| Charts     | Recharts                | Progress visualizations  |
| PWA        | next-pwa                | Service worker, offline  |
| Deployment | Netlify                 | Hosting and CDN          |
| Canvas     | html2canvas             | PR card image generation |

---

### 5. Getting Started

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

# Clone the repo

git clone https://github.com/yourusername/workoutsplit.git

# Navigate to project

cd workoutsplit

# Install dependencies

npm install

# Run development server

npm run dev

# Open in browser

http://localhost:3000

## Build for Production

npm run build
npm start

## Deploy to Netlify

1. Push to GitHub
2. Connect repo on netlify.com
3. Build command: npm run build
4. Publish directory: .next
5. Deploy

---

### 6. Project Structure

workoutsplit/
├── app/ # Next.js App Router pages
│ ├── page.tsx # Home screen
│ ├── log/ # Workout logging
│ ├── history/ # Session history
│ ├── progress/ # Charts and analytics
│ ├── splits/ # Split creator
│ └── settings/ # App settings
├── components/ # Reusable UI components
│ ├── BottomSheet.tsx # Gym friendly set logger
│ ├── RestTimer.tsx # Floating rest timer
│ ├── PRCelebration.tsx # PR overlay
│ └── Navigation.tsx # Bottom nav bar
├── lib/
│ └── db.ts # Dexie database schema
├── public/
│ └── manifest.json # PWA manifest
└── netlify.toml # Netlify config

---

### 7. Roadmap

### v1.0.2 (Current)

- [x] Core workout logging with bottom sheet UI
- [x] Progressive overload tracking
- [x] PR detection and celebration
- [x] Progress charts and muscle heatmap
- [x] Streak tracking
- [x] Gym buddy mode
- [x] Estimated calories
- [x] PWA offline support
- [x] Workout templates
- [x] Plate calculator

### v2.0.0 (Coming Soon)

- [ ] Cloud sync with Supabase
- [ ] Google and email login
- [ ] QR code gym buddy — real time multiplayer logging
- [ ] Apple Health and Google Fit integration
- [ ] AI powered workout recommendations
- [ ] Social features — share workouts with friends

---

### 8. Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'feat: add AmazingFeature')
4. Push to branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

### 9. License

Distributed under the MIT License.
See LICENSE for more information.

---

### 10. Contact & Links

Kartik Kittad
LinkedIn: linkedin.com/in/kartik-kittad-40351023a
GitHub: github.com/yourusername
Email: kartikkittad85@gmail.com

---

<div align="center">
Built with 💪 by Kartik Kittad
If this helped you, give it a ⭐ on GitHub!
</div>

---

## Instructions for generating this README:

- Output as a single clean markdown file
- No extra explanation before or after
- Use exact formatting shown above
- Keep all emojis
- Make sure all markdown renders correctly
- Version must show v1.0.2 everywhere
- File should be named README.md
