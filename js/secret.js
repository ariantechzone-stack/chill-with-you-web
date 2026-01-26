const KEY = "chillSecrets";
const unlocked = new Set(JSON.parse(localStorage.getItem(KEY)) || []);

const secrets = [
  {
    id: "zen",
    icon: "🧘",
    check: s => s.noInteractionMinutes >= 30
  },
  {
    id: "rain_soul",
    icon: "🌧",
    check: s => s.rainOnlyMinutes >= 60
  }
];

export function checkSecrets(state) {
  secrets.forEach(sec => {
    if (!unlocked.has(sec.id) && sec.check(state)) {
      unlocked.add(sec.id);
    }
  });
  localStorage.setItem(KEY, JSON.stringify([...unlocked]));
  return [...unlocked];
}
