import { playBell } from './audio.js';
import { Storage } from './storage.js';
import { updateSceneNight } from './scene.js';

const timerDisplay = document.getElementById("timer");
const label = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");

let focusTime = 25*60;
let breakTime = 5*60;
let timeLeft = focusTime;
let isFocus = true;
let isRunning = false;
let interval = null;

function updateTimerDisplay(){
  const m = String(Math.floor(timeLeft/60)).padStart(2,"0");
  const s = String(timeLeft%60).padStart(2,"0");
  timerDisplay.textContent = `${m}:${s}`;
}

export function switchPomodoroMode(){
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";

  playBell(isFocus);
  updateSceneNight(!isFocus); // night mode during break
  saveTimerState();
}

function saveTimerState(){
  const state = Storage.loadState() || {};
  Storage.saveState({
    ...state,
    isFocus,
    timeLeft,
    isRunning
  });
}

export function startPauseTimer(){
  if(!isRunning){
    isRunning=true;
    startPauseBtn.textContent="Pause";
    interval = setInterval(()=>{
      timeLeft--;
      updateTimerDisplay();
      if(timeLeft<=0) switchPomodoroMode();
    },1000);
  } else {
    clearInterval(interval);
    isRunning=false;
    startPauseBtn.textContent="Start";
  }
  saveTimerState();
}

export function resetTimer(){
  clearInterval(interval);
  isRunning=false;
  isFocus=true;
  timeLeft=focusTime;
  label.textContent="Focus Time";
  updateTimerDisplay();
  updateSceneNight(false);
  saveTimerState();
}

export function loadTimerState(){
  const state = Storage.loadState();
  if(!state) return;
  isFocus = state.isFocus ?? true;
  timeLeft = state.timeLeft ?? (isFocus?focusTime:breakTime);
  updateTimerDisplay();

  if(state.isRunning) startPauseTimer();
}
