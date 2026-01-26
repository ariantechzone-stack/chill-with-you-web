import { playBell } from "./audio.js";
import { setScene } from "./scene.js";

let focus = 25 * 60;
let brk = 5 * 60;
let long = 15 * 60;

let cycles = 0;
let time = focus;
let running = false;
let isFocus = true;
let interval;

const timer = document.getElementById("timer");
const label = document.getElementById("timerLabel");

function render() {
  timer.textContent =
    String(Math.floor(time / 60)).padStart(2, "0") + ":" +
    String(time % 60).padStart(2, "0");
}

function switchMode() {
  isFocus = !isFocus;

  if (isFocus) {
    time = focus;
    label.textContent = "Focus Time";
    playBell("focus");
    setScene("day");
  } else {
    cycles++;
    const longBreak = cycles % 4 === 0;
    time = longBreak ? long : brk;
    label.textContent = longBreak ? "Long Break" : "Break";
    playBell(longBreak ? "long" : "break");
    setScene("night");
  }
}

document.getElementById("startPause").onclick = () => {
  if (!running) {
    running = true;
    interval = setInterval(() => {
      time--;
      render();
      if (time <= 0) switchMode();
    }, 1000);
  } else {
    clearInterval(interval);
    running = false;
  }
};

render();

