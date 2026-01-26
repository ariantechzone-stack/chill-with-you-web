const STATS_KEY = "chillStats";

const defaultStats = {
  focusSessions: 0,
  breakSessions: 0,
  focusMinutes: 0,
  streak: 0,
  lastDate: null
};

export function loadStats() {
  return JSON.parse(localStorage.getItem(STATS_KEY)) || defaultStats;
}

export function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function logSession(isFocus, durationMinutes) {
  const stats = loadStats();
  const today = new Date().toDateString();

  if (stats.lastDate !== today) {
    stats.streak += 1;
    stats.lastDate = today;
  }

  if (isFocus) {
    stats.focusSessions++;
    stats.focusMinutes += durationMinutes;
  } else {
    stats.breakSessions++;
  }

  saveStats(stats);
}
