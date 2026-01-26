const KEY = "chillChallenge";

export function generateWeekly() {
  const week = Math.floor(Date.now() / 604800000);

  const challenges = [
    { id: "focus_5", target: 5, type: "focusSessions", xp: 100 },
    { id: "minutes_120", target: 120, type: "focusMinutes", xp: 150 }
  ];

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  localStorage.setItem(KEY, JSON.stringify({ week, progress: 0, ...challenge }));
}

export function updateChallenge(stats) {
  const c = JSON.parse(localStorage.getItem(KEY));
  if (!c) return;

  c.progress = stats[c.type];
  if (c.progress >= c.target && !c.completed) {
    c.completed = true;
    c.rewarded = true;
  }

  localStorage.setItem(KEY, JSON.stringify(c));
}
