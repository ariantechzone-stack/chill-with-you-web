export const lofi = document.getElementById("lofi");
export const rain = document.getElementById("rain");
export const bellFocus = document.getElementById("bellFocus");
export const bellBreak = document.getElementById("bellBreak");
export const fireplace = document.getElementById("fireplace");

export const lofiSlider = document.getElementById("lofiVolume");
export const rainSlider = document.getElementById("rainVolume");
export const fireplaceSlider = document.getElementById("fireplaceVolume");

export let lofiPlaying=false, rainPlaying=false, fireplacePlaying=false, audioUnlocked=false;

// User-uploaded tracks
export const userUploadInput = document.getElementById("uploadTrack");
export let userTrack = null;

export function unlockAudio() {
  if(audioUnlocked) return;
  [lofi,rain,bellFocus,bellBreak,fireplace].forEach(a=>a.muted=true);
  lofi.play().then(()=>{
    lofi.pause();
    [lofi,rain,bellFocus,bellBreak,fireplace].forEach(a=>a.muted=false);
    audioUnlocked=true;
  }).catch(()=>{});
}

document.addEventListener("click", unlockAudio, {once:true});

// Upload handler
userUploadInput?.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(file){
    userTrack = new Audio(URL.createObjectURL(file));
    userTrack.loop = true;
    userTrack.volume = 0.6;
    userTrack.play();
  }
});

document.addEventListener("click", unlockAudio, { once:true });
