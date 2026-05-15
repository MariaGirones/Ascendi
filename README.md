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

## Mochi Evolution Stages

Mochi the orange tabby evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Appearance |
|---|---|---|---|
| 1 | Kitten | 0 | Tiny sleeping kitten — just a small head, no body |
| 2 | Drowsy Kit | 111 | Small kitten with a compact body blob and stubby paw nubs |
| 3 | Snoozy | 222 | Young kitten with a medium head, short 3-row body, and a tail stub |
| 4 | Napper | 333 | Juvenile with a taller body, one belly stripe, and an animated swishing tail |
| 5 | Tabby | 444 | Young tabby with a full-width body, three stripes, and a curled right tail |
| 6 | Lounger | 556 | Confident tabby with five stripes across two rows and an upright animated tail on the left |
| 7 | Dreamer | 667 | Striped tabby with a white belly patch, flanking side stripes, and a hooked right tail |
| 8 | House Cat | 778 | Mature tabby with extra forehead marks, white belly, long sweeping right tail, and white paw highlights |
| 9 | Elder Cat | 889 | Elder tabby with a white collar, dense seven-stripe pattern, toe highlights, and an animated thick tail |
| 10 | Grand Tabby | 1000 | Majestic fully grown tabby with a white chest ruff, elaborate markings, big paws, and a towering three-wide tail |

---

## Sunny Evolution Stages

Sunny the golden retriever evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Appearance |
|---|---|---|---|
| 1 | Puppy | 0 | Tiny floating golden head with a waggy tail nub and no body yet |
| 2 | Playful Pup | 111 | Small face above a compact body with stubby paw nubs and an animated wagging side tail |
| 3 | Bounding Pup | 222 | Medium face on a wider body with a white belly patch and a tail with a white tip |
| 4 | Young Dog | 333 | Medium face above a four-row body, a white belly stripe, and a longer curved right tail |
| 5 | Retriever | 444 | Big face, full-width four-row body, wide white chest, fluffy tail, and white paw highlights |
| 6 | Loyal Dog | 556 | Full-width body with five fur streaks across two rows and an animated upright tail on the left |
| 7 | Good Dog | 667 | White belly, flanking dark fur marks on both sides, and a hooked right tail with a white tip |
| 8 | Golden | 778 | Extra forehead fur marks, wide white belly, inner-edge fur detail, long sweeping right tail, and white paw highlights |
| 9 | Elder Hound | 889 | White collar, dense seven-mark fur pattern, four-pixel toe highlights, and an animated thick swinging tail |
| 10 | Good Boy | 1000 | Majestic two-row white chest ruff, elaborate fur markings, big wide paws, and a towering three-wide tail |

---

## Drakon Evolution Stages

Drakon the ancient dragon evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Appearance |
|---|---|---|---|
| 1 | Egg | 0 | Smooth teal egg with a white highlight patch, four dark speckles, and a faint yellow glow on one corner |
| 2 | Cracked Egg | 111 | Teal egg with jagged crack lines spreading across the shell and a pair of glowing yellow eyes peeking out from within |
| 3 | Whelp | 222 | Tiny dragon head rising above two broken shell halves, with yellow horn nubs, animated eyes, a small body, and a dark-tipped tail |
| 4 | Hatchling | 333 | Free of the shell — compact head with four yellow horn pixels, 2×2 yellow eyes, a wider body, and small 2×2 dark wing nubs on each side |
| 5 | Sparkling | 444 | Taller head with 2×2 block horns, two yellow back spines, a 10×6 body, and animated 3×3 dark wing stubs that bob up and down |
| 6 | Drake | 556 | Young dragon with small 3-wide wings, glowing yellow eyes with white pupils, 2 spines, a 3-scale body pattern, and a short pointed tail |
| 7 | Firedrake | 667 | Full 4×8 wings with webbing, fierce red eyes, 3 spines, visible teeth, and an animated four-pixel fire breath stream |
| 8 | Wyvern | 778 | Swept-back narrow wings reaching the top of the canvas, red eyes, 4 spines, teeth, and a massive 6×3 tail with three yellow spikes |
| 9 | Elder Drake | 889 | Full wings with triple webbing dots, white belly patch, flanking dark scale marks, four forehead crest marks, 5 spines, and alternating white glow in each eye |
| 10 | Dragon | 1000 | Majestic ancient dragon with yellow glow on wing outer edges, white belly, four spines, epic wider tail, and fire burning on both animation frames |

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
