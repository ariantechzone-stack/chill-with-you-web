import { Storage } from './storage.js';

const scene = document.getElementById("scene");
const weatherLayers = {
  rain: document.querySelector(".weather-layer.rain"),
  snow: document.querySelector(".weather-layer.snow"),
  wind: document.querySelector(".weather-layer.wind")
};
const fireplace = document.getElementById("fireplaceGlow");

let nightMode = false;

export function updateSceneNight(isNight){
  nightMode = isNight;
  if(isNight){
    scene.classList.add("night");
    // Auto rain at night
    toggleWeather("rain", true);
  } else {
    scene.classList.remove("night");
    toggleWeather("rain", false);
  }
  saveSceneState();
}

export function toggleWeather(type, on){
  if(weatherLayers[type]){
    if(on){
      weatherLayers[type].classList.add("active");
    } else {
      weatherLayers[type].classList.remove("active");
    }
  }
}

// Fireplace toggle
export function toggleFireplace(on){
  if(on){
    fireplace.classList.add("active");
  } else {
    fireplace.classList.remove("active");
  }
}

function saveSceneState(){
  const state = Storage.loadState() || {};
  Storage.saveState({
    ...state,
    nightMode
  });
}

// Load state
export function loadSceneState(){
  const state = Storage.loadState();
  if(!state) return;
  if(state.nightMode) updateSceneNight(true);
}
