const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");

const focusBtn = document.getElementById("toggleFocus");
const rainBtn = document.getElementById("toggleRain");

let lofiPlaying = false;
let rainPlaying = false;

// Focus toggle
focusBtn.addEventListener("click", () => {
  lofiPlaying = !lofiPlaying;

  if (lofiPlaying) {
    lofi.play();
    focusBtn.textContent = "Stop Focus";
  } else {
    lofi.pause();
    focusBtn.textContent = "Focus Mode";
  }
});

// Rain toggle
rainBtn.addEventListener("click", () => {
  rainPlaying = !rainPlaying;

  if (rainPlaying) {
    rain.volume = 0.5;
    rain.play();
    rainBtn.textContent = "Rain Off";
  } else {
    rain.pause();
    rainBtn.textContent = "Rain";
  }
});
