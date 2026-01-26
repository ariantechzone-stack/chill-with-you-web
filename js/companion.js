
import { companionMessage } from "./classes.js";

const companionEl = document.getElementById("companion");

export function startCompanion() {
  companionEl.textContent = companionMessage();
  setInterval(()=>{
    companionEl.textContent = companionMessage();
  }, 10000); // every 10 seconds
}
