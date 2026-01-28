/* ==========================
   Cozy Chill – app.js
   ========================== */

const scene = document.getElementById("scene");
const rainWindow = document.querySelector(".rain-window");

/* Audio */
const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");
const lofiVol = document.getElementById("lofiVolume");
const rainVol = document.getElementById("rainVolume");

let unlocked = false;
let focusOn = false;

/* Unlock audio */
document.body.addEventListener("click", () => {
  if (unlocked) return;
  [lofi, rain].forEach(a => {
    a.volume = 0;
    a.play().then(() => a.pause()).catch(()=>{});
  });
  unlocked = true;
}, { once: true });

/* Smooth fade */
function fadeIn(audio, vol) {
  audio.volume = 0;
  audio.play();
  let v = 0;
  const i = setInterval(() => {
    v += 0.05;
    audio.volume = Math.min(vol, v);
    if (v >= vol) clearInterval(i);
  }, 60);
}

function fadeOut(audio) {
  let v = audio.volume;
  const i = setInterval(() => {
    v -= 0.05;
    audio.volume = Math.max(0, v);
    if (v <= 0) {
      audio.pause();
      clearInterval(i);
    }
  }, 60);
}

/* Focus */
document.getElementById("toggleFocus").onclick = () => {
  focusOn = !focusOn;

  if (focusOn) {
    scene.classList.add("night");
    fadeIn(lofi, lofiVol.value);
  } else {
    scene.classList.remove("night");
    fadeOut(lofi);
  }
};

/* Rain */
document.getElementById("toggleRain").onclick = () => {
  rainWindow.classList.toggle("active");

  if (rainWindow.classList.contains("active")) {
    fadeIn(rain, rainVol.value);
  } else {
    fadeOut(rain);
  }
};

/* Volume */
lofiVol.oninput = e => (lofi.volume = e.target.value);
rainVol.oninput = e => (rain.volume = e.target.value);

/* Pomodoro (simple + stable) */
let time = 25 * 60;
let running = false;
let timer;

const timerEl = document.getElementById("timer");

function renderTime() {
  const m = Math.floor(time / 60);
  const s = time % 60;
  timerEl.textContent = `${m}:${s.toString().padStart(2,"0")}`;
}

document.getElementById("startPause").onclick = () => {
  running = !running;

  if (running) {
    timer = setInterval(() => {
      if (time > 0) time--;
      renderTime();
    }, 1000);
  } else {
    clearInterval(timer);
  }
};

document.getElementById("reset").onclick = () => {
  clearInterval(timer);
  running = false;
  time = 25 * 60;
  renderTime();
};

renderTime();
