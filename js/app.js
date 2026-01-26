// ==========================
// Audio Elements
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

let lofiPlaying = false;
let rainPlaying = false;
let audioUnlocked = false;

// ==========================
// Unlock audio on first user interaction
// ==========================
document.addEventListener(
  "click",
  () => {
    if (!audioUnlocked) {
      lofi.muted = true;
      rain.muted = true;

      lofi
        .play()
        .then(() => {
          lofi.pause();
          lofi.muted = false;
          rain.muted = false;
          audioUnlocked = true;
          console.log("Audio unlocked");
        })
        .catch(() => {});
    }
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
// Rain Toggle (Safe Unlock)
// ==========================
rainBtn.addEventListener("click", async () => {
  try {
    // Force unlock rain if browser is strict
    if (!audioUnlocked) {
      rain.muted = true;
      await rain.play();
      rain.pause();
      rain.muted = false;
      audioUnlocked = true;
      console.log("Rain unlocked");
    }

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

function switchMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";

  if (isFocus) {
    // Day mode
    scene.classList.remove("night");
    lofi.volume = 0.6;
  } else {
    // Night mode
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
