# Ascendi

**A gamified Pomodoro timer where you focus to earn points, buy food, and evolve your pixel pet.**

> Stay focused. Earn XP. Watch your sprite grow.

## Live Demo

**[mariagirones.github.io/Ascendi](https://mariagirones.github.io/Ascendi/)**

---

## How it works

1. Pick a pixel companion — Cat, Dog, Dragon, Bunny, Fox, or Axolotl
2. Start a focus session (default 25 min, fully configurable)
3. Complete the session → earn XP (1 XP per minute worked)
4. XP fuels your pet's evolution through **10 stages**, from hatchling to legendary form
5. Take your short or long break, then go again

Your pet, XP, settings, and cycle position are all saved automatically — nothing is lost on refresh.

---

## Features

- **6 pixel art companions** — each with 10 evolution stages, drawn procedurally on HTML Canvas (no image files)
- **XP & evolution system** — earn XP by completing work sessions; your pet visibly transforms as it grows
- **Full Pomodoro cycle** — configurable work sessions, short breaks, long breaks, and sessions-per-cycle; progress shown as cycle dots
- **Reset controls** — *Reset Session* restarts only the current countdown; *Reset Cycle* jumps back to session 1 without touching XP or pet progress
- **Drift-free timer** — Web Worker with `Date.now()` correction so the countdown stays accurate in background tabs
- **Flexible settings** — work duration (5–90 min), short break (5–30 min), long break (10–30 min), sessions per cycle (1–8)
- **Sound + desktop notifications** — start chime and end-of-session alert, with persistent notifications that work in background tabs
- **Retro pixel aesthetic** — Press Start 2P font, NES-style XP bar, CRT scanline overlay, soft ambient timer glow
- **Dark / light mode** — toggle anytime, persisted across sessions
- **WCAG 2.1 AA accessible** — 4.5:1+ contrast ratios, keyboard-visible focus indicators, no strobing animations
- **Full localStorage persistence** — pet, XP, theme, all durations, and cycle count survive page refresh
- **Mobile-friendly** — responsive layout down to 320 px with 48 px minimum tap targets

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | React 19 (Create React App) |
| Styling | CSS custom properties (dark/light theming) |
| Pixel art | HTML Canvas API — procedural sprites, no images |
| Timer | Web Worker + `Date.now()` drift correction |
| Persistence | `localStorage` |
| Deployment | GitHub Pages via `gh-pages` |
| Font | Press Start 2P (Google Fonts) |

---

## Project structure

```
src/
  App.js          — timer logic, XP system, localStorage, session flow
  App.css         — retro theme, dark/light mode, WCAG-compliant styles
  PetDisplay.js   — animated pet canvas + XP bar
  PetPicker.js    — companion selection modal
  PixelPet.js     — canvas rendering, animation loop
  petSprites.js   — pixel art drawing functions (6 pets × 10 stages)
  pets.js         — pet definitions, XP thresholds, stage logic
public/
  timer-worker.js — drift-correcting Web Worker
  sw.js           — minimal service worker for reliable mobile notifications
  endOfPomodoro.wav
```

---

## Run locally

```bash
git clone https://github.com/MariaGirones/Ascendi.git
cd Ascendi
npm install
npm start
```

Opens at [http://localhost:3000/Ascendi](http://localhost:3000/Ascendi).

## Deploy

```bash
npm run deploy
```

Builds and pushes to the `gh-pages` branch automatically.
