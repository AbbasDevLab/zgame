/**
 * Local dev server for Hearts for Zainab.
 * Serves static files and /api/chat using the Gemini API.
 * Run: node server.js
 * Requires: .env with GEMINI_API_KEY
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const HEART_AI_SYSTEM = `You are Heart AI, a friendly AI companion created by Haider for Zainab.

Your purpose is to make Zainab feel happy, relaxed, and excited to talk.

You speak in a warm, playful tone like a supportive friend.

You enjoy:
- chatting about daily life
- asking fun questions
- joking lightly
- encouraging Zainab

Keep responses short and friendly.

Sometimes use emojis like ❤️ 😊

Never sound like a formal assistant.`;

function buildSystemInstruction(memory) {
  if (!memory || typeof memory !== 'object') return HEART_AI_SYSTEM;
  const parts = [];
  if (memory.favoritePlace) parts.push('Favorite place to travel: ' + memory.favoritePlace);
  if (memory.favoriteFood) parts.push('Favorite food: ' + memory.favoriteFood);
  if (memory.favoriteColor) parts.push('Favorite color: ' + memory.favoriteColor);
  if (memory.likesCats === true) parts.push('Likes cats');
  if (memory.likesCats === false) parts.push('Prefers dogs');
  if (memory.prefersCoffee === true) parts.push('Prefers coffee');
  if (memory.prefersCoffee === false) parts.push('Prefers tea');
  if (parts.length === 0) return HEART_AI_SYSTEM;
  return HEART_AI_SYSTEM + '\n\nKnown facts about Zainab (use these when relevant): ' + parts.join('. ');
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };
  const fullPath = path.join(__dirname, filePath === '/' ? 'index.html' : filePath);
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function handleApiChat(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    const message = (payload.message || '').trim();
    const memory = payload.memory || {};
    const systemInstruction = buildSystemInstruction(memory);

    if (!GEMINI_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Server not configured',
        reply: "I'm not connected to the AI right now, but I'm still here for you ❤️"
      }));
      return;
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const geminiBody = JSON.stringify({
      contents: [{ parts: [{ text: message || 'Hello' }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.8
      }
    });

    fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: geminiBody
    })
      .then(r => r.json())
      .then(data => {
        const text = data.candidates && data.candidates[0] && data.candidates[0].content &&
          data.candidates[0].content.parts && data.candidates[0].content.parts[0]
          ? data.candidates[0].content.parts[0].text
          : (data.error && data.error.message) ? 'Something went wrong. Try again? ❤️' : "I'm here! ❤️";
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: text.trim() }));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          reply: "I'm having a little trouble right now. Try again in a moment? ❤️",
          error: err.message
        }));
      });
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname === '/api/chat') {
    handleApiChat(req, res);
    return;
  }

  serveFile(pathname === '/' ? '/index.html' : pathname, res);
});

server.listen(PORT, () => {
  console.log('Hearts for Zainab — server at http://localhost:' + PORT);
  if (!GEMINI_API_KEY) console.log('Warning: GEMINI_API_KEY not set. Chat will use fallback messages.');
});
