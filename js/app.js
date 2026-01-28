/* ==========================
   Chill With You – app.js v2
   ========================== */

/* ---------- Audio ---------- */
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");

const lofiVol = document.getElementById("lofiVolume");
const rainVol = document.getElementById("rainVolume");

let audioUnlocked = false;
let focusOn = false;
let rainOn = false;

/* Unlock audio on first user interaction */
function unlockAudio() {
  if (audioUnlocked) return;

  [lofi, rain].forEach(a => {
    a.volume = 0;
    a.play().then(() => a.pause()).catch(() => {});
  });

  audioUnlocked = true;
  console.log("🔓 Audio unlocked");
}

document.body.addEventListener("click", unlockAudio, { once: true });

/* Smooth crossfade */
function crossFade(from, to, targetVol = 0.6, duration = 800) {
  const steps = 20;
  const stepTime = duration / steps;
  let i = 0;

  to.volume = 0;
  to.play();

  const fade = setInterval(() => {
    i++;
    from.volume = Math.max(0, from.volume - targetVol / steps);
    to.volume = Math.min(targetVol, to.volume + targetVol / steps);

    if (i >= steps) {
      from.pause();
      clearInterval(fade);
    }
  }, stepTime);
}

/* Focus toggle */
document.getElementById("toggleFocus").onclick = () => {
  unlockAudio();
  focusOn = !focusOn;

  if (focusOn) {
    crossFade(rain, lofi, lofiVol.value);
    document.getElementById("toggleFocus").textContent = "Focus On";
  } else {
    lofi.pause();
    document.getElementById("toggleFocus").textContent = "Focus Mode";
  }
};

/* Rain toggle */
document.getElementById("toggleRain").onclick = () => {
  unlockAudio();
  rainOn = !rainOn;

  if (rainOn) {
    crossFade(lofi, rain, rainVol.value);
    document.getElementById("toggleRain").textContent = "Rain On";
  } else {
    rain.pause();
    document.getElementById("toggleRain").textContent = "Rain";
  }
};

/* Volume sliders */
lofiVol.oninput = e => (lofi.volume = e.target.value);
rainVol.oninput = e => (rain.volume = e.target.value);

/* ---------- Pomodoro ---------- */
let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isFocus = true;
let running = false;
let interval;

const timerEl = document.getElementById("timer");
const labelEl = document.getElementById("timerLabel");
const ring = document.querySelector(".progress");

function updateTimerUI() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;

  const total = isFocus ? focusTime : breakTime;
  const progress = 339 - (timeLeft / total) * 339;
  ring.style.strokeDashoffset = progress;
}

function tick() {
  if (timeLeft <= 0) {
    isFocus = !isFocus;
    timeLeft = isFocus ? focusTime : breakTime;

    labelEl.textContent = isFocus ? "Focus Time" : "Break Time";

    /* 🔕 auto lofi pause on break */
    if (!isFocus) lofi.pause();
  } else {
    timeLeft--;
  }
  updateTimerUI();
}

document.getElementById("startPause").onclick = () => {
  unlockAudio();
  running = !running;

  if (running) {
    interval = setInterval(tick, 1000);
    event.target.textContent = "Pause";
  } else {
    clearInterval(interval);
    event.target.textContent = "Start";
  }
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  running = false;
  isFocus = true;
  timeLeft = focusTime;
  labelEl.textContent = "Focus Time";
  updateTimerUI();
  document.getElementById("startPause").textContent = "Start";
};

updateTimerUI();

/* ---------- Night Mode Auto Sound ---------- */
const hour = new Date().getHours();
if (hour >= 22 || hour <= 5) {
  rain.volume = 0.3;
  rain.play().catch(() => {});
  console.log("🌙 Night mode sound enabled");
}

const scene = document.getElementById("scene");

if (focusOn) {
  scene.classList.add("night");
} else {
  scene.classList.remove("night");
}
