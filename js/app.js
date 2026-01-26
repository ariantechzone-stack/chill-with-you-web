// ==========================
// Audio Elements
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const bell = document.getElementById("bell");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

// ==========================
// Audio State
// ==========================
let lofiPlaying = false;
let rainPlaying = false;
let audioUnlocked = false;

// ==========================
// Unlock audio (ONE TIME ONLY)
// ==========================
document.addEventListener(
  "click",
  () => {
    if (audioUnlocked) return;

    [lofi, rain, bell].forEach(a => (a.muted = true));

    lofi.play()
      .then(() => {
        lofi.pause();
        [lofi, rain, bell].forEach(a => (a.muted = false));
        audioUnlocked = true;
        console.log("🔓 Audio unlocked");
      })
      .catch(() => {});
  },
  { once: true }
);

// ==========================
// Focus (Lo-fi) Toggle
// ==========================
focusBtn.addEventListener("click", async () => {
  try {
    if (!lofiPlaying) {
      lofi.volume = 0.6;
      await lofi.play();
      focusBtn.textContent = "Stop Focus";
      lofiPlaying = true;
    } else {
      lofi.pause();
      focusBtn.textContent = "Focus Mode";
      lofiPlaying = false;
    }
  } catch (e) {
    console.error("Lofi error:", e);
  }
});

// ==========================
// Rain Toggle
// ==========================
rainBtn.addEventListener("click", async () => {
  try {
    if (!rainPlaying) {
      rain.volume = 0.4;
      await rain.play();
      rainBtn.textContent = "Rain Off";
      rainPlaying = true;
    } else {
      rain.pause();
      rainBtn.textContent = "Rain";
      rainPlaying = false;
    }
  } catch (e) {
    console.error("Rain error:", e);
  }
});

// ==========================
// Pomodoro Elements
// ==========================
const timerDisplay = document.getElementById("timer");
const label = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const scene = document.getElementById("scene");

// ==========================
// Pomodoro State
// ==========================
let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isRunning = false;
let isFocus = true;
let interval = null;

// ==========================
// Timer Helpers
// ==========================
function updateTimer() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const sec = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${min}:${sec}`;
}

function playBell() {
  try {
    bell.currentTime = 0;
    bell.volume = 0.5;
    bell.play();
  } catch {}
}

function switchMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";

  playBell(); // 🔔 soft bell

  if (isFocus) {
    scene.classList.remove("night");
    lofi.volume = 0.6;
  } else {
    scene.classList.add("night");
    lofi.volume = 0.3;
  }
}

// ==========================
// Pomodoro Controls
// ==========================
startPauseBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startPauseBtn.textContent = "Pause";

    interval = setInterval(() => {
      timeLeft--;
      updateTimer();

      if (timeLeft <= 0) {
        switchMode();
      }
    }, 1000);
  } else {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = "Start";
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  isRunning = false;
  isFocus = true;
  timeLeft = focusTime;

  label.textContent = "Focus Time";
  startPauseBtn.textContent = "Start";
  scene.classList.remove("night");
  lofi.volume = 0.6;

  updateTimer();
});

// ==========================
// Init
// ==========================
updateTimer();
