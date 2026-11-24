# ⏱️ StudyBloom — Minimalist Flip Clock & GATE CSE Study Tracker

An aesthetic, high-contrast **Black & White monochrome study companion** featuring an authentic 3D digital flip clock, drift-free study timer, procedural ambient soundscapes, consistency analytics, and distraction-free fullscreen focus mode.

Designed specifically for deep work, consistent study hours, and **GATE CSE** preparation.

---

## ✨ Features

### 🕰️ 1. 3D Mechanical Flip Clock
- **Authentic Flip Cards:** Dual-leaf 3D flip card animations with upper/lower splits, mechanical side clips, and realistic split shadow grooves.
- **Dual Display Modes:** Switch between **Live Clock** (HH:MM:SS with 12h/24h toggle) and **Study Timer** on the large flip cards.
- **Date & Greetings:** Real-time date display and contextual greetings (*"A little progress every day ✨"*, *"Quiet night study session"*, etc.).
- **Mechanical Tick Audio:** Gentle physical card-turning sound effect on digit changes.

### 🖥️ 2. Distraction-Free Fullscreen Focus Mode
- **True Browser Fullscreen:** Requests native browser fullscreen (`Esc` to exit) to hide browser tabs, bookmarks, and distractions.
- **Giant Flip Timer:** Massive, crisp flip digits centered on a pure pitch-black screen.
- **Integrated Controls:** Pause, Resume, Stop & Save session, and an embedded ambient sound bar.
- **Active Subject Badge:** Shows current subject and status (*"Deep Focus"* / *"Paused"*).

### 🎧 3. Built-in Procedural Ambient Soundscapes
Synthesized in real-time directly through the browser Web Audio API—no external audio files required:
- 🌧️ **Gentle Rain:** Soothing rainfall with randomized droplet pings.
- 🌊 **Ocean Waves:** Deep rolling tidal swells with natural oscillation.
- 🧘 **Zen 432Hz:** Warm harmonic Tibetan singing drone (216Hz, 324Hz, 432Hz, 540Hz).
- ☕ **Cozy Cafe:** Ambient background coffee shop murmur with subtle ceramic cup clinks.
- ☁️ **Pink Noise:** 1/f spectral density noise for drowning out background chatter.
- **Audio Feedback:** Tibetan bell chimes when starting, pausing, or completing sessions.

### ⏱️ 4. GATE CSE Study-Hour Tracker
- **10 Categorized Subjects:** Operating Systems, DBMS, Computer Networks, Algorithms, Theory of Computation, Computer Organization, Engineering Mathematics, Programming in C, General Revision, and custom topics.
- **Drift-Free Precision:** Tracks time by calculating real timestamp differences (`Date.now() - startTime`) rather than simple interval ticks, ensuring 100% accuracy even when browser tabs are backgrounded.
- **Session Notes:** Tag each session with specific topics (e.g., *"Solving PYQs on Virtual Memory"*).

### 🎯 5. Daily Goals & Consistency Dashboard
- **Customizable Daily Goal:** Set study targets (default: 8 hours) with quick presets (4h, 6h, 8h, 10h, 12h).
- **Completion Progress Bar:** High-contrast progress bar with celebratory confetti when achieving 100%.
- **Weekly Total & Streak:** Tracks Monday-Sunday hours and calculates consecutive study streaks.

### 📊 6. Analytics & Monochrome Charts
- **Daily Trend Chart:** Past 7 days & 14 days interactive bar charts with goal line markers and hover tooltips.
- **Subject-Wise Distribution:** Grayscale multi-segment progress bar and session breakdown.
- **Key Milestones:** Highlights best study day, monthly total, all-time study hours, and completed sessions.

### 📅 7. Consistency Calendar & History Log
- **Monthly Calendar Grid:** Highlights study days with solid status dots based on hours invested.
- **Filterable Session Log:** Search by date, subject, or notes.
- **Export Data:** Download your study log as **CSV** spreadsheet or **JSON** backup.

---

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS with custom 3D flip card keyframes & perspective
- **Audio Engine:** Web Audio API (procedural synthesis)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Storage:** LocalStorage with automatic state synchronization

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (version 18 or higher) installed:
```bash
node -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Parulsri1616/Study-Bloom-flipclock.git
   cd Study-Bloom-flipclock
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
```
The optimized production files will be output to the `dist/` directory.

### Deploy to Vercel
Deploying with the Vercel CLI:
```bash
npx vercel
```
Or connect your GitHub repository directly on [vercel.com/new](https://vercel.com/new)—`vercel.json` is already configured for zero-setup single-page routing.

### Deploy to Netlify
Push to GitHub and import into [app.netlify.com](https://app.netlify.com)—`netlify.toml` is pre-configured.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
