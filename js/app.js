const audio = document.getElementById("lofi");
const btn = document.getElementById("toggleFocus");

let playing = false;

btn.addEventListener("click", () => {
  playing = !playing;

  if (playing) {
    audio.play();
    btn.textContent = "Stop Focus";
  } else {
    audio.pause();
    btn.textContent = "Focus Mode";
  }
});

