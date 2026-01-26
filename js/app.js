import { toggleLofi, toggleRain, loadAudioState } from './audio.js';
import { startPauseTimer, resetTimer, loadTimerState } from './timer.js';
import { loadSceneState } from './scene.js';
import { loadCompanionState } from './companion.js';
import { loadStats, addXP } from './stats.js';

// Event listeners
document.getElementById("toggleFocus").addEventListener("click", toggleLofi);
document.getElementById("toggleRain").addEventListener("click", toggleRain);
document.getElementById("startPause").addEventListener("click", startPauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

// User uploaded track
const userTrackInput = document.getElementById("userTrack");
userTrackInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(file){
    const url = URL.createObjectURL(file);
    const lofi = document.getElementById("lofi");
    lofi.src = url;
    lofi.loop = true;
    lofi.play();
  }
});

// Load all states on page load
window.addEventListener("load", ()=>{
  loadAudioState();
  loadTimerState();
  loadSceneState();
  loadCompanionState();
  loadStats();
  addXP(5); // bonus XP on page load
});
