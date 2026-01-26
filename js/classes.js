const KEY = "chillClass";

const classes = {
  monk: {
    name: "Monk",
    icon: "🧘",
    bonus(stats) {
      stats.xpMultiplier = 1.1;
      stats.rainVolume *= 0.7;
    }
  },
  scholar: {
    name: "Scholar",
    icon: "📚",
    bonus(stats) {
      stats.focusBonus = 5 * 60;
    }
  },
  owl: {
    name: "Night Owl",
    icon: "🌙",
    bonus(stats) {
      if (stats.isNight) {
        stats.xpMultiplier = 1.2;
        stats.autoRain = true;
      }
    }
  }
};

const state = JSON.parse(localStorage.getItem(KEY)) || {
  active: null,
  unlocked: [],
  progress: {
    monk: { silent: 0 },
    scholar: { streak: 0 },
    owl: { night: 0 }
  }
};

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getActiveClass() {
  return state.active;
}

export function getClasses() {
  return classes;
}

export function applyClassBonuses(stats) {
  if (!state.active) return stats;
  classes[state.active].bonus(stats);
  return stats;
}

export function setClass(id) {
  if (state.unlocked.includes(id)) {
    state.active = id;
    save();
  }
}

export function trackClassProgress(event) {
  const hour = new Date().getHours();

  if (event === "focus_complete") {
    if (state.active === "monk") state.progress.monk.silent++;
    if (hour >= 22) state.progress.owl.night++;
  }

  if (event === "streak") {
    state.progress.scholar.streak++;
  }

  if (state.progress.monk.silent >= 5 && !state.unlocked.includes("monk")) {
    unlock("monk");
  }

  if (state.progress.scholar.streak >= 7 && !state.unlocked.includes("scholar")) {
    unlock("scholar");
  }

  if (state.progress.owl.night >= 3 && !state.unlocked.includes("owl")) {
    unlock("owl");
  }

  save();
}

function unlock(id) {
  state.unlocked.push(id);
  if (!state.active) state.active = id;
}
