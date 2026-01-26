export function play(audio, volume = 0.6) {
  audio.volume = volume;
  audio.play().catch(() => {});
}

export function stop(audio) {
  audio.pause();
}
