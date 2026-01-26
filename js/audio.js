import { Storage } from './storage.js';

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

// Unlock audio once on first click
document.addEventListener("click", () => {
  if (audioUnlocked) return;
  [lofi, rain, bellFocus, bellBreak].forEach(a => (a.muted = true));
  lofi.play().then(() => {
    lofi.pause();
    [lofi, rain, bellFocus, bellBreak].forEach(a => (a.muted = false));
    audioUnlocked = true;
  }).catch(()=>{});
}, { once: true });

// ==========================
// Focus toggle
// ==========================
export function toggleLofi() {
  if(!lofiPlaying){
    lofi.volume = parseFloat(lofiSlider.value);
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

// ==========================
// Rain toggle
// ==========================
export function toggleRain() {
  if(!rainPlaying){
    rain.volume = parseFloat(rainSlider.value);
    rain.play();
    rainBtn.textContent = "Rain Off";
    document.querySelector(".rain").classList.add("active");
    rainPlaying = true;
  } else {
    rain.pause();
    rainBtn.textContent = "Rain";
    document.querySelector(".rain").classList.remove("active");
    rainPlaying = false;
  }
  saveAudioState();
}

// ==========================
// Sliders
// ==========================
lofiSlider.addEventListener("input", ()=>{
  lofi.volume = parseFloat(lofiSlider.value);
  saveAudioState();
});
rainSlider.addEventListener("input", ()=>{
  rain.volume = parseFloat(rainSlider.value);
  saveAudioState();
});

// ==========================
// Play Bell
// ==========================
export function playBell(isFocus){
  if(isFocus){
    bellBreak.currentTime=0;
    bellBreak.volume=0.5;
    bellBreak.play().catch(()=>{});
  } else {
    bellFocus.currentTime=0;
    bellFocus.volume=0.5;
    bellFocus.play().catch(()=>{});
  }
}

// ==========================
// Save audio state
// ==========================
function saveAudioState(){
  Storage.saveState({
    lofiPlaying,
    rainPlaying,
    lofiVolume: lofi.volume,
    rainVolume: rain.volume
  });
}

// ==========================
// Load audio state
// ==========================
export function loadAudioState(){
  const state = Storage.loadState();
  if(!state) return;
  lofi.volume = state.lofiVolume ?? 0.6;
  rain.volume = state.rainVolume ?? 0.4;
  lofiSlider.value = lofi.volume;
  rainSlider.value = rain.volume;

  if(state.lofiPlaying){ lofi.play(); lofiPlaying=true; focusBtn.textContent="Stop Focus"; }
  if(state.rainPlaying){ rain.play(); rainPlaying=true; rainBtn.textContent="Rain Off"; document.querySelector(".rain").classList.add("active"); }
}
