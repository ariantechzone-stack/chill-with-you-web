const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

let lofiPlaying = false;
let rainPlaying = false;
let audioUnlocked = false;

// Unlock audio on first user interaction
document.addEventListener("click", () => {
  if (!audioUnlocked) {
    lofi.muted = true;
    rain.muted = true;

    lofi.play().then(() => {
      lofi.pause();
      lofi.muted = false;
      rain.muted = false;
      audioUnlocked = true;
      console.log("Audio unlocked");
    }).catch(() => {});
  }
}, { once: true });

// Focus toggle
focusBtn.addEventListener("click", async () => {
  try {
    if (!lofiPlaying) {
      await lofi.play();
      focusBtn.textContent = "Stop Focus";
      lofiPlaying = true;
    } else {
      lofi.pause();
      focusBtn.textContent = "Focus Mode";
      lofiPlaying = false;
    }
  } catch (e) {
    console.error("Lofi error:", e);
  }
});

// Rain toggle
rainBtn.addEventListener("click", async () => {
  try {
    if (!rainPlaying) {
      rain.volume = 0.4;
      await rain.play();
      rainBtn.textContent = "Rain Off";
      rainPlaying = true;
    } else {
      rain.pause();
      rainBtn.textContent = "Rain";
      rainPlaying = false;
    }
  } catch (e) {
    console.error("Rain error:", e);
  }
});
