/**
 * Quick test: run in browser console. Replace YOUR_API_KEY with your real key.
 * Paste your key where it says YOUR_API_KEY below, then run the whole thing.
 */
async function testGemini() {
  const API_KEY = "YOUR_API_KEY"; // <-- paste your key here
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Say hello to Zainab in a cute way" }] }]
    })
  });

  const data = await response.json();
  console.log("Status:", response.status);
  console.log("Response:", data);

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.log("✅ Gemini says:", data.candidates[0].content.parts[0].text);
  } else if (data.error) {
    console.error("❌ Error:", data.error.message || data.error);
  }
}

testGemini();
