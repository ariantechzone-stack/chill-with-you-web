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

export function setCompanion(state) {
  sprite.className = `state-${state}`;
  text.textContent = rand(messages[state] || messages.idle);
}
