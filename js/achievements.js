import { loadStats } from "./stats.js";

const KEY = "chillAchievements";

const definitions = [
  { id: "first_focus", icon: "🌱", check: s => s.focusSessions >= 1 },
  { id: "focus_5", icon: "🔥", check: s => s.focusSessions >= 5 },
  { id: "focus_25", icon: "💎", check: s => s.focusSessions >= 25 },
  { id: "streak_3", icon: "📅", check: s => s.streak >= 3 },
  { id: "streak_7", icon: "🏆", check: s => s.streak >= 7 },
  { id: "night_owl", icon: "🌙", check: s => new Date().getHours() >= 22 },
  { id: "level_5", icon: "⭐", check: s => s.level >= 5 },
  { id: "level_10", icon: "👑", check: s => s.level >= 10 }
];

let unlocked = new Set(
  JSON.parse(localStorage.getItem(KEY)) || []
);

export function checkAchievements(extra = {}) {
  const stats = loadStats();
  const combined = { ...stats, ...extra };

  definitions.forEach(def => {
    if (!unlocked.has(def.id) && def.check(combined)) {
      unlock(def.id);
    }
  });

  render();
}

function unlock(id) {
  unlocked.add(id);
  localStorage.setItem(KEY, JSON.stringify([...unlocked]));
  flashBadge();
}

function flashBadge() {
  document.body.classList.add("achievement-unlock");
  setTimeout(() => {
    document.body.classList.remove("achievement-unlock");
  }, 700);
}

export function render() {
  const grid = document.getElementById("badgeGrid");
  if (!grid) return;

  grid.innerHTML = "";

  definitions.forEach(def => {
    const div = document.createElement("div");
    div.className = "badge" + (unlocked.has(def.id) ? " unlocked" : "");
    div.innerHTML = `<span>${def.icon}</span>`;
    grid.appendChild(div);
  });
}
