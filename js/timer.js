import { trackProgress } from "./classes.js";
import { lofi, rain, lofiSlider, rainSlider } from "./audio.js";

// DOM Elements
export const timerDisplay = document.getElementById("timer");
export const label = document.getElementById("timerLabel");
export const startPauseBtn = document.getElementById("startPause");
export const resetBtn = document.getElementById("reset");
export const scene = document.getElementById("scene");

// Timer State
let focusTime = 25*60;
let breakTime = 5*60;
let timeLeft = focusTime;
let isRunning=false;
let isFocus=true;
let interval=null;

export function updateTimerDisplay(){
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  timerDisplay.textContent=`${m}:${s}`;
}

// Play bell
function playBell(){
  if(isFocus){
    bellBreak.currentTime=0; bellBreak.volume=0.5; bellBreak.play().catch(()=>{});
  } else {
    bellFocus.currentTime=0; bellFocus.volume=0.5; bellFocus.play().catch(()=>{});
  }
}

// Switch Mode (focus/break)
export function switchMode(){
  isFocus=!isFocus;
  timeLeft=isFocus?focusTime:breakTime;
  label.textContent=isFocus?"Focus Time":"Break Time";

  playBell();

  const isNight = !isFocus;
  trackProgress("focus_complete", isNight, rainPlaying);

  // Auto night/day ambience
  if(isFocus){
    scene.classList.remove("night");
    lofi.volume=parseFloat(lofiSlider.value);
    if(rainPlaying){ rain.pause(); rainPlaying=false; document.querySelector(".rain").classList.remove("active"); }
  } else {
    scene.classList.add("night");
    lofi.volume=parseFloat(lofiSlider.value)*0.5;
    if(!rainPlaying){ rain.volume=parseFloat(rainSlider.value); rain.play(); rainPlaying=true; document.querySelector(".rain").classList.add("active"); }
  }

  updateTimerDisplay();
}

export function startPauseTimer(){
  if(!isRunning){
    isRunning=true;
    startPauseBtn.textContent="Pause";
    interval=setInterval(()=>{
      timeLeft--;
      updateTimerDisplay();
      if(timeLeft<=0) switchMode();
    },1000);
  } else {
    clearInterval(interval);
    isRunning=false;
    startPauseBtn.textContent="Start";
  }
}

export function resetTimer(){
  clearInterval(interval);
  isRunning=false;
  isFocus=true;
  timeLeft=focusTime;
  label.textContent="Focus Time";
  scene.classList.remove("night");
  lofi.volume=parseFloat(lofiSlider.value);
  if(rainPlaying){ rain.pause(); rainPlaying=false; document.querySelector(".rain").classList.remove("active"); }
  updateTimerDisplay();
}

// Button listeners
startPauseBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);
updateTimerDisplay();
