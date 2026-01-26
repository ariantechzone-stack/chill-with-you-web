import { playBell } from "./audio.js";
import { setCompanion } from "./companion.js";

let focus = 1500, breakT = 300;
let time = focus, running = false, focusMode = true;

const timer = document.getElementById("timer");

function render() {
  timer.textContent =
    `${String(Math.floor(time/60)).padStart(2,"0")}:${String(time%60).padStart(2,"0")}`;
}

document.getElementById("startPause").onclick = () => {
  if (!running) {
    running = true;
    setInterval(() => {
      time--; render();
      if (time <= 0) {
        focusMode = !focusMode;
        time = focusMode ? focus : breakT;
        playBell(focusMode ? "focus" : "break");
        document.getElementById("scene").classList.toggle("night");
        setCompanion(focusMode ? "focus" : "break");
      }
    }, 1000);
  }
};

render();
