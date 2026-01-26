import { rain, snow, wind } from "./audio.js";

const layers = {
  rain: document.querySelector(".weather.rain"),
  snow: document.querySelector(".weather.snow")
};

document.querySelectorAll("[data-weather]").forEach(btn => {
  btn.onclick = () => {
    Object.values(layers).forEach(l => l.style.opacity = 0);
    rain.pause(); snow.pause(); wind.pause();

    const type = btn.dataset.weather;
    layers[type].style.opacity = 1;
    document.getElementById(type).play();
  };
});
