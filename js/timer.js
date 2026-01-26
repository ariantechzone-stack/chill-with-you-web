// ==========================
// Timer Module
// ==========================
import { lofi, rain, fireplace, bellFocus, bellBreak, lofiSlider, rainSlider, fireplaceSlider } from "./audio.js";
import { setWeather, randomWeather } from "./weather.js";
import { addXP } from "./xp.js";

export const timerDisplay = document.getElementById("timer");
const label = document.getElementById("timerLabel");
const startPauseBtn = document.getElementById("startPause");
const resetBtn = document.getElementById("reset");
const scene = document.getElementById("scene");

export let focusTime = 25 * 60;
export let breakTime = 5 * 60;
export let timeLeft = focusTime;
export let isRunning = false;
export let isFocus = true;
let interval = null;

function updateTimer() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function playBell() {
  if (isFocus) {
    bellBreak.currentTime = 0;
    bellBreak.volume = 0.5;
    bellBreak.play().catch(() => {});
  } else {
    bellFocus.currentTime = 0;
    bellFocus.volume = 0.5;
    bellFocus.play().catch(() => {});
  }
}

export function switchMode() {
  isFocus = !isFocus;
  timeLeft = isFocus ? focusTime : breakTime;
  label.textContent = isFocus ? "Focus Time" : "Break Time";

  playBell();
  addXP(isFocus ? 10 : 15);

  if (isFocus) {
    scene.classList.remove("night");
    lofi.volume = parseFloat(lofiSlider.value);
    if (rain.playing) { rain.pause(); }
  } else {
    scene.classList.add("night");
    lofi.volume = parseFloat(lofiSlider.value) * 0.5;
    if (!rain.playing) {
      rain.volume = parseFloat(rainSlider.value);
      rain.play();
    }
  }

  randomWeather();
}

startPauseBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startPauseBtn.textContent = "Pause";
    interval = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) switchMode();
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
  scene.classList.remove("night");
  updateTimer();
});

updateTimer();
