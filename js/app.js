// ==========================
// App.js Main Entry
// ==========================
import { unlockAudio } from "./audio.js";
import { startCompanion } from "./companion.js";
import { renderClassOptions, applyActiveClass } from "./classes.js";
import { switchMode, startPauseBtn } from "./timer.js";
import { updateXPPanel } from "./xp.js";

// Unlock audio on first interaction
unlockAudio();

// Start companion messages & animations
startCompanion();

// Render class selection buttons
renderClassOptions("classOptions");

// Initial XP / Panel update
updateXPPanel();
