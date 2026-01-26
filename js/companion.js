const companion = document.getElementById("companionText");

const messages = {
  idle: [
    "Ready when you are 🌱",
    "Let’s make today calm.",
  ],
  focus: [
    "I’m with you. Stay focused 💙",
    "One task. One breath.",
  ],
  break: [
    "You earned this break ☕",
    "Relax. You’re doing well."
  ],
  night: [
    "Quiet nights are powerful 🌙",
  ]
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function updateCompanion(state) {
  if (!companion) return;

  companion.textContent =
    messages[state] ? random(messages[state]) : "…";
}

