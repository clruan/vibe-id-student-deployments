const generator = require("./generate-vibe");

const { parseUploadedFile } = generator._internals;

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const file = body.file || body;
    if (!file || !file.name) return res.status(400).json({ error: "Resume file is required." });

    const parsed = await parseUploadedFile(Object.assign({}, file, { kind: "resume" }));
    const identity = extractResumeIdentity(parsed.text || "", parsed.name || "");

    return res.status(200).json({
      name: parsed.name,
      parseMode: parsed.parseMode,
      parseError: parsed.parseError || "",
      textChars: (parsed.text || "").length,
      text: parsed.text || "",
      identity
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Resume parse failed." });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb"
    }
  }
};

function extractResumeIdentity(text, fileName) {
  const source = String(text || "");
  return {
    name: findName(source, fileName),
    email: findEmail(source),
    phone: findPhone(source),
    linkedin: findLinkedIn(source),
    github: findGitHub(source)
  };
}

function findEmail(text) {
  const match = String(text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? cleanContact(match[0]) : "";
}

function findPhone(text) {
  const match = String(text || "").match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}\b/);
  return match ? cleanContact(match[0]).replace(/\s+/g, " ") : "";
}

function findLinkedIn(text) {
  const match = String(text || "").match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9%_.-]+\/?/i);
  return normalizeUrl(match && match[0], "https://www.linkedin.com/in/");
}

function findGitHub(text) {
  const match = String(text || "").match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/?/i);
  return normalizeUrl(match && match[0], "https://github.com/");
}

function findName(text, fileName) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((line) => cleanContact(line).replace(/[|•·]+/g, " "))
    .filter(Boolean)
    .slice(0, 18);

  const line = lines.find((item) => {
    if (item.length > 70 || /@|http|linkedin|github|resume|curriculum|vitae|\d{3}/i.test(item)) return false;
    const words = item.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 5) return false;
    return words.filter((word) => /^[A-Z][A-Za-z.'-]+$/.test(word) || /^[A-Z]{2,}$/.test(word)).length >= 2;
  });
  if (line) return line;

  const stem = String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/resume|cv|curriculum|vitae/ig, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (/^[A-Za-z.' -]{4,60}$/.test(stem)) return stem.replace(/\b[a-z]/g, (char) => char.toUpperCase());
  return "";
}

function normalizeUrl(value, base) {
  const text = cleanContact(value || "");
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text.replace(/\/$/, "");
  return (base && text.indexOf("/") === -1 ? base + text : "https://" + text).replace(/\/$/, "");
}

function cleanContact(value) {
  return String(value || "")
    .replace(/[<>()\[\]{}]/g, " ")
    .replace(/[;,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
