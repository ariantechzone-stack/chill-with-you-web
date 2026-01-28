import { toggleLofi, toggleRain, loadAudioState } from './audio.js';
import { startPauseTimer, resetTimer, loadTimerState } from './timer.js';
import { loadSceneState } from './scene.js';
import { loadCompanionState } from './companion.js';
import { loadStats, addXP } from './stats.js';

/* ---------- Event Listeners ---------- */
document.getElementById("toggleFocus")?.addEventListener("click", toggleLofi);
document.getElementById("toggleRain")?.addEventListener("click", toggleRain);
document.getElementById("startPause")?.addEventListener("click", startPauseTimer);
document.getElementById("reset")?.addEventListener("click", resetTimer);

/* ---------- User Uploaded Track ---------- */
const userTrackInput = document.getElementById("userTrack");
userTrackInput?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const lofi = document.getElementById("lofi");
    if (lofi) {
      lofi.src = url;
      lofi.loop = true;
      lofi.play().catch(() => {
        console.log("Audio play blocked until user interaction");
      });
    }
  }
});

/* ---------- Load States ---------- */
window.addEventListener("load", () => {
  loadAudioState();
  loadTimerState();
  loadSceneState();
  loadCompanionState();
  loadStats();

  if (!localStorage.getItem("firstLoad")) {
    addXP(5);
    localStorage.setItem("firstLoad", "true");
  }
});
