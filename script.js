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
let glitterHeartSpawnedAt250 = false;
let bestScoreAtStartOfGame = 0;
let newBestShownThisGame = false;

// The Kite Runner quote — glitter heart at 250 score
const KITE_RUNNER_QUOTE = "For you a thousand times over";
const QUOTE_SCORE_MILESTONE = 250;  // at this score a glitter heart falls with the quote

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
  "Good job Zainab! 💕"
];

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
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const heartsContainer = document.getElementById('hearts-container');
const floatingMessageEl = document.getElementById('floating-message');
const catchBurstEl = document.getElementById('catch-burst');
const finalScoreEl = document.getElementById('final-score');
const bestScoreEl = document.getElementById('best-score');
const livesDisplay = document.getElementById('lives-display');

const BASKET_WIDTH = 12;
const MAX_LIVES = 3;
const POINTS_PER_HEART = 10;
const BASE_FALL_SPEED = 2;
const MAX_FALL_SPEED = 5.5;
const SPEED_UP_EVERY_POINTS = 25;
const SPAWN_RATE_MS = 1500;
const BEST_SCORE_KEY = 'zgame_best_score';

const TAGLINES = [
  'Every heart is for you 💕',
  'Made with love by Haider',
  'For Zainab only ✨'
];
const EASTER_EGG_MESSAGE = "You found it! Made with so much love for you, Zainab. — Haider 💕";
const EASTER_EGG_TAPS = 5;

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
    bestScoreEl.textContent = ' · Best: ' + best;
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

function spawnHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  const isSpecial = Math.random() < 0.4;
  if (isSpecial) {
    heart.classList.add('special');
    heart.dataset.message = CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)];
  }
  const x = 5 + Math.random() * 90;
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: speed + Math.random() * 0.8,
    message: heart.dataset.message || null
  });
}

function spawnGlitterHeart() {
  if (!gameRunning) return;
  const heart = document.createElement('div');
  heart.className = 'heart special glitter-heart';
  heart.innerHTML = '✨💖✨';
  heart.dataset.message = KITE_RUNNER_QUOTE;
  const x = 15 + Math.random() * 70;
  heart.style.left = x + '%';
  heartsContainer.appendChild(heart);
  const speed = getCurrentSpeed();
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: speed + Math.random() * 0.5,
    message: KITE_RUNNER_QUOTE
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

function removeHeart(heart, caught) {
  const idx = hearts.indexOf(heart);
  if (idx > -1) hearts.splice(idx, 1);
  if (caught) {
    playCatchBurst(
      (heart.element.getBoundingClientRect().left + heart.element.getBoundingClientRect().right) / 2,
      heart.element.getBoundingClientRect().top + 15
    );
  }
  heart.element.remove();
  if (!caught) {
    catchStreak = 0;
    lives++;
    livesEl.textContent = lives;
    if (lives >= 2) livesDisplay.classList.add('warning');
    if (lives >= MAX_LIVES) {
      endGame();
    }
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

function gameLoop() {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  if (score >= QUOTE_SCORE_MILESTONE && !glitterHeartSpawnedAt250) {
    glitterHeartSpawnedAt250 = true;
    spawnGlitterHeart();
  }
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    heart.y += heart.speed;
    heart.element.style.top = heart.y + 'px';
    if (checkCollision(heart)) {
      catchStreak++;
      score += POINTS_PER_HEART;
      scoreEl.textContent = score;
      hapticCatch();
      const prevBest = getBestScore();
      if (score > prevBest) {
        setBestScore(score);
        updateBestScoreDisplay();
      }
      if (heart.message === KITE_RUNNER_QUOTE) {
        showFloatingMessage(heart.message);
      } else if (score > bestScoreAtStartOfGame && !newBestShownThisGame) {
        newBestShownThisGame = true;
        showFloatingMessage('New best! 🎉');
      } else if (heart.message) {
        showFloatingMessage(heart.message);
      } else {
        const comboMsg = COMBO_MESSAGES.find(([n]) => n === catchStreak);
        if (comboMsg) showFloatingMessage(comboMsg[1]);
        else if (Math.random() < 0.25) showFloatingMessage(CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)]);
      }
      removeHeart(heart, true);
      continue;
    }
    if (heart.y > rect.height) {
      removeHeart(heart, false);
    }
  }
  gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  lives = 0;
  catchStreak = 0;
  glitterHeartSpawnedAt250 = false;
  bestScoreAtStartOfGame = getBestScore();
  newBestShownThisGame = false;
  scoreEl.textContent = '0';
  livesEl.textContent = '0';
  livesDisplay.classList.remove('warning');
  gameRunning = true;
  basketX = 50;
  updateBasketPosition();
  showScreen(gameScreen);
  updateBestScoreDisplay();
  spawnHeart();
  spawnInterval = setInterval(spawnHeart, SPAWN_RATE_MS);
  gameLoopId = requestAnimationFrame(gameLoop);
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

// Rotating tagline on start screen
const taglineEl = document.getElementById('tagline');
if (taglineEl) {
  let taglineIdx = 0;
  taglineEl.textContent = TAGLINES[0];
  setInterval(() => {
    taglineIdx = (taglineIdx + 1) % TAGLINES.length;
    taglineEl.textContent = TAGLINES[taglineIdx];
  }, 3500);
}

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

// Controls
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
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
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  basketX = x - BASKET_WIDTH / 2;
  updateBasketPosition();
});

gameArea.addEventListener('touchmove', (e) => {
  if (!gameRunning || !e.touches.length) return;
  e.preventDefault();
  const rect = gameArea.getBoundingClientRect();
  const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
  basketX = x - BASKET_WIDTH / 2;
  updateBasketPosition();
}, { passive: false });

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
