// ==========================
// Focus Classes Module
// ==========================
export const classes = {
  Monk: { ambience: "meditation-glow" },
  Scholar: { ambience: "study-light" },
  "Night Owl": { ambience: "night-light" },
  // Hybrid / Secret examples
  ZenMaster: { parent: "Monk", ambience: "zen-glow" },
  ScholarOwl: { parent: "Scholar+Night Owl", ambience: "owl-study" }
};

export let activeClass = "Monk";

export function renderClassOptions(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = Object.keys(classes).map(c =>
    `<button class="class-btn" data-class="${c}">${c}</button>`
  ).join("");

  container.querySelectorAll(".class-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const cls = e.target.dataset.class;
      activeClass = cls;
      applyActiveClass();
      console.log("Active class:", activeClass);
    });
  });
}

export function applyActiveClass() {
  const scene = document.getElementById("scene");
  Object.values(classes).forEach(c => scene.classList.remove(c.ambience));
  scene.classList.add(classes[activeClass].ambience);
}

export function companionMessage() {
  const messages = {
    Monk: ["Breathe deeply…", "Focus your mind…"],
    Scholar: ["Time to study!", "Review your notes…"],
    "Night Owl": ["The night is quiet…", "Perfect for coding…"],
    ZenMaster: ["You have reached inner peace."],
    ScholarOwl: ["Hybrid focus activated!"]
  };
  const arr = messages[activeClass] || ["Stay focused!"];
  return arr[Math.floor(Math.random() * arr.length)];
}
