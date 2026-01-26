import { Storage } from './storage.js';

const companionEl = document.getElementById("companion");
const classButtons = document.querySelectorAll(".class-btn");

let companionClass = "monk"; // default
let personality = "calm";

const messages = {
  monk: ["Focus on your breath...", "Patience is key."],
  scholar: ["Time to learn!", "Absorb knowledge slowly."],
  nightOwl: ["The night is productive.", "Keep coding!"]
};

// Show companion message
export function showCompanionMessage(){
  const arr = messages[companionClass] || ["Stay focused!"];
  const msg = arr[Math.floor(Math.random()*arr.length)];
  companionEl.textContent = msg;
}

// Set class
classButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    companionClass = btn.dataset.class;
    saveCompanionState();
    showCompanionMessage();
  });
});

function saveCompanionState(){
  const state = Storage.loadState() || {};
  Storage.saveState({
    ...state,
    companionClass
  });
}

export function loadCompanionState(){
  const state = Storage.loadState();
  if(!state) return;
  companionClass = state.companionClass ?? "monk";
  showCompanionMessage();
}
