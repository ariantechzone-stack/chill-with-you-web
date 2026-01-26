const XP_KEY = "chillXP";

export let state = JSON.parse(localStorage.getItem(XP_KEY))||{
  xp:0,
  level:1,
  achievements:[]
};

export function addXP(amount){
  state.xp += amount;
  if(state.xp >= state.level*100){
    state.level++;
    state.xp = 0;
    addAchievement(`Level Up! Reached level ${state.level}`);
  }
  saveXP();
}

export function addAchievement(name){
  if(!state.achievements.includes(name)){
    state.achievements.push(name);
  }
  saveXP();
}

export function saveXP(){ localStorage.setItem(XP_KEY,JSON.stringify(state)); }
export function loadXP(){ return state; }
