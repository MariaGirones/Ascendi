# Ascendi

**A gamified Pomodoro timer where you focus to earn points, buy food, and evolve your pixel pet.**

> Stay focused. Earn XP. Watch your pet grow.

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

## 🐱 Mochi Evolution Stages

Mochi the orange tabby evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Appearance |
|---|---|---|---|
| 1 | Drowsy Kit | 0 | Tiny 6×5 orange blob with nubby ears, single-pixel eyes, and a pink nose dot — just a drowsy kitten head |
| 2 | Snoozy | 111 | Slightly wider 8×6 body with ear nubs and a small pink nose patch; still very round and compact |
| 3 | Napper | 222 | 10×7 body with the first tabby stripe across the belly — starting to look like a real cat |
| 4 | Tabby | 333 | 10×8 body with two belly stripes and taller ears; the classic tabby pattern takes shape |
| 5 | Lounger | 444 | Full-width stripes and a small three-pixel tail stub — the tail appears for the first time |
| 6 | Dreamer | 555 | 10×9 body with three stripes and a longer curling diagonal tail; a lounging, dreamy cat |
| 7 | House Cat | 666 | 10×10 body with three stripes and an even longer sweeping tail with more diagonal pixels |
| 8 | Elder Cat | 777 | Wider 11×10 body with three stripes and a long multi-pixel tail sweep — a distinguished tabby |
| 9 | Grand Tabby | 888 | 11×10 body with wider ear detail, four belly stripes, and a very long diagonal tail |
| 10 | Mythic Tabby | 999 | Double-pink ear markings, four stripes, a complete sweeping tail, and a pink paw pixel — the legendary final form |

---

## 🐶 Max Evolution Stages

Max the golden retriever evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Appearance |
|---|---|---|---|
| 1 | Puppy | 0 | Tiny golden head with small stub ears on each side, single-pixel eyes, and a brown nose dot — a baby pup |
| 2 | Playful Pup | 111 | Slightly bigger golden blob with soft rounded floppy ears and a wider brown nose stripe |
| 3 | Bounding Pup | 222 | Fuller golden body with longer dark-tipped floppy ears and a golden chin stripe below the face |
| 4 | Young Dog | 333 | Proper two-tone floppy ears with a darker outer edge; a pink tongue peeks out during the bounce animation |
| 5 | Retriever | 444 | Taller body with classic two-tone floppy ears — bouncy and full of energy |
| 6 | Loyal Dog | 555 | Body grows taller, ears lengthen a pixel, and two dark golden curl pixels appear on the forehead for the first time |
| 7 | Good Dog | 666 | Ears lengthen again, the forehead curl grows to three pixels, and the nose widens to two pixels across |
| 8 | Golden | 777 | Body rises higher on the canvas; a four-pixel golden hair tuft crowns the head and pink cheek blush marks appear |
| 9 | Elder Hound | 888 | Hair tuft widens to six pixels, nose broadens to three pixels wide, and cheek blush marks grow taller |
| 10 | Good Boy | 999 | Dramatic eight-pixel full-width hair tuft, wide cheek blush on both sides, and a red collar stripe across the chest |

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
