const lofi = document.getElementById("lofi");
const rain = document.getElementById("rain");

const bellFocus = document.getElementById("bellFocus");
const bellBreak = document.getElementById("bellBreak");
const bellLong = document.getElementById("bellLong");

let unlocked = false;

document.addEventListener("click", () => {
  if (!unlocked) {
    [lofi, rain].forEach(a => {
      a.muted = true;
      a.play().then(() => a.pause());
      a.muted = false;
    });
    unlocked = true;
  }
}, { once: true });

export function playBell(type) {
  const bell = type === "focus" ? bellFocus :
               type === "long" ? bellLong :
               bellBreak;
  bell.currentTime = 0;
  bell.play();
}

export function setVolumes({ lofiV, rainV, bellV }) {
  lofi.volume = lofiV;
  rain.volume = rainV;
  bellFocus.volume = bellBreak.volume = bellLong.volume = bellV;
}

