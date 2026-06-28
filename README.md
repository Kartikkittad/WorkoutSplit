<p align="center">
  <img src="public/icon-192.png" width="80" alt="WorkoutSplit logo" />
</p>

<h1 align="center">WorkoutSplit</h1>

<p align="center">
  <strong>The gym companion that respects your time, your privacy, and your wallet.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-C8F135?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/platform-PWA-0F172A?style=flat-square" alt="platform" />
  <img src="https://img.shields.io/badge/size-%3C1MB-green?style=flat-square" alt="size" />
  <img src="https://img.shields.io/badge/ads-zero-red?style=flat-square" alt="no ads" />
</p>

---

## The Problem

Every gym-goer knows the pain: fitness apps that demand $9.99/month subscriptions, harvest your data, require account creation, serve you ads between sets, and weigh in at 200MB+. You just want to log your bench press — not sign a contract.

## The Solution

**WorkoutSplit** is a free, offline-first, privacy-respecting Progressive Web App (PWA) that does one thing exceptionally well: **track your workouts**. No account. No cloud. No ads. Under 1MB. Install it on your phone's home screen and it works exactly like a native app — even without internet.

---

## Features

### Workout Logging
- **Real-time set tracking** — log weight × reps for every set
- **21 pre-loaded exercises** across Push, Pull, Legs, and Core categories
- **Auto rest timer** (30s–120s presets) with visual SVG ring and vibration alert
- **One-tap set completion** — mark sets done as you go

### Progress Analytics
- **Interactive line charts** with cubic-bezier smooth curves, gradient fills, and animated data points
- **Time filters** — This Week, This Month, All Time
- **Metric toggles** — Max Weight, Total Volume, Total Sets
- **Category-grouped exercise picker** with custom dropdown UI
- **Auto-detected Personal Records** with historical tracking

### Workout History
- **Complete session archive** sorted by date
- **Expandable session details** — tap any session to see full exercise breakdown
- **Duration, volume, and set count** per session

### Split Builder
- **Name your split** (e.g., "Push Pull Legs")
- **Configure training days** with custom day names
- **Pick exercises** from the full library per day
- **Set as active** to auto-populate daily workouts

### Home Dashboard
- **Time-aware greeting** (Good Morning / Afternoon / Evening)
- **Today's workout card** with live progress ring
- **Popular exercises** — quick-add shortcuts
- **Featured workouts** — curated routines (Upper Body, Lower Body, Full Body)
- **Weekly stats** — workouts completed, total volume, active streak

### PWA & Offline
- **Installable** on iOS, Android, and Desktop — no app store needed
- **Works fully offline** via service worker with cache-first strategy
- **Auto-redirects to /app** when opened from home screen (skips landing page)
- **< 1MB total size** — installs in under 5 seconds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Vanilla CSS (no UI library) |
| **Font** | [Orbitron](https://fonts.google.com/specimen/Orbitron) (Google Fonts, variable weight) |
| **Charts** | Custom SVG `<LineChart />` component (no charting library) |
| **Storage** | `localStorage` — all data stays on-device |
| **PWA** | Custom service worker + Web App Manifest |
| **Deployment** | Vercel (recommended), any Node.js host |

### Zero External UI Dependencies

No Tailwind. No Chart.js. No component library. Every component — the bottom nav, rest timer, line chart, progress circle, exercise cards — is built from scratch with vanilla CSS and inline styles. This keeps the bundle tiny and the design fully controlled.

---

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page (marketing site)
│   ├── layout.tsx            # Root layout (Orbitron font, PWA meta, service worker)
│   ├── globals.css           # Design system (tokens, components, animations)
│   ├── app/
│   │   ├── layout.tsx        # App shell (content area + bottom nav)
│   │   ├── page.tsx          # Home dashboard
│   │   ├── log/page.tsx      # Log workout screen
│   │   ├── history/page.tsx  # Workout history
│   │   ├── progress/page.tsx # Progress analytics + charts
│   │   └── create/page.tsx   # Split builder
│   └── api/                  # API routes (localStorage proxy, backward compat)
├── components/
│   ├── BottomNav.tsx         # Floating pill navigation
│   ├── LineChart.tsx         # SVG chart with bezier curves + animations
│   ├── RestTimer.tsx         # Countdown timer with SVG ring + vibration
│   ├── ProgressCircle.tsx    # Radial progress indicator
│   ├── ExerciseCard.tsx      # Exercise display card
│   └── WorkoutCard.tsx       # Session summary card
├── lib/
│   ├── exercises.ts          # Exercise library (21 exercises, 4 categories)
│   ├── storage.ts            # localStorage CRUD (workouts, splits, settings)
│   ├── seed.ts               # Sample data generator (14 realistic workouts)
│   └── types.ts              # TypeScript interfaces
public/
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker (cache-first offline strategy)
├── icon-192.png              # PWA icon (192×192)
└── icon-512.png              # PWA icon (512×512)
```

### Data Flow

```
User Action → React State → localStorage → UI Update
                                ↑
                          On mount: hydrate from localStorage
```

All data is read/written directly to `localStorage` via the `storage.ts` module. No server, no database, no API calls for core functionality. The app works identically online and offline.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Kartikkittad/WorkoutSplit.git
cd WorkoutSplit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.  
Open [http://localhost:3000/app](http://localhost:3000/app) to go directly to the app.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment

### Vercel (Recommended)

```bash
npx vercel --prod
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on every push.

### Other Platforms

WorkoutSplit is a standard Next.js app. It deploys to any platform that supports Node.js:

- **Netlify** — `npm run build` → deploy `.next/`
- **Railway** — connect repo, auto-detected
- **Docker** — use the official [Next.js Dockerfile](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
- **Static Export** — add `output: 'export'` to `next.config.ts` for CDN hosting

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#C8F135` | Buttons, active states, accents |
| `--primary-dark` | `#A8D010` | Hover states, emphasis |
| `--bg` | `#F5F5F0` | Page background |
| `--card-bg` | `#FFFFFF` | Card surfaces |
| `--nav-bg` | `#1A1A2E` | Bottom nav, dark cards |
| `--text-primary` | `#0F172A` | Headings, body text |
| `--text-secondary` | `#64748B` | Captions, metadata |

### Category Colors

| Category | Color | Hex |
|----------|-------|-----|
| Push | Lime | `#C8F135` |
| Pull | Pink | `#FFB4C8` |
| Legs | Cyan | `#B4F0FF` |
| Core | Violet | `#E4B4FF` |

### Typography

**Orbitron** — a geometric sans-serif designed for displays. Loaded via `next/font/google` with weights 400–900 for optimal rendering and zero layout shift.

---

## Privacy & Data

- **No account required** — ever
- **No analytics or tracking** — zero third-party scripts
- **No cloud sync** — data never leaves the device
- **No cookies** — nothing to consent to
- **localStorage only** — clear browser data to reset

This is a genuinely private app. There is no server-side data collection, no telemetry, no crash reporting. The API routes exist only as backward-compatible stubs.

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome (Android) | Full (installable PWA) |
| Safari (iOS 16.4+) | Full (installable PWA) |
| Chrome / Edge (Desktop) | Full (installable PWA) |
| Firefox | Functional (no install prompt) |

---

## Roadmap

- [ ] Dark mode toggle
- [ ] Workout templates & sharing
- [ ] Export data as JSON / CSV
- [ ] Body weight & measurement tracking
- [ ] Plate calculator
- [ ] Superset & circuit support
- [ ] Cloud backup (opt-in, encrypted)

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
# Make your changes
npm run build   # Ensure it builds
git commit -m "Add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## License

MIT © [Kartik Kittad](https://github.com/Kartikkittad)

---

<p align="center">
  <strong>Free forever · No ads · Your data stays on your device</strong>
</p>
