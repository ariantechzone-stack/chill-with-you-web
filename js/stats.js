const KEY = "chillStats";

const defaults = {
  focusSessions: 0,
  breakSessions: 0,
  focusMinutes: 0,
  streak: 0,
  lastDate: null
};

export function loadStats() {
  return JSON.parse(localStorage.getItem(KEY)) || { ...defaults };
}

export function saveStats(stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function logSession(isFocus, minutes) {
  const stats = loadStats();
  const today = new Date().toDateString();

  if (stats.lastDate !== today) {
    stats.streak += 1;
    stats.lastDate = today;
  }

  if (isFocus) {
    stats.focusSessions++;
    stats.focusMinutes += minutes;
  } else {
    stats.breakSessions++;
  }

  saveStats(stats);
  updateStatsUI(stats);
}

export function updateStatsUI(stats = loadStats()) {
  document.getElementById("statFocus").textContent = stats.focusSessions;
  document.getElementById("statBreak").textContent = stats.breakSessions;
  document.getElementById("statMinutes").textContent = stats.focusMinutes;
  document.getElementById("statStreak").textContent = stats.streak;
}
