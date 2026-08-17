let timeoutId = null;
let expected = 0;
let startedAt = 0;
let totalSeconds = 0;

function tick() {
  if (!startedAt || !totalSeconds) return;
  const now = Date.now();
  const elapsed = Math.round((now - startedAt) / 1000);
  const remaining = Math.max(0, totalSeconds - elapsed);
  self.postMessage({ type: 'tick', remaining });
  if (remaining <= 0) {
    clearTimeout(timeoutId);
    timeoutId = null;
    return;
  }
  const drift = now - expected;
  expected += 1000;
  timeoutId = setTimeout(tick, Math.max(0, 1000 - drift));
}

self.onmessage = function(e) {
  if (e.data === 'stop') {
    clearTimeout(timeoutId);
    timeoutId = null;
    expected = 0;
    return;
  }
  if (e.data && e.data.type === 'start') {
    if (timeoutId !== null) return;
    if (!e.data.seconds || e.data.seconds <= 0) return;
    totalSeconds = e.data.seconds;
    startedAt = Date.now();
    expected = startedAt + 1000;
    timeoutId = setTimeout(tick, 1000);
  }
};
