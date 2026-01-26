const focusPrompts = {
  start: [
    "One task. One breath.",
    "Stay with the work.",
    "Let the noise fade."
  ],
  mid: [
    "Still here. Still focused.",
    "Progress > perfection.",
    "You’re doing enough."
  ],
  end: [
    "Well done. Pause.",
    "You showed up.",
    "Rest is part of focus."
  ],
  night: [
    "Quiet effort matters.",
    "Slow focus is deep focus."
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getFocusMessage(type, isNight = false) {
  if (isNight) return pick(focusPrompts.night);
  return pick(focusPrompts[type] || focusPrompts.start);
}
