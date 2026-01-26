import { logSession } from "./stats.js";
import { updateCompanion } from "./companion.js";
import { autoWeather } from "./weather.js";

let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let isFocus = true;
let isRunning = false;
let interval;

export function initTimer({ onSwitch }) {
  updateCompanion("idle");

  function switchMode() {
    logSession(isFocus, isFocus ? 25 : 5);
    isFocus = !isFocus;
    timeLeft = isFocus ? focusTime : breakTime;

    updateCompanion(isFocus ? "focus" : "break");
    autoWeather(!isFocus);

    onSwitch?.(isFocus);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;

    interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(interval);
        isRunning = false;
        switchMode();
      }
    }, 1000);
  }

  function pause() {
    clearInterval(interval);
    isRunning = false;
  }

  return { start, pause };
}
