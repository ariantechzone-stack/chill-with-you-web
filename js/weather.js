const weatherLayer = document.getElementById("weather");

let currentWeather = "clear";

export function setWeather(type) {
  currentWeather = type;
  weatherLayer.className = `weather ${type}`;
}

export function autoWeather(isNight) {
  if (isNight) setWeather("rain");
  else setWeather("clear");
}

export function getWeather() {
  return currentWeather;
}
;
