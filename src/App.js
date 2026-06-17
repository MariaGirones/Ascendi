import './App.css';
import { useState, useEffect, useRef } from 'react';
import PetDisplay from './PetDisplay';
import PetPicker from './PetPicker';
import { MAX_XP } from './pets';

// ── Audio: end-of-session WAV ─────────────────────────────────────────────────
let audio = null;
function preloadAudio() {
  if (!audio) {
    audio = new Audio(process.env.PUBLIC_URL + '/endOfPomodoro.wav');
    audio.load();
  }
}

// ── Audio: synthesized start chime (Web Audio API, no file needed) ────────────
// Two ascending sine tones (E5 → A5) — clearly distinct from the end WAV.
// Fires on the user's tap/click, so mobile autoplay restrictions do not apply.
function playStartChime() {
  try {
    const AudioCtx = window.AudioContext || window['webkitAudioContext'];
    const ctx = new AudioCtx();
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
    setTimeout(() => ctx.close(), 1200);
  } catch (e) {}
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
      .catch(() => {});
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
    ...(persistent && { requireInteraction: true }),
    vibrate:  persistent ? [200, 100, 200] : [100],
  };
  try {
    if (swReg) {
      swReg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (_) {
    try { new Notification(title, options); } catch (_2) {}
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

  // Create the worker once
  useEffect(() => {
    const timerWorker = new Worker(`${process.env.PUBLIC_URL}/timer-worker.js`);
    workerRef.current = timerWorker;
    setWorker(timerWorker);
    return () => timerWorker.terminate();
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
    preloadAudio();
    audio.currentTime = 0;
    audio.play().catch(() => {});

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
    preloadAudio();
    audio.currentTime = 0;
    audio.play().catch(() => {});
    showNotification(
      'Additional time complete!',
      'Your main session is ready to resume.',
      { persistent: true }
    );

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
      Notification.requestPermission();
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

  // ── Derived display values ────────────────────────────────────────────────
  const completedInCycle =
    mode === 'work'      ? pomodoroCount - 1 :
    mode === 'longBreak' ? cycleLength :
    /* shortBreak */       pomodoroCount;

  const modeLabel =
    mode === 'work'       ? 'Work Session'  :
    mode === 'shortBreak' ? '☕ Short Break' :
                            '🛋️ Long Break';

  const subLabel =
    mode === 'work'
      ? `Session ${pomodoroCount} / ${cycleLength}`
      : mode === 'shortBreak'
      ? `After session ${pomodoroCount} / ${cycleLength}`
      : 'Cycle complete — enjoy the rest!';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Welcome / instructions modal (first visit only) ── */}
      {showWelcome && (
        <div className="welcome-modal">
          <div className="modal-content modal-narrow">
            <h3>Welcome to Ascendi!</h3>
            <ul className="welcome-instructions">
              <li>⏱ Work in focused sessions to earn XP</li>
              <li>🐾 Your pet grows as you level up</li>
              <li>☕ Short breaks after each session</li>
              <li>🛋️ Long break after every {cycleLength} sessions</li>
            </ul>
            <button className="got-it-btn" onClick={handleWelcomeContinue}>
              Pick your companion!
            </button>
          </div>
        </div>
      )}

      {/* ── Pet picker modal (onboarding + change) ── */}
      {showPicker && (
        <div className="welcome-modal">
          <div className="modal-content modal-wide">
            <h3>{isFirstVisitRef.current ? 'Choose your companion' : '🐾 Change companion'}</h3>
            {isFirstVisitRef.current && (
              <p className="modal-sub">
                It grows as you earn XP from focus sessions.
              </p>
            )}
            <PetPicker
              currentPetId={pendingPetId ?? chosenPetId}
              onSelect={setPendingPetId}
              onConfirm={handlePickerConfirm}
              onCancel={!isFirstVisitRef.current ? handlePickerCancel : undefined}
              isFirstVisit={isFirstVisitRef.current}
            />
          </div>
        </div>
      )}

      {/* ── XP reset confirmation ── */}
      {showXpWarning && (
        <div className="welcome-modal">
          <div className="modal-content modal-narrow">
            <h3>⚠ Reset XP?</h3>
            <div className="xp-warning-box">
              <p>Switching companions will reset your XP to&nbsp;0.</p>
              <p>This cannot be undone.</p>
            </div>
            <button
              className="got-it-btn got-it-btn--danger"
              onClick={handleXpResetConfirm}
            >
              Yes, switch &amp; reset
            </button>
            <button
              className="picker-cancel-btn"
              onClick={() => setShowXpWarning(false)}
            >
              Go back
            </button>
          </div>
        </div>
      )}

      {/* ── Break popup ── */}
      {showBreakPopup && (
        <div className={`welcome-modal break-popup-${pendingBreakMode === 'shortBreak' ? 'short' : 'long'}`}>
          <div className="modal-content modal-narrow">
            <h3>{pendingBreakMode === 'shortBreak' ? '☕ Short Break!' : '🛋️ Long Break!'}</h3>
            <p className="modal-sub">
              {pendingBreakMode === 'shortBreak' ? 'Take a quick breather' : 'You earned it — recharge!'}
            </p>
            <ul className="welcome-instructions break-suggestions">
              {pendingBreakMode === 'shortBreak' ? (
                <>
                  <li>💧 Drink some water</li>
                  <li>🧘 Stretch &amp; breathe</li>
                  <li>👀 Rest your eyes</li>
                </>
              ) : (
                <>
                  <li>🚶 Go for a short walk</li>
                  <li>📖 Read a few pages</li>
                  <li>🍎 Grab a healthy snack</li>
                  <li>🎵 Listen to a song</li>
                </>
              )}
            </ul>
            <button className="got-it-btn" onClick={handleStartBreak}>
              START BREAK
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
              aria-label="Change companion"
              title="Change companion"
            >
              🐾
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(d => !d)}
              aria-label="Toggle light/dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Pet + XP */}
        <PetDisplay petId={chosenPetId} xp={xp} gainCount={xpGainCount} isRunning={isRunning} />

        <hr className="divider" />

        {/* Timer */}
        <div className="session-info">
          {isAdditionalTime ? (
            <>
              <span className="mode-label mode-label--at">Additional Time</span>
              <span className="sub-label">Main cycle paused</span>
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
              aria-label={`Session ${i + 1}`}
            >●</span>
          ))}
        </div>

        {isAdditionalTime ? (
          <div className="controls">
            {isRunning ? (
              <button className="btn btn-sm btn-secondary" onClick={pauseTimer}>Pause</button>
            ) : (
              <button className="btn btn-sm btn-secondary" onClick={() => {
                workerRef.current?.postMessage('start');
                isRunningRef.current = true;
                setIsRunning(true);
              }}>Resume</button>
            )}
            <button className="btn btn-sm btn-at-cancel" onClick={cancelAdditionalTime}>
              Return to Cycle
            </button>
          </div>
        ) : (
          <div className="controls">
            <button className="btn" onClick={startTimer} disabled={isRunning}>
              Start
            </button>
            <button className="btn" onClick={pauseTimer} disabled={!isRunning}>
              Pause
            </button>
            <button className="btn btn-secondary btn-sm" onClick={resetSession}>
              Reset Session
            </button>
            <button className="btn btn-secondary btn-sm" onClick={resetCycle}>
              Reset Cycle
            </button>
            {undoVisible && (
              <button className="btn btn-undo btn-sm" onClick={handleUndo}>
                Undo
              </button>
            )}
          </div>
        )}

        {isAdditionalTime ? (
          <div className="at-paused-info">
            <span>Paused at</span>
            <span className="at-paused-time">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            <span>· Session {pomodoroCount}/{cycleLength}</span>
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
                  {sec / 60}m
                </button>
              ))}
            </div>
            <button className="btn btn-sm btn-at" onClick={startAdditionalTime}>
              + Extra Time
            </button>
          </div>
        )}

        <div className="settings-card">
          <div className="setting-row">
            <label htmlFor="work-duration">Work</label>
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
              <span>min</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="short-break">Short break</label>
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
              <span>min</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="long-break">Long break</label>
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
              <span>min</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="cycle-length">Sessions / cycle</label>
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
    </>
  );
}

export default App;
