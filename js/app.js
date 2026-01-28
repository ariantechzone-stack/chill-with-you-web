// ==========================
// Elements
// ==========================
const scene = document.getElementById("scene");

const lofi = document.getElementById("lofi");
const rain = document.getElementById("rainAudio");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const focusBtn = document.getElementById("focusBtn");
const rainBtn = document.getElementById("rainBtn");

const lofiVol = document.getElementById("lofiVol");
const rainVol = document.getElementById("rainVol");

const timerEl = document.getElementById("timer");
const timerLabel = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

// ==========================
// State
// ==========================
let audioUnlocked = false;
let focusOn = false;
let rainOn = false;

let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isFocus = true;
let running = false;
let interval = null;

// ==========================
// Unlock Audio (REQUIRED)
// ==========================
function unlockAudio() {
  if (audioUnlocked) return;

  [lofi, rain, bellFocus, bellBreak].forEach(a => {
    a.volume = 0;
    a.play().then(() => {
      a.pause();
      a.volume = 1;
    }).catch(() => {});
  });

  audioUnlocked = true;
}

document.addEventListener("click", unlockAudio, { once: true });

// ==========================
// Crossfade
// ==========================
function crossFade(from, to, targetVolume) {
  const step = 0.02;

  to.volume = 0;
  to.play();

  const fade = setInterval(() => {
    from.volume = Math.max(0, from.volume - step);
    to.volume = Math.min(targetVolume, to.volume + step);

    if (to.volume >= targetVolume) {
      from.pause();
      clearInterval(fade);
    }
  }, 50);
}

// ==========================
// Focus Button
// ==========================
focusBtn.onclick = () => {
  unlockAudio();
  focusOn = !focusOn;

  if (focusOn) {
    focusBtn.textContent = "Stop Focus";
    scene.className = "sunset";

    setTimeout(() => {
      scene.className = "night";
      crossFade(rain, lofi, lofiVol.value);
    }, 3000);

  } else {
    focusBtn.textContent = "Focus Mode";
    lofi.pause();
    scene.className = "day";
  }
};

// ==========================
// Rain Button
// ==========================
rainBtn.onclick = () => {
  unlockAudio();
  rainOn = !rainOn;

  if (rainOn) {
    rain.volume = rainVol.value;
    rain.play();
    rainBtn.textContent = "Rain Off";
  } else {
    rain.pause();
    rainBtn.textContent = "Rain";
  }
};

// ==========================
// Volume Controls
// ==========================
lofiVol.oninput = () => lofi.volume = lofiVol.value;
rainVol.oninput = () => rain.volume = rainVol.value;

// ==========================
// Pomodoro
// ==========================
function updateTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
}

function switchMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  timerLabel.textContent = isFocus ? "Focus Time" : "Break Time";

  if (!isFocus) {
    lofi.pause(); // auto pause on break
    bellBreak.play();
    scene.className = "sunset";
  } else {
    bellFocus.play();
    scene.className = "night";
  }
}

startPauseBtn.onclick = () => {
  if (!running) {
    running = true;
    startPauseBtn.textContent = "Pause";
    interval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) switchMode();
    }, 1000);
  } else {
    running = false;
    startPauseBtn.textContent = "Start";
    clearInterval(interval);
  }
};

resetBtn.onclick = () => {
  clearInterval(interval);
  running = false;
  isFocus = true;
  timeLeft = focusTime;
  timerLabel.textContent = "Focus Time";
  startPauseBtn.textContent = "Start";
  updateTimer();
  scene.className = "day";
};

updateTimer();
