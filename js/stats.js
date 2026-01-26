import { Storage } from './storage.js';

const xpEl = document.getElementById("xpValue");
const levelEl = document.getElementById("levelValue");
const achievementsEl = document.getElementById("achievements");

let xp = 0;
let level = 1;
const achievements = [];

export function addXP(amount){
  xp += amount;
  checkLevelUp();
  updateUI();
  saveStats();
}

function checkLevelUp(){
  const xpForNext = level*100;
  if(xp >= xpForNext){
    xp -= xpForNext;
    level++;
    addAchievement(`Reached level ${level}`);
    checkLevelUp();
  }
}

export function addAchievement(text){
  if(!achievements.includes(text)){
    achievements.push(text);
    const el = document.createElement("div");
    el.textContent = `🏆 ${text}`;
    achievementsEl.appendChild(el);
    saveStats();
  }
}

function updateUI(){
  xpEl.textContent = xp;
  levelEl.textContent = level;
}

function saveStats(){
  const state = Storage.loadState() || {};
  Storage.saveState({
    ...state,
    xp, level, achievements
  });
}

export function loadStats(){
  const state = Storage.loadState();
  if(!state) return;
  xp = state.xp ?? 0;
  level = state.level ?? 1;
  if(state.achievements){
    state.achievements.forEach(a=>addAchievement(a));
  }
  updateUI();
}
