const KEY = "chillSeasonal";

export function currentSeason() {
  const m = new Date().getMonth();
  return `Q${Math.floor(m / 3) + 1}-${new Date().getFullYear()}`;
}

const achievements = [
  {
    id: "spring_focus",
    icon: "🌸",
    check: stats => stats.focusSessions >= 10
  },
  {
    id: "night_chill",
    icon: "🌙",
    check: () => new Date().getHours() >= 22
  }
];

export function checkSeasonal(stats) {
  const season = currentSeason();
  const data = JSON.parse(localStorage.getItem(KEY)) || {};
  data[season] ||= [];

  achievements.forEach(a => {
    if (!data[season].includes(a.id) && a.check(stats)) {
      data[season].push(a.id);
    }
  });

  localStorage.setItem(KEY, JSON.stringify(data));
  return data[season];
}
