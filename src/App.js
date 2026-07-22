import './App.css';
import { useState, useEffect, useRef } from 'react';
import PetDisplay from './PetDisplay';
import PetPicker from './PetPicker';
import { MAX_XP, getStageIndex, getPetById } from './pets';
import { drawPet } from './petSprites';
import { LANGUAGES, LS_LANG, loadLang, T } from './i18n';

// ── Audio: end-of-session WAV ─────────────────────────────────────────────────
let audio = null;
let audioUnlocked = false;

function preloadAudio() {
  if (!audio) {
    audio = new Audio(process.env.PUBLIC_URL + '/endOfPomodoro.wav');
    audio.load();
  }
}

// Mobile browsers (iOS Safari, Android Chrome) block audio.play() unless it's
// invoked from within a user gesture. Unlock the element once, on the first
// pointerdown anywhere in the app, by playing + immediately pausing it — after
// that, calling audio.play() later (e.g. on session end, with no fresh
// gesture) is allowed.
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  preloadAudio();
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(err => console.warn('[Ascendi audio]', err));
}

// ── Audio: shared Web Audio context (start chime + WAV-failure beep) ─────────
let audioCtx = null;
function getAudioCtx() {
  const AudioCtx = window.AudioContext || window['webkitAudioContext'];
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

// iOS Safari suspends the AudioContext until it's resumed from within a user
// gesture; call this at the top of any gesture-triggered handler (e.g. Start).
function resumeAudioCtxIfSuspended() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(err => console.warn('[Ascendi audio]', err));
  }
}

// Two ascending sine tones (E5 → A5) — clearly distinct from the end WAV.
// Fires on the user's tap/click, so mobile autoplay restrictions do not apply.
function playStartChime() {
  try {
    const ctx = getAudioCtx();
    const t   = ctx.currentTime;
    [659.25, 880].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type          = 'sine';
      osc.frequency.value = freq;
      const onset = t + i * 0.16;
      gain.gain.setValueAtTime(0, onset);
      gain.gain.linearRampToValueAtTime(0.25, onset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, onset + 0.38);
      osc.start(onset);
      osc.stop(onset + 0.38);
    });
  } catch (e) {
    console.warn('[Ascendi audio]', e);
  }
}

// Fallback beep (short 440Hz sine tone) used when the end-of-session WAV
// fails to play (e.g. audio.play() rejected by the browser).
function playFallbackBeep() {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 440;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.3, t);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch (e) {
    console.warn('[Ascendi audio]', e);
  }
}

// Plays the end-of-session WAV, falling back to a synthesized beep if it fails.
function playEndSound() {
  preloadAudio();
  audio.currentTime = 0;
  audio.play().catch(err => {
    console.warn('[Ascendi audio]', err);
    playFallbackBeep();
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────
// Register a minimal service worker so we can use
// ServiceWorkerRegistration.showNotification(), which works more reliably on
// Android Chrome when the page is in a background tab than new Notification().
let swReg = null;
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(process.env.PUBLIC_URL + '/sw.js')
      .then(r  => { swReg = r; })
      .catch(err => console.warn('[Ascendi notification]', err));
  });
}

// opts.persistent = true  → requireInteraction + longer vibrate (end-of-session)
// opts.persistent = false → auto-dismiss, short vibrate (session-start confirm)
function showNotification(title, body, { persistent = false } = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const options = {
    body,
    tag:      'ascendi-session',
    renotify: true,
    silent:   false,
    ...(persistent && { requireInteraction: true }),
    vibrate:  persistent ? [200, 100, 200] : [100],
  };
  const tryDirectNotification = () => {
    try {
      new Notification(title, options);
    } catch (err) {
      console.warn('[Ascendi notification]', err);
    }
  };
  // iOS does not reliably support service workers while the page is in the
  // background, so fall back to a direct Notification whenever swReg is
  // unavailable or showNotification fails.
  if (!swReg) {
    tryDirectNotification();
    return;
  }
  try {
    Promise.resolve(swReg.showNotification(title, options)).catch(err => {
      console.warn('[Ascendi notification]', err);
      tryDirectNotification();
    });
  } catch (err) {
    console.warn('[Ascendi notification]', err);
    tryDirectNotification();
  }
}

// ── Pure timer helpers ────────────────────────────────────────────────────────
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, isNaN(val) ? min : val));
}

function getDuration(mode, workSecs, shortSecs, longSecs) {
  if (mode === 'work')       return workSecs;
  if (mode === 'shortBreak') return shortSecs;
  return longSecs;
}

function nextSession(mode, count, cycleLen) {
  if (mode === 'work') {
    if (count >= cycleLen) return { nextMode: 'longBreak', nextCount: count };
    return { nextMode: 'shortBreak', nextCount: count };
  }
  const nextCount = mode === 'longBreak' ? 1 : count + 1;
  return { nextMode: 'work', nextCount };
}

// ── localStorage keys & loaders ───────────────────────────────────────────────
const LS_XP    = 'nsq_xp';
const LS_PET   = 'nsq_pet';
const LS_DARK  = 'nsq_dark';
const LS_WORK  = 'nsq_work';
const LS_SHORT = 'nsq_short';
const LS_LONG  = 'nsq_long';
const LS_CYCLE = 'nsq_cycle';
const LS_COUNT  = 'nsq_count';
const LS_MODE   = 'nsq_mode';
const LS_POINTS = 'nsq_points';
const LS_GARDEN = 'nsq_garden';
const LS_NIGHT_GARDEN = 'nsq_garden_night';
const LS_WINTER_GARDEN = 'nsq_garden_winter';
const LS_GARDEN_NIGHT_PETS = 'nsq_garden_night_pets';
const LS_GARDEN_WINTER_PETS = 'nsq_garden_winter_pets';
const LS_STATS = 'nsq_stats';

function loadStats() {
  try { return JSON.parse(localStorage.getItem(LS_STATS)) || {}; } catch { return {}; }
}

function loadGarden() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN)) || []; } catch { return []; }
}

function loadNightGardenPets() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN_NIGHT_PETS)) || []; } catch { return []; }
}
function loadWinterGardenPets() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN_WINTER_PETS)) || []; } catch { return []; }
}

function loadXP() {
  const raw = parseInt(localStorage.getItem(LS_XP), 10);
  return isNaN(raw) ? 0 : Math.min(MAX_XP, Math.max(0, raw));
}
function loadPetId() { return localStorage.getItem(LS_PET) ?? 'cat'; }
function loadDarkMode() { return localStorage.getItem(LS_DARK) !== 'false'; }

const WORK_OPTIONS       = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90];
const SHORT_BREAK_OPTIONS = [5,10,15,20,25,30];
const LONG_BREAK_OPTIONS  = [10,15,20,25,30];

function snapToOptions(raw, options, defaultVal) {
  if (isNaN(raw)) return defaultVal;
  return options.includes(raw) ? raw : options.reduce((best, o) =>
    Math.abs(o - raw) < Math.abs(best - raw) ? o : best
  );
}

function loadWorkMinutes() {
  const raw = parseInt(localStorage.getItem(LS_WORK), 10);
  return snapToOptions(raw, WORK_OPTIONS, 25);
}
function loadShortBreakMinutes() {
  const raw = parseInt(localStorage.getItem(LS_SHORT), 10);
  return snapToOptions(raw, SHORT_BREAK_OPTIONS, 5);
}
function loadLongBreakMinutes() {
  const raw = parseInt(localStorage.getItem(LS_LONG), 10);
  return snapToOptions(raw, LONG_BREAK_OPTIONS, 15);
}
function loadCycleLength() {
  const raw = parseInt(localStorage.getItem(LS_CYCLE), 10);
  return isNaN(raw) ? 4 : clamp(raw, 1, 8);
}
function loadMode() {
  const raw = localStorage.getItem(LS_MODE);
  return ['work', 'shortBreak', 'longBreak'].includes(raw) ? raw : 'work';
}

function loadPoints() {
  const raw = parseInt(localStorage.getItem(LS_POINTS), 10);
  return isNaN(raw) ? 0 : Math.max(0, raw);
}

function loadPomodoroCount() {
  const cycleLen = loadCycleLength();
  const raw = parseInt(localStorage.getItem(LS_COUNT), 10);
  return isNaN(raw) ? 1 : clamp(raw, 1, cycleLen);
}

function GardenPetCanvas({ petId, stageIndex }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPet(ctx, petId, stageIndex, 0, false, 'transparent');
  }, [petId, stageIndex]);
  return (
    <canvas
      ref={ref}
      width={128}
      height={128}
      style={{ width: '40px', height: '40px', imageRendering: 'pixelated' }}
    />
  );
}

function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            className={`confirm-btn${danger ? ' confirm-btn--danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button className="confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function FocusCalendar({ stats, petColor }) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const totalMins = Object.values(stats).reduce((a, b) => a + b, 0);
  const activeDays = Object.keys(stats).filter(k => stats[k] > 0).length;
  const bestDay = Math.max(0, ...Object.values(stats));
  const avgDay = activeDays > 0 ? Math.round(totalMins / activeDays) : 0;

  let streak = 0;
  const d = new Date(today);
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (stats[key] > 0) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  const dow = start.getDay();
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));

  const weeks = [];
  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d2 = 0; d2 < 7; d2++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d2);
      week.push(date);
    }
    weeks.push(week);
  }

  const hex = petColor.replace('#', '');
  const r = parseInt(hex.slice(0,2),16);
  const g = parseInt(hex.slice(2,4),16);
  const b = parseInt(hex.slice(4,6),16);

  function getColor(mins) {
    if (!mins || mins === 0) return 'var(--bg-card)';
    const a = mins < 15 ? 0.22 : mins < 30 ? 0.44 : mins < 60 ? 0.66 : mins < 90 ? 0.85 : 1;
    return `rgba(${r},${g},${b},${a})`;
  }

  const monthLabels = [];
  weeks.forEach((week, wi) => {
    if (week[0].getDate() <= 7) {
      monthLabels.push({ wi, label: week[0].toLocaleString('default', { month: 'short' }) });
    }
  });

  return (
    <div className="focus-calendar">
      <div className="focus-calendar-header">
        <span className="focus-calendar-title">FOCUS HISTORY</span>
        <span className="focus-calendar-total">{totalMins} min total</span>
      </div>
      <div className="focus-calendar-grid-wrapper">
        <div className="focus-day-labels">
          <span>Mon</span><span/><span>Wed</span><span/><span>Fri</span><span/><span>Sun</span>
        </div>
        <div className="focus-grid-col">
          <div className="focus-month-labels" style={{gridTemplateColumns:`repeat(${weeks.length}, 10px)`}}>
            {monthLabels.map(({ wi, label }) => (
              <span key={wi} style={{gridColumn: wi + 1}}>{label}</span>
            ))}
          </div>
          <div className="focus-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="focus-week">
                {week.map((date, di) => {
                  const key = date.toISOString().slice(0, 10);
                  const mins = stats[key] || 0;
                  const isFuture = date > today;
                  const isToday = key === todayStr;
                  return (
                    <div
                      key={di}
                      className={`focus-cell${isToday ? ' focus-cell--today' : ''}`}
                      style={{ background: isFuture ? 'transparent' : getColor(mins) }}
                      title={!isFuture ? (mins > 0 ? `${key}: ${mins} min` : key) : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="focus-legend">
        <span className="focus-legend-label">Less</span>
        {[0.22, 0.44, 0.66, 0.85, 1].map((a, i) => (
          <div key={i} className="focus-legend-cell" style={{background:`rgba(${r},${g},${b},${a})`}}/>
        ))}
        <span className="focus-legend-label">More</span>
      </div>
      <div className="focus-stats-row">
        <div className="focus-stat">
          <span className="focus-stat-value">{streak}</span>
          <span className="focus-stat-label">day streak 🔥</span>
        </div>
        <div className="focus-stat">
          <span className="focus-stat-value">{activeDays}</span>
          <span className="focus-stat-label">days active</span>
        </div>
        <div className="focus-stat">
          <span className="focus-stat-value">{bestDay}</span>
          <span className="focus-stat-label">best day (min)</span>
        </div>
        <div className="focus-stat">
          <span className="focus-stat-value">{avgDay}</span>
          <span className="focus-stat-label">avg/day (min)</span>
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function App() {
  // Timer settings (all persisted)
  const [workMinutes,       setWorkMinutes]       = useState(loadWorkMinutes);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(loadShortBreakMinutes);
  const [longBreakMinutes,  setLongBreakMinutes]  = useState(loadLongBreakMinutes);
  const [cycleLength,       setCycleLength]       = useState(loadCycleLength);
  const [cycleLengthDraft,  setCycleLengthDraft]  = useState(() => String(loadCycleLength()));

  // Timer state
  const [pomodoroCount, setPomodoroCount] = useState(loadPomodoroCount);
  const [mode, setMode]                   = useState(loadMode);
  const [timeLeft, setTimeLeft]           = useState(() =>
    getDuration(
      loadMode(),
      loadWorkMinutes() * 60,
      loadShortBreakMinutes() * 60,
      loadLongBreakMinutes() * 60,
    )
  );
  const [isRunning, setIsRunning] = useState(false);
  const [worker, setWorker]       = useState(null);
  const [alerting, setAlerting]   = useState(false);

  // Pet & XP state
  const [xp, setXP]                   = useState(loadXP);
  const [chosenPetId, setChosenPetId] = useState(loadPetId);
  const [xpGainCount, setXpGainCount] = useState(0);

  // Points — earned in real time while the timer is running (1 per minute of work)
  const [points, setPoints] = useState(loadPoints);

  // Daily focus stats (minutes worked per day, keyed by 'YYYY-MM-DD') — feeds the focus calendar
  const [stats, setStats] = useState(loadStats);

  // UI state
  const isFirstVisitRef               = useRef(localStorage.getItem(LS_PET) === null);
  const [showWelcome, setShowWelcome]     = useState(() => localStorage.getItem(LS_PET) === null);
  const [showPicker, setShowPicker]       = useState(false);
  const [pendingPetId, setPendingPetId]   = useState(null);
  const [showXpWarning, setShowXpWarning] = useState(false);
  const [darkMode, setDarkMode]           = useState(loadDarkMode);
  const [showBreakPopup, setShowBreakPopup]   = useState(false);
  const [pendingBreakMode, setPendingBreakMode] = useState(null);
  const [undoVisible, setUndoVisible]         = useState(false);
  const [isAdditionalTime, setIsAdditionalTime]           = useState(false);
  const [additionalTimeLeft, setAdditionalTimeLeft]       = useState(0);
  const [additionalTimeDuration, setAdditionalTimeDuration] = useState(300); // seconds; 5 min default

  // Language state
  const [lang, setLang]       = useState(loadLang);
  const [langOpen, setLangOpen] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [gardenPets, setGardenPets] = useState(loadGarden);
  const [showNightGarden, setShowNightGarden] = useState(false);
  const [showWinterGarden, setShowWinterGarden] = useState(false);
  const [nightGardenPets, setNightGardenPets] = useState(loadNightGardenPets);
  const [winterGardenPets, setWinterGardenPets] = useState(loadWinterGardenPets);
  const [ownsNightGarden, setOwnsNightGarden] = useState(() => localStorage.getItem(LS_NIGHT_GARDEN) === 'true');
  const [ownsWinterGarden, setOwnsWinterGarden] = useState(() => localStorage.getItem(LS_WINTER_GARDEN) === 'true');
  const [showStore, setShowStore] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const askConfirm = (message, onConfirm, confirmLabel = 'Confirm', danger = false) => {
    setConfirm({ message, onConfirm, confirmLabel, danger });
  };

  // Derived translations shorthand
  const t = T[lang];

  // Refs — stable values readable inside async / stale-closure contexts
  const modeRef          = useRef(loadMode());
  const pomodoroCountRef = useRef(loadPomodoroCount());
  const workSecsRef      = useRef(loadWorkMinutes() * 60);
  const shortSecsRef     = useRef(loadShortBreakMinutes() * 60);
  const longSecsRef      = useRef(loadLongBreakMinutes() * 60);
  const cycleLengthRef   = useRef(loadCycleLength());
  const isRunningRef     = useRef(false);
  const workerRef        = useRef(null);
  const xpRef            = useRef(loadXP());
  const pointsRef        = useRef(loadPoints());
  // Tracks work-seconds and points awarded within the current work session
  const workSecondsRef   = useRef(0);
  const pointsEarnedRef  = useRef(0);
  const undoTimeoutRef   = useRef(null);
  const lastStateRef     = useRef(null);
  const isAdditionalTimeRef       = useRef(false);
  const savedCycleStateRef        = useRef(null);
  const additionalWorkSecsRef     = useRef(0);
  const additionalPointsEarnedRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => { modeRef.current          = mode;                  }, [mode]);
  useEffect(() => { pomodoroCountRef.current = pomodoroCount;         }, [pomodoroCount]);
  useEffect(() => { workSecsRef.current      = workMinutes * 60;      }, [workMinutes]);
  useEffect(() => { shortSecsRef.current     = shortBreakMinutes * 60;}, [shortBreakMinutes]);
  useEffect(() => { longSecsRef.current      = longBreakMinutes * 60; }, [longBreakMinutes]);
  useEffect(() => { cycleLengthRef.current   = cycleLength;           }, [cycleLength]);
  useEffect(() => { isRunningRef.current     = isRunning;             }, [isRunning]);
  useEffect(() => { xpRef.current            = xp;                    }, [xp]);
  useEffect(() => { pointsRef.current        = points;                }, [points]);

  // Persist all settings & session state to localStorage
  useEffect(() => { localStorage.setItem(LS_XP,    xp);               }, [xp]);
  useEffect(() => { localStorage.setItem(LS_PET,   chosenPetId);      }, [chosenPetId]);
  useEffect(() => { localStorage.setItem(LS_WORK,  workMinutes);      }, [workMinutes]);
  useEffect(() => { localStorage.setItem(LS_SHORT, shortBreakMinutes);}, [shortBreakMinutes]);
  useEffect(() => { localStorage.setItem(LS_LONG,  longBreakMinutes); }, [longBreakMinutes]);
  useEffect(() => { localStorage.setItem(LS_CYCLE, cycleLength);      }, [cycleLength]);
  useEffect(() => { localStorage.setItem(LS_COUNT, pomodoroCount);    }, [pomodoroCount]);
  useEffect(() => { localStorage.setItem(LS_MODE,   mode);            }, [mode]);
  useEffect(() => { localStorage.setItem(LS_POINTS, points);         }, [points]);
  useEffect(() => { localStorage.setItem(LS_LANG,   lang);            }, [lang]);
  useEffect(() => { localStorage.setItem(LS_GARDEN, JSON.stringify(gardenPets)); }, [gardenPets]);
  useEffect(() => { localStorage.setItem(LS_GARDEN_NIGHT_PETS, JSON.stringify(nightGardenPets)); }, [nightGardenPets]);
  useEffect(() => { localStorage.setItem(LS_GARDEN_WINTER_PETS, JSON.stringify(winterGardenPets)); }, [winterGardenPets]);
  useEffect(() => { localStorage.setItem(LS_NIGHT_GARDEN, ownsNightGarden ? 'true' : 'false'); }, [ownsNightGarden]);
  useEffect(() => { localStorage.setItem(LS_WINTER_GARDEN, ownsWinterGarden ? 'true' : 'false'); }, [ownsWinterGarden]);
  useEffect(() => { localStorage.setItem(LS_STATS, JSON.stringify(stats)); }, [stats]);

  // Apply theme and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(LS_DARK, darkMode);
  }, [darkMode]);

  // Browser tab title
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.title = `Ascendi ${m}:${s.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Preload the end-of-session audio on mount, and unlock it on the first
  // user gesture — mobile browsers block audio.play() until a gesture occurs.
  useEffect(() => {
    preloadAudio();
    const handleFirstInteraction = () => unlockAudio();
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  // Create the worker once
  useEffect(() => {
    const timerWorker = new Worker(`${process.env.PUBLIC_URL}/timer-worker.js`);
    workerRef.current = timerWorker;
    setWorker(timerWorker);
    return () => {
      // Stop ticking before terminating so no queued 'tick' message can be
      // delivered to a worker that's already gone (or after unmount).
      timerWorker.postMessage('stop');
      timerWorker.terminate();
    };
  }, []);

  // Wire up the tick handler — re-registers only when the worker instance changes
  useEffect(() => {
    if (!worker) return;
    worker.onmessage = (event) => {
      if (event.data !== 'tick') return;
      if (!isRunningRef.current) return; // discard stale ticks after stop

      if (isAdditionalTimeRef.current) {
        // Additional-time mode: count down the mini timer and award points
        setAdditionalTimeLeft(prev => Math.max(0, prev - 1));
        additionalWorkSecsRef.current++;
        const earned = Math.floor(additionalWorkSecsRef.current / 60);
        if (earned > additionalPointsEarnedRef.current) {
          const delta = earned - additionalPointsEarnedRef.current;
          const newPoints = pointsRef.current + delta;
          pointsRef.current = newPoints;
          additionalPointsEarnedRef.current = earned;
          setPoints(newPoints);
        }
      } else {
        setTimeLeft(prev => Math.max(0, prev - 1));
        if (modeRef.current === 'work') {
          workSecondsRef.current++;
          const earned = Math.floor(workSecondsRef.current / 60);
          if (earned > pointsEarnedRef.current) {
            const delta = earned - pointsEarnedRef.current;
            const newPoints = pointsRef.current + delta;
            pointsRef.current = newPoints;
            pointsEarnedRef.current = earned;
            setPoints(newPoints);
          }
        }
      }
    };
  }, [worker]);

  // ── Session-end effect ────────────────────────────────────────────────────
  // Fires whenever timeLeft reaches 0 while the timer is running.
  useEffect(() => {
    if (timeLeft !== 0 || !isRunningRef.current) return;

    workerRef.current?.postMessage('stop');
    isRunningRef.current = false;
    setIsRunning(false);

    // Flash alert
    setAlerting(true);
    setTimeout(() => setAlerting(false), 1500);

    // Sound
    playEndSound();

    // Notification — persistent so it stays visible in background tabs
    {
      const msgs = {
        work:       { title: 'Work session complete!', body: 'Nice work! Press Start to begin your break.' },
        shortBreak: { title: 'Break over.',            body: 'Ready to focus? Press Start for the next session.' },
        longBreak:  { title: 'Long break over.',       body: 'New cycle ready. Press Start when you\'re set.' },
      };
      const { title, body } = msgs[modeRef.current] ?? { title: "Time's up!", body: 'Press Start for the next session.' };
      showNotification(title, body, { persistent: true });
    }

    // Award XP for completed work sessions
    if (modeRef.current === 'work') {
      const earned = Math.floor(workSecsRef.current / 60); // 1 XP per full minute
      const newXP  = Math.min(MAX_XP, xpRef.current + earned);
      xpRef.current = newXP;
      setXP(newXP);
      setXpGainCount(c => c + 1);
    }
    if (modeRef.current === 'work') {
      const today = new Date().toISOString().slice(0, 10);
      const earned = Math.floor(workSecsRef.current / 60);
      if (earned > 0) setStats(prev => ({ ...prev, [today]: (prev[today] || 0) + earned }));
    }

    // Reset per-session point tracking before advancing to the next session
    workSecondsRef.current  = 0;
    pointsEarnedRef.current = 0;

    // Advance to the next session
    const { nextMode, nextCount } = nextSession(
      modeRef.current, pomodoroCountRef.current, cycleLengthRef.current
    );
    modeRef.current          = nextMode;
    pomodoroCountRef.current = nextCount;
    setMode(nextMode);
    setPomodoroCount(nextCount);
    setTimeLeft(getDuration(nextMode, workSecsRef.current, shortSecsRef.current, longSecsRef.current));

    if (nextMode === 'shortBreak' || nextMode === 'longBreak') {
      setPendingBreakMode(nextMode);
      setShowBreakPopup(true);
    }
  }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Additional-time end effect ────────────────────────────────────────────
  // Fires when the mini timer reaches 0.
  useEffect(() => {
    if (!isAdditionalTime || additionalTimeLeft !== 0) return;

    workerRef.current?.postMessage('stop');
    isRunningRef.current = false;
    setIsRunning(false);
    isAdditionalTimeRef.current = false;
    setIsAdditionalTime(false);

    setAlerting(true);
    setTimeout(() => setAlerting(false), 1500);
    playEndSound();
    showNotification(
      'Additional time complete!',
      'Your main session is ready to resume.',
      { persistent: true }
    );

    // Award XP for additional time worked (same rate as regular work sessions)
    const atEarned = Math.floor(additionalWorkSecsRef.current / 60);
    if (atEarned > 0) {
      const newXP = Math.min(MAX_XP, xpRef.current + atEarned);
      xpRef.current = newXP;
      setXP(newXP);
      setXpGainCount(c => c + 1);
    }
    if (atEarned > 0) {
      const today = new Date().toISOString().slice(0, 10);
      setStats(prev => ({ ...prev, [today]: (prev[today] || 0) + atEarned }));
    }
    additionalWorkSecsRef.current     = 0;
    additionalPointsEarnedRef.current = 0;

    const saved = savedCycleStateRef.current;
    if (saved) {
      modeRef.current          = saved.mode;
      pomodoroCountRef.current = saved.pomodoroCount;
      workSecondsRef.current   = saved.workSeconds;
      pointsEarnedRef.current  = saved.pointsEarned;
      setMode(saved.mode);
      setPomodoroCount(saved.pomodoroCount);
      setTimeLeft(saved.timeLeft);
      savedCycleStateRef.current = null;
    }
  }, [isAdditionalTime, additionalTimeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controls ──────────────────────────────────────────────────────────────
  const startTimer = () => {
    if (workerRef.current && !isRunningRef.current) {
      // Ask for notification permission here too, so users who skip the pet
      // picker (which also asks) still get prompted before their first session.
      requestNotificationPermission();
      // iOS Safari suspends the AudioContext until resumed inside a gesture.
      resumeAudioCtxIfSuspended();

      // Detect a fresh session start (vs. resume from pause)
      const fullDuration = getDuration(
        modeRef.current, workSecsRef.current, shortSecsRef.current, longSecsRef.current
      );
      const isFreshStart = timeLeft === fullDuration;

      workerRef.current.postMessage('start');
      isRunningRef.current = true;
      setIsRunning(true);

      // Play start chime + notify only when a work session begins fresh
      if (modeRef.current === 'work' && isFreshStart) {
        playStartChime();
        showNotification('Work session started!', 'Stay focused — you\'ve got this! 🎯');
      }
    }
  };

  const pauseTimer = () => {
    if (workerRef.current && isRunningRef.current) {
      workerRef.current.postMessage('stop');
      isRunningRef.current = false;
      setIsRunning(false);
    }
  };

  const resetSession = () => {
    lastStateRef.current = {
      mode: modeRef.current,
      pomodoroCount: pomodoroCountRef.current,
      timeLeft,
      workSeconds: workSecondsRef.current,
      pointsEarned: pointsEarnedRef.current,
    };
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoVisible(true);
    undoTimeoutRef.current = setTimeout(() => {
      setUndoVisible(false);
      lastStateRef.current = null;
    }, 5000);
    if (isRunningRef.current) {
      workerRef.current?.postMessage('stop');
      isRunningRef.current = false;
      setIsRunning(false);
    }
    workSecondsRef.current  = 0;
    pointsEarnedRef.current = 0;
    setTimeLeft(getDuration(
      modeRef.current, workSecsRef.current, shortSecsRef.current, longSecsRef.current
    ));
  };

  const resetCycle = () => {
    lastStateRef.current = {
      mode: modeRef.current,
      pomodoroCount: pomodoroCountRef.current,
      timeLeft,
      workSeconds: workSecondsRef.current,
      pointsEarned: pointsEarnedRef.current,
    };
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoVisible(true);
    undoTimeoutRef.current = setTimeout(() => {
      setUndoVisible(false);
      lastStateRef.current = null;
    }, 5000);
    if (isRunningRef.current) {
      workerRef.current?.postMessage('stop');
      isRunningRef.current = false;
      setIsRunning(false);
    }
    workSecondsRef.current  = 0;
    pointsEarnedRef.current = 0;
    modeRef.current = 'work';
    pomodoroCountRef.current = 1;
    setMode('work');
    setPomodoroCount(1);
    setTimeLeft(workSecsRef.current);
  };

  const handleUndo = () => {
    if (!lastStateRef.current) return;
    const { mode: m, pomodoroCount: cnt, timeLeft: tl, workSeconds, pointsEarned } = lastStateRef.current;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoVisible(false);
    lastStateRef.current = null;
    modeRef.current          = m;
    pomodoroCountRef.current = cnt;
    workSecondsRef.current   = workSeconds;
    pointsEarnedRef.current  = pointsEarned;
    setMode(m);
    setPomodoroCount(cnt);
    setTimeLeft(tl);
  };

  const startAdditionalTime = () => {
    // Snapshot the current cycle so it can be restored later
    savedCycleStateRef.current = {
      mode:          modeRef.current,
      pomodoroCount: pomodoroCountRef.current,
      timeLeft,
      workSeconds:   workSecondsRef.current,
      pointsEarned:  pointsEarnedRef.current,
    };
    additionalWorkSecsRef.current     = 0;
    additionalPointsEarnedRef.current = 0;
    isAdditionalTimeRef.current = true;
    setIsAdditionalTime(true);
    setAdditionalTimeLeft(additionalTimeDuration);
    // Ensure the worker is ticking (it may have been paused)
    if (!isRunningRef.current) {
      workerRef.current?.postMessage('start');
      isRunningRef.current = true;
      setIsRunning(true);
    }
  };

  const cancelAdditionalTime = () => {
    workerRef.current?.postMessage('stop');
    isRunningRef.current = false;
    setIsRunning(false);
    isAdditionalTimeRef.current = false;
    setIsAdditionalTime(false);
    setAdditionalTimeLeft(0);
    const saved = savedCycleStateRef.current;
    if (saved) {
      modeRef.current          = saved.mode;
      pomodoroCountRef.current = saved.pomodoroCount;
      workSecondsRef.current   = saved.workSeconds;
      pointsEarnedRef.current  = saved.pointsEarned;
      setMode(saved.mode);
      setPomodoroCount(saved.pomodoroCount);
      setTimeLeft(saved.timeLeft);
      savedCycleStateRef.current = null;
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(err => console.warn('[Ascendi notification]', err));
    }
  };

  // ── Settings change handlers ───────────────────────────────────────────────
  const handleWorkMinutesChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setWorkMinutes(val);
    workSecsRef.current = val * 60;
    if (!isRunningRef.current && modeRef.current === 'work') {
      setTimeLeft(val * 60);
    }
  };

  const handleShortBreakChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setShortBreakMinutes(val);
    shortSecsRef.current = val * 60;
    if (!isRunningRef.current && modeRef.current === 'shortBreak') {
      setTimeLeft(val * 60);
    }
  };

  const handleLongBreakChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setLongBreakMinutes(val);
    longSecsRef.current = val * 60;
    if (!isRunningRef.current && modeRef.current === 'longBreak') {
      setTimeLeft(val * 60);
    }
  };

  const handleCycleLengthChange = (e) => {
    setCycleLengthDraft(e.target.value);
    // Commit immediately only when the typed value is already a valid integer in range,
    // so the cycle dots update in real-time without snapping mid-edit.
    const raw = parseInt(e.target.value, 10);
    if (!isNaN(raw) && raw >= 1 && raw <= 8) {
      setCycleLength(raw);
      cycleLengthRef.current = raw;
      if (pomodoroCountRef.current > raw) {
        pomodoroCountRef.current = raw;
        setPomodoroCount(raw);
      }
    }
  };

  const handleCycleLengthBlur = () => {
    const val = clamp(parseInt(cycleLengthDraft, 10), 1, 8);
    setCycleLengthDraft(String(val));
    setCycleLength(val);
    cycleLengthRef.current = val;
    if (pomodoroCountRef.current > val) {
      pomodoroCountRef.current = val;
      setPomodoroCount(val);
    }
  };

  // ── Pet picker handlers ────────────────────────────────────────────────────
  const handleWelcomeContinue = () => {
    setShowWelcome(false);
    setShowPicker(true);
  };

  const openPetPicker = () => {
    setPendingPetId(null);
    setShowPicker(true);
  };

  const handlePickerConfirm = () => {
    const targetPet = pendingPetId ?? chosenPetId;
    if (isFirstVisitRef.current || targetPet === chosenPetId) {
      if (isFirstVisitRef.current) requestNotificationPermission();
      isFirstVisitRef.current = false;
      setChosenPetId(targetPet);
      setShowPicker(false);
      setPendingPetId(null);
    } else {
      setShowXpWarning(true);
    }
  };

  const handleXpResetConfirm = () => {
    setChosenPetId(pendingPetId);
    setXP(0);
    xpRef.current = 0;
    isFirstVisitRef.current = false;
    setShowXpWarning(false);
    setShowPicker(false);
    setPendingPetId(null);
  };

  const handlePickerCancel = () => {
    setShowXpWarning(false);
    setShowPicker(false);
    setPendingPetId(null);
  };

  const handleStartBreak = () => {
    setShowBreakPopup(false);
  };

  const handleRenameGardenPet = (index, newName) => {
    setGardenPets(prev => prev.map((p, i) => i === index ? { ...p, name: newName } : p));
  };

  const handleRenameNightPet = (index, newName) => {
    setNightGardenPets(prev => prev.map((p, i) => i === index ? { ...p, name: newName } : p));
  };
  const handleRenameWinterPet = (index, newName) => {
    setWinterGardenPets(prev => prev.map((p, i) => i === index ? { ...p, name: newName } : p));
  };

  const handleDeleteGardenPet = (index) => {
    askConfirm(
      'Remove this pet from the garden?',
      () => setGardenPets(prev => prev.filter((_, i) => i !== index)),
      'Remove',
      true
    );
  };
  const handleDeleteNightPet = (index) => {
    askConfirm(
      'Remove this pet from the night garden?',
      () => setNightGardenPets(prev => prev.filter((_, i) => i !== index)),
      'Remove',
      true
    );
  };
  const handleDeleteWinterPet = (index) => {
    askConfirm(
      'Remove this pet from the winter garden?',
      () => setWinterGardenPets(prev => prev.filter((_, i) => i !== index)),
      'Remove',
      true
    );
  };

  const handleDeleteNightGarden = () => {
    askConfirm(
      'Delete the Night Garden? All pets inside will be lost.',
      () => {
        setOwnsNightGarden(false);
        setNightGardenPets([]);
        setShowNightGarden(false);
      },
      'Delete garden',
      true
    );
  };
  const handleDeleteWinterGarden = () => {
    askConfirm(
      'Delete the Winter Garden? All pets inside will be lost.',
      () => {
        setOwnsWinterGarden(false);
        setWinterGardenPets([]);
        setShowWinterGarden(false);
      },
      'Delete garden',
      true
    );
  };

  // ── Derived display values ────────────────────────────────────────────────
  const completedInCycle =
    mode === 'work'      ? pomodoroCount - 1 :
    mode === 'longBreak' ? cycleLength :
    /* shortBreak */       pomodoroCount;

  const modeLabel =
    mode === 'work'       ? t.work :
    mode === 'shortBreak' ? `☕ ${t.shortBreak}` :
                            `🛋️ ${t.longBreak}`;

  const subLabel =
    mode === 'work'
      ? `${t.session} ${pomodoroCount} / ${cycleLength}`
      : mode === 'shortBreak'
      ? `${t.session} ${pomodoroCount} / ${cycleLength}`
      : t.youEarned;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Welcome / instructions modal (first visit only) ── */}
      {showWelcome && (
        <div className="welcome-modal">
          <div className="modal-content modal-narrow">
            <h3>{t.welcome}</h3>
            <ul className="welcome-instructions">
              <li>{`⏱ ${t.workSessions}`}</li>
              <li>{`🐾 ${t.petGrows}`}</li>
              <li>{`☕ ${t.shortBreakAfter}`}</li>
              <li>{`🛋️ ${t.longBreakAfter} ${cycleLength} ${t.sessions}`}</li>
            </ul>
            <button className="got-it-btn" onClick={isFirstVisitRef.current ? handleWelcomeContinue : () => setShowWelcome(false)}>
              {isFirstVisitRef.current ? t.pickCompanion : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* ── Pet picker modal (onboarding + change) ── */}
      {showPicker && (
        <div className="welcome-modal">
          <div className="modal-content modal-wide">
            <h3>{isFirstVisitRef.current ? t.chooseCompanion : t.changeCompanionTitle}</h3>
            {isFirstVisitRef.current && (
              <p className="modal-sub">
                {t.itGrows}
              </p>
            )}
            <PetPicker
              currentPetId={pendingPetId ?? chosenPetId}
              onSelect={setPendingPetId}
              onConfirm={handlePickerConfirm}
              onCancel={!isFirstVisitRef.current ? handlePickerCancel : undefined}
              isFirstVisit={isFirstVisitRef.current}
              t={t}
            />
          </div>
        </div>
      )}

      {/* ── XP reset confirmation ── */}
      {showXpWarning && (
        <div className="welcome-modal">
          <div className="modal-content modal-narrow">
            <h3>{t.resetXp}</h3>
            <div className="xp-warning-box">
              <p>{t.switchingResets}</p>
              <p>{t.cannotUndo}</p>
            </div>
            <button
              className="got-it-btn got-it-btn--danger"
              onClick={handleXpResetConfirm}
            >
              {t.yesSwitchReset}
            </button>
            <button
              className="picker-cancel-btn"
              onClick={() => setShowXpWarning(false)}
            >
              {t.goBack}
            </button>
          </div>
        </div>
      )}

      {/* ── Break popup ── */}
      {showBreakPopup && (
        <div className={`welcome-modal break-popup-${pendingBreakMode === 'shortBreak' ? 'short' : 'long'}`}>
          <div className="modal-content modal-narrow">
            <div className="sleep-box">
              <span className="z1">Z</span>
              <span className="z2">z</span>
              <span className="z3">z</span>
              <span className="z4">z</span>
            </div>
            <h3>{pendingBreakMode === 'shortBreak' ? t.shortBreakTime : t.longBreakTime}</h3>
            <p className="modal-sub">{t.youEarned}</p>
            <ul className="welcome-instructions break-suggestions">
              {pendingBreakMode === 'shortBreak' ? (
                <>
                  <li>{t.stretchLegs}</li>
                  <li>{t.deepBreaths}</li>
                </>
              ) : (
                <>
                  <li>{t.stretchLegs}</li>
                  <li>{t.deepBreaths}</li>
                  <li>{t.readPages}</li>
                  <li>{t.healthySnack}</li>
                  <li>{t.listenSong}</li>
                </>
              )}
            </ul>
            <button className="got-it-btn" onClick={handleStartBreak}>
              {t.startBreak}
            </button>
          </div>
        </div>
      )}

      {/* ── Main app ── */}
      <div className={`App mode-${mode}${alerting ? ' alerting' : ''}`}>
        <div className="top-bar">
          <h1>Ascendi</h1>
          <div className="top-bar-actions">
            <div className="points-chip" title="Points balance" aria-label={`${points} points`}>
              <span className="points-icon">✦</span>
              <span className="points-value">{points}</span>
            </div>
            <button
              className="settings-btn"
              onClick={openPetPicker}
              aria-label={t.changeCompanion}
              title={t.changeCompanion}
            >
              🐾
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(d => !d)}
              aria-label={t.toggleTheme}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              className="help-btn"
              onClick={() => setShowWelcome(true)}
              aria-label="How to use Ascendi"
              title="How to use Ascendi"
            >
              ?
            </button>
          </div>
        </div>

        {/* Pet + XP */}
        <div className="pet-display-row">
          <PetDisplay petId={chosenPetId} xp={xp} gainCount={xpGainCount} isRunning={isRunning} mode={mode} isAdditionalTime={isAdditionalTime} label={t.stage} onJoinGarden={() => {
            if (gardenPets.length >= 10) return;
            askConfirm(
              'Send this pet to the garden? Their XP will be frozen and you will need to choose a new companion.',
              () => {
                setGardenPets(prev => [...prev, { id: chosenPetId, name: chosenPetId, stageIndex: getStageIndex(xp, chosenPetId) }]);
                setXP(0);
                xpRef.current = 0;
                isFirstVisitRef.current = true;
                setShowPicker(true);
              },
              'Send to garden',
              false
            );
          }} />
          <div className="garden-buttons-col">
            <button className="garden-circle-btn" onClick={() => setShowGarden(g => !g)} aria-label="My garden" title="My garden">
              <svg width="18" height="18" viewBox="0 0 9 9" style={{imageRendering:'pixelated'}} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="4" y="0" width="1" height="1" fill="#4caf7d"/>
                <rect x="3" y="1" width="3" height="1" fill="#4caf7d"/>
                <rect x="2" y="2" width="5" height="1" fill="#4caf7d"/>
                <rect x="3" y="3" width="3" height="1" fill="#3a8f5a"/>
                <rect x="1" y="3" width="7" height="1" fill="#4caf7d"/>
                <rect x="2" y="4" width="5" height="1" fill="#3a8f5a"/>
                <rect x="0" y="4" width="9" height="1" fill="#4caf7d"/>
                <rect x="4" y="5" width="1" height="1" fill="#8B5E3C"/>
                <rect x="4" y="6" width="1" height="1" fill="#8B5E3C"/>
                <rect x="3" y="7" width="3" height="1" fill="#5abf5a"/>
                <rect x="1" y="8" width="7" height="1" fill="#5abf5a"/>
              </svg>
            </button>
            {ownsNightGarden && (
              <button className="night-garden-circle-btn" onClick={() => setShowNightGarden(g => !g)} aria-label="Night garden" title="Night garden">
                <svg width="18" height="18" viewBox="0 0 9 9" style={{imageRendering:'pixelated'}} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="3" y="0" width="4" height="1" fill="#ffe8a0"/>
                  <rect x="2" y="1" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="5" y="1" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="1" y="2" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="1" y="3" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="1" y="4" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="1" y="5" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="2" y="6" width="2" height="1" fill="#ffe8a0"/>
                  <rect x="3" y="7" width="1" height="1" fill="#ffe8a0"/>
                  <rect x="3" y="1" width="1" height="6" fill="#ffe8a0"/>
                  <rect x="4" y="2" width="1" height="4" fill="#ffe8a0"/>
                  <rect x="5" y="3" width="1" height="2" fill="#ffe8a0"/>
                  <rect x="4" y="0" width="2" height="1" fill="#c8a840"/>
                  <rect x="6" y="1" width="1" height="2" fill="#c8a840"/>
                  <rect x="7" y="2" width="1" height="3" fill="#c8a840"/>
                  <rect x="6" y="5" width="1" height="2" fill="#c8a840"/>
                  <rect x="4" y="7" width="3" height="1" fill="#c8a840"/>
                  <rect x="3" y="8" width="4" height="1" fill="#c8a840"/>
                </svg>
              </button>
            )}
            {ownsWinterGarden && (
              <button className="winter-garden-circle-btn" onClick={() => setShowWinterGarden(g => !g)} aria-label="Winter garden" title="Winter garden">
                <svg width="18" height="18" viewBox="0 0 9 9" style={{imageRendering:'pixelated'}} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="4" y="0" width="1" height="9" fill="#a0c8e8"/>
                  <rect x="0" y="4" width="9" height="1" fill="#a0c8e8"/>
                  <rect x="1" y="1" width="1" height="1" fill="#a0c8e8"/>
                  <rect x="7" y="1" width="1" height="1" fill="#a0c8e8"/>
                  <rect x="1" y="7" width="1" height="1" fill="#a0c8e8"/>
                  <rect x="7" y="7" width="1" height="1" fill="#a0c8e8"/>
                  <rect x="3" y="3" width="3" height="3" fill="#d8f0ff"/>
                  <rect x="4" y="2" width="1" height="5" fill="#fff"/>
                  <rect x="2" y="4" width="5" height="1" fill="#fff"/>
                </svg>
              </button>
            )}
            <button className="store-circle-btn" onClick={() => setShowStore(s => !s)} aria-label="Ascendi Shop" title="Ascendi Shop">
              <svg width="18" height="18" viewBox="0 0 9 9" style={{imageRendering:'pixelated'}} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="1" y="7" width="7" height="2" fill="#8B5E3C"/>
                <rect x="0" y="5" width="9" height="2" fill="#c49030"/>
                <rect x="1" y="3" width="7" height="2" fill="#e8b84b"/>
                <rect x="2" y="1" width="5" height="2" fill="#e8b84b"/>
                <rect x="3" y="0" width="3" height="1" fill="#FFE135"/>
                <rect x="4" y="2" width="1" height="4" fill="#FFE135"/>
                <rect x="3" y="4" width="3" height="1" fill="#FFE135"/>
              </svg>
            </button>
          </div>
        </div>

        <hr className="divider" />

        {/* Timer */}
        <div className="session-info">
          {isAdditionalTime ? (
            <>
              <span className="mode-label mode-label--at">{t.additionalTime}</span>
              <span className="sub-label">{t.mainCyclePaused}</span>
            </>
          ) : (
            <>
              <span className="mode-label">{modeLabel}</span>
              <span className="sub-label">{subLabel}</span>
            </>
          )}
        </div>

        <div className={`timer-display${isAdditionalTime ? ' timer-display--at' : ''}`}>
          {isAdditionalTime
            ? `${Math.floor(additionalTimeLeft / 60)}:${String(additionalTimeLeft % 60).padStart(2, '0')}`
            : `${minutes}:${seconds.toString().padStart(2, '0')}`}
        </div>

        <div className="cycle-dots" aria-label="Session cycle progress">
          {Array.from({ length: cycleLength }, (_, i) => (
            <span
              key={i}
              className={[
                'dot',
                i < completedInCycle                       ? 'done'   : '',
                i === pomodoroCount - 1 && mode === 'work' ? 'active' : '',
              ].filter(Boolean).join(' ')}
              aria-label={`${t.session} ${i + 1}`}
            >●</span>
          ))}
        </div>

        {isAdditionalTime ? (
          <div className="controls">
            {isRunning ? (
              <button className="btn btn-sm btn-secondary" onClick={pauseTimer}>{t.pause}</button>
            ) : (
              <button className="btn btn-sm btn-secondary" onClick={() => {
                workerRef.current?.postMessage('start');
                isRunningRef.current = true;
                setIsRunning(true);
              }}>{t.resume}</button>
            )}
            <button className="btn btn-sm btn-at-cancel" onClick={cancelAdditionalTime}>
              {t.returnCycle}
            </button>
          </div>
        ) : (
          <div className="controls">
            <button className="btn" onClick={startTimer} disabled={isRunning}>
              {t.start}
            </button>
            <button className="btn" onClick={pauseTimer} disabled={!isRunning}>
              {t.pause}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={resetSession}>
              {t.resetSession}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={resetCycle}>
              {t.resetCycle}
            </button>
            {undoVisible && (
              <button className="btn btn-undo btn-sm" onClick={handleUndo}>
                {t.undo}
              </button>
            )}
          </div>
        )}

        {isAdditionalTime ? (
          <div className="at-paused-info">
            <span>{t.pausedAt}</span>
            <span className="at-paused-time">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            <span>· {t.session} {pomodoroCount}/{cycleLength}</span>
          </div>
        ) : (
          <div className="at-row">
            <div className="duration-picker">
              {[300, 600, 900, 1200, 1500, 1800, 2700, 3600].map(sec => (
                <button
                  key={sec}
                  className={`btn-duration${additionalTimeDuration === sec ? ' btn-duration--active' : ''}`}
                  onClick={() => setAdditionalTimeDuration(sec)}
                >
                  {sec / 60}{t.min}
                </button>
              ))}
            </div>
            <button className="btn btn-sm btn-at" onClick={startAdditionalTime}>
              {t.extraTime}
            </button>
          </div>
        )}

        <div className="settings-card">
          <div className="setting-row">
            <label htmlFor="work-duration">{t.work}</label>
            <div className="setting-control">
              <select
                id="work-duration"
                value={workMinutes}
                onChange={handleWorkMinutesChange}
                disabled={isRunning && mode === 'work'}
              >
                {[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span>{t.min}</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="short-break">{t.shortBreak}</label>
            <div className="setting-control">
              <select
                id="short-break"
                value={shortBreakMinutes}
                onChange={handleShortBreakChange}
                disabled={isRunning && mode === 'shortBreak'}
              >
                {[5,10,15,20,25,30].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span>{t.min}</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="long-break">{t.longBreak}</label>
            <div className="setting-control">
              <select
                id="long-break"
                value={longBreakMinutes}
                onChange={handleLongBreakChange}
                disabled={isRunning && mode === 'longBreak'}
              >
                {[10,15,20,25,30].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span>{t.min}</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="cycle-length">{t.sessionsCycle}</label>
            <div className="setting-control">
              <input
                id="cycle-length"
                type="number"
                min="1"
                max="8"
                value={cycleLengthDraft}
                onChange={handleCycleLengthChange}
                onBlur={handleCycleLengthBlur}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                disabled={isRunning}
              />
            </div>
          </div>
        </div>

        <FocusCalendar stats={stats} petColor={getPetById(chosenPetId).color} />
      </div>

      <div className="lang-selector">
        <button className="lang-btn" onClick={() => setLangOpen(o => !o)} aria-label="Select language">
          {lang}
        </button>
        {langOpen && (
          <div className="lang-menu">
            {LANGUAGES.map(l => (
              <button
                key={l}
                className={`lang-option${l === lang ? ' lang-option--active' : ''}`}
                onClick={() => { setLang(l); setLangOpen(false); }}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
      {showGarden && (
        <div className="garden-overlay" onClick={() => setShowGarden(false)}>
          <div className="garden-modal" onClick={e => e.stopPropagation()}>
            <div className="garden-header">
              <span className="garden-title">🌿 My garden <span className="garden-count">{gardenPets.length} / 10</span></span>
              <button className="garden-close" onClick={() => setShowGarden(false)}>✕</button>
            </div>
            <div className="garden-scene">
              <div className="garden-sky">
                <div className="garden-sun" />
                <div className="garden-cloud cloud-1" />
                <div className="garden-cloud cloud-2" />
              </div>
              <div className="garden-ground">
                <div className="garden-tree tree-left" />
                <div className="garden-tree tree-right" />
                {gardenPets.map((pet, i) => (
                  <div
                    key={i}
                    className="garden-pet"
                    style={{
                      left: `${10 + (i % 5) * 18}%`,
                      bottom: i < 5 ? '52%' : '28%',
                    }}
                  >
                    <div className="garden-pet-sprite">
                      <GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex} />
                    </div>
                    <input
                      className="garden-pet-name"
                      value={pet.name}
                      onChange={e => handleRenameGardenPet(i, e.target.value)}
                      maxLength={12}
                    />
                    <button className="garden-pet-delete" onClick={() => handleDeleteGardenPet(i)} title="Remove from garden">✕</button>
                  </div>
                ))}
                {gardenPets.length === 0 && (
                  <div className="garden-empty">Your garden is empty — send a stage 8+ pet here!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showNightGarden && (
        <div className="garden-overlay" onClick={() => setShowNightGarden(false)}>
          <div className="night-garden-modal" onClick={e => e.stopPropagation()}>
            <div className="garden-header night-garden-header">
              <span className="garden-title" style={{color:'#a080d0'}}>🌙 Night Garden <span className="garden-count">{nightGardenPets.length} / 10</span></span>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="garden-delete-btn" onClick={handleDeleteNightGarden} title="Delete this garden">🗑</button>
                <button className="garden-close" onClick={() => setShowNightGarden(false)}>✕</button>
              </div>
            </div>
            <div className="night-garden-scene">
              <div className="night-stars">
                <div className="night-star" style={{top:'8px',left:'20px',width:'3px',height:'3px'}}/>
                <div className="night-star" style={{top:'18px',left:'60px',width:'2px',height:'2px'}}/>
                <div className="night-star" style={{top:'6px',left:'110px',width:'3px',height:'3px'}}/>
                <div className="night-star" style={{top:'22px',left:'160px',width:'2px',height:'2px'}}/>
                <div className="night-star" style={{top:'10px',left:'200px',width:'3px',height:'3px'}}/>
                <div className="night-star" style={{top:'5px',left:'250px',width:'2px',height:'2px'}}/>
                <div className="night-star" style={{top:'16px',left:'300px',width:'3px',height:'3px'}}/>
                <div className="night-star" style={{top:'8px',left:'350px',width:'2px',height:'2px'}}/>
                <div className="night-moon"/>
              </div>
              <div className="night-firefly" style={{top:'100px',left:'40px'}}/>
              <div className="night-firefly" style={{top:'130px',left:'150px'}}/>
              <div className="night-firefly" style={{top:'95px',left:'280px'}}/>
              <div className="night-firefly" style={{top:'140px',left:'380px'}}/>
              <div className="night-ground">
                <div className="night-tree tree-left"/>
                <div className="night-tree tree-right"/>
                <div className="night-mushroom" style={{left:'50px'}}>🍄</div>
                <div className="night-mushroom" style={{right:'50px'}}>🍄</div>
                {nightGardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet" style={{left:`${10+(i%5)*18}%`, bottom: i<5?'52%':'28%'}}>
                    <div className="garden-pet-sprite"><GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex}/></div>
                    <input className="garden-pet-name night-pet-name" value={pet.name} onChange={e => handleRenameNightPet(i, e.target.value)} maxLength={12}/>
                    <button className="garden-pet-delete" onClick={() => handleDeleteNightPet(i)} title="Remove from garden">✕</button>
                  </div>
                ))}
                {nightGardenPets.length === 0 && (
                  <div className="garden-empty" style={{color:'#a080d0',background:'rgba(10,8,24,0.85)'}}>Your night garden is empty!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showWinterGarden && (
        <div className="garden-overlay" onClick={() => setShowWinterGarden(false)}>
          <div className="winter-garden-modal" onClick={e => e.stopPropagation()}>
            <div className="garden-header winter-garden-header">
              <span className="garden-title" style={{color:'#80b0e0'}}>❄️ Winter Garden <span className="garden-count">{winterGardenPets.length} / 10</span></span>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="garden-delete-btn" onClick={handleDeleteWinterGarden} title="Delete this garden">🗑</button>
                <button className="garden-close" onClick={() => setShowWinterGarden(false)}>✕</button>
              </div>
            </div>
            <div className="winter-garden-scene">
              <div className="winter-sky"/>
              <div className="winter-snowflake" style={{top:'8px',left:'15px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'25px',left:'60px',fontSize:'8px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'8px',left:'110px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'30px',left:'170px',fontSize:'8px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'12px',left:'220px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'20px',left:'280px',fontSize:'8px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'5px',left:'330px'}}>❄</div>
              <div className="winter-snowflake" style={{top:'28px',left:'390px',fontSize:'8px'}}>❄</div>
              <div className="winter-ground">
                <div className="winter-tree tree-left"/>
                <div className="winter-tree tree-right"/>
                <div className="winter-snowman">⛄</div>
                {winterGardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet" style={{left:`${10+(i%5)*18}%`, bottom: i<5?'56%':'32%'}}>
                    <div className="garden-pet-sprite"><GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex}/></div>
                    <input className="garden-pet-name winter-pet-name" value={pet.name} onChange={e => handleRenameWinterPet(i, e.target.value)} maxLength={12}/>
                    <button className="garden-pet-delete" onClick={() => handleDeleteWinterPet(i)} title="Remove from garden">✕</button>
                  </div>
                ))}
                {winterGardenPets.length === 0 && (
                  <div className="garden-empty" style={{color:'#2a5080',background:'rgba(232,244,255,0.9)'}}>Your winter garden is empty!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showStore && (
        <div className="store-overlay" onClick={() => setShowStore(false)}>
          <div className="store-modal" onClick={e => e.stopPropagation()}>
            <div className="store-header">
              <span className="store-title">🏪 Ascendi Shop</span>
              <button className="store-close" onClick={() => setShowStore(false)}>✕</button>
            </div>
            <div className="store-scene">
              <div className="store-torch store-torch-left">🕯️</div>
              <div className="store-torch store-torch-right">🕯️</div>
              <p className="store-greeting">Welcome, traveler! What can I get you?</p>

              <div className="store-shelf">
                <div className="store-shelf-label">Gardens</div>
                <div className="store-shelf-items">

                  <div className="store-item">
                    <div className="store-item-name" style={{color:'#a080d0'}}>Night Garden</div>
                    <div className="store-item-preview store-item-preview--night">
                      <span className="store-preview-icon">🌙</span>
                      <span className="store-preview-star">⭐</span>
                    </div>
                    {ownsNightGarden ? (
                      <div className="store-owned-tag">✓ Owned</div>
                    ) : (
                      <button className="store-buy-btn store-buy-btn--night" onClick={() => { setOwnsNightGarden(true); }}>Get</button>
                    )}
                  </div>

                  <div className="store-item">
                    <div className="store-item-name" style={{color:'#80b0e0'}}>Winter Garden</div>
                    <div className="store-item-preview store-item-preview--winter">
                      <span className="store-preview-icon">❄️</span>
                      <span className="store-preview-tree">🌲</span>
                    </div>
                    {ownsWinterGarden ? (
                      <div className="store-owned-tag">✓ Owned</div>
                    ) : (
                      <button className="store-buy-btn store-buy-btn--winter" onClick={() => { setOwnsWinterGarden(true); }}>Get</button>
                    )}
                  </div>

                </div>
              </div>

              <div className="store-shelf">
                <div className="store-shelf-label">Coming Soon</div>
                <div className="store-shelf-items store-shelf-items--soon">
                  <div className="store-item store-item--soon">
                    <div style={{fontSize:'22px'}}>🎨</div>
                    <div className="store-item-name">Themes</div>
                    <div className="store-soon-tag">Soon</div>
                  </div>
                  <div className="store-item store-item--soon">
                    <div style={{fontSize:'22px'}}>✨</div>
                    <div className="store-item-name">Effects</div>
                    <div className="store-soon-tag">Soon</div>
                  </div>
                  <div className="store-item store-item--soon">
                    <div style={{fontSize:'22px'}}>🏠</div>
                    <div className="store-item-name">Decor</div>
                    <div className="store-soon-tag">Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
          confirmLabel={confirm.confirmLabel}
          danger={confirm.danger}
        />
      )}
    </>
  );
}

export default App;
