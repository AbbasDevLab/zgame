// Game state
let score = 0;
let lives = 0;
let gameRunning = false;
let basketX = 50;
let hearts = [];
let spawnInterval;
let gameLoopId;
let floatingMessageTimeout;
let catchStreak = 0;
let nextGlitterAtScore;
let bestScoreAtStartOfGame = 0;
let newBestShownThisGame = false;
let secretShownThisGame = false;
let quoteSecretShownThisGame = false;
let celebration50Shown = false;
let secretEndingShown = false;
let gameMode = 'basket';  // 'basket' | 'tap'
let lastInteractionTime = 0;
let idleMessageShown = false;
let loveBoostEndTime = 0;
let lastTapTime = 0;
let heartRainEndTime = 0;
let heartRainInterval = null;
let haider150Shown = false;
let lastAchievementTime = 0;
let achievementQueue = [];
let achievementShowing = false;
let currentLevelIndex = 0;
let teaser1500Shown = false;
let secret4000Shown = false;
let lastRandomHeartRainTime = 0;
let audioInitialized = false;
let isMuted = false;

const SECRET_SCORE = 600;
const ZAINAB_HEART_CHANCE = 1 / 100;
const ZAINAB_BONUS = 100;
const HEART_RAIN_COMBO = 5;
const HEART_RAIN_DURATION_MS = 3000;
const HEART_RAIN_SPAWN_MS = 150;
const HEART_RAIN_POINTS = 5;
const HAIDER_150_SCORE = 1200;

// The Kite Runner quote — glitter heart every 250 score
const KITE_RUNNER_QUOTE = "For you a thousand times over";
const QUOTE_SCORE_MILESTONE = 250;  // glitter heart at 250, 500, 750...
const QUOTE_OVERLAY_SCORE = 1800;

// Level system
const LEVELS = [
  { min: 0, max: 300, label: 'Level 1 — Warm Up' },
  { min: 300, max: 600, label: 'Level 2 — Heart Catcher' },
  { min: 600, max: 1200, label: 'Level 3 — Love Collector' },
  { min: 1200, max: 1800, label: 'Level 4 — Zainab Mode' },
  { min: 1800, max: 2200, label: 'Level 5 — Heart Queen' }
];

// Teasers & late secrets
const TEASER_SCORE = 1500;
const SECRET_UNLOCK_SCORE = 4000;
const HEART_RAIN_RANDOM_SCORE = 3000;
const HEART_RAIN_RANDOM_COOLDOWN_MS = 40000;

// Heart emojis for variety
const HEARTS = ['❤️', '💕', '💗', '💖', '💘', '❤️', '💕'];

// Cute messages (more of them!)
const CUTE_MESSAGES = [
  "You are amazing Zainab ❤️",
  "Bonus Love +10",
  "Haider likes you",
  "You make Haider smile 😊",
  "So proud of you!",
  "You're the best 💕",
  "Haider's favourite person",
  "Keep going, superstar!",
  "Love you Zainab!",
  "You've got this! 💖",
  "So much love for you",
  "Best catch ever! 🎯",
  "Good job Zainab! 💕",
  "Nice catch!",
  "Heart thief 😄",
  "Zainab bonus +20!"
];

const GOLDEN_MESSAGE = "Golden Heart! You unlocked Haider's love 💛";
const IDLE_MESSAGE = "Hey Zainab… hearts are falling 😄";
const LOVE_BOOST_MESSAGE = "Love Boost Activated 💖";
const COMBO_MESSAGE = "Love Combo! +30 points";
const ACHIEVEMENT_COOLDOWN_MS = 20000;

// Combo messages
const COMBO_MESSAGES = [
  [2, "2 in a row! 💕"],
  [3, "3 in a row! Amazing! 💖"],
  [4, "4 in a row! You're on fire! 🔥"],
  [5, "5 in a row! Incredible! 🌟"],
  [6, "6 in a row! Zainab is unstoppable! ✨"],
  [8, "8 in a row! Legend! 👑"],
  [10, "10 in a row! Haider's heart is yours! 💘"]
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const btnBasketMode = document.getElementById('btn-basket-mode');
const btnTapMode = document.getElementById('btn-tap-mode');
const restartBtn = document.getElementById('restart-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const secretMsgBtn = document.getElementById('secret-msg-btn');
const secretMsgModal = document.getElementById('secret-msg-modal');
const secretMsgClose = document.getElementById('secret-msg-close');
const celebration50El = document.getElementById('celebration-50');
const celebration50Btn = document.getElementById('celebration-50-btn');
const secretEndingOverlay = document.getElementById('secret-ending-overlay');
const secretEndingBtn = document.getElementById('secret-ending-btn');
const loveBoostIndicator = document.getElementById('love-boost-indicator');
const nightModeMsg = document.getElementById('night-mode-msg');
const comboSparkleEl = document.getElementById('combo-sparkle');
const zainabHeartOverlay = document.getElementById('zainab-heart-overlay');
const zainabHeartContinueBtn = document.getElementById('zainab-heart-continue-btn');
const haider150Overlay = document.getElementById('haider-150-overlay');
const haider150ContinueBtn = document.getElementById('haider-150-continue-btn');
const gameAreaEl = document.getElementById('game-area');
const heartRainSparkles = document.getElementById('heart-rain-sparkles');
const cursorHeartEl = document.getElementById('cursor-heart');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const heartsContainer = document.getElementById('hearts-container');
const floatingMessageEl = document.getElementById('floating-message');
const catchBurstEl = document.getElementById('catch-burst');
const secretOverlayEl = document.getElementById('secret-overlay');
const secretContinueBtn = document.getElementById('secret-continue-btn');
const quoteSecretOverlayEl = document.getElementById('quote-secret-overlay');
const quoteSecretContinueBtn = document.getElementById('quote-secret-continue-btn');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');
const livesDisplay = document.getElementById('lives-display');
const levelLabelEl = document.getElementById('level-label');
const levelProgressFill = document.getElementById('level-progress-fill');
const levelPopupEl = document.getElementById('level-popup');
const audioToggleBtn = document.getElementById('audio-toggle');
const sfxCatchEl = document.getElementById('sfx-catch');
const sfxTapEl = document.getElementById('sfx-tap');
const sfxGoldenEl = document.getElementById('sfx-golden');
const sfxComboEl = document.getElementById('sfx-combo');
const sfxHeartRainEl = document.getElementById('sfx-heart-rain');
const bgMusicEl = document.getElementById('bg-music');

const BASKET_WIDTH = 12;
const HEART_SPAWN_MIN = 10;
const HEART_SPAWN_MAX = 90;
const MAX_LIVES = 3;
const POINTS_PER_HEART = 5;
const TAP_POINTS = 5;
const GOLDEN_POINTS = 50;
const GOLDEN_HEART_CHANCE = 1 / 20;
const COMBO_COUNT = 3;
const COMBO_BONUS = 30;
const IDLE_SEC = 6;
const LOVE_BOOST_DURATION_MS = 10000;
const SECRET_ENDING_SCORE = 2200;
const CELEBRATION_50_SCORE = 300;
const MIN_SCORE_FOR_FLOATING_MSG = 28;
const MIN_SCORE_FOR_COMBO_MSG = 25;
const BASE_FALL_SPEED = 2.8;
const MAX_FALL_SPEED = 5.2;
const SPEED_UP_EVERY_POINTS = 30;
const SPAWN_RATE_MS = 1350;
const BEST_SCORE_KEY = 'zgame_best_score';

const TAGLINES = [
  'Every heart is for you 💕',
  'Made with love by Haider',
  'For Zainab only ✨'
];
const EASTER_EGG_MESSAGE = "You found it! Made with so much love for you, Zainab. — Haider 💕";
const EASTER_EGG_TAPS = 5;

function getLevelIndexForScore(s) {
  if (s < LEVELS[1].min) return 0;
  if (s < LEVELS[2].min) return 1;
  if (s < LEVELS[3].min) return 2;
  if (s < LEVELS[4].min) return 3;
  return 4;
}

function updateLevelAndProgress() {
  if (!levelLabelEl || !levelProgressFill) return;
  const prevIndex = currentLevelIndex;
  const newIndex = getLevelIndexForScore(score);
  currentLevelIndex = newIndex;
  const lvl = LEVELS[newIndex];
  levelLabelEl.textContent = lvl.label;
  const min = lvl.min;
  const max = lvl.max;
  let progress = 1;
  if (newIndex < LEVELS.length - 1) {
    progress = Math.max(0, Math.min(1, (score - min) / (max - min)));
  }
  levelProgressFill.style.width = (progress * 100) + '%';
  if (newIndex > prevIndex) {
    // Queue all levels crossed
    for (let i = prevIndex + 1; i <= newIndex; i++) {
      const levelNumber = i + 1; // level 2..5
      enqueueAchievement('level-' + levelNumber);
    }
  }
}

function checkScoreMilestones() {
  if (!celebration50Shown && score >= CELEBRATION_50_SCORE) {
    celebration50Shown = true;
    enqueueAchievement('celebration');
  }
  if (!secretShownThisGame && score >= SECRET_SCORE) {
    secretShownThisGame = true;
    enqueueAchievement('secret-main');
  }
  if (!haider150Shown && score >= HAIDER_150_SCORE) {
    haider150Shown = true;
    enqueueAchievement('message-haider');
  }
  if (!secretEndingShown && score >= SECRET_ENDING_SCORE) {
    secretEndingShown = true;
    enqueueAchievement('heart-queen');
  }
  if (!quoteSecretShownThisGame && score >= QUOTE_OVERLAY_SCORE) {
    quoteSecretShownThisGame = true;
    enqueueAchievement('kite-runner');
  }
  if (!teaser1500Shown && score >= TEASER_SCORE) {
    teaser1500Shown = true;
    enqueueAchievement('teaser-1500');
  }
  if (!secret4000Shown && score >= SECRET_UNLOCK_SCORE) {
    secret4000Shown = true;
    enqueueAchievement('secret-4000');
  }
  if (score >= HEART_RAIN_RANDOM_SCORE && !isHeartRainActive()) {
    const now = Date.now();
    if (now - lastRandomHeartRainTime > HEART_RAIN_RANDOM_COOLDOWN_MS && Math.random() < 0.05) {
      lastRandomHeartRainTime = now;
      startHeartRain();
    }
  }
}

function showScreen(screen) {
  startScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function getSpeedLevel() {
  return Math.min(5, Math.floor(score / SPEED_UP_EVERY_POINTS));
}

function getCurrentSpeed() {
  const level = getSpeedLevel();
  const extra = (score % SPEED_UP_EVERY_POINTS) / SPEED_UP_EVERY_POINTS;
  const base = BASE_FALL_SPEED + level * 0.6 + extra * 0.6;
  return Math.min(MAX_FALL_SPEED, base);
}

function showFloatingMessage(text) {
  if (floatingMessageTimeout) clearTimeout(floatingMessageTimeout);
  floatingMessageEl.textContent = text;
  floatingMessageEl.classList.remove('hidden');
  floatingMessageTimeout = setTimeout(() => {
    floatingMessageEl.classList.add('hidden');
  }, 1500);
}

function hapticCatch() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
}

function ensureAudioInitialized() {
  if (audioInitialized) return;
  audioInitialized = true;
  if (bgMusicEl && !isMuted) {
    try {
      bgMusicEl.volume = 0.35;
      bgMusicEl.play().catch(() => {});
    } catch (_) {}
  }
}

function playSfx(el) {
  if (!el || isMuted) return;
  try {
    el.currentTime = 0;
    el.play();
  } catch (_) {}
}

function toggleAudio() {
  isMuted = !isMuted;
  if (audioToggleBtn) {
    audioToggleBtn.classList.toggle('muted', isMuted);
    audioToggleBtn.textContent = isMuted ? '🔇' : '🔊';
  }
  [sfxCatchEl, sfxTapEl, sfxGoldenEl, sfxComboEl, sfxHeartRainEl, bgMusicEl].forEach(a => {
    if (a) a.muted = isMuted;
  });
  if (bgMusicEl && !isMuted && audioInitialized) {
    try { bgMusicEl.play().catch(() => {}); } catch (_) {}
  }
}

function getBestScore() {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
  } catch (_) { return 0; }
}

function setBestScore(n) {
  try { localStorage.setItem(BEST_SCORE_KEY, String(n)); } catch (_) {}
}

function updateBestScoreDisplay() {
  const best = getBestScore();
  if (best > 0) {
    bestScoreEl.textContent = 'Best: ' + best;
    bestScoreEl.classList.remove('hidden');
  } else {
    bestScoreEl.textContent = '';
    bestScoreEl.classList.add('hidden');
  }
}

function playCatchBurst(clientX, clientY) {
  catchBurstEl.innerHTML = '';
  catchBurstEl.classList.remove('hidden');
  const symbols = ['❤️', '💕', '✨', '💖'];
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('span');
    s.className = 'burst-piece';
    s.textContent = symbols[i % symbols.length];
    s.style.setProperty('--angle', (i * 45) + 'deg');
    catchBurstEl.appendChild(s);
  }
  catchBurstEl.style.left = clientX + 'px';
  catchBurstEl.style.top = clientY + 'px';
  setTimeout(() => {
    catchBurstEl.classList.add('hidden');
    catchBurstEl.innerHTML = '';
  }, 600);
}

function updateBasketPosition() {
  const maxX = 100 - BASKET_WIDTH;
  basketX = Math.max(0, Math.min(maxX, basketX));
  basket.style.left = basketX + '%';
}

function isHeartRainActive() {
  return Date.now() < heartRainEndTime;
}

function spawnHeart() {
  if (!gameRunning) return;
  const isZainab = !isHeartRainActive() && Math.random() < ZAINAB_HEART_CHANCE;
  if (isZainab) {
    spawnZainabHeart();
    return;
  }
  const heart = document.createElement('div');
  heart.className = 'heart';
  const isGolden = Math.random() < GOLDEN_HEART_CHANCE;
  if (isGolden) {
    heart.classList.add('golden-heart');
    heart.innerHTML = '💛';
  } else {
    heart.innerHTML = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  }
  const isSpecial = !isGolden && Math.random() < 0.4;
  if (isSpecial) {
    heart.classList.add('special');
    heart.dataset.message = CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)];
  }
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: speed + Math.random() * 0.35,
    message: heart.dataset.message || null,
    isGolden: isGolden
  });
}

function spawnZainabHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart zainab-heart';
  heart.textContent = 'Z';
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: speed + Math.random() * 0.35,
    message: null,
    isGolden: false,
    isZainabHeart: true
  });
}

function spawnRainHeart() {
  if (!gameRunning || !isHeartRainActive()) return;
  const heart = document.createElement('div');
  heart.className = 'heart rain-heart';
  heart.innerHTML = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  const x = Math.random() * 100;
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: 4.5 + Math.random() * 1.5,
    message: null,
    isGolden: false,
    isRainHeart: true
  });
}

function startHeartRain() {
  catchStreak = 0;
  heartRainEndTime = Date.now() + HEART_RAIN_DURATION_MS;
  showFloatingMessage('💞 Heart Rain!');
  if (gameAreaEl) gameAreaEl.classList.add('heart-rain');
  if (heartRainSparkles) {
    heartRainSparkles.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const s = document.createElement('span');
      s.className = 'rain-sparkle';
      s.textContent = '✨';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 0.5 + 's';
      heartRainSparkles.appendChild(s);
    }
    heartRainSparkles.classList.remove('hidden');
  }
  clearInterval(spawnInterval);
  heartRainInterval = setInterval(() => {
    if (!isHeartRainActive()) {
      clearInterval(heartRainInterval);
      heartRainInterval = null;
      if (gameAreaEl) gameAreaEl.classList.remove('heart-rain');
      if (heartRainSparkles) heartRainSparkles.classList.add('hidden');
      spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
      return;
    }
    spawnRainHeart();
  }, HEART_RAIN_SPAWN_MS);
}

function showZainabHeartFound() {
  pauseGame();
  addScore(ZAINAB_BONUS);
  if (score > getBestScore()) {
    setBestScore(score);
    updateBestScoreDisplay();
  }
  showComboSparkle();
  if (zainabHeartOverlay) zainabHeartOverlay.classList.remove('hidden');
}

function resumeAfterZainabHeart() {
  if (zainabHeartOverlay) zainabHeartOverlay.classList.add('hidden');
  resumeGame();
}

function showHaider150Message() {
  pauseGame();
  markAchievementShown();
  if (haider150Overlay) haider150Overlay.classList.remove('hidden');
}

function resumeAfterHaider150() {
  if (haider150Overlay) haider150Overlay.classList.add('hidden');
  achievementShowing = false;
  resumeGame();
}

function spawnGlitterHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart special glitter-heart';
  heart.innerHTML = '✨💖✨';
  heart.dataset.message = KITE_RUNNER_QUOTE;
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: speed + Math.random() * 0.35,
    message: KITE_RUNNER_QUOTE,
    isGlitterHeart: true
  });
}

function checkCollision(heart) {
  const heartRect = heart.element.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  const heartCenterX = (heartRect.left + heartRect.right) / 2;
  const heartBottom = heartRect.bottom;
  const basketTop = basketRect.top;
  const basketLeft = basketRect.left;
  const basketRight = basketRect.right;
  if (heartBottom >= basketTop - 10 && heartBottom <= basketTop + 30) {
    if (heartCenterX >= basketLeft && heartCenterX <= basketRight) {
      return true;
    }
  }
  return false;
}

function addScore(pts) {
  const mult = (Date.now() < loveBoostEndTime) ? 2 : 1;
  score += pts * mult;
  scoreEl.textContent = score;
  updateLevelAndProgress();
  checkScoreMilestones();
}

function removeHeart(heart, caught) {
  const idx = hearts.indexOf(heart);
  if (idx > -1) hearts.splice(idx, 1);
  if (caught) {
    const rect = heart.element.getBoundingClientRect();
    playCatchBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  heart.element.remove();
  if (!caught) {
    if (heart.isRainHeart) return;
    catchStreak = 0;
    lives++;
    livesEl.textContent = lives;
    if (lives >= MAX_LIVES - 1) livesDisplay.classList.add('warning');
    if (lives >= MAX_LIVES) endGame();
  }
}

function showComboSparkle() {
  if (!comboSparkleEl) return;
  comboSparkleEl.innerHTML = '✨✨✨';
  comboSparkleEl.classList.remove('hidden');
  setTimeout(() => {
    comboSparkleEl.classList.add('hidden');
    comboSparkleEl.innerHTML = '';
  }, 700);
}

function markAchievementShown() {
  lastAchievementTime = Date.now();
}

function canShowAchievement() {
  return Date.now() - lastAchievementTime > ACHIEVEMENT_COOLDOWN_MS;
}

function enqueueAchievement(id) {
  if (!achievementQueue.includes(id)) {
    achievementQueue.push(id);
  }
}

function showLevelPopup(message) {
  if (!levelPopupEl) {
    achievementShowing = false;
    return;
  }
  levelPopupEl.textContent = message;
  levelPopupEl.classList.remove('hidden');
  levelPopupEl.classList.add('show');
  markAchievementShown();
  setTimeout(() => {
    levelPopupEl.classList.remove('show');
    levelPopupEl.classList.add('hidden');
    achievementShowing = false;
  }, 2300);
}

function processAchievementQueue() {
  if (achievementShowing) return;
  if (!canShowAchievement()) return;
  if (!achievementQueue.length) return;
  const id = achievementQueue.shift();
  achievementShowing = true;
  switch (id) {
    case 'celebration':
      showCelebration50();
      break;
    case 'secret-main':
      showSecretUnlocked();
      break;
    case 'message-haider':
      showHaider150Message();
      break;
    case 'heart-queen':
      showSecretEnding();
      break;
    case 'kite-runner':
      showQuoteSecret();
      break;
    case 'level-2':
      showLevelPopup('✨ Level Up! Heart Catcher');
      break;
    case 'level-3':
      showLevelPopup('💖 Level Up! Love Collector');
      break;
    case 'level-4':
      showLevelPopup('🌸 Zainab Mode Activated!');
      break;
    case 'level-5':
      showLevelPopup('👑 Heart Queen Level');
      break;
    case 'teaser-1500':
      showLevelPopup('🔒 Something special is coming…');
      break;
    case 'secret-4000':
      showLevelPopup('💌 Secret Message from Haider Unlocked');
      break;
    default:
      achievementShowing = false;
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
  hearts.forEach(h => h.element.remove());
  hearts = [];
  finalScoreEl.textContent = score;
  if (score > getBestScore()) setBestScore(score);
  showScreen(gameOverScreen);
  fillGameOverHearts();
}

function pauseGameForOverlay() {
  secretShownThisGame = true;
  gameRunning = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
}

function resumeAfterSecret() {
  secretOverlayEl.classList.add('hidden');
  achievementShowing = false;
  gameRunning = true;
  spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function showSecretUnlocked() {
  pauseGameForOverlay();
  markAchievementShown();
  if (secretOverlayEl) secretOverlayEl.classList.remove('hidden');
}

function showQuoteSecret() {
  quoteSecretShownThisGame = true;
  pauseGameForOverlay();
  markAchievementShown();
  if (quoteSecretOverlayEl) quoteSecretOverlayEl.classList.remove('hidden');
}

function resumeAfterQuoteSecret() {
  if (quoteSecretOverlayEl) quoteSecretOverlayEl.classList.add('hidden');
  achievementShowing = false;
  resumeGame();
}

function pauseGame() {
  gameRunning = false;
  if (spawnInterval) clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
}

function showCelebration50() {
  pauseGame();
  markAchievementShown();
  if (celebration50El) {
    const stars = celebration50El.querySelector('.celebration-stars');
    if (stars) {
      stars.innerHTML = '';
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('span');
        s.className = 'star-float';
        s.textContent = '✨';
        s.style.left = Math.random() * 100 + '%';
        s.style.animationDelay = Math.random() * 0.5 + 's';
        stars.appendChild(s);
      }
    }
    celebration50El.classList.remove('hidden');
  }
}

function resumeAfterCelebration50() {
  if (celebration50El) celebration50El.classList.add('hidden');
  achievementShowing = false;
  resumeGame();
}

function showSecretEnding() {
  pauseGame();
  markAchievementShown();
  if (secretEndingOverlay) secretEndingOverlay.classList.remove('hidden');
}

function resumeAfterSecretEnding() {
  if (secretEndingOverlay) secretEndingOverlay.classList.add('hidden');
  achievementShowing = false;
  resumeGame();
}

function resumeGame() {
  gameRunning = true;
  if (!isHeartRainActive()) {
    spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
  }
  gameLoopId = requestAnimationFrame(gameLoop);
}

function onHeartTapped(heartObj) {
  lastInteractionTime = Date.now();
  if (heartObj.isZainabHeart) {
    showZainabHeartFound();
    removeHeart(heartObj, true);
    return;
  }
  if (heartObj.isRainHeart) {
    addScore(HEART_RAIN_POINTS);
    playSfx(sfxHeartRainEl);
    removeHeart(heartObj, true);
    return;
  }
  catchStreak++;
  if (catchStreak === HEART_RAIN_COMBO) {
    addScore(heartObj.isGolden ? GOLDEN_POINTS : TAP_POINTS);
    startHeartRain();
    playSfx(sfxHeartRainEl);
    removeHeart(heartObj, true);
    return;
  }
  const pts = heartObj.isGolden ? GOLDEN_POINTS : TAP_POINTS;
  addScore(pts);
  if (catchStreak === COMBO_COUNT) {
    addScore(COMBO_BONUS);
    playSfx(sfxComboEl);
    if (score >= MIN_SCORE_FOR_COMBO_MSG) {
      showFloatingMessage(COMBO_MESSAGE);
      showComboSparkle();
    }
  } else if (heartObj.isGolden) {
    showFloatingMessage(GOLDEN_MESSAGE);
    playSfx(sfxGoldenEl);
  } else if (heartObj.isGlitterHeart) {
    showFloatingMessage(KITE_RUNNER_QUOTE);
  } else if (score >= MIN_SCORE_FOR_FLOATING_MSG && Math.random() < 0.22) {
    showFloatingMessage(CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)]);
  }
  hapticCatch();
  playSfx(sfxTapEl);
  if (score > getBestScore()) {
    setBestScore(score);
    updateBestScoreDisplay();
  }
  removeHeart(heartObj, true);
}

function gameLoop() {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  processAchievementQueue();
  if (score >= nextGlitterAtScore) {
    nextGlitterAtScore += QUOTE_SCORE_MILESTONE;
    spawnGlitterHeart();
  }
  if (!idleMessageShown && Date.now() - lastInteractionTime > IDLE_SEC * 1000) {
    idleMessageShown = true;
    showFloatingMessage(IDLE_MESSAGE);
  }
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    heart.y += heart.speed;
    heart.element.style.top = heart.y + 'px';
    if (gameMode === 'basket' && checkCollision(heart)) {
      catchStreak++;
      if (heart.isZainabHeart) {
        showZainabHeartFound();
        removeHeart(heart, true);
        continue;
      }
      if (heart.isRainHeart) {
        addScore(HEART_RAIN_POINTS);
        playSfx(sfxHeartRainEl);
        removeHeart(heart, true);
        continue;
      }
      if (catchStreak === HEART_RAIN_COMBO) {
        addScore(heart.isGolden ? GOLDEN_POINTS : POINTS_PER_HEART);
        startHeartRain();
        playSfx(sfxHeartRainEl);
        removeHeart(heart, true);
        continue;
      }
      const pts = heart.isGolden ? GOLDEN_POINTS : POINTS_PER_HEART;
      addScore(pts);
      const showMsg = score >= MIN_SCORE_FOR_FLOATING_MSG;
      const showComboPopup = score >= MIN_SCORE_FOR_COMBO_MSG;
      if (catchStreak === COMBO_COUNT) {
        addScore(COMBO_BONUS);
        if (showComboPopup) {
          showFloatingMessage(COMBO_MESSAGE);
          showComboSparkle();
        }
      } else if (heart.isGolden) {
        showFloatingMessage(GOLDEN_MESSAGE);
        playSfx(sfxGoldenEl);
      } else if (heart.isGlitterHeart) {
        showFloatingMessage(KITE_RUNNER_QUOTE);
      } else if (bestScoreAtStartOfGame > 0 && score > bestScoreAtStartOfGame && !newBestShownThisGame) {
        newBestShownThisGame = true;
        showFloatingMessage('New best! 🎉');
      } else if (showMsg && heart.message) {
        showFloatingMessage(heart.message);
      } else if (showMsg) {
        const comboMsg = COMBO_MESSAGES.find(([n]) => n === catchStreak);
        if (comboMsg) showFloatingMessage(comboMsg[1]);
        else if (Math.random() < 0.2) showFloatingMessage(CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)]);
      }
      hapticCatch();
      playSfx(heart.isGolden ? sfxGoldenEl : sfxCatchEl);
      if (score > getBestScore()) {
        setBestScore(score);
        updateBestScoreDisplay();
      }
      removeHeart(heart, true);
      continue;
    }
    if (heart.y > rect.height) {
      if (!heart.isRainHeart) removeHeart(heart, false);
      else removeHeart(heart, false);
    }
  }
  gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame(mode) {
  gameMode = mode || 'basket';
  score = 0;
  lives = 0;
  catchStreak = 0;
  nextGlitterAtScore = QUOTE_SCORE_MILESTONE;
  bestScoreAtStartOfGame = getBestScore();
  newBestShownThisGame = false;
  secretShownThisGame = false;
  quoteSecretShownThisGame = false;
  celebration50Shown = false;
  secretEndingShown = false;
  haider150Shown = false;
   teaser1500Shown = false;
   secret4000Shown = false;
   achievementQueue = [];
   achievementShowing = false;
   lastAchievementTime = 0;
   currentLevelIndex = 0;
  idleMessageShown = false;
  lastInteractionTime = Date.now();
  loveBoostEndTime = 0;
  heartRainEndTime = 0;
  if (heartRainInterval) clearInterval(heartRainInterval);
  heartRainInterval = null;
  if (secretOverlayEl) secretOverlayEl.classList.add('hidden');
  if (quoteSecretOverlayEl) quoteSecretOverlayEl.classList.add('hidden');
  if (celebration50El) celebration50El.classList.add('hidden');
  if (secretEndingOverlay) secretEndingOverlay.classList.add('hidden');
  if (zainabHeartOverlay) zainabHeartOverlay.classList.add('hidden');
  if (haider150Overlay) haider150Overlay.classList.add('hidden');
  if (loveBoostIndicator) loveBoostIndicator.classList.add('hidden');
  if (gameAreaEl) gameAreaEl.classList.remove('heart-rain');
  if (heartRainSparkles) heartRainSparkles.classList.add('hidden');
  scoreEl.textContent = '0';
  livesEl.textContent = '0';
  livesDisplay.classList.remove('warning');
  updateLevelAndProgress();
  gameRunning = true;
  basketX = 50;
  updateBasketPosition();
  gameScreen.classList.toggle('tap-mode', gameMode === 'tap');
  if (isNightMode()) {
    document.body.classList.add('night-mode');
    if (nightModeMsg) nightModeMsg.classList.remove('hidden');
  } else {
    document.body.classList.remove('night-mode');
    if (nightModeMsg) nightModeMsg.classList.add('hidden');
  }
  showScreen(gameScreen);
  updateBestScoreDisplay();
  spawnHeart();
  spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function isNightMode() {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 6;
}

// Start screen floating hearts
function fillStartHearts() {
  const container = document.getElementById('start-hearts');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('span');
    h.className = 'start-heart';
    h.textContent = HEARTS[i % HEARTS.length];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDelay = Math.random() * 4 + 's';
    h.style.animationDuration = (4 + Math.random() * 3) + 's';
    container.appendChild(h);
  }
}

function fillGameOverHearts() {
  const container = document.getElementById('gameover-hearts');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('span');
    h.className = 'gameover-heart';
    h.textContent = HEARTS[i % HEARTS.length];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(h);
  }
}

fillStartHearts();

// Easter egg: tap title 5 times
const titleEl = document.getElementById('game-title');
const easterEggEl = document.getElementById('easter-egg-msg');
if (titleEl && easterEggEl) {
  let tapCount = 0;
  let tapReset = null;
  titleEl.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapReset);
    tapReset = setTimeout(() => { tapCount = 0; }, 800);
    if (tapCount >= EASTER_EGG_TAPS) {
      tapCount = 0;
      easterEggEl.textContent = EASTER_EGG_MESSAGE;
      easterEggEl.classList.remove('hidden');
      setTimeout(() => easterEggEl.classList.add('hidden'), 5000);
    }
  });
}

// Controls (basket mode only)
document.addEventListener('keydown', (e) => {
  if (!gameRunning || gameMode !== 'basket') return;
  if (e.key === 'ArrowLeft') {
    basketX -= 8;
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    basketX += 8;
    e.preventDefault();
  }
  updateBasketPosition();
});

gameArea.addEventListener('mousemove', (e) => {
  if (!gameRunning || gameMode !== 'basket') return;
  lastInteractionTime = Date.now();
  const rect = gameArea.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  basketX = x - BASKET_WIDTH / 2;
  updateBasketPosition();
});

gameArea.addEventListener('touchmove', (e) => {
  if (!gameRunning || !e.touches.length) return;
  if (gameMode === 'basket') {
    e.preventDefault();
    lastInteractionTime = Date.now();
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    basketX = x - BASKET_WIDTH / 2;
    updateBasketPosition();
  }
}, { passive: false });

function updateCursorHeart(x, y) {
  if (!cursorHeartEl || !startScreen || startScreen.classList.contains('hidden')) return;
  cursorHeartEl.style.left = x + 'px';
  cursorHeartEl.style.top = y + 'px';
}
document.addEventListener('mousemove', (e) => updateCursorHeart(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
  if (e.touches.length) updateCursorHeart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

if (btnBasketMode) btnBasketMode.addEventListener('click', () => { ensureAudioInitialized(); startGame('basket'); });
if (btnTapMode) btnTapMode.addEventListener('click', () => { ensureAudioInitialized(); startGame('tap'); });
restartBtn.addEventListener('click', () => startGame(gameMode));
if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => {
  gameRunning = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
  hearts.forEach(h => h.element.remove());
  hearts = [];
  showScreen(startScreen);
  fillStartHearts();
});
if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
if (secretContinueBtn) secretContinueBtn.addEventListener('click', resumeAfterSecret);
if (quoteSecretContinueBtn) quoteSecretContinueBtn.addEventListener('click', resumeAfterQuoteSecret);
if (celebration50Btn) celebration50Btn.addEventListener('click', resumeAfterCelebration50);
if (secretEndingBtn) secretEndingBtn.addEventListener('click', resumeAfterSecretEnding);
if (zainabHeartContinueBtn) zainabHeartContinueBtn.addEventListener('click', resumeAfterZainabHeart);
if (haider150ContinueBtn) haider150ContinueBtn.addEventListener('click', resumeAfterHaider150);

if (secretMsgBtn) secretMsgBtn.addEventListener('click', () => { if (secretMsgModal) secretMsgModal.classList.remove('hidden'); });
if (secretMsgClose) secretMsgClose.addEventListener('click', () => { if (secretMsgModal) secretMsgModal.classList.add('hidden'); });

if (heartsContainer) {
  heartsContainer.addEventListener('click', (e) => {
    if (gameMode !== 'tap' || !gameRunning) return;
    const el = e.target.closest('.heart');
    if (!el) return;
    lastInteractionTime = Date.now();
    const heartObj = hearts.find(h => h.element === el);
    if (heartObj) onHeartTapped(heartObj);
  });
  heartsContainer.addEventListener('touchend', (e) => {
    if (gameMode !== 'tap' || !gameRunning) return;
    const el = e.target.closest('.heart');
    if (!el) return;
    e.preventDefault();
    lastInteractionTime = Date.now();
    const heartObj = hearts.find(h => h.element === el);
    if (heartObj) onHeartTapped(heartObj);
  }, { passive: false });
}

gameArea.addEventListener('touchstart', (e) => {
  if (!gameRunning) return;
  lastInteractionTime = Date.now();
  const now = Date.now();
  if (now - lastTapTime < 350) {
    lastTapTime = 0;
    loveBoostEndTime = Date.now() + LOVE_BOOST_DURATION_MS;
    showFloatingMessage(LOVE_BOOST_MESSAGE);
    if (loveBoostIndicator) {
      loveBoostIndicator.classList.remove('hidden');
      setTimeout(() => loveBoostIndicator.classList.add('hidden'), LOVE_BOOST_DURATION_MS);
    }
  } else {
    lastTapTime = now;
  }
}, { passive: true });
