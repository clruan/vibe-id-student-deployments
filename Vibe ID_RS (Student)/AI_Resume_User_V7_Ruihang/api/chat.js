const LOCAL_DEEPSEEK_API_KEY = ""; // Keep empty. Set DEEPSEEK_API_KEY in Vercel environment variables.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || LOCAL_DEEPSEEK_API_KEY;
const DEEPSEEK_ENDPOINT = process.env.DEEPSEEK_ENDPOINT || "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: "Missing DEEPSEEK_API_KEY" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const context = String(body.context || "").slice(0, 24000);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];

    const safeMessages = messages
      .filter((message) => message && (message.role === "user" || message.role === "assistant"))
      .map((message) => ({
        role: message.role,
        content: String(message.content || "").slice(0, 3000)
      }))
      .filter((message) => message.content);

    if (!safeMessages.length) {
      return res.status(400).json({ error: "No chat messages supplied" });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    let upstream;
    try {
      upstream = await fetch(DEEPSEEK_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: [
            {
              role: "system",
              content: context || "You are a concise assistant for a candidate portfolio site."
            }
          ].concat(safeMessages),
          thinking: { type: "disabled" },
          temperature: 0.3,
          max_tokens: 500,
          stream: false
        })
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: payload.error && payload.error.message ? payload.error.message : "DeepSeek request failed"
      });
    }

    const reply = payload.choices &&
      payload.choices[0] &&
      payload.choices[0].message &&
      payload.choices[0].message.content;

    return res.status(200).json({ reply: reply || "I could not generate a response." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Chat request failed" });
  }
};
