export function saveState(state) {
  localStorage.setItem("chill-state", JSON.stringify(state));
}

export function loadState() {
  return JSON.parse(localStorage.getItem("chill-state")) || {};
}

