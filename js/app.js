// ==========================
// ELEMENTS
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const fireplace = document.getElementById("fireplace");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

const lofiSlider = document.getElementById("lofiVolume");
const rainSlider = document.getElementById("rainVolume");

const timerDisplay = document.getElementById("timer");
const timerLabel = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

const companionEl = document.getElementById("companion");

let lofiPlaying = false;
let rainPlaying = false;
let fireplacePlaying = false;
let audioUnlocked = false;

// Pomodoro
let focusTime = 25*60;
let breakTime = 5*60;
let timeLeft = focusTime;
let isFocus = true;
let isRunning = false;
let interval = null;

// Night mode
const NIGHT_HOUR = 20; // 8 PM
let nightModeActive = false;

// XP / Achievements
const XP_KEY = "chillXP";
let xpState = JSON.parse(localStorage.getItem(XP_KEY)) || {
  xp: 0,
  level: 1,
  achievements: []
};

// Companion
let companionClass = "monk";
const companionMessages = {
  monk: ["Focus on your breath...", "Patience is key."],
  scholar: ["Time to learn!", "Absorb knowledge slowly."],
  nightOwl: ["The night is productive.", "Keep coding!"]
};

// ==========================
// UTILITY FUNCTIONS
// ==========================
function unlockAudio() {
  if (audioUnlocked) return;
  [lofi, rain, fireplace, bellFocus, bellBreak].forEach(a => {
    a.muted = true;
    a.play().then(() => { a.pause(); a.muted = false; }).catch(()=>{});
  });
  audioUnlocked = true;
}

function fade(audio, from, to, duration = 600) {
  const steps = 30;
  const stepTime = duration / steps;
  const delta = (to - from) / steps;
  let current = from;

  audio.volume = from;
  const interval = setInterval(() => {
    current += delta;
    audio.volume = Math.max(0, Math.min(1, current));
    if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
      audio.volume = to;
      clearInterval(interval);
    }
  }, stepTime);
}

function playBell(isFocus) {
  const bell = isFocus ? bellFocus : bellBreak;
  bell.currentTime = 0;
  bell.volume = 0.5;
  bell.play().catch(()=>{});
}

function updateTimerDisplay() {
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  timerDisplay.textContent = `${m}:${s}`;
}

function checkNightMode() {
  const h = new Date().getHours();
  return h >= NIGHT_HOUR;
}

// ==========================
// AUDIO CONTROLS
// ==========================
focusBtn.addEventListener("click", () => {
  unlockAudio();
  if (!lofiPlaying) {
    lofi.currentTime = 0;
    lofi.play();
    fade(lofi, 0, parseFloat(lofiSlider.value));
    focusBtn.textContent = "Stop Focus";
    lofiPlaying = true;
  } else {
    fade(lofi, lofi.volume, 0);
    setTimeout(() => lofi.pause(), 600);
    focusBtn.textContent = "Focus Mode";
    lofiPlaying = false;
  }
});

rainBtn.addEventListener("click", () => {
  unlockAudio();
  if (!rainPlaying) {
    rain.currentTime = 0;
    rain.play();
    fade(rain, 0, parseFloat(rainSlider.value));
    if (lofiPlaying) fade(lofi, lofi.volume, 0.2); // duck Lofi
    rainBtn.textContent = "Rain Off";
    rainPlaying = true;
  } else {
    fade(rain, rain.volume, 0);
    setTimeout(() => rain.pause(), 600);
    if (lofiPlaying) fade(lofi, lofi.volume, parseFloat(lofiSlider.value));
    rainBtn.textContent = "Rain";
    rainPlaying = false;
  }
});

lofiSlider.addEventListener("input", () => {
  if (lofiPlaying) lofi.volume = parseFloat(lofiSlider.value);
});

rainSlider.addEventListener("input", () => {
  if (rainPlaying) rain.volume = parseFloat(rainSlider.value);
});

// ==========================
// NIGHT MODE AUDIO
// ==========================
function updateNightAudio() {
  nightModeActive = checkNightMode();
  if (nightModeActive) {
    if (!rainPlaying) { rain.currentTime = 0; rain.play(); fade(rain, 0, parseFloat(rainSlider.value)); rainPlaying=true; }
    if (!fireplacePlaying) { fireplace.currentTime=0; fireplace.play(); fade(fireplace,0,0.3); fireplacePlaying=true; }
    if (lofiPlaying) fade(lofi, lofi.volume, 0.2);
  } else {
    if (rainPlaying && !rainBtn.classList.contains("active")) { fade(rain,rain.volume,0); setTimeout(()=>rain.pause(),600); rainPlaying=false; }
    if (fireplacePlaying) { fade(fireplace,fireplace.volume,0); setTimeout(()=>fireplace.pause(),600); fireplacePlaying=false; }
    if (lofiPlaying) fade(lofi,lofi.volume,parseFloat(lofiSlider.value));
  }
}

// ==========================
// POMODORO TIMER
// ==========================
function switchPomodoroMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  timerLabel.textContent = isFocus ? "Focus Time" : "Break Time";

  playBell(isFocus);

  // Auto pause Lofi on break
  if (!isFocus && lofiPlaying) { fade(lofi,lofi.volume,0); setTimeout(()=>lofi.pause(),600); }
  else if (isFocus && lofiPlaying) { lofi.play(); fade(lofi,0,parseFloat(lofiSlider.value)); }

  updateNightAudio();
  saveTimerState();
}

function startPauseTimer() {
  if (!isRunning) {
    isRunning = true;
    startPauseBtn.textContent = "Pause";
    interval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) switchPomodoroMode();
    }, 1000);
  } else {
    clearInterval(interval);
    isRunning = false;
    startPauseBtn.textContent = "Start";
  }
  saveTimerState();
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isFocus = true;
  timeLeft = focusTime;
  timerLabel.textContent = "Focus Time";
  updateTimerDisplay();
  saveTimerState();

  if (lofiPlaying) { lofi.play(); fade(lofi,0,parseFloat(lofiSlider.value)); }
  updateNightAudio();
}

function saveTimerState() {
  localStorage.setItem("pomodoroState", JSON.stringify({ isFocus,timeLeft,isRunning }));
}

function loadTimerState() {
  const state = JSON.parse(localStorage.getItem("pomodoroState"));
  if (!state) return;
  isFocus = state.isFocus ?? true;
  timeLeft = state.timeLeft ?? (isFocus?focusTime:breakTime);
  updateTimerDisplay();
  if (state.isRunning) startPauseTimer();
}

// ==========================
// XP & ACHIEVEMENTS
// ==========================
function addXP(amount) {
  xpState.xp += amount;
  const needed = xpState.level * 200;
  if (xpState.xp >= needed) {
    xpState.xp -= needed;
    xpState.level++;
    addAchievement(`Reached level ${xpState.level}`);
  }
  saveXP();
  updateXPUI();
}

function addAchievement(name) {
  if (!xpState.achievements.includes(name)) {
    xpState.achievements.push(name);
    updateXPUI();
  }
}

function saveXP() { localStorage.setItem(XP_KEY, JSON.stringify(xpState)); }

function updateXPUI() {
  const levelEl = document.getElementById("levelValue");
  const xpEl = document.getElementById("xpValue");
  const fillEl = document.getElementById("xpFill");
  if (levelEl) levelEl.textContent = xpState.level;
  if (xpEl) xpEl.textContent = xpState.xp;
  if (fillEl) fillEl.style.width = `${(xpState.xp / (xpState.level*200))*100}%`;
}

// ==========================
// COMPANION MESSAGES
// ==========================
function showCompanionMessage() {
  const arr = companionMessages[companionClass] || ["Stay focused!"];
  companionEl.textContent = arr[Math.floor(Math.random()*arr.length)];
}

// ==========================
// INIT
// ==========================
window.addEventListener("load", () => {
  unlockAudio();
  loadTimerState();
  updateTimerDisplay();
  updateNightAudio();
  updateXPUI();
  showCompanionMessage();
  setInterval(updateNightAudio, 60*1000); // check every 1 min
});
