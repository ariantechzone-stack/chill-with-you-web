// ==========================
// Audio Module
// ==========================
export const lofi = document.getElementById("lofi");
export const rain = document.getElementById("rain");
export const fireplace = document.getElementById("fireplace");
export const bellFocus = document.getElementById("bellFocus");
export const bellBreak = document.getElementById("bellBreak");

export const lofiSlider = document.getElementById("lofiVolume");
export const rainSlider = document.getElementById("rainVolume");
export const fireplaceSlider = document.getElementById("fireplaceVolume");

export let lofiPlaying = false;
export let rainPlaying = false;
export let fireplacePlaying = false;
export let audioUnlocked = false;

// User-uploaded track
export const userUploadInput = document.getElementById("uploadTrack");
export let userTrack = null;

// ==========================
// Unlock audio on first interaction
// ==========================
export function unlockAudio() {
  if (audioUnlocked) return;
  [lofi, rain, fireplace, bellFocus, bellBreak].forEach(a => a.muted = true);
  lofi.play().then(() => {
    lofi.pause();
    [lofi, rain, fireplace, bellFocus, bellBreak].forEach(a => a.muted = false);
    audioUnlocked = true;
    console.log("Audio unlocked!");
  }).catch(() => {});
}

document.addEventListener("click", unlockAudio, { once: true });

// ==========================
// Sliders
// ==========================
lofiSlider.addEventListener("input", () => {
  lofi.volume = parseFloat(lofiSlider.value);
});

rainSlider.addEventListener("input", () => {
  rain.volume = parseFloat(rainSlider.value);
});

fireplaceSlider.addEventListener("input", () => {
  fireplace.volume = parseFloat(fireplaceSlider.value);
});

// ==========================
// User Upload
// ==========================
userUploadInput?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    userTrack = new Audio(URL.createObjectURL(file));
    userTrack.loop = true;
    userTrack.volume = 0.6;
    userTrack.play();
    console.log("User track playing!");
  }
});
