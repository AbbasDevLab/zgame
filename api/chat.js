/**
 * Vercel serverless function: POST /api/chat
 * Uses Gemini with Heart AI personality. Set GEMINI_API_KEY in Vercel env.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      message: 'Heart AI chat API. Send POST with body: { "message": "your text", "memory": {} }'
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let payload;
  try {
    let body = req.body;
    if (body == null || body === '') {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    } else if (typeof body === 'string') {
      body = JSON.parse(body || '{}');
    }
    payload = body || {};
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const message = (payload.message || '').trim();
  const memory = payload.memory || {};
  const systemInstruction = buildSystemInstruction(memory);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(200).json({
      reply: "I'm not connected to the AI right now, but I'm still here for you ❤️"
    });
    return;
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const geminiBody = JSON.stringify({
    contents: [{ parts: [{ text: message || 'Hello' }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      maxOutputTokens: 256,
      temperature: 0.8
    }
  });

  try {
    const r = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: geminiBody
    });
    const data = await r.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text && typeof text === 'string') {
      res.status(200).json({ reply: text.trim() });
      return;
    }

    const errMsg = (data.error && data.error.message) || (typeof data.error === 'string' ? data.error : '');
    const isAuthError = r.status === 401 || r.status === 403 || /API key|invalid|permission|quota/i.test(String(errMsg));

    const friendlyReply = isAuthError
      ? "I can't connect right now. Make sure GEMINI_API_KEY is set in Vercel (Settings → Environment Variables) and your key is valid. ❤️"
      : "Something went wrong. Check that your Gemini API key is valid and try again? ❤️";

    res.status(200).json({ reply: friendlyReply });
  } catch (err) {
    res.status(200).json({
      reply: "I'm having a little trouble right now. Try again in a moment? ❤️"
    });
  }
}
