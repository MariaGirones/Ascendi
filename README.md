# 🌱 Ascendi

A gamified Pomodoro timer web app where you grow and evolve virtual pixel-art pets through focused work sessions.

---

## ✨ Features

### 🐾 Virtual Pets
- 6 unique pets: **Mochi** (cat), **Max** (dog), **Drakon** (dragon), **Pochi** (bunny), **Kira** (fox), **Axie** (axolotl)
- Each pet has **10 evolution stages** with hand-crafted pixel art sprites
- Pets earn XP by completing Pomodoro work sessions
- Max evolves through 10 loyal-dog stages, from Puppy to Good Boy
- Axie evolves through a larva-to-axolotl life cycle, ending as a Primordial Axie

### ⏱ Pomodoro Timer
- Configurable work, short break, and long break durations
- Cycle-based sessions (1–8 sessions per cycle)
- Additional time mode with XP and points rewards
- Undo last session action
- Drift-correcting Web Worker timer (accurate even when tab is backgrounded)
- Tab visibility fix: timer resyncs when returning to the tab

### 🌿 Garden System
- **My Garden** — free, always available
- **Night Garden** — purchasable, starry sky with fireflies and glowing mushrooms
- **Winter Garden** — purchasable, snowy landscape with pine trees and snowman
- **Ocean Garden** — purchasable, ocean waves and sandy shore
- Up to 10 pets per garden
- Pets in the garden no longer evolve — their XP is frozen
- Rename pets directly in the garden
- Move pets between unlocked gardens
- Remove pets from the garden individually

### 🏪 Store
- Ocarina of Time–inspired dark wood aesthetic with torch decorations
- Purchase additional gardens (Night, Winter, Ocean)
- Coming soon: Themes, Effects, Decor

### 📊 Focus Statistics
- GitHub contribution graph–style calendar (53 weeks)
- Color intensity based on minutes worked per day
- Calendar color matches the active pet's color
- Stats: current streak 🔥, days active, best day, avg/day
- Today always visible on the left (most recent first)

### 🌍 Internationalization
- Supports 9 languages: **EN, ES, DE, FR, PT, ZH, NO, IT, JA**
- Language selector inside Settings
- Full translation coverage: UI, modals, pet picker, popups

### ⚙️ Settings
- Alarm sound: Whistle, Bell, Chime, or None
- Volume slider
- Push notifications toggle
- Language selector
- Font size: S / M / L
- Reset statistics, Reset account, Delete account

### 🏠 Two-Screen Navigation
- **Home screen**: pet display, XP bar, focus calendar, START SESSION button
- **Timer screen**: full Pomodoro controls, session info, garden/store access
- Back button returns to Home from Timer

### 🔔 Notifications & Audio
- Push notifications for session start and end (via Service Worker)
- iOS/Android audio unlock on first user gesture
- Web Audio API fallback beep if WAV fails
- Shared AudioContext to avoid mobile autoplay issues

---

## 🛠 Tech Stack

- **React** (Create React App)
- **CSS** with CSS custom properties for theming (dark/light mode)
- **Web Workers** for drift-correcting timer
- **Web Audio API** for synthesized alarm sounds
- **Canvas API** for pixel-art pet rendering
- **localStorage** for all persistent state
- **Service Worker** for push notifications
- Deployed via **GitHub Pages** (`npm run deploy`)

---

## 🚀 Getting Started

```bash
npm install
npm start
```

To deploy:
```bash
npm run deploy
```

---

## 📁 Project Structure
src/
App.js — main app component, all state and logic
App.css — all styles, theming, dark/light mode
PetDisplay.js — XP bar, stage info, join garden button
PetPicker.js — pet selection modal
petSprites.js — pixel art drawing functions for all pets and stages
pets.js — pet definitions, XP thresholds, stage names
i18n.js — translations for all 9 languages
PixelPet.js — animated canvas pet renderer
public/
timer-worker.js — drift-correcting Web Worker timer
sw.js — service worker for push notifications
endOfPomodoro.wav — end-of-session alarm sound
---

## 🗺 Roadmap

- [ ] Supabase integration (cloud save, user accounts)
- [ ] Google login (via Supabase Auth)
- [ ] Stripe payments (pet pack one-time + monthly subscription)
- [ ] Pet of the month (subscriber exclusive)
- [ ] Landing page
- [ ] Google Play Store (via PWABuilder)
- [ ] Terms & Conditions + Privacy Policy

---

## 📝 Notes

- All data is currently stored in `localStorage` — clearing browser data will reset progress
- The timer uses absolute timestamp tracking to stay accurate across tab switches
- Garden pets render their actual pixel-art sprite at the correct evolution stage

---

*Built with 🌱 and focused work sessions.*
