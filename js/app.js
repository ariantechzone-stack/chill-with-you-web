// ==========================
// DOM Elements
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const fireplace = document.getElementById("fireplace");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

const timerDisplay = document.getElementById("timer");
const timerLabel = document.getElementById("timerLabel");

const lofiSlider = document.getElementById("lofiVolume");
const rainSlider = document.getElementById("rainVolume");

const scene = document.getElementById("scene");

// ==========================
// State
// ==========================
let audioUnlocked = false;
let lofiPlaying = false;
let rainPlaying = false;

let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isFocus = true;
let isRunning = false;
let interval = null;

// ==========================
// Unlock audio once per page
// ==========================
document.addEventListener("click", () => {
  if (audioUnlocked) return;
  [lofi, rain, fireplace, bellFocus, bellBreak].forEach(a => a.muted = true);
  lofi.play().then(() => {
    lofi.pause();
    [lofi, rain, fireplace, bellFocus, bellBreak].forEach(a => a.muted = false);
    audioUnlocked = true;
  }).catch(() => {});
}, { once: true });

// ==========================
// Helper: Smooth volume change
// ==========================
function crossfade(audio, targetVolume, step = 0.02, callback) {
  clearInterval(audio._fadeInterval);
  audio._fadeInterval = setInterval(() => {
    if (Math.abs(audio.volume - targetVolume) < step) {
      audio.volume = targetVolume;
      clearInterval(audio._fadeInterval);
      if (callback) callback();
    } else {
      audio.volume += audio.volume < targetVolume ? step : -step;
    }
  }, 50);
}

// ==========================
// Focus Toggle
// ==========================
focusBtn.addEventListener("click", () => {
  if (!audioUnlocked) return;
  if (!lofiPlaying) {
    lofi.volume = parseFloat(lofiSlider.value);
    lofi.play().catch(()=>{});
    focusBtn.textContent = "Stop Focus";
    lofiPlaying = true;
  } else {
    crossfade(lofi, 0, 0.02, () => lofi.pause());
    focusBtn.textContent = "Focus Mode";
    lofiPlaying = false;
  }
});

// ==========================
// Rain Toggle
// ==========================
rainBtn.addEventListener("click", () => {
  if (!audioUnlocked) return;
  if (!rainPlaying) {
    rain.volume = parseFloat(rainSlider.value);
    rain.play().catch(()=>{});
    rainBtn.textContent = "Rain Off";
    document.querySelector(".rain").classList.add("active");
    rainPlaying = true;
  } else {
    crossfade(rain, 0, 0.02, () => rain.pause());
    rainBtn.textContent = "Rain";
    document.querySelector(".rain").classList.remove("active");
    rainPlaying = false;
  }
});

// ==========================
// Volume Sliders
// ==========================
lofiSlider.addEventListener("input", () => {
  lofi.volume = parseFloat(lofiSlider.value);
});

rainSlider.addEventListener("input", () => {
  rain.volume = parseFloat(rainSlider.value);
});

// ==========================
// Pomodoro Functions
// ==========================
function updateTimerDisplay() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function switchPomodoroMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  timerLabel.textContent = isFocus ? "Focus Time" : "Break Time";

  if (isFocus) {
    bellBreak.currentTime = 0;
    bellBreak.play().catch(() => {});
    // Lofi auto-play on focus
    if (!lofiPlaying) {
      lofi.play().catch(() => {});
      lofiPlaying = true;
      focusBtn.textContent = "Stop Focus";
    }
  } else {
    bellFocus.currentTime = 0;
    bellFocus.play().catch(() => {});
    // Lofi auto-pause on break
    crossfade(lofi, 0, 0.02, () => {
      lofi.pause();
      lofiPlaying = false;
      focusBtn.textContent = "Focus Mode";
    });
  }

  saveTimerState();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = "Pause";
  interval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) switchPomodoroMode();
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  startPauseBtn.textContent = "Start";
  clearInterval(interval);
}

startPauseBtn.addEventListener("click", () => {
  if (!audioUnlocked) return;
  if (!isRunning) startTimer();
  else pauseTimer();
});

resetBtn.addEventListener("click", () => {
  pauseTimer();
  timeLeft = focusTime;
  isFocus = true;
  timerLabel.textContent = "Focus Time";
  updateTimerDisplay();
  // Ensure Lofi stops
  crossfade(lofi, 0, 0.02, () => { lofi.pause(); lofiPlaying = false; focusBtn.textContent = "Focus Mode"; });
});

// ==========================
// Timer Save / Load (LocalStorage)
// ==========================
function saveTimerState() {
  localStorage.setItem("pomodoro", JSON.stringify({ timeLeft, isFocus, isRunning }));
}

function loadTimerState() {
  const state = JSON.parse(localStorage.getItem("pomodoro"));
  if (!state) return;
  timeLeft = state.timeLeft;
  isFocus = state.isFocus;
  updateTimerDisplay();
  if (state.isRunning) startTimer();
}

window.addEventListener("load", () => {
  loadTimerState();
});

// ==========================
// Night Mode Auto Sound
// ==========================
function updateSceneNight(isNight) {
  if (isNight) {
    scene.classList.add("night");
    if (!rainPlaying) {
      rain.play().catch(()=>{});
      rainPlaying = true;
      rainBtn.textContent = "Rain Off";
      document.querySelector(".rain").classList.add("active");
    }
  } else {
    scene.classList.remove("night");
    // Optionally stop rain in day mode
    // crossfade(rain,0,0.02,()=>{rain.pause(); rainPlaying=false;});
  }
}

// Example: Auto night mode at 8 PM
setInterval(() => {
  const h = new Date().getHours();
  updateSceneNight(h >= 20 || h < 6);
}, 60000);
updateSceneNight(new Date().getHours() >= 20 || new Date().getHours() < 6);

// ==========================
// Initialize Display
// ==========================
updateTimerDisplay();
