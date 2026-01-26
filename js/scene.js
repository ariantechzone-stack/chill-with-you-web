const scene = document.getElementById("scene");
const rain = document.getElementById("rain");

export function setScene(mode) {
  if (mode === "night") {
    scene.classList.add("night");
    rain.volume = 0.4;
    rain.play();
  } else {
    scene.classList.remove("night");
  }
}

