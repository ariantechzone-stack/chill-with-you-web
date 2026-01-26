export const weather = {
  type: "clear", // clear, rain, snow, wind
};

export function setWeather(type){
  document.body.classList.remove("weather-clear","weather-rain","weather-snow","weather-wind");
  weather.type = type;
  document.body.classList.add(`weather-${type}`);
}

export function randomWeather(){
  const options=["clear","rain","snow","wind"];
  setWeather(options[Math.floor(Math.random()*options.length)]);
}
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
