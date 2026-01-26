// ==========================
// Audio Elements
// ==========================
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

let lofiPlaying = false;
let rainPlaying = false;
let audioUnlocked = false;

// Sliders
const lofiSlider = document.getElementById("lofiVolume");
const rainSlider = document.getElementById("rainVolume");

// ==========================
// Unlock audio once
// ==========================
document.addEventListener(
  "click",
  () => {
    if (audioUnlocked) return;
    [lofi, rain, bellFocus, bellBreak].forEach(a => (a.muted = true));
    lofi.play().then(() => {
      lofi.pause();
      [lofi, rain, bellFocus, bellBreak].forEach(a => (a.muted = false));
      audioUnlocked = true;
    }).catch(() => {});
  },
  { once: true }
);

// ==========================
// Focus Toggle
// ==========================
focusBtn.addEventListener("click", async () => {
  if (!lofiPlaying) {
    lofi.volume = parseFloat(lofiSlider.value);
    await lofi.play();
    focusBtn.textContent = "Stop Focus";
    lofiPlaying = true;
    saveState();
  } else {
    lofi.pause();
    focusBtn.textContent = "Focus Mode";
    lofiPlaying = false;
    saveState();
  }
});

// ==========================
// Rain Toggle
// ==========================
rainBtn.addEventListener("click", async () => {
  if (!rainPlaying) {
    rain.volume = parseFloat(rainSlider.value);
    await rain.play();
    rainBtn.textContent = "Rain Off";
    document.querySelector(".rain").classList.add("active");
    rainPlaying = true;
    saveState();
  } else {
    rain.pause();
    rainBtn.textContent = "Rain";
    document.querySelector(".rain").classList.remove("active");
    rainPlaying = false;
    saveState();
  }
});

// ==========================
// Sliders
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
// Pomodoro
// ==========================
const timerDisplay = document.getElementById("timer");
const label = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const scene = document.getElementById("scene");

let focusTime = 25*60;
let breakTime = 5*60;
let timeLeft = focusTime;
let isRunning = false;
let isFocus = true;
let interval = null;

function updateTimer() {
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  timerDisplay.textContent = `${m}:${s}`;
}

function playBell() {
  if (isFocus) {
    bellBreak.currentTime = 0;
    bellBreak.volume = 0.5;
    bellBreak.play().catch(()=>{});
  } else {
    bellFocus.currentTime = 0;
    bellFocus.volume = 0.5;
    bellFocus.play().catch(()=>{});
  }
}

function switchMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";

  playBell();

  if (isFocus) {
    scene.classList.remove("night");
    lofi.volume = parseFloat(lofiSlider.value);
    if (rainPlaying) { rain.pause(); document.querySelector(".rain").classList.remove("active"); rainPlaying = false;}
  } else {
    scene.classList.add("night");
    lofi.volume = parseFloat(lofiSlider.value)*0.5;
    if (!rainPlaying) { rain.volume = parseFloat(rainSlider.value); rain.play(); rainPlaying = true; document.querySelector(".rain").classList.add("active"); }
  }

  saveState();
}

startPauseBtn.addEventListener("click", ()=>{
  if(!isRunning){
    isRunning=true;
    startPauseBtn.textContent="Pause";
    interval=setInterval(()=>{
      timeLeft--;
      updateTimer();
      if(timeLeft<=0) switchMode();
    },1000);
  } else {
    clearInterval(interval);
    isRunning=false;
    startPauseBtn.textContent="Start";
  }
  saveState();
});

resetBtn.addEventListener("click", ()=>{
  clearInterval(interval);
  isRunning=false;
  isFocus=true;
  timeLeft=focusTime;
  label.textContent="Focus Time";
  scene.classList.remove("night");
  lofi.volume=parseFloat(lofiSlider.value);
  if(rainPlaying){ rain.pause(); rainPlaying=false; document.querySelector(".rain").classList.remove("active"); }
  updateTimer();
  saveState();
});

// ==========================
// LocalStorage
// ==========================
function saveState(){
  const state={
    lofiPlaying,
    rainPlaying,
    lofiVolume: lofi.volume,
    rainVolume: rain.volume,
    isFocus,
    timeLeft,
    isRunning
  };
  localStorage.setItem("chillState",JSON.stringify(state));
}

function loadState(){
  const state=JSON.parse(localStorage.getItem("chillState"));
  if(!state) return;

  lofi.volume=state.lofiVolume??0.6;
  rain.volume=state.rainVolume??0.4;
  lofiSlider.value=lofi.volume;
  rainSlider.value=rain.volume;

  isFocus=state.isFocus;
  timeLeft=state.timeLeft??(isFocus?focusTime:breakTime);
  updateTimer();

  if(state.isRunning) startPauseBtn.click();
  if(state.lofiPlaying){ lofi.play(); lofiPlaying=true; focusBtn.textContent="Stop Focus"; }
  if(state.rainPlaying){ rain.play(); rainPlaying=true; rainBtn.textContent="Rain Off"; document.querySelector(".rain").classList.add("active"); }
  if(!isFocus) scene.classList.add("night");
}

window.addEventListener("load",loadState);
window.addEventListener("beforeunload",saveState);

updateTimer();
