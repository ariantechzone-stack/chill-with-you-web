const KEY = "chillXP";

const state = {
  level: 1,
  xp: 0
};

export function loadXP() {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved) Object.assign(state, saved);
  updateUI();
}

export function addXP(amount) {
  state.xp += amount;

  const needed = state.level * 200;
  if (state.xp >= needed) {
    state.xp -= needed;
    state.level++;
    playLevelUp();
  }

  save();
  updateUI();
}

function updateUI() {
  const needed = state.level * 200;
  document.getElementById("level").textContent = state.level;
  document.getElementById("xpNow").textContent = state.xp;
  document.getElementById("xpNeed").textContent = needed;
  document.getElementById("xpFill").style.width =
    `${(state.xp / needed) * 100}%`;
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function playLevelUp() {
  document.body.classList.add("level-up");
  setTimeout(() => document.body.classList.remove("level-up"), 800);
}
