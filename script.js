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
let lastLoveBoostTime = 0;
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
let slowMotionEndTime = 0;
let zainabSkyEventShown = false;
let magnetEndTime = 0;
let skyFillShownThisGame = false;
let windEndTime = 0;
let windDirection = 1;
let lastWindCheckTime = 0;
let pendingMisses = [];
let consecutiveMisses = 0;
let bonusHeartSpawnRemaining = 0;
let shieldCharges = 0;
let currentComboMultiplier = 1;
let birthdayFireworksScoreShown = false;
let birthdaySecretShownThisGame = false;
let birthdayFirstCatchShown = false;
let birthdayStartShownThisSession = false;
let lastEmptyHeartsTime = 0;

const SECRET_SCORE = 600;
const MISS_GRACE_MS = 350;
const CLOSE_CATCH_PX = 10;
const MAX_HEARTS_FOR_MISS = 5;
const CONSECUTIVE_MISSES_FOR_BONUS = 3;
const BONUS_SPAWN_REMAINING_COUNT = 6;
const SKY_FILL_SCORE = 3000;
const SKY_FILL_RAIN_MS = 2000;
const ZAINAB_SKY_SCORE = 1500;
const ZAINAB_HEART_CHANCE = 1 / 100;
const MYSTERY_HEART_CHANCE = 1 / 25;
const MYSTERY_BONUS_POINTS = 50;
const BROWN_HEART_CHANCE = 1 / 30;
const BROWN_BONUS_POINTS = 100;
const MAGNET_HEART_CHANCE = 1 / 40;
const MAGNET_DURATION_MS = 5000;
const BROKEN_HEART_CHANCE = 1 / 16;
const BROKEN_HEART_PENALTY = 50;
const SHIELD_HEART_CHANCE = 1 / 45;
const ZIGZAG_MIN_SCORE = 1200;
const ZIGZAG_CHANCE = 0.28;
const WIND_DURATION_MS = 4000;
const WIND_COOLDOWN_MS = 38000;
const WIND_DRIFT = 0.38;
const WIND_MIN_SCORE = 150;
const WIND_CHECK_INTERVAL_MS = 2500;
const WIND_CHANCE = 0.07;
const MYSTERY_DOUBLE_SCORE_MS = 5000;
const SLOW_MOTION_DURATION_MS = 5000;
const ZAINAB_BONUS = 100;
const HEART_RAIN_COMBO = 6;
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
const HEART_RAIN_RANDOM_SCORE = 3200;
const HEART_RAIN_RANDOM_COOLDOWN_MS = 70000;

// Birthday mode
const BIRTHDAY_FIREWORKS_SCORE = 2000;
const BIRTHDAY_SECRET_SCORE = 3000;
const BIRTHDAY_GIFT_HEART_CHANCE = 1 / 28;
const BIRTHDAY_CAKE_HEART_CHANCE = 1 / 30;
const BIRTHDAY_BALLOON_HEART_CHANCE = 0.18;

// Late curve hearts
const LATE_CURVE_CHANCE = 0.18;
const DELAYED_HEART_CHANCE = 0.12;
const FAKE_DIRECTION_CHANCE = 0.14;

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
const btnCatchHeartsMode = document.getElementById('btn-catch-hearts-mode');
const btnTableTennisMode = document.getElementById('btn-table-tennis-mode');
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
const magnetIndicator = document.getElementById('magnet-indicator');
const windIndicator = document.getElementById('wind-indicator');
const shieldIndicator = document.getElementById('shield-indicator');
const comboIndicator = document.getElementById('combo-indicator');
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
const birthdayBanner = document.getElementById('birthday-banner');
const birthdayConfettiEl = document.getElementById('birthday-confetti');
const birthdayFireworksLayer = document.getElementById('birthday-fireworks-layer');
const birthdayStartOverlay = document.getElementById('birthday-start-overlay');
const birthdayStartContinueBtn = document.getElementById('birthday-start-continue-btn');
const birthdaySecretOverlay = document.getElementById('birthday-secret-overlay');
const birthdaySecretContinueBtn = document.getElementById('birthday-secret-continue-btn');
const introMessageEl = document.getElementById('intro-message');
const tableTennisScreen = document.getElementById('table-tennis-screen');
const ttCanvas = document.getElementById('tt-canvas');
const ttScoreEl = document.getElementById('tt-score');
const ttBackBtn = document.getElementById('tt-back-btn');
const ttRestartBtn = document.getElementById('tt-restart-btn');
const ttFooter = document.getElementById('tt-footer');
const ttResultOverlay = document.getElementById('tt-result-overlay');
const ttResultTitle = document.getElementById('tt-result-title');
const ttResultSubtitle = document.getElementById('tt-result-subtitle');
const ttResultContinueBtn = document.getElementById('tt-result-continue-btn');

const BASKET_WIDTH = 12;
const HEART_SPAWN_MIN = 14;
const HEART_SPAWN_MAX = 86;
const HEART_EDGE_MARGIN = 6;
const MAX_LIVES = 3;
const POINTS_PER_HEART = 5;
const TAP_POINTS = 5;
const GOLDEN_POINTS = 50;
const GOLDEN_HEART_CHANCE = 1 / 24;
const COMBO_COUNT = 3;
const COMBO_BONUS = 25;
const COMBO_X2_THRESHOLD = 12;
const COMBO_X3_THRESHOLD = 24;
const COMBO_X4_THRESHOLD = 36;
const IDLE_SEC = 6;
const LOVE_BOOST_DURATION_MS = 7000;
const SECRET_ENDING_SCORE = 2200;
const CELEBRATION_50_SCORE = 300;
const MIN_SCORE_FOR_FLOATING_MSG = 28;
const MIN_SCORE_FOR_COMBO_MSG = 25;
const BASE_FALL_SPEED = 3.2;
const MAX_FALL_SPEED = 5.8;
const SPEED_UP_EVERY_POINTS = 30;
const SPAWN_RATE_MS = 1200;
const BEST_SCORE_KEY = 'zgame_best_score';

const TAGLINES = [
  'Every heart is for you 💕',
  'Made with love by Haider',
  'For Zainab only ✨'
];
const EASTER_EGG_MESSAGE = "You found it! Made with so much love for you, Zainab. — Haider 💕";
const EASTER_EGG_TAPS = 5;

function isBirthdayWeek() {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan
  const day = now.getDate();
  // Enable from March 1–17 (inclusive)
  return month === 2 && day <= 17;
}

function isBirthdayToday() {
  const now = new Date();
  return now.getMonth() === 2 && now.getDate() === 17;
}

const birthdayMode = isBirthdayWeek();
const birthdayToday = isBirthdayToday();

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
  if (!zainabSkyEventShown && score >= ZAINAB_SKY_SCORE) {
    zainabSkyEventShown = true;
    triggerZainabSkyEvent();
  }
  if (!secret4000Shown && score >= SECRET_UNLOCK_SCORE) {
    secret4000Shown = true;
    enqueueAchievement('secret-4000');
  }
  // Sky fill/extra heart rain disabled above 3000 to keep late-game flow simple
  if (birthdayMode && !birthdayFireworksScoreShown && score >= BIRTHDAY_FIREWORKS_SCORE) {
    birthdayFireworksScoreShown = true;
    showFloatingMessage('🎆 Birthday Celebration!');
    startBirthdayFireworks(3000);
  }
  if (birthdayMode && !birthdaySecretShownThisGame && score >= BIRTHDAY_SECRET_SCORE) {
    birthdaySecretShownThisGame = true;
    pauseGame();
    markAchievementShown();
    if (birthdaySecretOverlay) birthdaySecretOverlay.classList.remove('hidden');
  }
  if (score >= HEART_RAIN_RANDOM_SCORE && !isHeartRainActive()) {
    const now = Date.now();
    if (score < 3000 && now - lastRandomHeartRainTime > HEART_RAIN_RANDOM_COOLDOWN_MS && Math.random() < 0.02) {
      lastRandomHeartRainTime = now;
      startHeartRain();
    }
  }
}

var ZAINAB_PARTICLES = ['💖', '💕', '✨', '💗', '💘', '✨', '💖', '💕'];

function triggerZainabSkyEvent() {
  showFloatingMessage('✨ Something magical is happening…');
  const container = document.getElementById('zainab-sky-formation');
  if (!container) return;
  container.innerHTML = '';
  const textEl = document.createElement('div');
  textEl.className = 'zainab-sky-text';
  textEl.setAttribute('aria-hidden', 'true');
  textEl.textContent = 'ZAINAB';
  container.appendChild(textEl);
  const particleWrap = document.createElement('div');
  particleWrap.className = 'zainab-sky-particles';
  const count = 52;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'zainab-sky-particle';
    p.textContent = ZAINAB_PARTICLES[i % ZAINAB_PARTICLES.length];
    p.style.left = (5 + Math.random() * 90) + '%';
    p.style.top = (2 + Math.random() * 55) + '%';
    p.style.animationDelay = (Math.random() * 2.5) + 's';
    p.style.animationDuration = (2 + Math.random() * 2) + 's';
    particleWrap.appendChild(p);
  }
  container.appendChild(particleWrap);
  container.classList.remove('hidden');
  container.classList.add('zainab-sky-show');
  setTimeout(() => {
    container.classList.remove('zainab-sky-show');
    setTimeout(() => {
      container.classList.add('hidden');
      container.innerHTML = '';
    }, 500);
  }, 3800);
}

function showScreen(screen) {
  startScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  if (tableTennisScreen) tableTennisScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function stopCatchHeartsMode() {
  gameRunning = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
  if (heartRainInterval) clearInterval(heartRainInterval);
  heartRainInterval = null;
  hearts.forEach(h => h.element.remove());
  hearts = [];
  pendingMisses = [];
  if (catchBurstEl) catchBurstEl.classList.add('hidden');
  if (floatingMessageEl) floatingMessageEl.classList.add('hidden');
}

// ---------------------------
// Heart Table Tennis Mode
// ---------------------------
let ttRunning = false;
let ttRaf = 0;
let ttLastTs = 0;
let ttPlayerScore = 0;
let ttAiScore = 0;
let ttPlayerX = 0;
let ttAiX = 0;
let ttTargetPlayerX = 0;
let ttBallX = 0;
let ttBallY = 0;
let ttBallVx = 0;
let ttBallVy = 0;
let ttBallSpeed = 460;
let ttAiMissBiasUntil = 0;
let ttAiDesiredX = 0;
let ttAiNextReactTime = 0;
let ttAiMissThisApproach = false;
let ttPlayerPaddleScale = 1;

function ttClamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function ttResetRound(direction) {
  if (!ttCanvas) return;
  const w = ttCanvas.width;
  const h = ttCanvas.height;
  ttBallX = w / 2;
  ttBallY = h / 2;
  ttBallSpeed = 420;
  ttAiMissThisApproach = false;
  ttAiNextReactTime = 0;
  ttAiDesiredX = w / 2;
  const dir = direction || (Math.random() < 0.5 ? -1 : 1); // -1 up, +1 down
  const angle = (Math.random() * 0.7 - 0.35);
  ttBallVy = Math.cos(angle) * ttBallSpeed * dir;
  ttBallVx = Math.sin(angle) * ttBallSpeed * (Math.random() < 0.5 ? -1 : 1);
}

function ttUpdateScoreUi() {
  if (!ttScoreEl) return;
  ttScoreEl.textContent = `Zainab ❤️ ${ttPlayerScore}  |  Haider 🤖 ${ttAiScore}`;
}

function ttShowResult(winner) {
  if (!ttResultOverlay || !ttResultTitle || !ttResultSubtitle) return;
  if (winner === 'player') {
    ttResultTitle.textContent = '🏆 Zainab Wins!';
    ttResultSubtitle.textContent = 'Table Tennis Champion!';
  } else {
    ttResultTitle.textContent = '🤖 Haider Wins!';
    ttResultSubtitle.textContent = 'Try Again!';
  }
  ttResultOverlay.classList.remove('hidden');
  if (ttFooter) ttFooter.classList.remove('hidden');
}

function ttHideResult() {
  if (ttResultOverlay) ttResultOverlay.classList.add('hidden');
  if (ttFooter) ttFooter.classList.add('hidden');
}

function ttStop() {
  ttRunning = false;
  cancelAnimationFrame(ttRaf);
  ttRaf = 0;
}

function ttStart() {
  if (!tableTennisScreen || !ttCanvas) return;
  stopCatchHeartsMode();
  ttStop();
  ttHideResult();
  if (ttFooter) ttFooter.classList.add('hidden');

  ttPlayerScore = 0;
  ttAiScore = 0;
  ttPlayerPaddleScale = 1;
  ttUpdateScoreUi();

  const h = ttCanvas.height;
  const w = ttCanvas.width;
  ttPlayerX = w / 2;
  ttAiX = w / 2;
  ttTargetPlayerX = w / 2;
  ttAiMissBiasUntil = 0;
  ttResetRound();

  showScreen(tableTennisScreen);
  ttRunning = true;
  ttLastTs = 0;
  ttRaf = requestAnimationFrame(ttLoop);
}

function ttWinCheck() {
  if (ttPlayerScore >= 5) { ttShowResult('player'); return true; }
  if (ttAiScore >= 5) { ttShowResult('ai'); return true; }
  return false;
}

function ttLoop(ts) {
  if (!ttRunning || !ttCanvas) return;
  const ctx = ttCanvas.getContext('2d');
  if (!ctx) return;

  const w = ttCanvas.width;
  const h = ttCanvas.height;
  const dt = Math.min(0.033, ttLastTs ? (ts - ttLastTs) / 1000 : 0);
  ttLastTs = ts;

  // Layout
  const paddleH = Math.max(12, Math.round(h * 0.035));     // thickness
  const basePaddleW = Math.max(90, Math.round(w * 0.26));     // length (narrower for more challenge)
  const playerPaddleW = Math.max(Math.round(basePaddleW * 0.5), Math.round(basePaddleW * ttPlayerPaddleScale));
  const aiPaddleW = basePaddleW;
  // Match heart mode basket placement: bottom margin + basket height
  const basketBottomPx = (h <= 760) ? 86 : 76;
  const basketHeightPx = (h <= 760) ? 40 : 50;
  const playerY = ttClamp(h - basketBottomPx - basketHeightPx, 8, h - paddleH - 4);
  const aiY = Math.max(12, Math.round(h * 0.035)); // top
  const ballR = Math.max(9, Math.round(w * 0.022));
  // Safety: never draw paddle off-canvas even if sizes change
  const safePlayerY = Math.min(playerY, h - paddleH - 4);

  // Player paddle follow (smooth)
  const playerSpeed = 1300;
  const pxTarget = ttClamp(ttTargetPlayerX - playerPaddleW / 2, 0, w - playerPaddleW);
  const px = ttClamp(ttPlayerX - playerPaddleW / 2, 0, w - playerPaddleW);
  const pxNew = px + (pxTarget - px) * (1 - Math.pow(0.0007, dt * playerSpeed));
  ttPlayerX = ttClamp(pxNew + playerPaddleW / 2, playerPaddleW / 2, w - playerPaddleW / 2);

  // AI paddle (slightly imperfect)
  const now = Date.now();
  const aiMaxSpeed = 620; // slightly slower than perfect
  const aiReaction = 0.10;
  // Random reaction delay (50–150ms)
  if (!ttAiNextReactTime || now >= ttAiNextReactTime) {
    const delay = 50 + Math.random() * 100;
    ttAiNextReactTime = now + delay;
    let aiAimX = ttBallX;
    if (now < ttAiMissBiasUntil) aiAimX += 170; // intentional miss window
    const aiErr = (Math.random() - 0.5) * 18;
    aiAimX += aiErr;
    ttAiDesiredX = ttClamp(aiAimX, aiPaddleW / 2, w - aiPaddleW / 2);
  }
  const aiDelta = (ttAiDesiredX - ttAiX);
  const aiMove = ttClamp(aiDelta * aiReaction, -aiMaxSpeed * dt, aiMaxSpeed * dt);
  ttAiX = ttClamp(ttAiX + aiMove, aiPaddleW / 2, w - aiPaddleW / 2);

  // Ball move
  ttBallX += ttBallVx * dt;
  ttBallY += ttBallVy * dt;

  // Wall bounce (left/right)
  if (ttBallX - ballR <= 0) { ttBallX = ballR; ttBallVx *= -1; }
  if (ttBallX + ballR >= w) { ttBallX = w - ballR; ttBallVx *= -1; }

  // Paddle collision helper (top/bottom paddles)
  function bounceFromPaddle(py, pxCenter, paddleWidth, isTop) {
    const pxLeft = pxCenter - paddleWidth / 2;
    const pxRight = pxCenter + paddleWidth / 2;
    if (ttBallX + ballR < pxLeft || ttBallX - ballR > pxRight) return false;
    if (isTop) {
      // ball moving up, hits top paddle underside
      if (ttBallY - ballR > py + paddleH) return false;
      if (ttBallVy < 0 && ttBallY - ballR <= py + paddleH) {
        ttBallY = py + paddleH + ballR;
      } else {
        return false;
      }
    } else {
      // bottom paddle
      if (ttBallY + ballR < py) return false;
      if (ttBallVy > 0 && ttBallY + ballR >= py) {
        ttBallY = py - ballR;
      } else {
        return false;
      }
    }
    // Speed increase per paddle hit: 5–10%, reset on point (ttResetRound)
    const speedMult = 1.05 + Math.random() * 0.05;
    ttBallSpeed = Math.min(980, ttBallSpeed * speedMult);

    // Angle variation: center -> straight, edges -> angled
    const offset = (ttBallX - pxCenter) / (paddleWidth / 2);
    const maxAngle = 0.9;
    const ang = offset * maxAngle;
    const dir = isTop ? 1 : -1; // after hit: top sends down (+y), bottom sends up (-y)
    ttBallVy = Math.cos(ang) * ttBallSpeed * dir;
    ttBallVx = Math.sin(ang) * ttBallSpeed;
    return true;
  }

  // Occasionally (5–10% of approaches) AI deliberately misses for fairness
  if (!ttAiMissThisApproach && ttBallVy < 0 && ttBallY < h * 0.45 && Math.random() < 0.08) {
    ttAiMissThisApproach = true;
    ttAiMissBiasUntil = Date.now() + 550;
  }

  bounceFromPaddle(aiY, ttAiX, aiPaddleW, true);
  bounceFromPaddle(safePlayerY, ttPlayerX, playerPaddleW, false);

  // Score (misses top/bottom)
  if (ttBallY + ballR < 0) {
    // Haider missed at top -> Zainab scores
    ttPlayerScore++;
    ttUpdateScoreUi();
    if (!ttWinCheck()) {
      if (Math.random() < 0.18) ttAiMissBiasUntil = Date.now() + 800;
      ttResetRound(1); // send down
    } else {
      ttStop();
    }
  } else if (ttBallY - ballR > h) {
    // Zainab missed at bottom -> Haider scores
    ttAiScore++;
    // Smaller paddle challenge: every 2 Haider points, shrink player paddle by 10% (min 50%)
    if (ttAiScore % 2 === 0) {
      ttPlayerPaddleScale = Math.max(0.5, ttPlayerPaddleScale * 0.9);
    }
    ttUpdateScoreUi();
    if (!ttWinCheck()) {
      if (Math.random() < 0.22) ttAiMissBiasUntil = Date.now() + 900;
      ttResetRound(-1); // send up
    } else {
      ttStop();
    }
  }

  // Draw
  ctx.clearRect(0, 0, w, h);

  // Background hearts (subtle)
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#c71585';
  for (let i = 0; i < 10; i++) {
    const sz = Math.max(22, Math.round(w * 0.08));
    ctx.font = `${sz}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji`;
    ctx.fillText('💖', (i * (w * 0.32) + w * 0.12) % w, (i * (h * 0.12) + h * 0.08) % h);
  }
  ctx.globalAlpha = 1;

  // Center line
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#c71585';
  for (let x = 10; x < w; x += 22) {
    ctx.fillRect(x, h / 2 - 2, 12, 4);
  }
  ctx.globalAlpha = 1;

  // Paddles
  ctx.fillStyle = '#ff69b4';
  ctx.strokeStyle = '#db7093';
  ctx.lineWidth = 3;
  function roundRect(x, y, rw, rh, r) {
    const rr = Math.min(r, rw / 2, rh / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + rw, y, x + rw, y + rh, rr);
    ctx.arcTo(x + rw, y + rh, x, y + rh, rr);
    ctx.arcTo(x, y + rh, x, y, rr);
    ctx.arcTo(x, y, x + rw, y, rr);
    ctx.closePath();
  }
  const pLeft = ttPlayerX - playerPaddleW / 2;
  const aLeft = ttAiX - aiPaddleW / 2;
  roundRect(pLeft, safePlayerY, playerPaddleW, paddleH, 12);
  ctx.fill(); ctx.stroke();
  roundRect(aLeft, aiY, aiPaddleW, paddleH, 12);
  ctx.fill(); ctx.stroke();

  // Ball (heart)
  const ballFont = Math.max(20, Math.round(w * 0.07));
  ctx.font = `${ballFont}px Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', ttBallX, ttBallY);

  ttRaf = requestAnimationFrame(ttLoop);
}

function ttHandlePointer(clientY) {
  if (!ttCanvas) return;
  const rect = ttCanvas.getBoundingClientRect();
  const y = (clientY - rect.top) / rect.height;
  // keep existing signature for backwards usage (no-op)
  void y;
}

function ttHandlePointerX(clientX) {
  if (!ttCanvas) return;
  const rect = ttCanvas.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  ttTargetPlayerX = ttClamp(x * ttCanvas.width, 0, ttCanvas.width);
}

function getSpeedLevel() {
  return Math.min(5, Math.floor(score / SPEED_UP_EVERY_POINTS));
}

function getCurrentSpeed() {
  const level = getSpeedLevel();
  const extra = (score % SPEED_UP_EVERY_POINTS) / SPEED_UP_EVERY_POINTS;
  const base = BASE_FALL_SPEED + level * 0.6 + extra * 0.6;
  const capped = Math.min(MAX_FALL_SPEED, base);
  return capped;
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

function playBrownBurst(clientX, clientY) {
  catchBurstEl.innerHTML = '';
  catchBurstEl.classList.remove('hidden');
  catchBurstEl.classList.add('brown-burst');
  const count = 7;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'burst-piece burst-piece-brown';
    s.textContent = '🤎';
    s.style.setProperty('--angle', (i * (360 / count)) + 'deg');
    catchBurstEl.appendChild(s);
  }
  catchBurstEl.style.left = clientX + 'px';
  catchBurstEl.style.top = clientY + 'px';
  setTimeout(() => {
    catchBurstEl.classList.remove('brown-burst');
    catchBurstEl.classList.add('hidden');
    catchBurstEl.innerHTML = '';
  }, 700);
}

function updateBasketPosition() {
  // basketX is the basket's CENTER in percent (CSS uses translateX(-50%))
  // Allow it to reach the edges (half the basket can go off-screen).
  basketX = Math.max(0, Math.min(100, basketX));
  basket.style.left = basketX + '%';
}

function isHeartRainActive() {
  return Date.now() < heartRainEndTime;
}

function spawnHeart() {
  if (!gameRunning) return;
  if (bonusHeartSpawnRemaining > 0 && !isHeartRainActive()) {
    bonusHeartSpawnRemaining--;
    if (Math.random() < 0.5) {
      bonusHeartSpawnRemaining = 0;
      consecutiveMisses = 0;
      if (Math.random() < 0.5) spawnMysteryHeart();
      else spawnBrownHeart();
      return;
    }
  }
  if (birthdayMode && !isHeartRainActive()) {
    if (Math.random() < BIRTHDAY_GIFT_HEART_CHANCE) {
      spawnBirthdayGiftHeart();
      return;
    }
    if (Math.random() < BIRTHDAY_CAKE_HEART_CHANCE) {
      spawnCakeHeart();
      return;
    }
  }
  const isZainab = !isHeartRainActive() && Math.random() < ZAINAB_HEART_CHANCE;
  if (isZainab) {
    spawnZainabHeart();
    return;
  }
  const isMystery = !isHeartRainActive() && Math.random() < MYSTERY_HEART_CHANCE;
  if (isMystery) {
    spawnMysteryHeart();
    return;
  }
  const isBrown = !isHeartRainActive() && Math.random() < BROWN_HEART_CHANCE;
  if (isBrown) {
    spawnBrownHeart();
    return;
  }
  const isShield = !isHeartRainActive() && Math.random() < SHIELD_HEART_CHANCE;
  if (isShield) {
    spawnShieldHeart();
    return;
  }
  const isMagnet = !isHeartRainActive() && Math.random() < MAGNET_HEART_CHANCE;
  if (isMagnet) {
    spawnMagnetHeart();
    return;
  }
  const isBroken = !isHeartRainActive() && Math.random() < BROKEN_HEART_CHANCE;
  if (isBroken) {
    spawnBrokenHeart();
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
  const useWobble = score >= ZIGZAG_MIN_SCORE && Math.random() < ZIGZAG_CHANCE;
  const isBalloon = birthdayMode && Math.random() < BIRTHDAY_BALLOON_HEART_CHANCE;
  const startY = isBalloon ? 60 : 0;
  if (isBalloon) {
    heart.classList.add('balloon-heart');
    heart.style.top = startY + 'px';
  }
  const obj = {
    element: heart,
    x: x,
    y: startY,
    speed: speed + Math.random() * 0.35,
    message: heart.dataset.message || null,
    isGolden: isGolden,
    isBalloonHeart: isBalloon,
    balloonPhase: isBalloon ? 'up' : null,
    lateCurve: Math.random() < LATE_CURVE_CHANCE,
    lateCurveDir: Math.random() < 0.5 ? -1 : 1
  };
  if (!isBalloon && Math.random() < DELAYED_HEART_CHANCE) {
    obj.delayedHeart = true;
    obj.delayEndTime = Date.now() + 650 + Math.random() * 500; // ~0.65–1.15s pause
    obj.delayBoosted = false;
  }
  if (!isBalloon && Math.random() < FAKE_DIRECTION_CHANCE) {
    obj.fakeDirHeart = true;
    obj.fakeDirDir = Math.random() < 0.5 ? -1 : 1;
    obj.fakeDirSwitched = false;
  }
  if (useWobble) {
    obj.wobble = true;
    obj.baseX = x;
    obj.wobbleAmplitude = 10 + Math.random() * 10;
    obj.wobblePhase = Math.random() * Math.PI * 2;
  }
  hearts.push(obj);
  // If the screen is too empty, gently top up with an extra heart.
  if (!isHeartRainActive() && hearts.length < 3) {
    setTimeout(() => {
      if (gameRunning && !isHeartRainActive() && hearts.length < 3) {
        spawnHeart();
      }
    }, SPAWN_RATE_MS * 0.5);
  }
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

function spawnMysteryHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart mystery-heart';
  heart.innerHTML = '💜';
  heart.title = 'Mystery!';
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
    isMysteryHeart: true
  });
}

function spawnBirthdayGiftHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart birthday-gift-heart';
  heart.innerHTML = '🎁';
  heart.title = 'Birthday Surprise!';
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x,
    y: 0,
    speed: speed + Math.random() * 0.35,
    message: null,
    isGolden: false,
    isBirthdayGiftHeart: true
  });
}

function spawnCakeHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart cake-heart';
  heart.innerHTML = '🎂';
  heart.title = 'Birthday Cake!';
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x,
    y: 0,
    speed: speed * 0.9,
    message: null,
    isGolden: false,
    isCakeHeart: true
  });
}

function spawnBrownHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart brown-heart';
  heart.innerHTML = '🤎';
  heart.title = 'Bonus!';
  const x = HEART_SPAWN_MIN + Math.random() * (HEART_SPAWN_MAX - HEART_SPAWN_MIN);
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const baseSpeed = getCurrentSpeed();
  const speed = baseSpeed * 0.82 + Math.random() * 0.2;
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed,
    message: null,
    isGolden: false,
    isBrownHeart: true
  });
}

function spawnShieldHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart shield-heart';
  heart.innerHTML = '💙';
  heart.title = 'Shield!';
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
    isShieldHeart: true
  });
}

function spawnMagnetHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart magnet-heart';
  heart.innerHTML = '🧲💖';
  heart.title = 'Magnet!';
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
    isMagnetHeart: true
  });
}

function isMagnetActive() {
  return Date.now() < magnetEndTime;
}

function isWindActive() {
  return Date.now() < windEndTime;
}

function startWind() {
  windEndTime = Date.now() + WIND_DURATION_MS;
  windDirection = Math.random() < 0.5 ? -1 : 1;
  lastWindCheckTime = Date.now();
  showFloatingMessage('🌬️ Windy!');
  if (windIndicator) {
    windIndicator.classList.remove('hidden');
    windIndicator.textContent = windDirection > 0 ? '🌬️ Wind →' : '🌬️ ← Wind';
    setTimeout(() => windIndicator.classList.add('hidden'), WIND_DURATION_MS);
  }
}

function spawnBrokenHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart broken-heart';
  heart.innerHTML = '💔';
  heart.title = 'Avoid!';
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
    isBrokenHeart: true
  });
}

function applyBrokenHeartPenalty() {
  if (shieldCharges > 0) {
    shieldCharges--;
    if (shieldIndicator) {
      if (shieldCharges <= 0) shieldIndicator.classList.add('hidden');
      else shieldIndicator.textContent = `🛡 Shield x${shieldCharges}`;
    }
    showFloatingMessage('🛡 Shield saved you!');
    return;
  }
  catchStreak = 0;
  score = Math.max(0, score - BROKEN_HEART_PENALTY);
  scoreEl.textContent = score;
  updateLevelAndProgress();
}

function applyMysteryEffect() {
  const roll = Math.floor(Math.random() * 4);
  if (roll === 0) {
    addScore(MYSTERY_BONUS_POINTS);
    showFloatingMessage('🎁 Mystery! +50 points');
    if (score > getBestScore()) {
      setBestScore(score);
      updateBestScoreDisplay();
    }
  } else if (roll === 1) {
    startHeartRain();
    showFloatingMessage('🎁 Mystery! Heart Rain!');
    playSfx(sfxHeartRainEl);
  } else if (roll === 2) {
    slowMotionEndTime = Date.now() + SLOW_MOTION_DURATION_MS;
    showFloatingMessage('🎁 Mystery! Slow motion!');
  } else {
    loveBoostEndTime = Math.max(loveBoostEndTime, Date.now() + MYSTERY_DOUBLE_SCORE_MS);
    showFloatingMessage('🎁 Mystery! Double score!');
    if (loveBoostIndicator) {
      loveBoostIndicator.classList.remove('hidden');
      setTimeout(() => loveBoostIndicator.classList.add('hidden'), MYSTERY_DOUBLE_SCORE_MS);
    }
  }
  showComboSparkle();
}

function applyBirthdayGiftReward(heartObj) {
  showFloatingMessage('🎁 Birthday Surprise!');
  const roll = Math.floor(Math.random() * 4);
  if (roll === 0) {
    addScore(200);
    showFloatingMessage('🎁 Birthday Surprise! +200 points');
  } else if (roll === 1) {
    startHeartRain();
    showFloatingMessage('💖 Heart storm!');
    playSfx(sfxHeartRainEl);
  } else if (roll === 2) {
    magnetEndTime = Date.now() + MAGNET_DURATION_MS;
    showFloatingMessage('🧲 Birthday Magnet Mode!');
    if (magnetIndicator) {
      magnetIndicator.classList.remove('hidden');
      setTimeout(() => magnetIndicator.classList.add('hidden'), MAGNET_DURATION_MS);
    }
  } else {
    startBirthdayFireworks(2800);
    showFloatingMessage('🎆 Birthday Fireworks!');
  }
  showComboSparkle();
}

function playCakeBurst(clientX, clientY) {
  catchBurstEl.innerHTML = '';
  catchBurstEl.classList.remove('hidden');
  const symbols = ['🕯️', '💖', '✨'];
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'burst-piece';
    s.textContent = symbols[i % symbols.length];
    s.style.setProperty('--angle', (i * 40) + 'deg');
    catchBurstEl.appendChild(s);
  }
  catchBurstEl.style.left = clientX + 'px';
  catchBurstEl.style.top = clientY + 'px';
  setTimeout(() => {
    catchBurstEl.classList.add('hidden');
    catchBurstEl.innerHTML = '';
  }, 650);
}

function spawnRainHeart() {
  if (!gameRunning || !isHeartRainActive()) return;
  const heart = document.createElement('div');
  heart.className = 'heart rain-heart';
  heart.innerHTML = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  const x = HEART_EDGE_MARGIN + Math.random() * (100 - 2 * HEART_EDGE_MARGIN);
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

function startHeartRain(durationMs) {
  catchStreak = 0;
  const duration = durationMs !== undefined ? durationMs : HEART_RAIN_DURATION_MS;
  heartRainEndTime = Date.now() + duration;
  if (durationMs === undefined) showFloatingMessage('💞 Heart Rain!');
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

function startBirthdayConfetti() {
  if (!birthdayConfettiEl) return;
  birthdayConfettiEl.innerHTML = '';
  birthdayConfettiEl.classList.remove('hidden');
  const symbols = ['❤️', '💕', '💖', '💗'];
  const count = 40;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'birthday-confetti-heart';
    h.textContent = symbols[i % symbols.length];
    h.style.left = Math.random() * 100 + '%';
    h.style.animationDelay = (Math.random() * 0.8) + 's';
    birthdayConfettiEl.appendChild(h);
  }
  setTimeout(() => {
    birthdayConfettiEl.classList.add('hidden');
    birthdayConfettiEl.innerHTML = '';
  }, 3600);
}

function startBirthdayFireworks(durationMs) {
  if (!birthdayFireworksLayer) return;
  const duration = durationMs || 3000;
  birthdayFireworksLayer.classList.remove('hidden');
  birthdayFireworksLayer.innerHTML = '';
  const symbols = ['💖', '💕', '💜', '💙', '💛', '✨'];
  const start = Date.now();
  function spawn() {
    const now = Date.now();
    if (now - start > duration) {
      birthdayFireworksLayer.classList.add('hidden');
      birthdayFireworksLayer.innerHTML = '';
      return;
    }
    const s = document.createElement('span');
    s.className = 'birthday-firework';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = Math.random() * 100 + '%';
    s.style.top = (20 + Math.random() * 60) + '%';
    s.style.animationDuration = (0.9 + Math.random() * 0.7) + 's';
    birthdayFireworksLayer.appendChild(s);
    setTimeout(() => s.remove(), 1800);
    setTimeout(spawn, 150);
  }
  spawn();
}

function maybeShowFirstBirthdayCatch() {
  if (!birthdayToday || birthdayFirstCatchShown) return;
  birthdayFirstCatchShown = true;
  showFloatingMessage('💖 First heart of your birthday.');
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

function isNormalHeart(heart) {
  return !heart.isRainHeart && !heart.isBrokenHeart && !heart.isZainabHeart &&
    !heart.isMysteryHeart && !heart.isBrownHeart &&
    !heart.isMagnetHeart && !heart.isGlitterHeart && !heart.isShieldHeart;
}

function checkCollision(heart) {
  const heartRect = heart.element.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  const heartCenterX = (heartRect.left + heartRect.right) / 2;
  const heartBottom = heartRect.bottom;
  const basketTop = basketRect.top;
  const basketLeft = basketRect.left;
  const basketRight = basketRect.right;
  // Slightly generous vertical band so special hearts don't slip through.
  if (heartBottom >= basketTop - 18 && heartBottom <= basketTop + 36) {
    if (heartCenterX >= basketLeft && heartCenterX <= basketRight) {
      return true;
    }
  }
  return false;
}

function checkCloseCatch(heart) {
  if (gameMode !== 'basket' || heart.isBrokenHeart) return false;
  const heartRect = heart.element.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  const heartCenterX = (heartRect.left + heartRect.right) / 2;
  const heartBottom = heartRect.bottom;
  const basketTop = basketRect.top;
  const basketLeft = basketRect.left;
  const basketRight = basketRect.right;
  if (heartBottom < basketTop - 18 || heartBottom > basketTop + 36) return false;
  const distOutside = Math.max(0, basketLeft - heartCenterX, heartCenterX - basketRight);
  return distOutside > 0 && distOutside <= CLOSE_CATCH_PX;
}

function addScore(pts) {
  const loveMult = (Date.now() < loveBoostEndTime) ? 2 : 1;
  let comboMult = 1;
  if (catchStreak >= COMBO_X4_THRESHOLD) comboMult = 4;
  else if (catchStreak >= COMBO_X3_THRESHOLD) comboMult = 3;
  else if (catchStreak >= COMBO_X2_THRESHOLD) comboMult = 2;
  if (comboMult !== currentComboMultiplier) {
    currentComboMultiplier = comboMult;
    if (comboIndicator) {
      comboIndicator.classList.toggle('hidden', currentComboMultiplier === 1);
      if (currentComboMultiplier > 1) {
        comboIndicator.textContent = `Combo x${currentComboMultiplier}`;
      }
    }
  }
  score += pts * loveMult * comboMult;
  scoreEl.textContent = score;
  updateLevelAndProgress();
  checkScoreMilestones();
}

function schedulePossibleMiss(heart) {
  const idx = hearts.indexOf(heart);
  if (idx > -1) hearts.splice(idx, 1);
  heart.element.remove();
  pendingMisses.push({
    isRainHeart: heart.isRainHeart,
    isBrokenHeart: heart.isBrokenHeart,
    isNormal: isNormalHeart(heart),
    timestamp: Date.now()
  });
}

function processPendingMisses() {
  const now = Date.now();
  for (let i = pendingMisses.length - 1; i >= 0; i--) {
    const p = pendingMisses[i];
    if (now - p.timestamp < MISS_GRACE_MS) continue;
    pendingMisses.splice(i, 1);
    if (!p.isNormal || p.isRainHeart || p.isBrokenHeart) continue;
    if (isHeartRainActive() || Date.now() < loveBoostEndTime) continue;
    if (hearts.length > MAX_HEARTS_FOR_MISS) continue;
    catchStreak = 0;
    consecutiveMisses++;
    lives++;
    livesEl.textContent = lives;
    if (lives >= MAX_LIVES - 1) livesDisplay.classList.add('warning');
    if (lives >= MAX_LIVES) endGame();
    if (consecutiveMisses >= CONSECUTIVE_MISSES_FOR_BONUS) {
      bonusHeartSpawnRemaining = BONUS_SPAWN_REMAINING_COUNT;
    }
  }
}

function removeHeart(heart, caught) {
  const idx = hearts.indexOf(heart);
  if (idx > -1) hearts.splice(idx, 1);
  if (caught) {
    consecutiveMisses = 0;
    const rect = heart.element.getBoundingClientRect();
    playCatchBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  heart.element.remove();
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
  applyNightMode();
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

function resumeAfterBirthdaySecret() {
  if (birthdaySecretOverlay) birthdaySecretOverlay.classList.add('hidden');
  achievementShowing = false;
  startHeartRain(5000);
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
  maybeShowFirstBirthdayCatch();
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
  if (heartObj.isBirthdayGiftHeart) {
    applyBirthdayGiftReward(heartObj);
    removeHeart(heartObj, true);
    return;
  }
  if (heartObj.isCakeHeart) {
    addScore(300);
    showFloatingMessage('🎂 Birthday Cake! +300');
    const rect = heartObj.element.getBoundingClientRect();
    playCakeBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    playSfx(sfxGoldenEl);
    removeHeart(heartObj, true);
    return;
  }
  if (heartObj.isShieldHeart) {
    shieldCharges++;
    if (shieldIndicator) {
      shieldIndicator.classList.remove('hidden');
      shieldIndicator.textContent = shieldCharges > 1 ? `🛡 Shield x${shieldCharges}` : '🛡 Heart Shield!';
    }
    showFloatingMessage('🛡 Heart Shield!');
    playSfx(sfxGoldenEl);
    removeHeart(heartObj, true);
    return;
  }
  if (heartObj.isMagnetHeart) {
    addScore(TAP_POINTS);
    magnetEndTime = Date.now() + MAGNET_DURATION_MS;
    showFloatingMessage('🧲 Heart Magnet!');
    if (magnetIndicator) {
      magnetIndicator.classList.remove('hidden');
      setTimeout(() => magnetIndicator.classList.add('hidden'), MAGNET_DURATION_MS);
    }
    playSfx(sfxGoldenEl);
    removeHeart(heartObj, true);
    return;
  }
  if (heartObj.isBrokenHeart) {
    applyBrokenHeartPenalty();
    showFloatingMessage('💔 Broken heart! -50');
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
  const now = Date.now();
  if (!isWindActive() && !isHeartRainActive() && score >= WIND_MIN_SCORE && now - lastWindCheckTime >= WIND_CHECK_INTERVAL_MS) {
    lastWindCheckTime = now;
    if (Math.random() < WIND_CHANCE) startWind();
  }
  processPendingMisses();
  const slowMult = now < slowMotionEndTime ? 0.5 : 1;
  const magnetPull = gameMode === 'basket' && isMagnetActive();
  const windActive = isWindActive();
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    const holding = heart.delayedHeart && now < heart.delayEndTime;
    if (magnetPull && !heart.isMagnetHeart) {
      const dx = basketX - heart.x;
      heart.x += dx * 0.07;
      heart.x = Math.max(HEART_EDGE_MARGIN, Math.min(100 - HEART_EDGE_MARGIN, heart.x));
      heart.element.style.left = heart.x + '%';
    } else if (heart.wobble) {
      heart.x = heart.baseX + Math.sin(heart.y * 0.04 + heart.wobblePhase) * heart.wobbleAmplitude;
      heart.x = Math.max(HEART_EDGE_MARGIN, Math.min(100 - HEART_EDGE_MARGIN, heart.x));
      heart.element.style.left = heart.x + '%';
    }
    if (windActive) {
      heart.x += windDirection * WIND_DRIFT;
      heart.x = Math.max(HEART_EDGE_MARGIN, Math.min(100 - HEART_EDGE_MARGIN, heart.x));
      heart.element.style.left = heart.x + '%';
    }
    // Fake direction: gentle drift one way, then switch near bottom
    if (heart.fakeDirHeart) {
      const switchY = rect.height * 0.7;
      if (!heart.fakeDirSwitched && heart.y >= switchY) {
        heart.fakeDirSwitched = true;
        heart.fakeDirDir *= -1;
      }
      const drift = heart.fakeDirSwitched ? 0.7 : 0.4;
      heart.x += heart.fakeDirDir * drift * slowMult;
      heart.x = Math.max(HEART_EDGE_MARGIN, Math.min(100 - HEART_EDGE_MARGIN, heart.x));
      heart.element.style.left = heart.x + '%';
    }
    if (!holding) {
      if (heart.delayedHeart && !heart.delayBoosted) {
        heart.delayBoosted = true;
        heart.speed *= 1.6; // modest fast drop after pause
      }
      if (heart.isBalloonHeart && heart.balloonPhase === 'up') {
        heart.y -= heart.speed * slowMult * 0.4;
        if (heart.y <= 20) heart.balloonPhase = 'down';
      } else {
        heart.y += heart.speed * slowMult;
      }
    }
    // Late curve: gentle side drift near bottom
    if (heart.lateCurve) {
      const threshold = rect.height * 0.7;
      if (heart.y > threshold) {
        const t = Math.min(1, (heart.y - threshold) / (rect.height * 0.25));
        heart.x += heart.lateCurveDir * 0.5 * slowMult * t;
        heart.x = Math.max(HEART_EDGE_MARGIN, Math.min(100 - HEART_EDGE_MARGIN, heart.x));
        heart.element.style.left = heart.x + '%';
      }
    }
    heart.element.style.top = heart.y + 'px';
    if (gameMode === 'basket' && checkCloseCatch(heart)) {
      addScore(POINTS_PER_HEART);
      showFloatingMessage('💖 Close Catch!');
      playSfx(sfxCatchEl);
      hapticCatch();
      removeHeart(heart, true);
      continue;
    }
    if (gameMode === 'basket' && checkCollision(heart)) {
      catchStreak++;
      maybeShowFirstBirthdayCatch();
      if (heart.isZainabHeart) {
        showZainabHeartFound();
        removeHeart(heart, true);
        continue;
      }
      if (heart.isMysteryHeart) {
        applyMysteryEffect();
        playSfx(sfxGoldenEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isBirthdayGiftHeart) {
        applyBirthdayGiftReward(heart);
        playSfx(sfxGoldenEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isCakeHeart) {
        addScore(300);
        showFloatingMessage('🎂 Birthday Cake! +300');
        const r2 = heart.element.getBoundingClientRect();
        playCakeBurst(r2.left + r2.width / 2, r2.top + r2.height / 2);
        playSfx(sfxGoldenEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isBrownHeart) {
        addScore(BROWN_BONUS_POINTS);
        if (score > getBestScore()) {
          setBestScore(score);
          updateBestScoreDisplay();
        }
        showFloatingMessage('🤎 Bonus Heart! +100 Points');
        const rect = heart.element.getBoundingClientRect();
        playBrownBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        showComboSparkle();
        playSfx(sfxGoldenEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isMagnetHeart) {
        addScore(POINTS_PER_HEART);
        magnetEndTime = Date.now() + MAGNET_DURATION_MS;
        showFloatingMessage('🧲 Heart Magnet!');
        if (magnetIndicator) {
          magnetIndicator.classList.remove('hidden');
          setTimeout(() => magnetIndicator.classList.add('hidden'), MAGNET_DURATION_MS);
        }
        playSfx(sfxGoldenEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isBrokenHeart) {
        applyBrokenHeartPenalty();
        showFloatingMessage('💔 Broken heart! -50');
        removeHeart(heart, true);
        continue;
      }
      if (heart.isRainHeart) {
        addScore(HEART_RAIN_POINTS);
        playSfx(sfxHeartRainEl);
        removeHeart(heart, true);
        continue;
      }
      if (heart.isShieldHeart) {
        shieldCharges++;
        if (shieldIndicator) {
          shieldIndicator.classList.remove('hidden');
          shieldIndicator.textContent = shieldCharges > 1 ? `🛡 Shield x${shieldCharges}` : '🛡 Heart Shield!';
        }
        showFloatingMessage('🛡 Heart Shield!');
        playSfx(sfxGoldenEl);
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
      schedulePossibleMiss(heart);
    }
  }

  // Watchdog: if no hearts for a while, force a spawn to keep flow
  if (!isHeartRainActive() && gameRunning) {
    if (hearts.length === 0) {
      if (!lastEmptyHeartsTime) lastEmptyHeartsTime = now;
      if (now - lastEmptyHeartsTime > 2200) {
        spawnHeart();
        lastEmptyHeartsTime = now;
      }
    } else {
      lastEmptyHeartsTime = 0;
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
   zainabSkyEventShown = false;
   luckyHeartShownThisGame = false;
   skyFillShownThisGame = false;
   achievementQueue = [];
   achievementShowing = false;
   lastAchievementTime = 0;
   currentLevelIndex = 0;
  idleMessageShown = false;
  lastInteractionTime = Date.now();
  loveBoostEndTime = 0;
  magnetEndTime = 0;
  windEndTime = 0;
  lastWindCheckTime = 0;
  pendingMisses = [];
  consecutiveMisses = 0;
  bonusHeartSpawnRemaining = 0;
  shieldCharges = 0;
  currentComboMultiplier = 1;
  slowMotionEndTime = 0;
  heartRainEndTime = 0;
  if (heartRainInterval) clearInterval(heartRainInterval);
  heartRainInterval = null;
  birthdayFireworksScoreShown = false;
  birthdaySecretShownThisGame = false;
  birthdayFirstCatchShown = false;
  if (secretOverlayEl) secretOverlayEl.classList.add('hidden');
  if (quoteSecretOverlayEl) quoteSecretOverlayEl.classList.add('hidden');
  if (celebration50El) celebration50El.classList.add('hidden');
  if (secretEndingOverlay) secretEndingOverlay.classList.add('hidden');
  if (zainabHeartOverlay) zainabHeartOverlay.classList.add('hidden');
  if (haider150Overlay) haider150Overlay.classList.add('hidden');
  if (loveBoostIndicator) loveBoostIndicator.classList.add('hidden');
  if (magnetIndicator) magnetIndicator.classList.add('hidden');
  if (windIndicator) windIndicator.classList.add('hidden');
  if (shieldIndicator) shieldIndicator.classList.add('hidden');
  if (comboIndicator) comboIndicator.classList.add('hidden');
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
  applyNightMode();
  showScreen(gameScreen);
  updateBestScoreDisplay();
  if (birthdayToday && !birthdayStartShownThisSession && birthdayStartOverlay) {
    birthdayStartShownThisSession = true;
    gameRunning = false;
    birthdayStartOverlay.classList.remove('hidden');
    startBirthdayConfetti();
  } else {
    spawnHeart();
    spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
    gameLoopId = requestAnimationFrame(gameLoop);
  }
}

function isNightMode() {
  const hour = new Date().getHours();
  return hour >= 20 || hour < 6;
}

function applyNightMode() {
  if (isNightMode()) {
    document.body.classList.add('night-mode');
    if (nightModeMsg) nightModeMsg.classList.remove('hidden');
  } else {
    document.body.classList.remove('night-mode');
    if (nightModeMsg) nightModeMsg.classList.add('hidden');
  }
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
applyNightMode();

function applyBirthdayUi() {
  if (!birthdayMode) return;
  const titleElLocal = document.getElementById('game-title');
  if (titleElLocal) {
    titleElLocal.textContent = "Zainab\u2019s Birthday Heart Game 🎂";
  }
  document.title = "Zainab\u2019s Birthday Heart Game 🎂";
  if (introMessageEl) {
    introMessageEl.textContent = "🎉 Birthday Week for Zainab!\nCollect extra love hearts ❤️";
  }
  if (birthdayBanner) {
    birthdayBanner.classList.remove('hidden');
    setTimeout(() => birthdayBanner.classList.add('hidden'), 5000);
  }
}

applyBirthdayUi();

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
  basketX = x;
  updateBasketPosition();
});

gameArea.addEventListener('touchmove', (e) => {
  if (!gameRunning || !e.touches.length) return;
  if (gameMode === 'basket') {
    e.preventDefault();
    lastInteractionTime = Date.now();
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    basketX = x;
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

if (btnCatchHeartsMode) btnCatchHeartsMode.addEventListener('click', () => { ensureAudioInitialized(); startGame('basket'); });
if (btnTableTennisMode) btnTableTennisMode.addEventListener('click', () => { ensureAudioInitialized(); ttStart(); });
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
  applyNightMode();
});
if (ttBackBtn) ttBackBtn.addEventListener('click', () => {
  ttStop();
  showScreen(startScreen);
  fillStartHearts();
  applyNightMode();
});
if (ttRestartBtn) ttRestartBtn.addEventListener('click', () => {
  ttStart();
});
if (ttResultContinueBtn) ttResultContinueBtn.addEventListener('click', () => {
  ttHideResult();
  ttStart();
});
if (audioToggleBtn) audioToggleBtn.addEventListener('click', toggleAudio);
if (secretContinueBtn) secretContinueBtn.addEventListener('click', resumeAfterSecret);
if (quoteSecretContinueBtn) quoteSecretContinueBtn.addEventListener('click', resumeAfterQuoteSecret);
if (celebration50Btn) celebration50Btn.addEventListener('click', resumeAfterCelebration50);
if (secretEndingBtn) secretEndingBtn.addEventListener('click', resumeAfterSecretEnding);
if (zainabHeartContinueBtn) zainabHeartContinueBtn.addEventListener('click', resumeAfterZainabHeart);
if (haider150ContinueBtn) haider150ContinueBtn.addEventListener('click', resumeAfterHaider150);
if (birthdayStartContinueBtn) birthdayStartContinueBtn.addEventListener('click', () => {
  if (birthdayStartOverlay) birthdayStartOverlay.classList.add('hidden');
  resumeGame();
});
if (birthdaySecretContinueBtn) birthdaySecretContinueBtn.addEventListener('click', resumeAfterBirthdaySecret);

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
  if (now - lastTapTime < 300) {
    lastTapTime = 0;
    if (now - lastLoveBoostTime > 20000) {
      lastLoveBoostTime = now;
      loveBoostEndTime = Date.now() + LOVE_BOOST_DURATION_MS;
      showFloatingMessage(LOVE_BOOST_MESSAGE);
      if (loveBoostIndicator) {
        loveBoostIndicator.classList.remove('hidden');
        setTimeout(() => loveBoostIndicator.classList.add('hidden'), LOVE_BOOST_DURATION_MS);
      }
    }
  } else {
    lastTapTime = now;
  }
}, { passive: true });

if (ttCanvas) {
  ttCanvas.addEventListener('mousemove', (e) => {
    if (!ttRunning) return;
    ttHandlePointerX(e.clientX);
  });
  ttCanvas.addEventListener('touchmove', (e) => {
    if (!ttRunning || !e.touches.length) return;
    e.preventDefault();
    ttHandlePointerX(e.touches[0].clientX);
  }, { passive: false });
  ttCanvas.addEventListener('touchstart', (e) => {
    if (!ttRunning || !e.touches.length) return;
    ttHandlePointerX(e.touches[0].clientX);
  }, { passive: true });
}
