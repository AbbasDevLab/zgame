// Game state
let score = 0;
let lives = 0;
let gameRunning = false;
let basketX = 50; // percentage
let hearts = [];
let spawnInterval;
let gameLoopId;
let floatingMessageTimeout;

// Cute messages to show when catching hearts (some hearts are "special")
const CUTE_MESSAGES = [
  "You are amazing Zainab ❤️",
  "Bonus Love +10",
  "Haider likes you",
  "You make Haider smile 😊"
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
const finalScoreEl = document.getElementById('final-score');
const livesDisplay = document.getElementById('lives-display');

// Basket width in percentage (for collision)
const BASKET_WIDTH = 12;
const HEART_SIZE = 28;
const POINTS_PER_HEART = 10;
const MAX_LIVES = 5;
const SPAWN_RATE = 1500; // ms between new hearts
const FALL_SPEED = 2; // pixels per frame

function showScreen(screen) {
  startScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function showFloatingMessage(text) {
  if (floatingMessageTimeout) clearTimeout(floatingMessageTimeout);
  floatingMessageEl.textContent = text;
  floatingMessageEl.classList.remove('hidden');
  floatingMessageTimeout = setTimeout(() => {
    floatingMessageEl.classList.add('hidden');
  }, 1500);
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
  heart.innerHTML = '❤️';
  const isSpecial = Math.random() < 0.35; // 35% chance of special message
  if (isSpecial) {
    heart.classList.add('special');
    heart.dataset.message = CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)];
  }
  const x = 5 + Math.random() * 90; // 5% to 95%
  heart.style.left = x + '%';
  heart.style.setProperty('--y', '0px');
  heartsContainer.appendChild(heart);
  hearts.push({
    element: heart,
    x: x,
    y: 0,
    speed: FALL_SPEED + Math.random() * 1.5,
    message: heart.dataset.message || null
  });
}

function checkCollision(heart) {
  const rect = gameArea.getBoundingClientRect();
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
  heart.element.remove();
  if (!caught) {
    lives++;
    livesEl.textContent = lives;
    if (lives >= 3) livesDisplay.classList.add('warning');
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
  showScreen(gameOverScreen);
}

function gameLoop() {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    heart.y += heart.speed;
    heart.element.style.top = heart.y + 'px';
    if (checkCollision(heart)) {
      score += POINTS_PER_HEART;
      scoreEl.textContent = score;
      if (heart.message) showFloatingMessage(heart.message);
      else if (Math.random() < 0.25) showFloatingMessage(CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)]);
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
  hearts = [];
  scoreEl.textContent = '0';
  livesEl.textContent = '0';
  livesDisplay.classList.remove('warning');
  gameRunning = true;
  basketX = 50;
  updateBasketPosition();
  showScreen(gameScreen);
  spawnHeart();
  spawnInterval = setInterval(spawnHeart, SPAWN_RATE);
  gameLoopId = requestAnimationFrame(gameLoop);
}

// Controls: keyboard
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

// Controls: mouse
gameArea.addEventListener('mousemove', (e) => {
  if (!gameRunning) return;
  const rect = gameArea.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  basketX = x - BASKET_WIDTH / 2;
  updateBasketPosition();
});

// Touch support for mobile
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
