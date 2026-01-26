// ==========================
// Weather Module
// ==========================
export const weather = {
  type: "clear", // clear, rain, snow, wind
};

export function setWeather(type) {
  const scene = document.getElementById("scene");
  scene.classList.remove("weather-clear", "weather-rain", "weather-snow", "weather-wind");
  weather.type = type;
  scene.classList.add(`weather-${type}`);
}

export function randomWeather() {
  const options = ["clear", "rain", "snow", "wind"];
  setWeather(options[Math.floor(Math.random() * options.length)]);
}
