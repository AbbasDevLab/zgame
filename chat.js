/**
 * Zainab Chat Companion — Heart AI
 * Chat UI, question game, memory, API placeholder, idle prompt
 */

(function () {
  const STORAGE_KEY = 'zainab_chat_memory';
  const IDLE_MS = 20000;
  const QUESTION_GAME_LENGTH = 10;

  const defaultMemory = {
    favoriteFood: '',
    favoriteColor: '',
    likesCats: false,
    prefersCoffee: false,
    favoritePlace: ''
  };

  let zainabMemory = { ...defaultMemory };
  let idleTimer = null;
  let questionGameActive = false;
  let questionIndex = 0;
  let welcomeShown = false;

  const questions = [
    'If you could travel anywhere tomorrow, where would you go?',
    'Coffee or tea?',
    'Mountains or beach?',
    'Cats or dogs?',
    "What's something that always makes you smile?",
    'If you could have one superpower, what would it be?',
    'What kind of music do you enjoy?',
    'Are you more of a morning person or night owl?',
    "What's your favorite food?",
    "What's your favorite color?"
  ];

  const randomIdleQuestions = [
    "Random question time 🎲\nWhat's something that made you smile today?",
    "Quick one 🎲\nWhat are you up to right now?",
    "Fun question 🎲\nIf you could have dinner with anyone, who would it be?"
  ];

  const systemPrompt = 'You are Heart AI, a friendly AI companion created by Haider for Zainab. Your purpose is to make Zainab feel happy, relaxed, and excited to talk. You speak in a warm, playful tone like a supportive friend. You enjoy: chatting about daily life, asking fun questions, joking lightly, encouraging Zainab. Keep responses short and friendly. Sometimes use emojis like ❤️ 😊 Never sound like a formal assistant.';

  const chatScreen = document.getElementById('chat-screen');
  const startScreen = document.getElementById('start-screen');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const backBtn = document.getElementById('chat-back-btn');
  const questionGameBtn = document.getElementById('chat-question-game-btn');
  const sendHeartBtn = document.getElementById('chat-send-heart-btn');

  function loadMemory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        zainabMemory = { ...defaultMemory, ...parsed };
      }
    } catch (_) {
      zainabMemory = { ...defaultMemory };
    }
  }

  function saveMemory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zainabMemory));
    } catch (_) {}
  }

  function extractMemoryFromAnswer(questionIndex, answer) {
    const a = (answer || '').toLowerCase().trim();
    if (questionIndex === 1) {
      if (a.includes('coffee')) zainabMemory.prefersCoffee = true;
      else if (a.includes('tea')) zainabMemory.prefersCoffee = false;
    } else if (questionIndex === 3) {
      if (a.includes('cat')) zainabMemory.likesCats = true;
      else if (a.includes('dog')) zainabMemory.likesCats = false;
    } else if (questionIndex === 8) {
      if (a) zainabMemory.favoriteFood = a.slice(0, 80);
    } else if (questionIndex === 9) {
      if (a) zainabMemory.favoriteColor = a.slice(0, 40);
    } else if (questionIndex === 0 && a) {
      zainabMemory.favoritePlace = a.slice(0, 80);
    }
    saveMemory();
  }

  function appendMessage(text, isUser, meta) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-ai');
    const p = document.createElement('p');
    p.textContent = text;
    wrap.appendChild(p);
    if (meta) {
      const span = document.createElement('span');
      span.className = 'chat-msg-meta';
      span.textContent = meta;
      wrap.appendChild(span);
    }
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showWelcome() {
    if (welcomeShown) return;
    welcomeShown = true;
    appendMessage(
      'Hi Zainab ❤️\nI\'m a little AI companion Haider made for you.\nWe can talk about anything.',
      false
    );
  }

  function sendMessageToAI(message, options) {
    const payload = { message, memory: { ...zainabMemory } };
    const base = (typeof window !== 'undefined' && window.HEART_AI_API_URL) ? window.HEART_AI_API_URL.replace(/\/$/, '') : '';
    const endpoint = base + '/api/chat';

    if (options && options.heartOnly) {
      appendMessage('A heart for me? Thank you Zainab ❤️', false);
      resetIdleTimer();
      return Promise.resolve();
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(function (data) {
        const raw = (data && (data.reply || data.message || data.text)) ? (data.reply || data.message || data.text) : '';
        const isErrorReply = raw && (raw.indexOf('Something went wrong') !== -1 || raw.indexOf("can't connect") !== -1 || raw.indexOf("couldn't connect") !== -1);
        const reply = raw && !isErrorReply ? raw : (isErrorReply ? "I'm having a little connection trouble right now. Try again in a moment? ❤️" : getMockReply(message, options));
        appendMessage(reply, false);
        resetIdleTimer();
      })
      .catch(function () {
        appendMessage("I'm having a little connection trouble right now. Try again in a moment? ❤️", false);
        resetIdleTimer();
      });
  }

  function getMockReply(userMessage, options) {
    if (options && options.heartOnly) return 'A heart for me? Thank you Zainab ❤️';
    const lower = (userMessage || '').toLowerCase();
    if (lower.includes('cat') && zainabMemory.likesCats) return 'You mentioned you like cats earlier 😄';
    if (lower.includes('coffee') && zainabMemory.prefersCoffee) return 'Coffee is the best, right? ☕❤️';
    if (lower.includes('tea') && !zainabMemory.prefersCoffee) return 'Tea time is the best time 😊❤️';
    const replies = [
      "That's so nice to hear! ❤️",
      "I love that! Tell me more 😊",
      "You're the best, Zainab! ❤️",
      "That made me smile 😄",
      "I'm here whenever you want to chat! ❤️"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      const msg = randomIdleQuestions[Math.floor(Math.random() * randomIdleQuestions.length)];
      appendMessage(msg, false);
      resetIdleTimer();
    }, IDLE_MS);
  }

  function stopIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = null;
  }

  function startQuestionGame() {
    if (questionGameActive) return;
    questionGameActive = true;
    questionIndex = 0;
    showQuestionProgress();
    appendMessage(questions[0], false, 'Question 1 of ' + QUESTION_GAME_LENGTH);
    resetIdleTimer();
  }

  function showQuestionProgress() {
    let el = document.getElementById('chat-question-progress');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chat-question-progress';
      el.className = 'chat-question-progress';
      const inputWrap = chatScreen.querySelector('.chat-input-wrap');
      chatScreen.insertBefore(el, inputWrap);
    }
    if (questionIndex >= QUESTION_GAME_LENGTH) {
      el.textContent = '';
      return;
    }
    el.textContent = 'Question ' + (questionIndex + 1) + ' of ' + QUESTION_GAME_LENGTH;
  }

  function advanceQuestionGame(userAnswer) {
    if (!questionGameActive) return;
    extractMemoryFromAnswer(questionIndex, userAnswer);
    questionIndex++;
    if (questionIndex >= QUESTION_GAME_LENGTH) {
      questionGameActive = false;
      showQuestionProgress();
      appendMessage("I think I'm starting to understand you better Zainab ❤️", false);
      var parts = [];
      if (zainabMemory.favoritePlace) parts.push('You\'d go to ' + zainabMemory.favoritePlace);
      if (zainabMemory.prefersCoffee) parts.push('You prefer coffee');
      if (zainabMemory.favoriteFood) parts.push('Favorite food: ' + zainabMemory.favoriteFood);
      if (zainabMemory.favoriteColor) parts.push('Favorite color: ' + zainabMemory.favoriteColor);
      var summary = parts.length ? 'Quick summary: ' + parts.join('. ') + '. ' : '';
      summary += 'Thanks for playing! 😊❤️';
      appendMessage(summary, false);
      return;
    }
    showQuestionProgress();
    appendMessage(questions[questionIndex], false, 'Question ' + (questionIndex + 1) + ' of ' + QUESTION_GAME_LENGTH);
  }

  function onSend() {
    const text = (inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    appendMessage(text, true);
    if (questionGameActive) {
      advanceQuestionGame(text);
      resetIdleTimer();
      return;
    }
    sendMessageToAI(text);
  }

  function openChat() {
    startScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    if (!welcomeShown) showWelcome();
    resetIdleTimer();
    inputEl.focus();
  }

  function closeChat() {
    chatScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    stopIdleTimer();
  }

  backBtn.addEventListener('click', closeChat);
  document.getElementById('btn-chat-mode').addEventListener('click', openChat);

  sendBtn.addEventListener('click', onSend);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  });

  questionGameBtn.addEventListener('click', function () {
    startQuestionGame();
  });

  sendHeartBtn.addEventListener('click', function () {
    appendMessage('❤️', true);
    sendMessageToAI('', { heartOnly: true });
  });

  loadMemory();
})();
