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

## 🐉 Drakon Evolution Stages

Drakon the ancient dragon evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Description |
|---|---|---|---|
| 1 | Egg | 0 | Smooth teal oval egg with dark teal right-edge shading and a 2×2 white shine patch — pristine and unhatched |
| 2 | Cracked Egg | 111 | Same teal egg crossed by branching yellow crack lines radiating in a zigzag from center to lower-left — breaking open |
| 3 | Whelp | 222 | Tiny 8×6 orange body with a single dark eye on each side and small dark nubs — just emerged from the shell |
| 4 | Hatchling | 333 | Taller 8×7 orange body with growing dark orange wing nubs and a single yellow horn pixel above the head |
| 5 | Sparkling | 444 | 8×8 orange body with a salmon belly patch, wider 2×3 dark wings, a two-pixel diagonal tail stub, and a yellow horn |
| 6 | Drake | 556 | Deep red body with a salmon belly, 3-row triangular dark red wings, a longer diagonal tail, and a single yellow horn |
| 7 | Firedrake | 667 | Taller deep red body with 4-row triangular wings, a curved tail, and two yellow horn pixels flanking the head |
| 8 | Wyvern | 778 | Electric blue body with 5-row wings, two medium frilly yellow horn clusters, and 5 fire breath pixels spreading right and up |
| 9 | Elder Drake | 889 | Electric blue body with 6-row jagged wings, two large frilly yellow horns with side frills, and 7 fire pixels in a wider spread |
| 10 | Dragon | 1000 | Dramatic 8-row wings spanning nearly the full canvas, a three-horn frilly crest, and 10 fire pixels cascading up and down |

---

## 🐇 Pochi Evolution Stages

Pochi the soft lavender bunny evolves as you accumulate XP from completed focus sessions (1 XP per minute worked).

| Stage | Name | XP Required | Description |
|---|---|---|---|
| 1 | Kit | 0 | Tiny 4×3 lavender blob with two single-pixel ear nubs and dark dot eyes — barely a bunny yet |
| 2 | Cottontail | 111 | Same small lavender body with 2-tall ears showing pink inners and a single pink nose pixel |
| 3 | Bunny | 222 | Wider 6×4 lavender body, taller 3-pixel upright ears, a small purple belly stripe, and a white tail dot |
| 4 | Hopper | 333 | Full 8-wide lavender body, long 4-tall upright ears, a wider purple belly with lavender center, and white tail |
| 5 | Thumper | 444 | Crouching full form with upright ears reaching the top edge, a dark purple bow, pink paws, and white tail |
| 6 | Meadow Hare | 555 | Identical silhouette to Thumper — same lavender body and purple bow |
| 7 | Moon Hare | 666 | Body lightens to pale lavender (#d4c0f0); a single white tooth appears below the pink nose |
| 8 | Elder Hare | 777 | Body and ears lighten uniformly to soft lilac (#d4c8ee), belly pales to near-white (#ede6fa), two white teeth |
| 9 | Grand Hare | 888 | Very pale lavender (#e8e0f8) body; dark purple bow replaced by a 3-spike gold crown with a red gem; eyes turn dark red |
| 10 | Lunar Hare | 999 | Fully white body, ears, and belly; crown grows to 5 spikes on a wider gold bar; eyes glow bright red; two white teeth |

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
