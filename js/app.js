/* =====================================
   Chill With You – Single File app.js
   ===================================== */

/* ---------- Storage ---------- */
const Storage = {
  saveState(state) {
    localStorage.setItem("chillState", JSON.stringify(state));
  },
  loadState() {
    return JSON.parse(localStorage.getItem("chillState"));
  }
};

/* ---------- Audio ---------- */
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");
const lofiSlider = document.getElementById("lofiVolume");
const rainSlider = document.getElementById("rainVolume");

let audioUnlocked = false;
let lofiPlaying = false;
let rainPlaying = false;

/* Unlock audio */
document.addEventListener("click", () => {
  if (audioUnlocked) return;
  [lofi, rain, bellFocus, bellBreak].forEach(a => a.muted = true);
  lofi.play().then(() => {
    lofi.pause();
    [lofi, rain, bellFocus, bellBreak].forEach(a => a.muted = false);
    audioUnlocked = true;
  }).catch(()=>{});
}, { once:true });

function saveAudioState(){
  const s = Storage.loadState() || {};
  Storage.saveState({
    ...s,
    lofiPlaying,
    rainPlaying,
    lofiVolume: lofi.volume,
    rainVolume: rain.volume
  });
}

function loadAudioState(){
  const s = Storage.loadState();
  if(!s) return;
  lofi.volume = s.lofiVolume ?? 0.6;
  rain.volume = s.rainVolume ?? 0.4;
  lofiSlider.value = lofi.volume;
  rainSlider.value = rain.volume;

  if(s.lofiPlaying){ toggleLofi(); }
  if(s.rainPlaying){ toggleRain(); }
}

function toggleLofi(){
  if(!lofiPlaying){
    lofi.volume = lofiSlider.value;
    lofi.play();
    focusBtn.textContent = "Stop Focus";
    lofiPlaying = true;
  } else {
    lofi.pause();
    focusBtn.textContent = "Focus Mode";
    lofiPlaying = false;
  }
  saveAudioState();
}

function toggleRain(){
  const rainLayer = document.querySelector(".rain");
  if(!rainPlaying){
    rain.volume = rainSlider.value;
    rain.play();
    rainBtn.textContent = "Rain Off";
    rainLayer.classList.add("active");
    rainPlaying = true;
  } else {
    rain.pause();
    rainBtn.textContent = "Rain";
    rainLayer.classList.remove("active");
    rainPlaying = false;
  }
  saveAudioState();
}

lofiSlider.oninput = ()=>{ lofi.volume = lofiSlider.value; saveAudioState(); };
rainSlider.oninput = ()=>{ rain.volume = rainSlider.value; saveAudioState(); };

function playBell(isFocus){
  const b = isFocus ? bellFocus : bellBreak;
  b.currentTime = 0;
  b.volume = 0.5;
  b.play().catch(()=>{});
}

/* ---------- Scene / Night ---------- */
const scene = document.getElementById("scene");
let nightMode = false;

function updateSceneNight(on){
  nightMode = on;
  scene.classList.toggle("night", on);
  saveScene();
}

function saveScene(){
  const s = Storage.loadState() || {};
  Storage.saveState({ ...s, nightMode });
}

function loadScene(){
  const s = Storage.loadState();
  if(s?.nightMode) updateSceneNight(true);
}

/* ---------- Pomodoro ---------- */
const timerEl = document.getElementById("timer");
const label = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");

let focusTime = 25*60;
let breakTime = 5*60;
let timeLeft = focusTime;
let isFocus = true;
let running = false;
let interval;

function updateTimer(){
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  timerEl.textContent = `${m}:${s}`;
}

function switchMode(){
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";
  playBell(isFocus);
  updateSceneNight(!isFocus);
  saveTimer();
}

function startPause(){
  if(!running){
    running = true;
    startPauseBtn.textContent = "Pause";
    interval = setInterval(()=>{
      timeLeft--;
      updateTimer();
      if(timeLeft<=0) switchMode();
    },1000);
  } else {
    clearInterval(interval);
    running = false;
    startPauseBtn.textContent = "Start";
  }
  saveTimer();
}

function resetTimer(){
  clearInterval(interval);
  running=false;
  isFocus=true;
  timeLeft=focusTime;
  label.textContent="Focus Time";
  updateSceneNight(false);
  updateTimer();
  saveTimer();
}

function saveTimer(){
  const s = Storage.loadState() || {};
  Storage.saveState({ ...s, isFocus, timeLeft, running });
}

function loadTimer(){
  const s = Storage.loadState();
  if(!s) return;
  isFocus = s.isFocus ?? true;
  timeLeft = s.timeLeft ?? focusTime;
  updateTimer();
  if(s.running) startPause();
}

/* ---------- Companion ---------- */
const companionEl = document.getElementById("companion");
let companionClass = "monk";

const messages = {
  monk: ["Breathe slowly…", "One task only."],
  scholar: ["Study calmly.", "Review your notes."],
  nightOwl: ["The night is quiet.", "Perfect focus time."]
};

document.querySelectorAll(".class-btn").forEach(btn=>{
  btn.onclick = ()=>{
    companionClass = btn.dataset.class;
    showMessage();
    saveCompanion();
  };
});

function showMessage(){
  const arr = messages[companionClass];
  companionEl.textContent = arr[Math.floor(Math.random()*arr.length)];
}

function saveCompanion(){
  const s = Storage.loadState() || {};
  Storage.saveState({ ...s, companionClass });
}

function loadCompanion(){
  const s = Storage.loadState();
  if(s?.companionClass) companionClass = s.companionClass;
  showMessage();
}

/* ---------- XP ---------- */
const xpEl = document.getElementById("xpValue");
const levelEl = document.getElementById("levelValue");
const achEl = document.getElementById("achievements");

let xp = 0, level = 1, achievements = [];

function addXP(amount){
  xp += amount;
  if(xp >= level*100){
    xp -= level*100;
    level++;
    addAchievement(`Level ${level} reached`);
  }
  saveXP();
  updateXP();
}

function addAchievement(a){
  if(!achievements.includes(a)){
    achievements.push(a);
    saveXP();
  }
}

function updateXP(){
  xpEl.textContent = xp;
  levelEl.textContent = level;
  achEl.innerHTML = achievements.map(a=>`🏆 ${a}`).join("<br>");
}

function saveXP(){
  const s = Storage.loadState() || {};
  Storage.saveState({ ...s, xp, level, achievements });
}

function loadXP(){
  const s = Storage.loadState();
  if(!s) return;
  xp = s.xp ?? 0;
  level = s.level ?? 1;
  achievements = s.achievements ?? [];
  updateXP();
}

/* ---------- Events ---------- */
focusBtn.onclick = toggleLofi;
rainBtn.onclick = toggleRain;
document.getElementById("reset").onclick = resetTimer;

/* ---------- Init ---------- */
window.onload = ()=>{
  loadAudioState();
  loadScene();
  loadTimer();
  loadCompanion();
  loadXP();
  addXP(5);
};
