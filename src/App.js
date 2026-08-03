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

// ── Audio: selectable end-of-session alarm sounds ─────────────────────────────
function playWhistle(volume = 1) {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.25);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4 * volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t); osc.stop(t + 0.35);
  } catch(e) { console.warn('[Ascendi audio]', e); }
}

function playBell(volume = 1) {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    [523.25, 1046.5, 2093].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3 * volume / (i + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
      osc.start(t); osc.stop(t + 1.5);
    });
  } catch(e) { console.warn('[Ascendi audio]', e); }
}

function playChime(volume = 1) {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    [783.99, 987.77, 1174.66, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const onset = t + i * 0.12;
      gain.gain.setValueAtTime(0, onset);
      gain.gain.linearRampToValueAtTime(0.2 * volume, onset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, onset + 0.6);
      osc.start(onset); osc.stop(onset + 0.6);
    });
  } catch(e) { console.warn('[Ascendi audio]', e); }
}

// Plays the user's chosen end-of-session alarm sound at the chosen volume.
function playEndSound(sound = 'whistle', vol = 0.7) {
  if (sound === 'none') return;
  if (sound === 'bell') { playBell(vol); return; }
  if (sound === 'chime') { playChime(vol); return; }
  playWhistle(vol);
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
  if (!notifEnabledRef.current) return;
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
const LS_OCEAN_GARDEN = 'nsq_garden_ocean';
const LS_GARDEN_NIGHT_PETS = 'nsq_garden_night_pets';
const LS_GARDEN_WINTER_PETS = 'nsq_garden_winter_pets';
const LS_GARDEN_OCEAN_PETS = 'nsq_garden_ocean_pets';
const LS_STATS = 'nsq_stats';
const LS_SOUND = 'nsq_sound';
const LS_VOLUME = 'nsq_volume';
const LS_NOTIF = 'nsq_notif';
const LS_FONTSIZE = 'nsq_fontsize';
const LS_TIME_LEFT = 'nsq_time_left';
const LS_IS_ADDITIONAL_TIME = 'nsq_is_additional_time';
const LS_ADDITIONAL_TIME_LEFT = 'nsq_additional_time_left';

function loadTimeLeft() {
  const raw = parseInt(localStorage.getItem(LS_TIME_LEFT), 10);
  return isNaN(raw) ? null : raw;
}
function loadIsAdditionalTime() { return localStorage.getItem(LS_IS_ADDITIONAL_TIME) === 'true'; }
function loadAdditionalTimeLeft() {
  const raw = parseInt(localStorage.getItem(LS_ADDITIONAL_TIME_LEFT), 10);
  return isNaN(raw) ? 0 : raw;
}

// Timer-session record: the absolute wall-clock anchor for the currently
// running segment (fresh work/break run, or a resume from pause). Any tab —
// after a full reload, a mobile background suspension, or just waking up —
// recomputes "remaining" from this instead of trusting in-memory/worker state,
// which may have been frozen or discarded while the tab was backgrounded.
const LS_TIMER_SESSION = 'nsq_timer_session';

function saveTimerSession(session) {
  try { localStorage.setItem(LS_TIMER_SESSION, JSON.stringify(session)); } catch { /* ignore quota errors */ }
}
function loadTimerSession() {
  try { return JSON.parse(localStorage.getItem(LS_TIMER_SESSION)); } catch { return null; }
}
function clearTimerSession() {
  try { localStorage.removeItem(LS_TIMER_SESSION); } catch { /* ignore */ }
}

// ── Cross-tab leader election ─────────────────────────────────────────────────
// Only one open tab may own the Worker and award XP/points/stats — otherwise
// two tabs both ticking the same session would double-award and clobber each
// other's localStorage writes. Web Locks API gives free, automatic failover
// (the lock releases itself when a tab closes or crashes); for browsers
// without it, fall back to a localStorage heartbeat + BroadcastChannel.
const TIMER_LOCK_NAME = 'ascendi-timer-leader';
const LS_LEADER_HEARTBEAT = 'nsq_leader_heartbeat';
const LEADER_HEARTBEAT_INTERVAL_MS = 1000;
const LEADER_HEARTBEAT_STALE_MS = 3000;

function loadStats() {
  try { return JSON.parse(localStorage.getItem(LS_STATS)) || {}; } catch { return {}; }
}

function loadSound() { return localStorage.getItem(LS_SOUND) || 'whistle'; }
function loadVolume() { const r = parseFloat(localStorage.getItem(LS_VOLUME)); return isNaN(r) ? 0.7 : r; }
function loadNotifEnabled() { return localStorage.getItem(LS_NOTIF) !== 'false'; }
function loadFontSize() { return localStorage.getItem(LS_FONTSIZE) || 'M'; }

// showNotification is a module-level function (called from many places, including
// before any App instance exists), so this can't be a useRef — it's a plain
// mutable object the component syncs via a useEffect, mirroring the same .current
// access pattern.
let notifEnabledRef = { current: loadNotifEnabled() };

function loadGarden() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN)) || []; } catch { return []; }
}

function loadNightGardenPets() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN_NIGHT_PETS)) || []; } catch { return []; }
}
function loadWinterGardenPets() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN_WINTER_PETS)) || []; } catch { return []; }
}
function loadOceanGardenPets() {
  try { return JSON.parse(localStorage.getItem(LS_GARDEN_OCEAN_PETS)) || []; } catch { return []; }
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
const MAX_GARDEN_PETS = 10;

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
    drawPet(ctx, petId, stageIndex, 0, false, 'transparent', 1.5);
  }, [petId, stageIndex]);
  return (
    <canvas
      ref={ref}
      width={128}
      height={128}
      style={{ width: '50px', height: '50px', imageRendering: 'pixelated' }}
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
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, []);

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
  weeks.reverse();

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
    const lastDay = week[week.length - 1];
    if (lastDay.getDate() <= 7) {
      monthLabels.push({ wi, label: lastDay.toLocaleString('default', { month: 'short' }) });
    }
  });

  return (
    <div className="focus-calendar">
      <div className="focus-calendar-header">
        <span className="focus-calendar-title">FOCUS HISTORY</span>
        <span className="focus-calendar-total">{totalMins} min total</span>
      </div>
      <div className="focus-calendar-grid-wrapper" ref={scrollRef}>
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

function HomeScreen({ pet, xp, stats, onStart, onOpenSettings, onOpenPicker, darkMode, onToggleDark, t }) {
  const stageIdx = getStageIndex(xp, pet.id);
  const stageName = pet.stageNames[stageIdx];
  const nextThreshold = pet.stageThresholds[stageIdx + 1] ?? 1000;
  const prevThreshold = pet.stageThresholds[stageIdx] ?? 0;
  const xpInStage = xp - prevThreshold;
  const xpNeeded = nextThreshold - prevThreshold;
  const pct = Math.min(100, Math.round((xpInStage / xpNeeded) * 100));

  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPet(ctx, pet.id, stageIdx, 0, false, 'transparent');
  }, [pet.id, stageIdx]);

  return (
    <div className="home-screen">
      <div className="home-top-bar">
        <span className="home-title">ASCENDI</span>
        <div className="home-top-actions">
          <button className="home-icon-btn" onClick={onToggleDark} aria-label="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="home-icon-btn" onClick={onOpenSettings} aria-label="Settings">⚙️</button>
          <button className="home-icon-btn" onClick={onOpenPicker} aria-label="Change pet">🐾</button>
        </div>
      </div>

      <div className="home-pet-section">
        <canvas
          ref={canvasRef}
          width={128} height={128}
          className="home-pet-canvas"
        />
        <div className="home-pet-info">
          <div className="home-pet-name">{pet.name}</div>
          <div className="home-pet-stage">{t.stage} {stageIdx + 1} · {stageName}</div>
          <div className="home-xp-bar-wrap">
            <div className="home-xp-bar" style={{width:`${pct}%`, background: pet.color}}/>
          </div>
          <div className="home-xp-label">XP {xp} / {nextThreshold}</div>
        </div>
      </div>

      <div className="home-calendar-section">
        <FocusCalendar stats={stats} petColor={pet.color} />
      </div>

      <div className="home-start-section">
        <button className="home-start-btn" onClick={onStart} style={{borderColor: pet.color, color: pet.color}}>
          ▶ START SESSION
        </button>
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
    loadTimeLeft() ?? getDuration(
      loadMode(),
      loadWorkMinutes() * 60,
      loadShortBreakMinutes() * 60,
      loadLongBreakMinutes() * 60,
    )
  );
  const [isRunning, setIsRunning] = useState(false);
  const [worker, setWorker]       = useState(null);
  const [alerting, setAlerting]   = useState(false);

  // Cross-tab leader election — only the leader tab owns the Worker and is
  // allowed to award XP/points/stats; other open tabs mirror its state.
  const [isLeader, setIsLeader] = useState(false);

  // Pet & XP state
  const [xp, setXP]                   = useState(loadXP);
  const [chosenPetId, setChosenPetId] = useState(loadPetId);
  const [xpGainCount, setXpGainCount] = useState(0);

  // Points — earned in real time while the timer is running (1 per minute of work)
  const [points, setPoints] = useState(loadPoints);

  // Daily focus stats (minutes worked per day, keyed by 'YYYY-MM-DD') — feeds the focus calendar
  const [stats, setStats] = useState(loadStats);

  // UI state
  const [screen, setScreen] = useState('home');
  const isFirstVisitRef               = useRef(localStorage.getItem(LS_PET) === null);
  const [showWelcome, setShowWelcome]     = useState(() => localStorage.getItem(LS_PET) === null);
  const [showPicker, setShowPicker]       = useState(false);
  const [pendingPetId, setPendingPetId]   = useState(null);
  const [showXpWarning, setShowXpWarning] = useState(false);
  const [showGardenPicker, setShowGardenPicker] = useState(false);
  const [moveMenuFor, setMoveMenuFor]     = useState(null); // { gardenKey, index } | null
  const [darkMode, setDarkMode]           = useState(loadDarkMode);
  const [showBreakPopup, setShowBreakPopup]   = useState(false);
  const [pendingBreakMode, setPendingBreakMode] = useState(null);
  const [undoVisible, setUndoVisible]         = useState(false);
  const [isAdditionalTime, setIsAdditionalTime]           = useState(loadIsAdditionalTime);
  const [additionalTimeLeft, setAdditionalTimeLeft]       = useState(loadAdditionalTimeLeft);
  const [showExtraTimePicker, setShowExtraTimePicker] = useState(false);

  // Language state
  const [lang, setLang]       = useState(loadLang);
  const [showGarden, setShowGarden] = useState(false);
  const [gardenPets, setGardenPets] = useState(loadGarden);
  const [showNightGarden, setShowNightGarden] = useState(false);
  const [showWinterGarden, setShowWinterGarden] = useState(false);
  const [showOceanGarden, setShowOceanGarden] = useState(false);
  const [nightGardenPets, setNightGardenPets] = useState(loadNightGardenPets);
  const [winterGardenPets, setWinterGardenPets] = useState(loadWinterGardenPets);
  const [oceanGardenPets, setOceanGardenPets] = useState(loadOceanGardenPets);
  const [ownsNightGarden, setOwnsNightGarden] = useState(() => localStorage.getItem(LS_NIGHT_GARDEN) === 'true');
  const [ownsWinterGarden, setOwnsWinterGarden] = useState(() => localStorage.getItem(LS_WINTER_GARDEN) === 'true');
  const [ownsOceanGarden, setOwnsOceanGarden] = useState(() => localStorage.getItem(LS_OCEAN_GARDEN) === 'true');
  const [showStore, setShowStore] = useState(false);
  const [confirm, setConfirm] = useState(null);

  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);
  const [soundChoice, setSoundChoice] = useState(loadSound);
  const [volume, setVolume] = useState(loadVolume);
  const [notifEnabled, setNotifEnabled] = useState(loadNotifEnabled);
  const [fontSize, setFontSize] = useState(loadFontSize);

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
  const timeLeftRef               = useRef(timeLeft);
  const additionalTimeLeftRef     = useRef(additionalTimeLeft);
  const soundChoiceRef            = useRef(loadSound());
  const volumeRef                 = useRef(loadVolume());
  const isLeaderRef               = useRef(false);
  const leaderReleaseRef          = useRef(null); // resolves the Web Locks promise to release leadership
  const bcRef                     = useRef(null);  // BroadcastChannel for control-forwarding + fallback election
  const tabIdRef                  = useRef(Math.random().toString(36).slice(2));

  // Keep refs in sync with state
  useEffect(() => { modeRef.current          = mode;                  }, [mode]);
  useEffect(() => { pomodoroCountRef.current = pomodoroCount;         }, [pomodoroCount]);
  useEffect(() => { workSecsRef.current      = workMinutes * 60;      }, [workMinutes]);
  useEffect(() => { shortSecsRef.current     = shortBreakMinutes * 60;}, [shortBreakMinutes]);
  useEffect(() => { longSecsRef.current      = longBreakMinutes * 60; }, [longBreakMinutes]);
  useEffect(() => { cycleLengthRef.current   = cycleLength;           }, [cycleLength]);
  useEffect(() => { isRunningRef.current     = isRunning;             }, [isRunning]);
  useEffect(() => { isLeaderRef.current      = isLeader;              }, [isLeader]);
  useEffect(() => { xpRef.current            = xp;                    }, [xp]);
  useEffect(() => { pointsRef.current        = points;                }, [points]);
  useEffect(() => { timeLeftRef.current      = timeLeft;              }, [timeLeft]);
  useEffect(() => { additionalTimeLeftRef.current = additionalTimeLeft; }, [additionalTimeLeft]);
  useEffect(() => { soundChoiceRef.current   = soundChoice;           }, [soundChoice]);
  useEffect(() => { volumeRef.current        = volume;                }, [volume]);
  useEffect(() => { notifEnabledRef.current  = notifEnabled;          }, [notifEnabled]);

  // Persist all settings & session state to localStorage
  useEffect(() => { localStorage.setItem(LS_XP,    xp);               }, [xp]);
  useEffect(() => { localStorage.setItem(LS_PET,   chosenPetId);      }, [chosenPetId]);
  useEffect(() => { localStorage.setItem(LS_WORK,  workMinutes);      }, [workMinutes]);
  useEffect(() => { localStorage.setItem(LS_SHORT, shortBreakMinutes);}, [shortBreakMinutes]);
  useEffect(() => { localStorage.setItem(LS_LONG,  longBreakMinutes); }, [longBreakMinutes]);
  useEffect(() => { localStorage.setItem(LS_CYCLE, cycleLength);      }, [cycleLength]);
  useEffect(() => { localStorage.setItem(LS_COUNT, pomodoroCount);    }, [pomodoroCount]);
  useEffect(() => { localStorage.setItem(LS_MODE,   mode);            }, [mode]);
  // So a paused (or otherwise non-running) session survives a full reload
  // too — not just a running one, which recomputeFromSession already covers.
  useEffect(() => { localStorage.setItem(LS_TIME_LEFT, timeLeft);      }, [timeLeft]);
  useEffect(() => { localStorage.setItem(LS_IS_ADDITIONAL_TIME, isAdditionalTime ? 'true' : 'false'); }, [isAdditionalTime]);
  useEffect(() => { localStorage.setItem(LS_ADDITIONAL_TIME_LEFT, additionalTimeLeft); }, [additionalTimeLeft]);
  useEffect(() => { localStorage.setItem(LS_POINTS, points);         }, [points]);
  useEffect(() => { localStorage.setItem(LS_LANG,   lang);            }, [lang]);
  useEffect(() => { localStorage.setItem(LS_GARDEN, JSON.stringify(gardenPets)); }, [gardenPets]);
  useEffect(() => { localStorage.setItem(LS_GARDEN_NIGHT_PETS, JSON.stringify(nightGardenPets)); }, [nightGardenPets]);
  useEffect(() => { localStorage.setItem(LS_GARDEN_WINTER_PETS, JSON.stringify(winterGardenPets)); }, [winterGardenPets]);
  useEffect(() => { localStorage.setItem(LS_GARDEN_OCEAN_PETS, JSON.stringify(oceanGardenPets)); }, [oceanGardenPets]);
  useEffect(() => { localStorage.setItem(LS_NIGHT_GARDEN, ownsNightGarden ? 'true' : 'false'); }, [ownsNightGarden]);
  useEffect(() => { localStorage.setItem(LS_WINTER_GARDEN, ownsWinterGarden ? 'true' : 'false'); }, [ownsWinterGarden]);
  useEffect(() => { localStorage.setItem(LS_OCEAN_GARDEN, ownsOceanGarden ? 'true' : 'false'); }, [ownsOceanGarden]);
  useEffect(() => { localStorage.setItem(LS_STATS, JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem(LS_SOUND, soundChoice); }, [soundChoice]);
  useEffect(() => { localStorage.setItem(LS_VOLUME, volume); }, [volume]);
  useEffect(() => { localStorage.setItem(LS_NOTIF, notifEnabled); }, [notifEnabled]);
  useEffect(() => { localStorage.setItem(LS_FONTSIZE, fontSize); }, [fontSize]);

  // Apply theme and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem(LS_DARK, darkMode);
  }, [darkMode]);

  // Apply chosen font size to the document root
  useEffect(() => {
    const sizes = { S: '13px', M: '16px', L: '19px' };
    document.documentElement.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  // Browser tab title
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.title = `Ascendi ${m}:${s.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  // Recompute "how much time is actually left" from the absolute timestamp
  // anchor persisted in localStorage, rather than trusting in-memory/worker
  // state — which may have been frozen (background-tab throttling) or lost
  // entirely (a full tab reload/kill, which mobile browsers do aggressively
  // once a tab has been backgrounded for a while). Called on mount (once
  // this tab knows whether it's leader), on every visibilitychange back to
  // 'visible', and once a second by follower tabs for display purposes.
  // `restartWorker` also re-anchors and restarts this tab's own Worker from
  // the corrected remaining time — meaningful only for the leader.
  const recomputeFromSession = (restartWorker) => {
    const session = loadTimerSession();
    if (!session) return;

    const elapsed = Math.max(0, (Date.now() - session.startedAt) / 1000);
    const cappedElapsed = Math.min(elapsed, session.initialRemaining);
    const remaining = Math.max(0, Math.round(session.initialRemaining - elapsed));

    if (session.isAdditionalTime) {
      isAdditionalTimeRef.current = true;
      setIsAdditionalTime(true);
      setAdditionalTimeLeft(remaining);
    } else {
      setTimeLeft(remaining);
    }
    isRunningRef.current = true;
    setIsRunning(true);

    if (isLeaderRef.current) {
      // Only the leader may catch up the work-seconds/points counters —
      // a follower must never touch these, or two tabs recomputing the
      // same background gap would double-award.
      const targetRef = session.isAdditionalTime ? additionalWorkSecsRef : workSecondsRef;
      const newWorkSecs = session.workSecondsAtStart + cappedElapsed;
      targetRef.current = newWorkSecs;
      if (session.isAdditionalTime || modeRef.current === 'work') {
        const earnedRef = session.isAdditionalTime ? additionalPointsEarnedRef : pointsEarnedRef;
        const earned = Math.floor(newWorkSecs / 60);
        if (earned > earnedRef.current) {
          const delta = earned - earnedRef.current;
          const newPoints = pointsRef.current + delta;
          pointsRef.current = newPoints;
          setPoints(newPoints);
        }
        earnedRef.current = earned;
      }

      if (restartWorker && remaining > 0) {
        workerRef.current?.postMessage('stop');
        workerRef.current?.postMessage({ type: 'start', seconds: remaining });
        saveTimerSession({
          startedAt: Date.now(),
          initialRemaining: remaining,
          isAdditionalTime: session.isAdditionalTime,
          workSecondsAtStart: newWorkSecs,
        });
      }
      // If remaining is already 0, leave timeLeft/additionalTimeLeft at 0
      // with isRunning still true — the existing session-end /
      // additional-time-end effects detect that transition and run the
      // normal completion flow (sound, notification, XP, stats, next mode)
      // using the now-correctly-caught-up work-seconds total.
    }
  };

  // Preload the end-of-session audio on mount, and unlock it on the first
  // user gesture — mobile browsers block audio.play() until a gesture occurs.
  useEffect(() => {
    preloadAudio();
    const handleFirstInteraction = () => unlockAudio();
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });

    // Re-sync from the absolute timestamp anchor whenever the tab comes back
    // into the foreground. We never trust that the worker kept ticking in
    // the background — iOS Safari in particular suspends JS (and Workers)
    // aggressively on lock/app-switch, so "how much time passed" can only be
    // known by comparing wall-clock time now against when the segment
    // started, not by counting ticks that may never have fired.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        recomputeFromSession(isLeaderRef.current);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ── Cross-tab leader election ────────────────────────────────────────────
  // Exactly one open tab may drive the timer (own the Worker, award XP /
  // points / stats) — otherwise two tabs both ticking the same session could
  // double-award and clobber each other's localStorage writes. Web Locks
  // gives free, automatic failover: the lock releases itself the instant a
  // leader tab closes or crashes, and the browser hands it to the next tab
  // waiting in line — no polling needed. Falls back to a localStorage
  // heartbeat + BroadcastChannel election for browsers without it.
  useEffect(() => {
    let cancelled = false;
    const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('ascendi-timer') : null;
    bcRef.current = bc;

    if (navigator.locks && navigator.locks.request) {
      navigator.locks.request(TIMER_LOCK_NAME, () => new Promise((release) => {
        if (cancelled) { release(); return; }
        leaderReleaseRef.current = release;
        setIsLeader(true);
        // Resolve only when this tab goes away — that's what releases the
        // lock and lets the next queued tab become leader.
      })).catch(() => { /* Locks API unexpectedly failed — stay a follower */ });
    } else {
      const claim = () => {
        localStorage.setItem(LS_LEADER_HEARTBEAT, JSON.stringify({ id: tabIdRef.current, ts: Date.now() }));
        bc?.postMessage({ type: 'leader-announce', id: tabIdRef.current });
        setIsLeader(true);
      };
      const tick = () => {
        if (cancelled) return;
        if (isLeaderRef.current) {
          localStorage.setItem(LS_LEADER_HEARTBEAT, JSON.stringify({ id: tabIdRef.current, ts: Date.now() }));
          return;
        }
        let hb = null;
        try { hb = JSON.parse(localStorage.getItem(LS_LEADER_HEARTBEAT)); } catch { /* ignore */ }
        if (!hb || Date.now() - hb.ts > LEADER_HEARTBEAT_STALE_MS) claim();
      };
      const handleAnnounce = (e) => {
        if (e.data?.type === 'leader-announce' && e.data.id !== tabIdRef.current) setIsLeader(false);
      };
      bc?.addEventListener('message', handleAnnounce);
      tick();
      const intervalId = setInterval(tick, LEADER_HEARTBEAT_INTERVAL_MS);
      return () => {
        cancelled = true;
        clearInterval(intervalId);
        bc?.removeEventListener('message', handleAnnounce);
        bc?.close();
      };
    }

    return () => {
      cancelled = true;
      leaderReleaseRef.current?.();
      leaderReleaseRef.current = null;
      bc?.close();
    };
  }, []);

  // Create the Worker only once this tab is confirmed leader — a follower
  // never owns one. Also resumes any run that was already in progress
  // before this tab reloaded, or before it took over from a leader that
  // just closed.
  useEffect(() => {
    if (!isLeader) return;
    const timerWorker = new Worker(`${process.env.PUBLIC_URL}/timer-worker.js`);
    workerRef.current = timerWorker;
    setWorker(timerWorker);
    recomputeFromSession(true);
    return () => {
      // Stop ticking before terminating so no queued 'tick' message can be
      // delivered to a worker that's already gone (or after unmount).
      timerWorker.postMessage('stop');
      timerWorker.terminate();
      workerRef.current = null;
    };
  }, [isLeader]); // eslint-disable-line react-hooks/exhaustive-deps

  // Followers don't own a Worker — recompute the display from the shared
  // session record once a second so the countdown still visibly moves in
  // every open tab, without any of them driving real (persisted) state.
  useEffect(() => {
    if (isLeader) return;
    recomputeFromSession(false);
    const intervalId = setInterval(() => recomputeFromSession(false), 1000);
    return () => clearInterval(intervalId);
  }, [isLeader]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wire up the tick handler — re-registers only when the worker instance changes
  useEffect(() => {
    if (!worker) return;
    worker.onmessage = (event) => {
      if (!event.data || event.data.type !== 'tick') return;
      if (!isRunningRef.current) return; // discard stale ticks after stop

      if (isAdditionalTimeRef.current) {
        // Additional-time mode: count down the mini timer and award points
        setAdditionalTimeLeft(event.data.remaining);
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
        setTimeLeft(event.data.remaining);
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
    // Only the leader awards XP/points/stats — a follower just mirrors the
    // timeLeft-hits-0 moment visually and waits for the leader's real
    // completion (next mode, isRunning=false) to reach it via localStorage.
    if (!isLeaderRef.current) return;

    workerRef.current?.postMessage('stop');
    isRunningRef.current = false;
    setIsRunning(false);
    clearTimerSession();

    // Flash alert
    setAlerting(true);
    setTimeout(() => setAlerting(false), 1500);

    // Sound
    playEndSound(soundChoiceRef.current, volumeRef.current);

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
    if (!isLeaderRef.current) return;

    workerRef.current?.postMessage('stop');
    isRunningRef.current = false;
    setIsRunning(false);
    isAdditionalTimeRef.current = false;
    setIsAdditionalTime(false);
    clearTimerSession();

    setAlerting(true);
    setTimeout(() => setAlerting(false), 1500);
    playEndSound(soundChoiceRef.current, volumeRef.current);
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
  // A tab that isn't the leader has no Worker of its own — forward the
  // intent to whichever tab currently is leader instead of acting locally.
  const startTimer = () => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'start' }); return; }
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

      workerRef.current.postMessage({ type: 'start', seconds: timeLeft });
      isRunningRef.current = true;
      setIsRunning(true);
      saveTimerSession({
        startedAt: Date.now(),
        initialRemaining: timeLeft,
        isAdditionalTime: false,
        workSecondsAtStart: workSecondsRef.current,
      });

      // Play start chime + notify only when a work session begins fresh
      if (modeRef.current === 'work' && isFreshStart) {
        playStartChime();
        showNotification('Work session started!', 'Stay focused — you\'ve got this! 🎯');
      }
    }
  };

  const pauseTimer = () => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'pause' }); return; }
    if (workerRef.current && isRunningRef.current) {
      workerRef.current.postMessage('stop');
      clearTimerSession();
      isRunningRef.current = false;
      setIsRunning(false);
    }
  };

  const resetSession = () => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'resetSession' }); return; }
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
      clearTimerSession();
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
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'resetCycle' }); return; }
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
      clearTimerSession();
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

  const startAdditionalTime = (minutes) => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'startAdditionalTime', minutes }); return; }
    setShowExtraTimePicker(false);
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
    setAdditionalTimeLeft(minutes * 60);
    // Ensure the worker is ticking (it may have been paused)
    if (!isRunningRef.current) {
      workerRef.current?.postMessage({ type: 'start', seconds: minutes * 60 });
      isRunningRef.current = true;
      setIsRunning(true);
    }
    saveTimerSession({
      startedAt: Date.now(),
      initialRemaining: minutes * 60,
      isAdditionalTime: true,
      workSecondsAtStart: 0,
    });
  };

  const resumeAdditionalTime = () => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'resumeAdditionalTime' }); return; }
    workerRef.current?.postMessage({ type: 'start', seconds: additionalTimeLeftRef.current });
    isRunningRef.current = true;
    setIsRunning(true);
    saveTimerSession({
      startedAt: Date.now(),
      initialRemaining: additionalTimeLeftRef.current,
      isAdditionalTime: true,
      workSecondsAtStart: additionalWorkSecsRef.current,
    });
  };

  const cancelAdditionalTime = () => {
    if (!isLeaderRef.current) { bcRef.current?.postMessage({ type: 'control', action: 'cancelAdditionalTime' }); return; }
    workerRef.current?.postMessage('stop');
    clearTimerSession();
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

  // A follower tab's button clicks forward here as a 'control' message
  // instead of acting locally — only the leader is listening and allowed to
  // act on them, so the exact same handler a local click would use runs.
  useEffect(() => {
    const handleMessage = (e) => {
      if (!isLeaderRef.current) return;
      const msg = e.data;
      if (!msg || msg.type !== 'control') return;
      switch (msg.action) {
        case 'start':               startTimer(); break;
        case 'pause':                pauseTimer(); break;
        case 'resetSession':         resetSession(); break;
        case 'resetCycle':           resetCycle(); break;
        case 'startAdditionalTime':  startAdditionalTime(msg.minutes); break;
        case 'resumeAdditionalTime': resumeAdditionalTime(); break;
        case 'cancelAdditionalTime': cancelAdditionalTime(); break;
        default: break;
      }
    };
    bcRef.current?.addEventListener('message', handleMessage);
    return () => bcRef.current?.removeEventListener('message', handleMessage);
  }); // no deps — re-registers each render so it always closes over the latest handlers

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
  const handleRenameOceanPet = (index, newName) => {
    setOceanGardenPets(prev => prev.map((p, i) => i === index ? { ...p, name: newName } : p));
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
  const handleDeleteOceanPet = (index) => {
    askConfirm(
      'Remove this pet from the ocean garden?',
      () => setOceanGardenPets(prev => prev.filter((_, i) => i !== index)),
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
  const handleDeleteOceanGarden = () => {
    askConfirm(
      'Delete the Ocean Garden? All pets inside will be lost.',
      () => {
        setOwnsOceanGarden(false);
        setOceanGardenPets([]);
        setShowOceanGarden(false);
      },
      'Delete garden',
      true
    );
  };


  // Only gardens the user has unlocked/purchased are offered as a destination —
  // My Garden is free/always available, Night, Winter & Ocean are store purchases.
  const gardenOptions = [
    { key: 'day',    label: 'My Garden',      icon: '🌿', color: undefined,  pets: gardenPets,       setPets: setGardenPets,       unlocked: true },
    { key: 'night',  label: 'Night Garden',   icon: '🌙', color: '#a080d0',  pets: nightGardenPets,  setPets: setNightGardenPets,  unlocked: ownsNightGarden },
    { key: 'winter', label: 'Winter Garden',  icon: '❄️', color: '#80b0e0',  pets: winterGardenPets, setPets: setWinterGardenPets, unlocked: ownsWinterGarden },
    { key: 'ocean',  label: 'Ocean Garden',   icon: '🌊', color: '#3ab0d8',  pets: oceanGardenPets,  setPets: setOceanGardenPets,  unlocked: ownsOceanGarden },
  ].filter(g => g.unlocked);

  const sendPetToGarden = (option) => {
    if (option.pets.length >= MAX_GARDEN_PETS) return;
    setShowGardenPicker(false);
    askConfirm(
      `Send this pet to ${option.label}? Their XP will be frozen and you will need to choose a new companion.`,
      () => {
        const petName = getPetById(chosenPetId).name;
        const stageIndex = getStageIndex(xpRef.current, chosenPetId);
        option.setPets(prev => [...prev, { id: chosenPetId, name: petName, stageIndex }]);
        setXP(0);
        xpRef.current = 0;
        isFirstVisitRef.current = true;
        setShowPicker(true);
      },
      'Send to garden',
      false
    );
  };

  // Moving a pet already inside a garden over to a different unlocked garden.
  const movePetToGarden = (fromOption, index, toOption) => {
    if (toOption.pets.length >= MAX_GARDEN_PETS) return;
    const pet = fromOption.pets[index];
    fromOption.setPets(prev => prev.filter((_, i) => i !== index));
    toOption.setPets(prev => [...prev, pet]);
    setMoveMenuFor(null);
  };

  const renderMoveTo = (gardenKey, index) => {
    const fromOption = gardenOptions.find(g => g.key === gardenKey);
    const others = gardenOptions.filter(g => g.key !== gardenKey);
    const isOpen = !!moveMenuFor && moveMenuFor.gardenKey === gardenKey && moveMenuFor.index === index;
    return (
      <div className="garden-pet-move" onClick={e => e.stopPropagation()}>
        <button
          className="garden-pet-move-btn"
          onClick={() => setMoveMenuFor(isOpen ? null : { gardenKey, index })}
        >
          Move to...
        </button>
        {isOpen && (
          <div className="garden-pet-move-menu">
            {others.length === 0 ? (
              <div className="garden-pet-move-empty">No other gardens unlocked</div>
            ) : others.map(o => {
              const full = o.pets.length >= MAX_GARDEN_PETS;
              return (
                <button
                  key={o.key}
                  className="garden-pet-move-option"
                  disabled={full}
                  onClick={() => movePetToGarden(fromOption, index, o)}
                >
                  {o.icon} {o.label}{full ? ' · full' : ''}
                </button>
              );
            })}
          </div>
        )}
      </div>
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

      {screen === 'home' ? (
        <HomeScreen
          pet={getPetById(chosenPetId)}
          xp={xp}
          stats={stats}
          onStart={() => setScreen('timer')}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPicker={() => setShowPicker(true)}
          onToggleDark={() => setDarkMode(d => !d)}
          darkMode={darkMode}
          t={t}
        />
      ) : (
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
            <button
              className="settings-gear-btn"
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              title="Settings"
            >
              ⚙️
            </button>
            <button className="home-back-btn" onClick={() => setScreen('home')} aria-label="Go to home">← Home</button>
          </div>
        </div>

        {/* Pet + XP */}
        <div className="pet-display-row">
          <PetDisplay petId={chosenPetId} xp={xp} gainCount={xpGainCount} isRunning={isRunning} mode={mode} isAdditionalTime={isAdditionalTime} label={t.stage} onJoinGarden={() => setShowGardenPicker(true)} />
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
            {ownsOceanGarden && (
              <button className="ocean-garden-circle-btn" onClick={() => setShowOceanGarden(g => !g)} aria-label="Ocean garden" title="Ocean garden">
                <svg width="18" height="18" viewBox="0 0 9 9" style={{imageRendering:'pixelated'}} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="0" y="2" width="2" height="1" fill="#3ab0d8"/>
                  <rect x="2" y="1" width="2" height="1" fill="#3ab0d8"/>
                  <rect x="4" y="2" width="2" height="1" fill="#3ab0d8"/>
                  <rect x="6" y="1" width="2" height="1" fill="#3ab0d8"/>
                  <rect x="8" y="2" width="1" height="1" fill="#3ab0d8"/>
                  <rect x="0" y="5" width="2" height="1" fill="#7ad0e8"/>
                  <rect x="2" y="4" width="2" height="1" fill="#7ad0e8"/>
                  <rect x="4" y="5" width="2" height="1" fill="#7ad0e8"/>
                  <rect x="6" y="4" width="2" height="1" fill="#7ad0e8"/>
                  <rect x="8" y="5" width="1" height="1" fill="#7ad0e8"/>
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
              <button className="btn btn-sm btn-secondary" onClick={resumeAdditionalTime}>{t.resume}</button>
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
            <button className="btn btn-sm btn-at" onClick={() => setShowExtraTimePicker(true)}>
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

      </div>
      )}

      {showGarden && (
        <div className="garden-overlay" onClick={() => setShowGarden(false)}>
          <div className="garden-modal" onClick={e => { e.stopPropagation(); setMoveMenuFor(null); }}>
            <div className="garden-header">
              <span className="garden-title">🌿 My garden <span className="garden-count">{gardenPets.length} / {MAX_GARDEN_PETS}</span></span>
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
              </div>
              <div className="garden-pets-grid">
                {gardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet">
                    <div className="garden-pet-sprite">
                      <GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex} />
                    </div>
                    <textarea
                      className="garden-pet-name"
                      value={pet.name}
                      onChange={e => handleRenameGardenPet(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      maxLength={15}
                      rows={2}
                    />
                    <button className="garden-pet-delete" onClick={() => handleDeleteGardenPet(i)} title="Remove from garden">✕</button>
                    {renderMoveTo('day', i)}
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
          <div className="night-garden-modal" onClick={e => { e.stopPropagation(); setMoveMenuFor(null); }}>
            <div className="garden-header night-garden-header">
              <span className="garden-title" style={{color:'#a080d0'}}>🌙 Night Garden <span className="garden-count">{nightGardenPets.length} / {MAX_GARDEN_PETS}</span></span>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="garden-delete-btn" onClick={handleDeleteNightGarden} title="Delete this garden">delete</button>
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
              </div>
              <div className="garden-pets-grid">
                {nightGardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet">
                    <div className="garden-pet-sprite"><GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex}/></div>
                    <textarea
                      className="garden-pet-name night-pet-name"
                      value={pet.name}
                      onChange={e => handleRenameNightPet(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      maxLength={15}
                      rows={2}
                    />
                    <button className="garden-pet-delete" onClick={() => handleDeleteNightPet(i)} title="Remove from garden">✕</button>
                    {renderMoveTo('night', i)}
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
          <div className="winter-garden-modal" onClick={e => { e.stopPropagation(); setMoveMenuFor(null); }}>
            <div className="garden-header winter-garden-header">
              <span className="garden-title" style={{color:'#80b0e0'}}>❄️ Winter Garden <span className="garden-count">{winterGardenPets.length} / {MAX_GARDEN_PETS}</span></span>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="garden-delete-btn" onClick={handleDeleteWinterGarden} title="Delete this garden">delete</button>
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
              </div>
              <div className="garden-pets-grid">
                {winterGardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet">
                    <div className="garden-pet-sprite"><GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex}/></div>
                    <textarea
                      className="garden-pet-name winter-pet-name"
                      value={pet.name}
                      onChange={e => handleRenameWinterPet(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      maxLength={15}
                      rows={2}
                    />
                    <button className="garden-pet-delete" onClick={() => handleDeleteWinterPet(i)} title="Remove from garden">✕</button>
                    {renderMoveTo('winter', i)}
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

      {showOceanGarden && (
        <div className="garden-overlay" onClick={() => setShowOceanGarden(false)}>
          <div className="ocean-garden-modal" onClick={e => { e.stopPropagation(); setMoveMenuFor(null); }}>
            <div className="garden-header ocean-garden-header">
              <span className="garden-title" style={{color:'#3ab0d8'}}>🌊 Ocean Garden <span className="garden-count">{oceanGardenPets.length} / {MAX_GARDEN_PETS}</span></span>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <button className="garden-delete-btn" onClick={handleDeleteOceanGarden} title="Delete this garden">delete</button>
                <button className="garden-close" onClick={() => setShowOceanGarden(false)}>✕</button>
              </div>
            </div>
            <div className="ocean-garden-scene">
              <div className="ocean-light-ray" style={{left:'10%'}}/>
              <div className="ocean-light-ray" style={{left:'35%', animationDelay:'1.5s'}}/>
              <div className="ocean-light-ray" style={{left:'60%', animationDelay:'0.8s'}}/>
              <div className="ocean-light-ray" style={{left:'82%', animationDelay:'2.2s'}}/>
              <div className="ocean-bubble" style={{left:'15%', animationDelay:'0s'}}/>
              <div className="ocean-bubble" style={{left:'32%', animationDelay:'1.2s'}}/>
              <div className="ocean-bubble" style={{left:'52%', animationDelay:'2.4s'}}/>
              <div className="ocean-bubble" style={{left:'70%', animationDelay:'0.6s'}}/>
              <div className="ocean-bubble" style={{left:'88%', animationDelay:'1.8s'}}/>
              <div className="ocean-floor">
                <div className="ocean-seaweed" style={{left:'18px'}}/>
                <div className="ocean-seaweed ocean-seaweed--right" style={{right:'18px'}}/>
                <div className="ocean-coral" style={{left:'50px'}}>🪸</div>
                <div className="ocean-shell" style={{left:'46%'}}>🐚</div>
                <div className="ocean-coral" style={{right:'60px'}}>🪸</div>
              </div>
              <div className="garden-pets-grid">
                {oceanGardenPets.map((pet, i) => (
                  <div key={i} className="garden-pet">
                    <div className="garden-pet-sprite"><GardenPetCanvas petId={pet.id} stageIndex={pet.stageIndex}/></div>
                    <textarea
                      className="garden-pet-name ocean-pet-name"
                      value={pet.name}
                      onChange={e => handleRenameOceanPet(i, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      maxLength={15}
                      rows={2}
                    />
                    <button className="garden-pet-delete" onClick={() => handleDeleteOceanPet(i)} title="Remove from garden">✕</button>
                    {renderMoveTo('ocean', i)}
                  </div>
                ))}
                {oceanGardenPets.length === 0 && (
                  <div className="garden-empty" style={{color:'#0a3a5c',background:'rgba(200,169,110,0.9)'}}>Your ocean garden is empty!</div>
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

                  <div className="store-item">
                    <div className="store-item-name" style={{color:'#3ab0d8'}}>Ocean Garden</div>
                    <div className="store-item-preview store-item-preview--ocean">
                      <span className="store-preview-icon">🌊</span>
                      <span className="store-preview-shell">🐚</span>
                    </div>
                    <p className="store-item-desc">A peaceful underwater world</p>
                    {ownsOceanGarden ? (
                      <div className="store-owned-tag">✓ Owned</div>
                    ) : (
                      <button className="store-buy-btn store-buy-btn--ocean" onClick={() => { setOwnsOceanGarden(true); }}>Get</button>
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

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="settings-modal-header">
              <span className="settings-modal-title">⚙️ Settings</span>
              <button className="settings-modal-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="settings-modal-body">

              <div className="settings-section-label">Sound</div>
              <div className="settings-row">
                <span className="settings-row-label">Alarm</span>
                <div className="settings-sound-btns">
                  {['whistle','bell','chime','none'].map(s => (
                    <button
                      key={s}
                      className={`settings-sound-btn${soundChoice === s ? ' active' : ''}`}
                      onClick={() => {
                        setSoundChoice(s);
                        if (s !== 'none') playEndSound(s, volumeRef.current);
                      }}
                    >
                      {s === 'whistle' ? '🎵' : s === 'bell' ? '🔔' : s === 'chime' ? '✨' : '🔇'}
                      <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-row-label">Volume</span>
                <div className="settings-volume-row">
                  <span style={{fontSize:'12px'}}>🔈</span>
                  <input
                    type="range" min="0" max="1" step="0.05"
                    value={volume}
                    className="settings-volume-slider"
                    onChange={e => setVolume(parseFloat(e.target.value))}
                  />
                  <span style={{fontSize:'12px'}}>🔊</span>
                </div>
              </div>

              <div className="settings-section-label">Notifications</div>
              <div className="settings-row">
                <div>
                  <span className="settings-row-label">Push notifications</span>
                  <div className="settings-row-sub">Session start & end alerts</div>
                </div>
                <button
                  className={`settings-toggle${notifEnabled ? ' active' : ''}`}
                  onClick={() => setNotifEnabled(v => !v)}
                  aria-label="Toggle notifications"
                >
                  <div className="settings-toggle-thumb"/>
                </button>
              </div>

              <div className="settings-section-label">Display</div>
              <div className="settings-row">
                <span className="settings-row-label">Language</span>
                <div className="settings-lang-btns">
                  {LANGUAGES.map(l => (
                    <button
                      key={l}
                      className={`settings-lang-btn${lang === l ? ' active' : ''}`}
                      onClick={() => setLang(l)}
                    >{l}</button>
                  ))}
                </div>
              </div>
              <div className="settings-row">
                <span className="settings-row-label">Font size</span>
                <div className="settings-font-btns">
                  {['S','M','L'].map(f => (
                    <button
                      key={f}
                      className={`settings-font-btn${fontSize === f ? ' active' : ''}`}
                      onClick={() => setFontSize(f)}
                    >{f}</button>
                  ))}
                </div>
              </div>

              <div className="settings-section-label">Account</div>
              <div className="settings-account-btns">
                <button className="settings-account-btn" onClick={() => {
                  askConfirm('Reset focus statistics? Your calendar history will be cleared.', () => setStats({}), 'Reset stats', true);
                }}>📊 Reset statistics</button>
                <button className="settings-account-btn settings-account-btn--warn" onClick={() => {
                  askConfirm('Reset account? This clears your XP and stats but keeps your pet.', () => {
                    setXP(0); xpRef.current = 0;
                    setPoints(0); pointsRef.current = 0;
                    setStats({});
                  }, 'Reset account', true);
                }}>⚠️ Reset account — clears XP & stats, keeps pet</button>
                <button className="settings-account-btn settings-account-btn--danger" onClick={() => {
                  askConfirm('Delete everything? This cannot be undone.', () => {
                    localStorage.clear();
                    window.location.reload();
                  }, 'Delete everything', true);
                }}>🗑 Delete account — removes everything</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showGardenPicker && (
        <div className="garden-picker-overlay" onClick={() => setShowGardenPicker(false)}>
          <div className="garden-picker-modal" onClick={e => e.stopPropagation()}>
            <div className="garden-picker-header">
              <span className="garden-picker-title">Choose a garden</span>
              <button className="garden-picker-close" onClick={() => setShowGardenPicker(false)}>✕</button>
            </div>
            <p className="garden-picker-sub">Their XP will be frozen and you'll pick a new companion.</p>
            <div className="garden-picker-list">
              {gardenOptions.map(option => {
                const isFull = option.pets.length >= MAX_GARDEN_PETS;
                return (
                  <button
                    key={option.key}
                    className="garden-picker-option"
                    style={option.color ? { '--garden-color': option.color } : undefined}
                    disabled={isFull}
                    onClick={() => sendPetToGarden(option)}
                  >
                    <span className="garden-picker-option-icon">{option.icon}</span>
                    <span className="garden-picker-option-label">{option.label}</span>
                    <span className="garden-picker-option-count">{option.pets.length} / {MAX_GARDEN_PETS}{isFull ? ' · full' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showExtraTimePicker && (
        <div className="extra-time-picker-overlay" onClick={() => setShowExtraTimePicker(false)}>
          <div className="extra-time-picker-modal" onClick={e => e.stopPropagation()}>
            <div className="extra-time-picker-header">
              <span className="extra-time-picker-title">{t.extraTime}</span>
              <button className="extra-time-picker-close" onClick={() => setShowExtraTimePicker(false)}>✕</button>
            </div>
            <div className="extra-time-picker-list">
              {[5, 10, 15, 20, 30, 60].map(min => (
                <button
                  key={min}
                  className="extra-time-picker-option"
                  onClick={() => startAdditionalTime(min)}
                >
                  {min} {t.min}
                </button>
              ))}
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
