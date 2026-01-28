// ==========================
// AUDIO ELEMENTS
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const toggleFocusBtn = document.getElementById("toggleFocus");
const toggleRainBtn = document.getElementById("toggleRain");

const lofiVolume = document.getElementById("lofiVolume");
const rainVolume = document.getElementById("rainVolume");

// ==========================
// UNLOCK AUDIO (GitHub Pages fix)
// ==========================
let audioUnlocked = false;

document.addEventListener("click", () => {
  if (audioUnlocked) return;

  [lofi, rain, bellFocus, bellBreak].forEach(a => {
    if (!a) return;
    a.play().then(() => a.pause()).catch(() => {});
  });

  audioUnlocked = true;
}, { once: true });

// ==========================
// AUDIO CONTROLS
// ==========================
toggleFocusBtn.addEventListener("click", () => {
  if (lofi.paused) {
    lofi.play();
    toggleFocusBtn.textContent = "Stop Lofi";
  } else {
    lofi.pause();
    toggleFocusBtn.textContent = "Focus Mode";
  }
});

toggleRainBtn.addEventListener("click", () => {
  if (rain.paused) {
    rain.play();
    toggleRainBtn.textContent = "Stop Rain";
  } else {
    rain.pause();
    toggleRainBtn.textContent = "Rain";
  }
});

lofiVolume.addEventListener("input", () => {
  lofi.volume = lofiVolume.value;
});

rainVolume.addEventListener("input", () => {
  rain.volume = rainVolume.value;
});

// ==========================
// POMODORO TIMER
// ==========================
const timerEl = document.getElementById("timer");
const labelEl = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isRunning = false;
let isFocus = true;
let interval = null;

function updateTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

function switchMode() {
  isFocus = !isFocus;

  if (isFocus) {
    labelEl.textContent = "Focus Time";
    timeLeft = focusTime;
    bellFocus.play();
  } else {
    labelEl.textContent = "Break Time";
    timeLeft = breakTime;
    bellBreak.play();
  }
}

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = "Start";
    return;
  }

  isRunning = true;
  startPauseBtn.textContent = "Pause";

  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      switchMode();
      updateTimer();
    }
  }, 1000);
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  isRunning = false;
  isFocus = true;
  timeLeft = focusTime;
  labelEl.textContent = "Focus Time";
  startPauseBtn.textContent = "Start";
  updateTimer();
});

// ==========================
// INIT
// ==========================
updateTimer();
lofi.volume = lofiVolume.value;
rain.volume = rainVolume.value;
