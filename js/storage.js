<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Chill With You</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Fonts -->
  <link rel="stylesheet" href="assets/fonts/inter.css" />

  <!-- CSS -->
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/ambience.css" />
  <link rel="stylesheet" href="css/scene.css" />
  <link rel="stylesheet" href="css/ui.css" />
</head>
<body>

  <!-- Scene / Background -->
  <div id="scene">
    <!-- Weather Layers -->
    <div class="weather-layer rain"></div>
    <div class="weather-layer snow"></div>
    <div class="weather-layer wind"></div>

    <!-- Fireplace / Candle Glow -->
    <div id="fireplaceGlow" class="fireplace-flicker"></div>

    <!-- Window Glow -->
    <div class="window-glow"></div>

    <!-- Companion -->
    <div id="companion">👋 Hey! Ready to focus?</div>

    <!-- Desk / Controls -->
    <div id="desk">
      <p class="status">Chilling… 🎧</p>

      <!-- Focus / Audio -->
      <button id="toggleFocus">Focus Mode</button>
      <button id="toggleRain">Rain</button>
      <input type="range" id="lofiVolume" min="0" max="1" step="0.01" value="0.6">
      <label for="lofiVolume">Lofi Volume</label>
      <input type="range" id="rainVolume" min="0" max="1" step="0.01" value="0.4">
      <label for="rainVolume">Rain Volume</label>

      <!-- Pomodoro -->
      <div id="pomodoro">
        <p id="timerLabel">Focus Time</p>
        <p id="timer">25:00</p>
        <button id="startPause">Start</button>
        <button id="reset">Reset</button>
      </div>

      <!-- Focus Classes -->
      <div id="classOptions">
        <button class="class-btn" data-class="monk">Monk</button>
        <button class="class-btn" data-class="scholar">Scholar</button>
        <button class="class-btn" data-class="nightOwl">Night Owl</button>
      </div>

      <!-- XP / Achievements -->
      <div id="xpPanel">
        <p>XP: <span id="xpValue">0</span></p>
        <p>Level: <span id="levelValue">1</span></p>
        <div id="achievements"></div>
      </div>

      <!-- Upload custom track -->
      <input type="file" id="userTrack" accept="audio/*">
    </div>
  </div>

  <!-- Audio -->
  <audio id="bellFocus" src="assets/audio/bellFocus.mp3" preload="auto"></audio>
  <audio id="bellBreak" src="assets/audio/bellBreak.mp3" preload="auto"></audio>
  <audio id="lofi" src="assets/audio/lofi-01.mp3" loop></audio>
  <audio id="rain" src="assets/audio/rain.mp3" loop></audio>

  <!-- JS Modules -->
  <script type="module" src="js/storage.js"></script>
  <script type="module" src="js/audio.js"></script>
  <script type="module" src="js/timer.js"></script>
  <script type="module" src="js/scene.js"></script>
  <script type="module" src="js/companion.js"></script>
  <script type="module" src="js/stats.js"></script>
  <script type="module" src="js/app.js"></script>

</body>
</html>
