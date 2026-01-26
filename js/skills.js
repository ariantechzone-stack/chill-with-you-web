const KEY = "chillSkills";

const skills = {
  focus: { xp: 0, level: 0 },
  calm: { xp: 0, level: 0 },
  discipline: { xp: 0, level: 0 }
};

export function loadSkills() {
  return JSON.parse(localStorage.getItem(KEY)) || skills;
}

export function addSkillXP(skill, amount) {
  const s = loadSkills();
  s[skill].xp += amount;

  const need = (s[skill].level + 1) * 100;
  if (s[skill].xp >= need) {
    s[skill].xp -= need;
    s[skill].level++;
  }

  localStorage.setItem(KEY, JSON.stringify(s));
}
