// ==========================
// Audio Module
// ==========================
export const lofi = document.getElementById("lofi");
export const rain = document.getElementById("rain");
export const bellFocus = document.getElementById("bellFocus");
export const bellBreak = document.getElementById("bellBreak");

// Sliders
export const lofiSlider = document.getElementById("lofiVolume");
export const rainSlider = document.getElementById("rainVolume");

export let lofiPlaying = false;
export let rainPlaying = false;
export let audioUnlocked = false;

// Unlock audio on first interaction
export function unlockAudio() {
  if(audioUnlocked) return;
  [lofi,rain,bellFocus,bellBreak].forEach(a=>a.muted=true);
  lofi.play().then(()=>{
    lofi.pause();
    [lofi,rain,bellFocus,bellBreak].forEach(a=>a.muted=false);
    audioUnlocked=true;
  }).catch(()=>{});
}

document.addEventListener("click", unlockAudio, { once:true });
