export const lofi = document.getElementById("lofi");
export const rain = document.getElementById("rain");
export const snow = document.getElementById("snow");
export const wind = document.getElementById("wind");
export const fireplace = document.getElementById("fireplace");

export function playBell(type) {
  document.getElementById(
    type === "focus" ? "bellFocus" :
    type === "long" ? "bellLong" : "bellBreak"
  ).play();
}

document.getElementById("upload").onchange = e => {
  const file = e.target.files[0];
  if (file) {
    lofi.src = URL.createObjectURL(file);
    lofi.play();
  }
};
