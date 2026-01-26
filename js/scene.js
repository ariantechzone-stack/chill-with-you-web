export function setNight(isNight) {
  document.getElementById("scene")
    .classList.toggle("night", !isNight);
}
