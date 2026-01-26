export function play(audio, volume = 0.6) {
  audio.volume = volume;
  audio.play().catch(() => {});
}

export function stop(audio) {
  audio.pause();
}
export function toggleFireplace(audio, on) {
  if (on) audio.play().catch(()=>{});
  else audio.pause();
}
