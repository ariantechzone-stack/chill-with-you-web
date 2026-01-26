// ==========================
// Companion Module
// ==========================
import { companionMessage } from "./classes.js";

const companionEl = document.getElementById("companion");

export function startCompanion() {
  setInterval(() => {
    if (!companionEl) return;
    companionEl.textContent = companionMessage();
    // Simple CSS animation toggle
    companionEl.classList.toggle("blink");
  }, 10000);
}
