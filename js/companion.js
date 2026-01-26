const sprite = document.getElementById("companionSprite");
const text = document.getElementById("companionText");

const messages = {
  idle: ["Ready when you are 🌱", "Slow and steady."],
  focus: ["Stay with it 💙", "One task only."],
  break: ["Relax ☕", "You earned this."],
  night: ["Quiet nights feel safe 🌙"]
};

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

import { getFocusMessage } from "./focusAI.js";

export function setCompanion(state, isNight = false) {
  sprite.className = `state-${state}`;
  text.textContent = getFocusMessage(state, isNight);
}
import { companionMessage } from "./classes.js";

const companionEl = document.getElementById("companion");

export function startCompanion() {
  companionEl.textContent = companionMessage();
  setInterval(()=>{
    companionEl.textContent = companionMessage();
  }, 10000); // every 10 seconds
}
