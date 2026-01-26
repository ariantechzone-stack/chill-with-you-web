// ==========================
// DOM ELEMENTS
// ==========================
const scene = document.getElementById("scene");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

const timerDisplay = document.getElementById("timer");
const timerLabel = document.getElementById("timerLabel");

const lofiSlider = document.getElementById("lofiVolume");
const rainSlider = document.getElementById("rainVolume");

// Audio
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

// ==========================
// STATE
// ==========================
let audioUnlocked = false;

let lofiPlaying = false;
let rainPlaying = false;
let autoRainEnabled = true;

let focusTime = 25 * 60;
let breakTime = 5 * 60;

let timeLeft = focusTime;
let isFocus = true;
let isRunning = false;
let interval = null;

// ==========================
// AUDIO UNLOCK (SAFE)
// ==========================
document.addEventListener(
  "click",
  async () => {
    if (audioUnlocked) return;
    audioUnlocked = true;

    const audios = [lofi, rain, bellFocus, bellBreak];
    for (const a of audios) {
      try {
        a.muted = true;
        await a.play();
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      } catch {}
    }
  },
  { once: true }
);

// ==========================
// UI HELPERS
// ==========================
function updateTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function playBell() {
  const bell = isFocus ? bellBreak : bellFocus;
  bell.currentTime = 0;
  bell.volume = 0.5;
  bell.play().catch(() => {});
}

// ==========================
// AUDIO CONTROLS
// ==========================
focusBtn.addEventListener("click", async () => {
  if (!lofiPlaying) {
    lofi.volume = parseFloat(lofiSlider.value);
    await lofi.play();
    lofiPlaying = true;
    focusBtn.textContent = "Stop Focus";
  } else {
    lofi.pause();
    lofiPlaying = false;
    focusBtn.textContent = "Focus Mode";
  }
  saveState();
});

rainBtn.addEventListener("click", async () => {
  if (!rainPlaying) {
    rain.volume = parseFloat(rainSlider.value);
    await rain.play();
    rainPlaying = true;
    autoRainEnabled = false;
    rainBtn.textContent = "Rain Off";
    document.querySelector(".rain")?.classList.add("active");
  } else {
    rain.pause();
    rainPlaying = false;
    autoRainEnabled = true;
    rainBtn.textContent = "Rain";
    document.querySelector(".rain")?.classList.remove("active");
  }
  saveState();
});

// ==========================
// SLIDERS
// ==========================
lofiSlider.addEventListener("input", () => {
  lofi.volume = parseFloat(lofiSlider.value);
  saveState();
});

rainSlider.addEventListener("input", () => {
  rain.volume = parseFloat(rainSlider.value);
  saveState();
});

// ==========================
// POMODORO LOGIC
// ==========================
function switchMode() {
  import { addXP, loadXP } from "./gamification.js";

// when switching
if (!isFocus) {
  addXP(50); // focus complete
} else {
  addXP(10); // break complete
}

  playBell();

  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  timerLabel.textContent = isFocus ? "Focus Time" : "Break Time";

  if (isFocus) {
    scene.classList.remove("night");

    if (autoRainEnabled && rainPlaying) {
      rain.pause();
      rainPlaying = false;
      document.querySelector(".rain")?.classList.remove("active");
    }
  } else {
    scene.classList.add("night");

    if (autoRainEnabled && !rainPlaying) {
      rain.volume = parseFloat(rainSlider.value);
      rain.play();
      rainPlaying = true;
      document.querySelector(".rain")?.classList.add("active");
    }
  }

  updateTimer();
  saveState();
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startPauseBtn.textContent = "Pause";

  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(interval);
      isRunning = false;
      startPauseBtn.textContent = "Start";
      switchMode();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
  startPauseBtn.textContent = "Start";
  saveState();
}

startPauseBtn.addEventListener("click", () => {
  isRunning ? pauseTimer() : startTimer();
});

resetBtn.addEventListener("click", () => {
  pauseTimer();
  isFocus = true;
  timeLeft = focusTime;
  timerLabel.textContent = "Focus Time";
  scene.classList.remove("night");

  if (rainPlaying && autoRainEnabled) {
    rain.pause();
    rainPlaying = false;
    document.querySelector(".rain")?.classList.remove("active");
  }

  updateTimer();
  saveState();
});

// ==========================
// STORAGE
// ==========================
function saveState() {
  const state = {
    lofiPlaying,
    rainPlaying,
    autoRainEnabled,
    lofiVolume: lofi.volume,
    rainVolume: rain.volume,
    isFocus,
    timeLeft,
    isRunning
  };
  localStorage.setItem("chillState", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("chillState"));
  if (!state) return;

  lofi.volume = state.lofiVolume ?? 0.6;
  rain.volume = state.rainVolume ?? 0.4;

  lofiSlider.value = lofi.volume;
  rainSlider.value = rain.volume;

  lofiPlaying = state.lofiPlaying;
  rainPlaying = state.rainPlaying;
  autoRainEnabled = state.autoRainEnabled ?? true;

  isFocus = state.isFocus;
  timeLeft = state.timeLeft ?? (isFocus ? focusTime : breakTime);

  timerLabel.textContent = isFocus ? "Focus Time" : "Break Time";
  if (!isFocus) scene.classList.add("night");

  if (lofiPlaying) {
    lofi.play().catch(() => {});
    focusBtn.textContent = "Stop Focus";
  }

  if (rainPlaying) {
    rain.play().catch(() => {});
    rainBtn.textContent = "Rain Off";
    document.querySelector(".rain")?.classList.add("active");
  }

  updateTimer();

  if (state.isRunning) startTimer();
}

// ==========================
// INIT
// ==========================
window.addEventListener("load", loadState);
window.addEventListener("beforeunload", saveState);

updateTimer();
import { initTimer } from "./timer.js";
import { updateCompanion } from "./companion.js";

document.addEventListener("DOMContentLoaded", () => {
  const timer = initTimer({
    onSwitch: isFocus => {
      updateCompanion(isFocus ? "focus" : "break");
    }
  });

  document.getElementById("startPause")
    .addEventListener("click", timer.start);

  document.getElementById("reset")
    .addEventListener("click", timer.pause);
});
import { updateStatsUI } from "./stats.js";

window.addEventListener("load", updateStatsUI);
import { handleUserMusic } from "./audio.js";

handleUserMusic(
  document.getElementById("musicUpload"),
  document.getElementById("lofi")
);
import { checkAchievements, render } from "./achievements.js";
