// ==========================
// Focus Classes Module
// ==========================
const KEY = "chillClasses";

// CLASS DEFINITIONS
const classes = {
  monk: {
    name: "Monk",
    icon: "🧘",
    bonus(stats) {
      stats.xpMultiplier = 1.1;
      stats.rainVolume *= 0.7;
    },
    ambience: () => document.body.classList.add("calm-light"),
    messages: ["Focus deeply...", "Breathe slowly..."]
  },
  zenMaster: {
    name: "Zen Master",
    icon: "☯️",
    bonus(stats) {
      stats.xpMultiplier = 1.2;
      stats.rainVolume *= 0.5;
    },
    ambience: () => document.body.classList.add("meditation-glow"),
    messages: ["Your mind is clear.", "Let the silence guide you."]
  },
  scholar: {
    name: "Scholar",
    icon: "📚",
    bonus(stats) {
      stats.focusBonus = 5 * 60;
    },
    ambience: () => document.body.classList.add("study-light"),
    messages: ["Great work! Keep going!", "Knowledge grows here."]
  },
  owl: {
    name: "Night Owl",
    icon: "🌙",
    bonus(stats) {
      if(stats.isNight) {
        stats.xpMultiplier = 1.2;
        stats.autoRain = true;
      }
    },
    ambience: () => document.body.classList.add("night-light"),
    messages: ["Night is your ally.", "Focus under the stars."]
  },
  nightMonk: {
    name: "Night Monk",
    icon: "🌌",
    bonus(stats) {
      stats.xpMultiplier = 1.15;
      stats.focusBonus = 2*60;
    },
    ambience: () => document.body.classList.add("night-calm"),
    messages: ["Harmony at night.", "The night guides your focus."]
  },
  rainWhisperer: {
    name: "Rain Whisperer",
    icon: "🌧",
    bonus(stats) {
      stats.rainVolume *= 1.2;
      stats.xpMultiplier = 1.1;
    },
    ambience: () => document.body.classList.add("rainy-glow"),
    messages: ["You are one with the rain.", "Let it wash away distractions."]
  }
};

// DEFAULT STATE
const state = JSON.parse(localStorage.getItem(KEY)) || {
  active: null,
  unlocked: [],
  evolution: {},
  hybrid: null,
  secret: { unlocked: [], active: null },
  progress: { monkSilent: 0, owlNight: 0, scholarStreak: 0, rainOnly: 0 }
};

// SAVE STATE
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

// GETTERS
export function getClasses() { return classes; }
export function getActiveClass() { return state.active; }

// APPLY ACTIVE CLASS
export function applyActiveClass(stats) {
  if(!state.active) return stats;
  const cls = classes[state.active];
  if(cls) {
    cls.bonus(stats);
    if(cls.ambience) cls.ambience();
  }
  return stats;
}

// SET ACTIVE CLASS
export function setClass(id) {
  if(state.unlocked.includes(id) || state.secret.unlocked.includes(id) || state.hybrid?.name===id) {
    state.active = id;
    save();
  }
}

// TRACK PROGRESS & UNLOCK CLASSES
export function trackProgress(event, isNight=false, rainOnly=false) {
  // Focus completion
  if(event==="focus_complete") {
    state.progress.monkSilent++;
    if(isNight) state.progress.owlNight++;
    if(rainOnly) state.progress.rainOnly++;
  }
  // Streak tracking
  if(event==="streak") state.progress.scholarStreak++;

  // ---- EVOLUTIONS ----
  if(state.progress.monkSilent >= 20 && !state.unlocked.includes("zenMaster")) state.unlocked.push("zenMaster");

  // ---- HYBRID CLASSES ----
  if(state.progress.monkSilent >= 15 && state.progress.owlNight >=5 && !state.hybrid) {
    state.hybrid = { name: "nightMonk", components: ["monk","owl"] };
  }

  // ---- SECRET CLASSES ----
  if(state.progress.rainOnly >=3 && !state.secret.unlocked.includes("rainWhisperer")) {
    state.secret.unlocked.push("rainWhisperer");
    state.secret.active = "rainWhisperer";
  }

  // Auto-activate first unlocked if none
  if(!state.active) {
    if(state.unlocked[0]) state.active=state.unlocked[0];
    else if(state.secret.active) state.active=state.secret.active;
    else if(state.hybrid?.name) state.active=state.hybrid.name;
  }

  save();
}

// GET COMPANION MESSAGE
export function companionMessage() {
  const cls = classes[state.active];
  if(!cls || !cls.messages) return "";
  return cls.messages[Math.floor(Math.random()*cls.messages.length)];
}

// RENDER CLASS OPTIONS
export function renderClassOptions(containerId) {
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = "";
  const allClasses = {...classes};

  Object.entries(allClasses).forEach(([id, cls])=>{
    const div = document.createElement("div");
    div.className="class-card";
    div.textContent = `${cls.icon} ${cls.name}`;

    // ACTIVE
    if(state.active===id) div.classList.add("active");

    // UNLOCKED
    if(state.unlocked.includes(id) || state.secret.unlocked.includes(id) || state.hybrid?.name===id) {
      div.classList.add("unlocked");
    } else div.style.opacity="0.4";

    div.onclick = ()=>{
      setClass(id);
      renderClassOptions(containerId);
    };

    container.appendChild(div);
  });
}

// LOAD STATE
export function loadClassState() { return state; }
