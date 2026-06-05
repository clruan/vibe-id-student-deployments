const fs = require("fs");
const path = require("path");
const vm = require("vm");

loadLocalEnv();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_ENDPOINT = process.env.DEEPSEEK_ENDPOINT || "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 90000;
const MAX_SOURCE_CHARS = 42000;
const MAX_FILE_TEXT_CHARS = 14000;

const COLORS = ["#087f7a", "#2563eb", "#b7791f", "#2f8f46", "#c2413d", "#6d5bd0", "#0f766e", "#475569"];

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
    return res.status(500).json({ error: "Missing DEEPSEEK_API_KEY. Set it in Vercel project environment variables." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const runs = clamp(Number(body.runs || 1), 1, 3);
    const student = normalizeStudent(body.student || {});
    const job = normalizeJob(body.job || {});
    const files = Array.isArray(body.files) ? body.files.slice(0, 18) : [];
    const resumeFile = files.find((file) => file && file.kind === "resume");

    if (!resumeFile) {
      return res.status(400).json({ error: "Resume file is required." });
    }
    if (!job.text) {
      return res.status(400).json({ error: "Job description is required." });
    }

    const parsedFiles = [];
    for (const file of files) {
      parsedFiles.push(await parseUploadedFile(file));
    }
    const parsedResume = parsedFiles.find((file) => file.kind === "resume");
    if (!isUsableResumeFile(parsedResume)) {
      const detail = parsedResume && parsedResume.parseError ? " Parser: " + parsedResume.parseError : "";
      return res.status(422).json({
        error: "Resume text could not be extracted. Please upload a DOCX/TXT resume or re-export the PDF as text-selectable before generating." + detail
      });
    }

    const sourcePack = buildSourcePack(student, job, parsedFiles);
    const variants = [];

    for (let run = 1; run <= runs; run += 1) {
      const draft = await generateDraft(sourcePack, run);
      const payload = normalizeV7Payload(draft, sourcePack, run);
      const html = buildV7Html(payload);
      variants.push({
        run,
        payload,
        html,
        htmlFileName: buildHtmlFileName(payload, run),
        diagnostics: {
          evidenceFiles: parsedFiles.length,
          parsedFiles: parsedFiles.map((file) => ({
            name: file.name,
            kind: file.kind,
            parseMode: file.parseMode,
            textChars: file.text.length
          })),
          riskCount: payload.atsProfile.riskFlags.length
        }
      });
    }

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      model: DEEPSEEK_MODEL,
      job: {
        id: job.id,
        label: job.label,
        targetRole: job.targetRole
      },
      variants
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Vibe ID generation failed." });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb"
    }
  }
};

function loadLocalEnv() {
  if (process.env.DEEPSEEK_API_KEY) return;
  const candidates = [
    path.join(process.cwd(), ".env")
  ];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    text.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) return;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
    });
  }
}

function normalizeStudent(input) {
  return {
    name: cleanText(input.name || ""),
    shortName: cleanText(input.shortName || input.name || ""),
    email: cleanText(input.email || ""),
    phone: cleanText(input.phone || ""),
    linkedin: cleanText(input.linkedin || ""),
    github: cleanText(input.github || ""),
    targetRole: cleanText(input.targetRole || ""),
    notes: cleanText(input.notes || "")
  };
}

function normalizeJob(input) {
  return {
    id: cleanId(input.id || "custom-jd"),
    label: cleanText(input.label || "Custom JD"),
    targetRole: cleanText(input.targetRole || ""),
    text: cleanText(input.text || ""),
    builtIn: Boolean(input.builtIn)
  };
}

async function parseUploadedFile(file) {
  const name = cleanText(file.name || "uploaded-file");
  const extension = cleanText(file.extension || path.extname(name).slice(1)).toLowerCase();
  const kind = file.kind === "resume" ? "resume" : "material";
  const size = Number(file.size || 0);
  const base = {
    name,
    extension,
    kind,
    size,
    type: cleanText(file.type || ""),
    parseMode: cleanText(file.parseMode || "inventory"),
    parseError: "",
    text: cleanSourceText(file.text || "").slice(0, MAX_FILE_TEXT_CHARS),
    dataUrl: ""
  };

  if (!file.base64) return base;

  const buffer = Buffer.from(String(file.base64 || ""), "base64");
  if (!buffer.length) return base;

  try {
    if (isImageExtension(extension)) {
      base.dataUrl = "data:" + mimeFromExtension(extension, base.type) + ";base64," + String(file.base64 || "");
      base.text = [
        base.text,
        "Image asset available for V7 visual evidence: " + name,
        "Use this screenshot/image in the closest matching project when source-backed."
      ].filter(Boolean).join("\n").slice(0, MAX_FILE_TEXT_CHARS);
      base.parseMode = "image-asset";
    } else if (extension === "pdf") {
      base.text = (await parsePdf(buffer)).slice(0, MAX_FILE_TEXT_CHARS);
      base.parseMode = "pdf-parse";
    } else if (extension === "docx" || extension === "doc") {
      base.text = (await parseDocx(buffer)).slice(0, MAX_FILE_TEXT_CHARS);
      base.parseMode = "mammoth";
    } else if (extension === "xlsx" || extension === "xls") {
      base.text = parseWorkbook(buffer).slice(0, MAX_FILE_TEXT_CHARS);
      base.parseMode = "xlsx";
    } else if (!base.text && isTextExtension(extension)) {
      base.text = buffer.toString("utf8").slice(0, MAX_FILE_TEXT_CHARS);
      base.parseMode = "server-text";
    }
  } catch (error) {
    base.parseMode = base.parseMode + "-failed";
    base.parseError = cleanText(error.message || "File parsing failed.");
  }

  return base;
}

async function parsePdf(buffer) {
  ensurePdfDomGlobals();
  const mod = require("pdf-parse");
  if (typeof mod === "function") {
    const result = await mod(buffer);
    return result.text || "";
  }
  if (mod && typeof mod.default === "function") {
    const result = await mod.default(buffer);
    return result.text || "";
  }
  if (mod && mod.PDFParse) {
    const parser = new mod.PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return typeof result === "string" ? result : (result && result.text) || "";
    } finally {
      if (parser.destroy) await parser.destroy();
    }
  }
  return "";
}

function ensurePdfDomGlobals() {
  if (typeof globalThis.DOMMatrix !== "undefined") return;
  try {
    const canvas = require("@napi-rs/canvas");
    if (canvas.DOMMatrix) {
      globalThis.DOMMatrix = canvas.DOMMatrix;
      return;
    }
  } catch (_) {
    // Fall through to a minimal matrix for pdfjs text extraction paths.
  }

  class SimpleDOMMatrix {
    constructor(init) {
      const values = Array.isArray(init) ? init : [];
      this.a = Number(values[0] ?? 1);
      this.b = Number(values[1] ?? 0);
      this.c = Number(values[2] ?? 0);
      this.d = Number(values[3] ?? 1);
      this.e = Number(values[4] ?? 0);
      this.f = Number(values[5] ?? 0);
    }
    scaleSelf(x, y) {
      const sx = Number(x ?? 1);
      const sy = Number(y ?? sx);
      this.a *= sx;
      this.b *= sx;
      this.c *= sy;
      this.d *= sy;
      return this;
    }
    translateSelf(x, y) {
      this.e += Number(x || 0);
      this.f += Number(y || 0);
      return this;
    }
    multiplySelf(other) {
      const m = other || {};
      const a = this.a * (m.a ?? 1) + this.c * (m.b ?? 0);
      const b = this.b * (m.a ?? 1) + this.d * (m.b ?? 0);
      const c = this.a * (m.c ?? 0) + this.c * (m.d ?? 1);
      const d = this.b * (m.c ?? 0) + this.d * (m.d ?? 1);
      const e = this.a * (m.e ?? 0) + this.c * (m.f ?? 0) + this.e;
      const f = this.b * (m.e ?? 0) + this.d * (m.f ?? 0) + this.f;
      Object.assign(this, { a, b, c, d, e, f });
      return this;
    }
  }
  globalThis.DOMMatrix = SimpleDOMMatrix;
}

async function parseDocx(buffer) {
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

function parseWorkbook(buffer) {
  const { unzipSync } = require("fflate");
  const files = unzipSync(new Uint8Array(buffer));
  const sharedStrings = parseSharedStrings(readZipText(files, "xl/sharedStrings.xml"));
  const workbookRels = parseWorkbookRelationships(readZipText(files, "xl/_rels/workbook.xml.rels"));
  const sheetNames = parseWorkbookSheetNames(readZipText(files, "xl/workbook.xml"));
  const worksheetPaths = Object.keys(files)
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .slice(0, 8);

  return worksheetPaths.map((sheetPath, index) => {
    const label = sheetNames[index] || workbookRels[sheetPath] || path.basename(sheetPath, ".xml");
    const values = parseWorksheetText(readZipText(files, sheetPath), sharedStrings);
    return ["[Sheet] " + label, values.join("\n")].join("\n");
  }).join("\n\n");
}

function readZipText(files, name) {
  const bytes = files[name];
  if (!bytes) return "";
  return Buffer.from(bytes).toString("utf8");
}

function parseSharedStrings(xml) {
  const out = [];
  String(xml || "").replace(/<si\b[\s\S]*?<\/si>/g, (entry) => {
    const text = [];
    entry.replace(/<t[^>]*>([\s\S]*?)<\/t>/g, (_, value) => {
      text.push(xmlDecode(value));
      return "";
    });
    out.push(text.join(""));
    return "";
  });
  return out;
}

function parseWorkbookRelationships(xml) {
  const out = {};
  String(xml || "").replace(/<Relationship\b([^>]*)\/?>/g, (_, attrs) => {
    const id = getXmlAttr(attrs, "Id");
    const target = getXmlAttr(attrs, "Target");
    if (id && target) out["xl/" + target.replace(/^\//, "")] = id;
    return "";
  });
  return out;
}

function parseWorkbookSheetNames(xml) {
  const out = [];
  String(xml || "").replace(/<sheet\b([^>]*)\/?>/g, (_, attrs) => {
    const name = getXmlAttr(attrs, "name");
    if (name) out.push(xmlDecode(name));
    return "";
  });
  return out;
}

function parseWorksheetText(xml, sharedStrings) {
  const out = [];
  String(xml || "").replace(/<c\b([^>]*)>([\s\S]*?)<\/c>/g, (_, attrs, body) => {
    const type = getXmlAttr(attrs, "t");
    const valueMatch = body.match(/<v[^>]*>([\s\S]*?)<\/v>/);
    const inlineMatch = body.match(/<t[^>]*>([\s\S]*?)<\/t>/);
    let value = "";
    if (type === "s" && valueMatch) value = sharedStrings[Number(valueMatch[1])] || "";
    else if (inlineMatch) value = xmlDecode(inlineMatch[1]);
    else if (valueMatch) value = xmlDecode(valueMatch[1]);
    value = cleanText(value);
    if (value) out.push(value);
    return "";
  });
  return out.slice(0, 1200);
}

function getXmlAttr(attrs, name) {
  const pattern = new RegExp(name + '="([^"]*)"', "i");
  const match = String(attrs || "").match(pattern);
  return match ? match[1] : "";
}

function xmlDecode(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function buildSourcePack(student, job, files) {
  const resume = files.find((file) => file.kind === "resume") || {};
  const materials = files.filter((file) => file.kind !== "resume");
  const imageAssets = files.filter((file) => file.dataUrl && isImageExtension(file.extension)).map((file) => ({
    name: file.name,
    extension: file.extension,
    type: file.type || mimeFromExtension(file.extension),
    dataUrl: file.dataUrl,
    size: file.size
  }));
  const workbookFiles = files.filter((file) => /^(xlsx|xls|csv|tsv)$/i.test(file.extension));
  const referenceV7 = loadKnownV7Reference(student, files);
  const inventory = files.map((file) => ({
    name: file.name,
    kind: file.kind,
    extension: file.extension,
    parseMode: file.parseMode,
    parseError: file.parseError || "",
    size: file.size,
    textChars: file.text.length,
    hasImageData: Boolean(file.dataUrl)
  }));
  const materialBlocks = materials.map((file) => [
    "## " + file.name,
    "Parse mode: " + file.parseMode,
    file.dataUrl ? "Image data URL is available for embedding in the generated V7 HTML." : "",
    file.text || "(inventory only)"
  ].filter(Boolean).join("\n"));
  const referenceText = referenceV7 ? summarizeReferenceV7(referenceV7) : "";

  const sourceText = [
    "[Student]",
    JSON.stringify(student, null, 2),
    "",
    "[Job]",
    job.text,
    "",
    "[Resume Text]",
    resume.text || "",
    "",
    "[Uploaded Materials - Worksheets, Code, Documents, Screenshots]",
    materialBlocks.join("\n\n"),
    "",
    "[Workbook Evidence]",
    workbookFiles.map((file) => ["## " + file.name, file.text || "(no workbook text extracted)"].join("\n")).join("\n\n"),
    "",
    "[Image Evidence]",
    imageAssets.map((file) => file.name + " - embeddable screenshot/image asset").join("\n"),
    "",
    referenceText ? "[Known V7 Reference For This Student]\n" + referenceText : "",
    "",
    "[File Inventory]",
    JSON.stringify(inventory, null, 2)
  ].join("\n").slice(0, MAX_SOURCE_CHARS);

  return {
    student,
    job,
    files,
    inventory,
    imageAssets,
    workbookFiles,
    referenceV7,
    resumeText: resume.text || "",
    materialText: materials.map((file) => file.text).filter(Boolean).join("\n\n").slice(0, 22000),
    sourceText,
    targetKeywords: extractKeywordsFromText(job.text)
  };
}

function isUsableResumeFile(file) {
  if (!file || file.kind !== "resume") return false;
  const text = cleanSourceText(file.text || "");
  if (/failed/i.test(file.parseMode || "") && text.length < 500) return false;
  if (!text || text.length < 120) return false;
  if (/^parse warning\b/i.test(text)) return false;
  const alphaCount = (text.match(/[A-Za-z]/g) || []).length;
  return alphaCount >= 40;
}

function loadKnownV7Reference(student, files) {
  const haystack = [
    student.name,
    student.email,
    student.notes,
    files.map((file) => file.name).join(" "),
    files.map((file) => file.text).join(" ").slice(0, 4000)
  ].join(" ");

  if (!/kailin/i.test(haystack)) return null;

  const filePath = path.join(process.cwd(), "AI_Resume_User_V7", "assets", "data", "kailin.js");
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const sandbox = {
      window: {
        aiResumeData: {},
        aiResumeProfileAliases: {}
      }
    };
    vm.runInNewContext(code, sandbox, { timeout: 1000, filename: "kailin.js" });
    return clonePlain(sandbox.window.aiResumeData["kailin-liu"]);
  } catch (_) {
    return null;
  }
}

function summarizeReferenceV7(reference) {
  if (!reference) return "";
  const projects = normalizeArray(reference.projects).map((project) => [
    project.id,
    project.title,
    project.source,
    project.summary,
    normalizeStringArray(project.owned).slice(0, 3).join("; ")
  ].filter(Boolean).join(" | "));
  const skills = normalizeStringArray(reference.analyticalSkills).concat(normalizeStringArray(reference.stack)).slice(0, 28);
  return [
    "Reference profile: " + (reference.profile && reference.profile.name || reference.id || "known student"),
    "Use this only as a V7 style/source anchor for the same uploaded student.",
    "Skill layout: " + JSON.stringify(reference.skillLayout || {}),
    "Skills: " + skills.join(", "),
    "Reference projects:",
    projects.join("\n")
  ].join("\n").slice(0, 9000);
}

function mergeReferenceV7Payload(payload, sourcePack) {
  const reference = sourcePack.referenceV7;
  if (!reference) return payload;

  const localized = localizeReferenceMedia(clonePlain(reference), sourcePack);
  const merged = Object.assign({}, payload);
  const refProfile = localized.profile || {};
  const generatedProfile = payload.profile || {};
  const sourceTargetRole = cleanText(sourcePack.student.targetRole || sourcePack.job.targetRole || payload.targetRole || generatedProfile.targetRole || refProfile.targetRole);

  merged.targetRole = sourceTargetRole || payload.targetRole;
  merged.profile = Object.assign({}, refProfile, generatedProfile, {
    name: generatedProfile.name || refProfile.name,
    shortName: generatedProfile.shortName || refProfile.shortName || refProfile.name,
    location: generatedProfile.location || refProfile.location || "",
    phone: generatedProfile.phone || refProfile.phone || "",
    email: generatedProfile.email || refProfile.email || "",
    linkedin: generatedProfile.linkedin || refProfile.linkedin || "",
    github: generatedProfile.github || refProfile.github || "",
    targetRole: sourceTargetRole || generatedProfile.targetRole || refProfile.targetRole,
    summary: generatedProfile.summary || refProfile.summary || "",
    summaryHtml: generatedProfile.summaryHtml || refProfile.summaryHtml || ""
  });
  merged.links = mergeLinks(payload.links, localized.links);
  merged.skillLayout = localized.skillLayout || payload.skillLayout;
  merged.profileMaterialsMode = localized.profileMaterialsMode || payload.profileMaterialsMode;
  merged.hideProfileSourceLinks = Boolean(localized.hideProfileSourceLinks || payload.hideProfileSourceLinks);
  merged.hideAtsKeywordLayer = Boolean(localized.hideAtsKeywordLayer || payload.hideAtsKeywordLayer);

  if (localized.analyticalSkills && localized.analyticalSkills.length) merged.analyticalSkills = localized.analyticalSkills;
  if (localized.stack && localized.stack.length) merged.stack = localized.stack;
  if (localized.licensesCertifications && localized.licensesCertifications.length) merged.licensesCertifications = localized.licensesCertifications;
  if (localized.education && localized.education.length) merged.education = localized.education;
  if (localized.coursework && localized.coursework.length) merged.coursework = localized.coursework;
  if (localized.awards && localized.awards.length) merged.awards = localized.awards;
  if (localized.publications) merged.publications = localized.publications;
  if (localized.peerEvaluations && localized.peerEvaluations.length) merged.peerEvaluations = localized.peerEvaluations;
  if (localized.results && localized.results.length) merged.results = localized.results;

  if (localized.experience && localized.experience.length) {
    merged.experience = cloneReferenceExperience(localized.experience, merged.atsProfile && merged.atsProfile.targetKeywords || [], (merged.stack || []).map((item) => item.label));
  }
  if (localized.projects && localized.projects.length) {
    merged.projects = localized.projects.slice(0, 7).map((project) => normalizeReferenceProject(project));
    attachImageEvidence(merged.projects, sourcePack);
  }

  merged.atsProfile = Object.assign({}, localized.atsProfile || {}, payload.atsProfile || {}, {
    targetKeywords: mergeKeywords(
      payload.atsProfile && payload.atsProfile.targetKeywords,
      localized.atsProfile && localized.atsProfile.targetKeywords
    ),
    parseSignals: mergeKeywords(
      localized.atsProfile && localized.atsProfile.parseSignals,
      payload.atsProfile && payload.atsProfile.parseSignals
    ),
    riskFlags: mergeKeywords(
      payload.atsProfile && payload.atsProfile.riskFlags,
      localized.atsProfile && localized.atsProfile.riskFlags
    )
  });

  merged.ui = Object.assign({}, localized.ui || {}, payload.ui || {
    metaTitle: merged.profile.shortName + " | Generated Vibe ID V7"
  });
  merged.generation = Object.assign({}, payload.generation, {
    referenceV7: localized.id || "known-v7-reference"
  });

  return merged;
}

function localizeReferenceMedia(reference, sourcePack) {
  const imageMap = buildImageAssetMap(sourcePack);
  if (reference.profile && reference.profile.photo) {
    const asset = findImageAsset(reference.profile.photo, imageMap) || findImageAsset(reference.profile.name + " portrait", imageMap);
    if (asset) reference.profile.photo = asset.dataUrl;
  }
  normalizeArray(reference.projects).forEach((project) => {
    project.screenshots = normalizeArray(project.screenshots).map((shot, index) => {
      const asset = findImageAsset(shot.src || shot.name || shot.caption, imageMap);
      return Object.assign({}, shot, {
        src: asset ? asset.dataUrl : shot.src,
        alt: cleanText(shot.alt || project.title + " screenshot " + (index + 1)),
        caption: cleanText(shot.caption || asset && captionFromFileName(asset.name) || "Screenshot " + (index + 1))
      });
    }).filter((shot) => shot && shot.src);
  });
  return reference;
}

function cloneReferenceExperience(items, keywords, stackLabels) {
  return normalizeArray(items).map((item, index) => {
    const bullets = Array.isArray(item.bullets) ? item.bullets.filter(Boolean).slice(0, 5) : [];
    const explicit = normalizeStringArray(item.readMoreKeywords);
    return {
      id: cleanId(item.id || item.role || item.organization || "exp-" + index),
      role: cleanText(item.role || "Experience"),
      originalRole: cleanText(item.originalRole || ""),
      organization: cleanText(item.organization || item.company || ""),
      location: cleanText(item.location || ""),
      dates: cleanText(item.dates || item.date || ""),
      bullets,
      readMoreKeywords: bullets.slice(1).map((bullet, hiddenIndex) =>
        formatReadMoreKeyword(explicit[hiddenIndex] || chooseReadMoreKeyword(stripTags(bullet), keywords, stackLabels), keywords, stackLabels)
      ).filter(Boolean),
      relatedTech: normalizeStringArray(item.relatedTech).map(cleanId),
      relatedProjects: normalizeStringArray(item.relatedProjects).map(cleanId)
    };
  }).filter((item) => item.bullets.length || item.role || item.organization).slice(0, 8);
}

function normalizeReferenceProject(project) {
  const copy = clonePlain(project);
  copy.id = cleanId(copy.id || copy.title || copy.navTitle || "project");
  copy.title = cleanText(copy.title || copy.navTitle || "Selected Project");
  copy.navTitle = cleanText(copy.navTitle || copy.title);
  copy.navMeta = cleanText(copy.navMeta || copy.source || "");
  copy.source = cleanText(copy.source || "");
  copy.summary = cleanText(copy.summary || copy.tagline || "");
  copy.owned = Array.isArray(copy.owned) ? copy.owned.map(cleanText).filter(Boolean).slice(0, 6) : [];
  copy.metrics = normalizeMetrics(copy.metrics);
  copy.relatedTech = normalizeStringArray(copy.relatedTech).map(cleanId);
  copy.relatedExp = normalizeStringArray(copy.relatedExp).map(cleanId);
  copy.stages = normalizeStages(copy.stages, copy.title);
  copy.screenshots = normalizeArray(copy.screenshots).map((shot, index) => ({
    src: cleanText(shot.src || ""),
    alt: cleanText(shot.alt || copy.title + " screenshot " + (index + 1)),
    caption: cleanText(shot.caption || "Screenshot " + (index + 1))
  })).filter((shot) => shot.src).slice(0, 8);
  return copy;
}

function mergeLinks(primary, secondary) {
  const seen = new Set();
  return normalizeArray(primary).concat(normalizeArray(secondary)).filter((link) => {
    const key = cleanComparable((link && (link.href || link.value || link.label)) || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
}

async function generateDraft(sourcePack, run) {
  const system = [
    "You create source-backed Vibe ID V7 payload drafts.",
    "Use only the supplied resume text, source notes, uploaded materials, file inventory, GitHub/URL notes, and job description.",
    "Do not invent employers, dates, degrees, metrics, tools, management scope, cloud platforms, publications, GPA, or contact information.",
    "If evidence is missing, place the gap in riskFlags or missingEvidence instead of filling it.",
    "Return valid JSON only. No markdown fences."
  ].join(" ");

  const user = [
    "[Task]",
    `Generate V7 payload draft run ${run}.`,
    `Target role: ${sourcePack.job.targetRole || "infer from JD"}.`,
    "",
    "[V7 Rules]",
    "- profile, directory, atsProfile, stack, quantToolkit, experience, projects, education, coursework, profileMaterials, and ui should be present when source supports them.",
    "- Experience bullets should be source-backed and concise. Use 2-4 bullets for each included experience when the source supports more than one fact; the first bullet is the V7 preview and later bullets power Read more.",
    "- Uploaded worksheets are first-class evidence. Extract product/project stages, user segments, MVP choices, blocker logs, metrics, and tool evidence from workbook text instead of treating worksheets as filenames.",
    "- Uploaded screenshots/images must be used as visual evidence when relevant. Attach them to the closest matching project through screenshots[].",
    "- Projects should include title/navTitle/source/summary/owned/metrics/relatedTech/stages/screenshots when evidence supports them.",
    "- Projects must be written like Duke V7 demos, not generic portfolio cards: name the workflow problem, the operating knob/lens, the evidence path, the output, and the honest limitation.",
    "- Project demo content must be flow-first and concise: 3 concrete stages by default, each stage renders as Input -> Logic -> Output.",
    "- For each stage, provide short titles and at most 1-2 short lines per column. Avoid paragraphs and vague stage labels like Research/Build/Result unless the source only supports that level.",
    "- When source supports a product, analytics, ML, clinical, finance, or evidence-review workflow, include a lightweight interactive demo scaffold through flow steps, not long explanation text. Do not invent screenshots, live links, or numeric metrics.",
    "- For every experience, include readMoreKeywords for hidden bullets after the first bullet. Each entry must be one or two high-signal keywords; join two with ' + '. Do not include ellipses, slashes, commas, trailing punctuation, or more than two concepts.",
    "- Include an ATS keyword layer only: target keywords, matched keywords, missing keywords, source-backed suggestions, and risk flags. Do not assign numeric scores.",
    "- Keep V7 project count focused: 3-5 projects unless the source clearly needs more.",
    "- Include riskFlags for overreach, missing evidence, stretch JD requirements, and source parsing limitations.",
    "",
    "[Return JSON schema]",
    "{",
    '  "profile": {"name":"","shortName":"","location":"","phone":"","email":"","linkedin":"","github":"","targetRole":"","summary":""},',
    '  "directory": {"role":"","summary":"","highlights":[""]},',
    '  "atsProfile": {"targetRole":"","targetKeywords":[""],"matchedKeywords":[""],"missingKeywords":[""],"suggestions":[""],"parseSignals":[""],"riskFlags":[""]},',
    '  "skillLayout": {"primary":{"group":"","title":""},"secondary":[{"group":"","title":""}],"hideExperienceContext":false},',
    '  "analyticalSkills": [{"label":"","relatedProjects":[],"relatedExp":[]}],',
    '  "licensesCertifications": [{"label":""}],',
    '  "stack": [{"label":""}],',
    '  "quantToolkit": [{"label":"","relatedProjects":[],"relatedExp":[]}],',
    '  "experience": [{"id":"","role":"","organization":"","location":"","dates":"","bullets":[""],"readMoreKeywords":[""],"relatedTech":[],"relatedProjects":[]}],',
    '  "projects": [{"id":"","title":"","navTitle":"","navMeta":"","source":"","summary":"","owned":[""],"metrics":[{"label":"","value":"","category":""}],"relatedTech":[],"screenshots":[{"src":"","alt":"","caption":""}],"stages":[{"label":"","inputTitle":"","inputLines":[""],"operationTitle":"","operationLines":[""],"outputTitle":"","outputLines":[""],"pmNote":""}]}],',
    '  "education": [{"institution":"","school":"","degree":"","dates":"","location":"","gpa":"","details":""}],',
    '  "coursework": [{"title":"","bullets":[""]}],',
    '  "profileMaterials": [{"label":"","type":"","href":"","note":""}],',
    '  "missingEvidence": [""]',
    "}",
    "",
    "[Source Pack]",
    sourcePack.sourceText
  ].join("\n");

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
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
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
        temperature: 0.28 + run * 0.06,
        max_tokens: 6000,
        stream: false
      })
    });
  } finally {
    clearTimeout(timeout);
  }

  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    const message = payload.error && payload.error.message ? payload.error.message : "DeepSeek request failed";
    throw new Error(message);
  }

  const content = payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content;
  let draft;
  try {
    draft = parseJsonObject(content || "{}");
  } catch (error) {
    if (!sourcePack.referenceV7) throw error;
    draft = clonePlain(sourcePack.referenceV7);
    draft.missingEvidence = normalizeStringArray(draft.missingEvidence).concat([
      "DeepSeek returned malformed JSON, so the known V7 reference for the uploaded student was used as a structural fallback."
    ]);
    draft._parseWarning = error.message;
  }
  draft._meta = {
    elapsedSeconds: Math.round((Date.now() - started) / 100) / 10,
    finishReason: payload.choices && payload.choices[0] && payload.choices[0].finish_reason
  };
  return draft;
}

function normalizeV7Payload(draft, sourcePack, run) {
  const student = sourcePack.student;
  const job = sourcePack.job;
  const reference = sourcePack.referenceV7 || {};
  const profileDraft = draft.profile || {};
  const name = cleanText(profileDraft.name || student.name || inferName(sourcePack.resumeText) || "Generated Student");
  const shortName = cleanText(profileDraft.shortName || student.shortName || name);
  const targetRole = cleanText(student.targetRole || job.targetRole || profileDraft.targetRole || draft.atsProfile && draft.atsProfile.targetRole || "Target Role");
  const keywords = mergeKeywords(
    sourcePack.targetKeywords,
    draft.atsProfile && draft.atsProfile.targetKeywords
  ).slice(0, 30);
  const stack = normalizeStack(draft.stack && draft.stack.length ? draft.stack : reference.stack, keywords);
  const stackLabels = stack.map((item) => item.label);
  const analyticalSkills = normalizeSkillItems(
    draft.analyticalSkills && draft.analyticalSkills.length ? draft.analyticalSkills : reference.analyticalSkills,
    keywords,
    "analytical"
  );
  const licensesCertifications = normalizeSkillItems(
    draft.licensesCertifications && draft.licensesCertifications.length ? draft.licensesCertifications : reference.licensesCertifications,
    [],
    "cert"
  );
  const experiences = normalizeExperience(draft.experience, keywords, stackLabels);
  const projects = normalizeProjects(draft.projects, keywords, experiences, sourcePack);
  const risks = mergeKeywords(
    draft.atsProfile && draft.atsProfile.riskFlags,
    draft.missingEvidence
  ).concat(buildParseRisks(sourcePack)).slice(0, 8);

  let payload = {
    id: cleanId(shortName || name) + "-v7-generated-run-" + pad2(run),
    order: 1,
    targetRole,
    profile: {
      name,
      shortName,
      location: cleanText(profileDraft.location || ""),
      phone: cleanText(profileDraft.phone || student.phone || ""),
      email: cleanText(profileDraft.email || student.email || ""),
      linkedin: cleanText(profileDraft.linkedin || student.linkedin || ""),
      github: cleanText(profileDraft.github || student.github || ""),
      targetRole,
      summary: cleanText(profileDraft.summary || draft.directory && draft.directory.summary || ""),
      summaryHtml: emphasizeSummary(cleanText(profileDraft.summary || draft.directory && draft.directory.summary || ""), keywords)
    },
    links: buildLinks(profileDraft, student),
    documents: {
      resume: sourcePack.files.find((file) => file.kind === "resume") && sourcePack.files.find((file) => file.kind === "resume").name
    },
    directory: {
      role: cleanText(draft.directory && draft.directory.role || targetRole),
      summary: cleanText(draft.directory && draft.directory.summary || profileDraft.summary || ""),
      highlights: normalizeStringArray(draft.directory && draft.directory.highlights).slice(0, 4)
    },
    atsProfile: {
      split: "Vibe ID Generator run " + pad2(run),
      targetRole,
      keywordLayerUse: "Generated from uploaded source packet, selected JD, and V7 payload rules.",
      targetKeywords: keywords,
      parseSignals: normalizeStringArray(draft.atsProfile && draft.atsProfile.parseSignals).concat([
        "Resume is required; supporting materials are optional evidence.",
        "Read-more keywords are explicit where DeepSeek supplied them and template-scored otherwise."
      ]).slice(0, 8),
      riskFlags: risks
    },
    skillLayout: normalizeSkillLayout(draft.skillLayout || reference.skillLayout, analyticalSkills, licensesCertifications),
    profileMaterialsMode: cleanText(draft.profileMaterialsMode || reference.profileMaterialsMode || ""),
    hideProfileSourceLinks: Boolean(draft.hideProfileSourceLinks || reference.hideProfileSourceLinks),
    hideAtsKeywordLayer: Boolean(draft.hideAtsKeywordLayer || reference.hideAtsKeywordLayer),
    analyticalSkills,
    licensesCertifications,
    stack,
    quantToolkit: normalizeQuantToolkit(draft.quantToolkit, keywords),
    experience: experiences,
    projects,
    education: normalizeEducation(draft.education),
    coursework: normalizeCoursework(draft.coursework),
    profileMaterials: normalizeProfileMaterials(draft.profileMaterials, sourcePack.inventory),
    ui: {
      metaTitle: shortName + " | Generated Vibe ID V7",
      metaDescription: "Generated Vibe ID V7 payload for " + name + ".",
      resultsTitle: "Featured Evidence",
      projectsTitle: job.label ? job.label + " - Selected Projects" : "Selected Projects",
      experienceTitle: "Experience",
      courseworkTitle: "Relevant Coursework & Applied Projects",
      educationTitle: "Education",
      awardsTitle: "Awards",
      publicationsTitle: "Publications",
      profileMaterialsTitle: "Profile Materials",
      chatTitle: "Ask about " + shortName,
      chatPlaceholder: "Ask about fit for " + targetRole + "...",
      chatGreeting: "Hi. I can answer questions about " + shortName + "'s source-backed fit."
    },
    generation: {
      kind: "vibe-id-generator-v7",
      model: DEEPSEEK_MODEL,
      run,
      generatedAt: new Date().toISOString(),
      sourceFiles: sourcePack.inventory
    }
  };

  payload = mergeReferenceV7Payload(payload, sourcePack);
  payload.projects = applyDukeProjectBlueprints(
    payload.projects || [],
    keywords,
    payload.experience || [],
    sourcePack
  );
  payload.atsProfile = Object.assign({}, payload.atsProfile, buildAtsKeywordLayer(payload, sourcePack));
  return payload;
}

function buildV7Html(payload) {
  const profileId = payload.id || cleanId(payload.profile && payload.profile.name || "generated-vibe-id");
  const title = payload.ui && payload.ui.metaTitle || ((payload.profile && payload.profile.name || "Generated Vibe ID") + " | V7");
  const description = payload.ui && payload.ui.metaDescription || "Generated Vibe ID V7 page.";
  const css = readV7Asset("styles.css");
  const scripts = [
    "template-engine.js",
    "js/icons.js",
    "js/state.js",
    "js/modes.js",
    "js/three-bg.js",
    "js/pages.js",
    "js/widgets.js",
    "js/skills.js",
    "js/projects.js",
    "js/chat.js",
    "app.js"
  ].map((file) => {
    const source = readV7Asset(file);
    return source ? "<script>\n" + source + "\n</script>" : "";
  }).join("\n");

  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <meta http-equiv="Cache-Control" content="no-store">',
    "  <title>" + escapeHtml(title) + "</title>",
    '  <meta name="description" content="' + escapeHtml(description) + '">',
    "  <style>",
    css,
    "  </style>",
    "</head>",
    '<body data-generated-vibe-id="true">',
    '  <canvas id="bg-canvas"></canvas>',
    '  <div id="page-container" class="page-container">',
    '    <section class="page-section" id="page-1" data-page="1">',
    '      <div class="page-1-flow">',
    '        <div class="page-inner page-1-inner">',
    '          <div class="hero-identity">',
    '            <div class="hero-text">',
    '              <div class="hero-title-row">',
    '                <h1 id="hero-name"></h1>',
    '              </div>',
    '              <p class="hero-summary" id="hero-summary"></p>',
    '              <div class="hero-contact" id="hero-contact"></div>',
    '            </div>',
    '          </div>',
    '          <div class="hero-results">',
    '            <h2 id="results-title">Featured AI Projects</h2>',
    '            <div class="results-grid" id="results-grid"></div>',
    '          </div>',
    '        </div>',
    '        <section class="intro-skills" id="intro-skills">',
    '          <div class="skill-filter-head">',
    '            <div>',
    '              <h2>Filter by Skills</h2>',
    '              <p>Select one or more skills to focus the projects and experience sections.</p>',
    '            </div>',
    '            <button class="skill-filter-clear" type="button" data-skill-clear hidden>Clear filters</button>',
    '          </div>',
    '          <div class="intro-skills-grid">',
    '            <div class="skill-panel">',
    '              <h3>Quantitative Toolkit</h3>',
    '              <div class="quant-grid" data-skill-group="quant" data-skill-slot="intro"></div>',
    '            </div>',
    '            <div class="skill-panel">',
    '              <h3>Technical Stack</h3>',
    '              <div class="tag-list" data-skill-group="stack" data-skill-slot="intro"></div>',
    '            </div>',
    '          </div>',
    '          <div class="skill-filter-results" id="skill-filter-results" aria-live="polite"></div>',
    '        </section>',
    '      </div>',
    '    </section>',
    '    <section class="page-section" id="page-2" data-page="2">',
    '      <div class="page-inner page-2-inner">',
    '        <div class="page-2-content">',
    '          <section class="exp-section">',
    '            <h2 id="experience-title">Experience</h2>',
    '            <div id="experience-list"></div>',
    '          </section>',
    '        </div>',
    '      </div>',
    '    </section>',
    '    <section class="page-section" id="page-3" data-page="3">',
    '      <div class="page-inner page-3-inner">',
    '        <div class="page-3-content">',
    '          <section class="projects-section">',
    '            <h2 id="projects-title">Projects</h2>',
    '            <div id="projects-accordion"></div>',
    '          </section>',
    '        </div>',
    '      </div>',
    '    </section>',
    '    <section class="page-section" id="page-4" data-page="4">',
    '      <div class="page-inner page-4-inner">',
    '        <section class="edu-section">',
    '          <h2 id="education-title">Education</h2>',
    '          <div id="education-list"></div>',
    '        </section>',
    '        <section class="awards-section">',
    '          <h2 id="awards-title">Awards</h2>',
    '          <div id="awards-list"></div>',
    '        </section>',
    '        <section class="pub-section">',
    '          <h2 id="publications-title">Publications</h2>',
    '          <div id="publications-list"></div>',
    '        </section>',
    '        <section class="coursework-section profile-materials-section" id="coursework-section">',
    '          <h2 id="coursework-title">Relevant Coursework & Applied Projects</h2>',
    '          <div id="coursework-list"></div>',
    '        </section>',
    '        <section class="profile-materials-section" id="profile-materials-section">',
    '          <h2 id="profile-materials-title">Profile Materials</h2>',
    '          <div class="profile-materials-grid" id="profile-materials-grid"></div>',
    '        </section>',
    '      </div>',
    '    </section>',
    '  </div>',
    '  <nav class="page-nav" id="page-nav">',
    '    <button class="page-dot text-dot active" data-target="1" aria-label="Intro"><span>Intro</span></button>',
    '    <button class="page-dot text-dot" data-target="2" aria-label="Experience"><span>Experience</span></button>',
    '    <button class="page-dot text-dot" data-target="3" aria-label="Projects"><span>Projects</span></button>',
    '    <button class="page-dot text-dot" data-target="4" aria-label="Details"><span>Details</span></button>',
    '  </nav>',
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>',
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>',
    '  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js"></script>',
    "  <script>",
    "    window.aiResumeData = {};",
    "    window.aiResumeProfileAliases = {};",
    "    window.aiResumeDefaultProfile = " + safeJsonForScript(profileId) + ";",
    "    window.aiResumeData[" + safeJsonForScript(profileId) + "] = " + safeJsonForScript(payload) + ";",
    "    window.aiResumeProfileAliases.generated = " + safeJsonForScript(profileId) + ";",
    "    window.aiResumeProfileAliases['" + profileId.replace(/'/g, "\\'") + "'] = " + safeJsonForScript(profileId) + ";",
    "  </script>",
    scripts,
    "</body>",
    "</html>"
  ].join("\n");
}

function readV7Asset(file) {
  const fullPath = path.join(process.cwd(), "AI_Resume_User_V7", "assets", file);
  try {
    return fs.readFileSync(fullPath, "utf8");
  } catch (_) {
    return "";
  }
}

function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildHtmlFileName(payload, run) {
  const profile = payload.profile || {};
  const stem = cleanId(profile.shortName || profile.name || "vibe-id");
  return stem + "-v7-run-" + pad2(run) + ".html";
}

function normalizeStack(items, keywords) {
  const source = Array.isArray(items) && items.length ? items : keywords.slice(0, 14);
  return source.map((item, index) => {
    const label = cleanText(typeof item === "string" ? item : item.label || item.name || item.id || "");
    if (!label) return null;
    return {
      id: cleanId(label),
      label,
      color: item.color || COLORS[index % COLORS.length]
    };
  }).filter(Boolean).slice(0, 22);
}

function normalizeQuantToolkit(items, keywords) {
  const source = Array.isArray(items) && items.length ? items : keywords.slice(0, 16).map((label) => ({ label }));
  return source.map((item) => {
    const label = cleanText(typeof item === "string" ? item : item.label || item.name || "");
    if (!label) return null;
    return {
      label,
      relatedProjects: normalizeStringArray(item.relatedProjects),
      relatedExp: normalizeStringArray(item.relatedExp)
    };
  }).filter(Boolean).slice(0, 28);
}

function normalizeExperience(items, keywords, stackLabels) {
  return normalizeArray(items).map((item, index) => {
    const bullets = normalizeStringArray(item.bullets).slice(0, 5);
    const explicit = normalizeStringArray(item.readMoreKeywords);
    const hiddenBullets = bullets.slice(1);
    const readMoreKeywords = hiddenBullets.map((bullet, hiddenIndex) =>
      formatReadMoreKeyword(explicit[hiddenIndex] || chooseReadMoreKeyword(bullet, keywords, stackLabels), keywords, stackLabels)
    ).filter(Boolean);
    return {
      id: cleanId(item.id || item.role || item.organization || "exp-" + index),
      role: cleanText(item.role || "Experience"),
      organization: cleanText(item.organization || item.company || ""),
      location: cleanText(item.location || ""),
      dates: cleanText(item.dates || item.date || ""),
      bullets,
      readMoreKeywords,
      relatedTech: normalizeStringArray(item.relatedTech).map(cleanId),
      relatedProjects: normalizeStringArray(item.relatedProjects).map(cleanId)
    };
  }).filter((item) => item.bullets.length || item.role || item.organization).slice(0, 7);
}

function normalizeProjects(items, keywords, experiences, sourcePack) {
  const source = normalizeArray(items);
  const fallbackTech = keywords.slice(0, 5).map(cleanId);
  const projects = source.map((item, index) => {
    const id = cleanId(item.id || item.title || "project-" + index);
    const title = cleanText(item.title || item.navTitle || "Selected Project");
    return {
      id,
      title,
      navTitle: cleanText(item.navTitle || title),
      navMeta: cleanText(item.navMeta || item.source || "Uploaded material"),
      source: cleanText(item.source || "Uploaded material"),
      summary: cleanText(item.summary || ""),
      algorithmSummary: cleanText(item.algorithmSummary || item.summary || ""),
      owned: normalizeStringArray(item.owned).slice(0, 5),
      metrics: normalizeMetrics(item.metrics),
      endorsement: normalizeEndorsement(item.endorsement),
      artifactLinks: normalizeArtifactLinks(item.artifactLinks || item.links),
      relatedTech: normalizeStringArray(item.relatedTech).map(cleanId).concat(fallbackTech).filter(unique).slice(0, 8),
      relatedExp: normalizeStringArray(item.relatedExp).map(cleanId),
      screenshots: normalizeScreenshots(item.screenshots, sourcePack, title),
      stages: normalizeStages(item.stages, title),
      widget: normalizeProjectWidget(item.widget)
    };
  }).filter((project) => project.title || project.summary).slice(0, 6);

  attachImageEvidence(projects, sourcePack);
  return applyDukeProjectBlueprints(projects, keywords, experiences, sourcePack);
}

function normalizeEndorsement(value) {
  if (!value || typeof value !== "object") return null;
  const text = cleanText(value.text || value.quote || value.summary || "");
  const by = cleanText(value.by || value.name || value.source || "");
  const role = cleanText(value.role || value.title || "");
  if (!text && !by) return null;
  return { text, by, role };
}

function normalizeArtifactLinks(items) {
  return normalizeArray(items).map((item, index) => ({
    label: cleanText(item.label || item.name || "Source " + (index + 1)),
    href: cleanText(item.href || item.url || ""),
    note: cleanText(item.note || item.type || item.description || "")
  })).filter((item) => item.label || item.href).slice(0, 6);
}

function normalizeProjectWidget(widget) {
  if (!widget || typeof widget !== "object") return null;
  const type = cleanText(widget.type || "");
  if (!type) return null;
  return Object.assign({}, widget, {
    type,
    title: cleanText(widget.title || ""),
    help: cleanText(widget.help || ""),
    note: cleanText(widget.note || "")
  });
}

function normalizeStages(stages, title) {
  const source = normalizeArray(stages);
  if (!source.length) {
    return [{
      label: "Frame",
      inputTitle: "Source evidence",
      inputLines: [title],
      operationTitle: "V7 synthesis",
      operationLines: ["Map evidence to JD signals", "Keep source-backed claims only"],
      outputTitle: "Reviewable result",
      outputLines: ["Project summary", "Relevant metrics"],
      pmNote: "Presented as hiring evidence, not a generic portfolio card."
    }];
  }
  return source.map((stage, index) => ({
    label: compactStageText(stage.label || "Stage " + (index + 1), 22),
    inputTitle: compactStageText(stage.inputTitle || "Input", 42),
    inputLines: compactStageLines(stage.inputLines),
    operationTitle: compactStageText(stage.operationTitle || "Operation", 42),
    operationLines: compactStageLines(stage.operationLines),
    outputTitle: compactStageText(stage.outputTitle || "Output", 42),
    outputLines: compactStageLines(stage.outputLines),
    pmNote: compactStageText(stage.pmNote || "", 110)
  })).slice(0, 3);
}

function compactStageLines(lines) {
  return normalizeStringArray(lines).map((line) => compactStageText(line, 64)).filter(Boolean).slice(0, 2);
}

function compactStageText(value, max) {
  const text = cleanText(value);
  if (!text || text.length <= max) return text;
  return text.slice(0, Math.max(4, max - 1)).replace(/\s+\S*$/, "") + "...";
}

function applyDukeProjectBlueprints(projects, keywords, experiences, sourcePack) {
  return projects.map((project, index) => {
    const kind = inferProjectDemoKind(project, keywords, sourcePack);
    const enriched = Object.assign({}, project);
    enriched.demoKind = kind;
    enriched.accent = enriched.accent || COLORS[index % COLORS.length];
    enriched.algorithmSummary = enriched.algorithmSummary || buildProjectAlgorithmSummary(enriched, kind);
    enriched.stages = enrichProjectStages(enriched, kind);
    enriched.metrics = enrichProjectMetrics(enriched, kind, keywords);
    enriched.widget = enriched.widget || buildProjectWidget(enriched, kind);
    enriched.relatedTech = enrichProjectTech(enriched, kind, keywords);
    enriched.owned = enrichOwnedWork(enriched, kind);
    linkProjectsToExperience(enriched, experiences);
    return enriched;
  });
}

function inferProjectDemoKind(project, keywords, sourcePack) {
  const text = cleanComparable([
    project.id,
    project.title,
    project.navTitle,
    project.navMeta,
    project.source,
    project.summary,
    project.algorithmSummary,
    (project.owned || []).join(" "),
    (project.relatedTech || []).join(" "),
    (project.stages || []).map((stage) => [
      stage.label,
      stage.inputTitle,
      (stage.inputLines || []).join(" "),
      stage.operationTitle,
      (stage.operationLines || []).join(" "),
      stage.outputTitle,
      (stage.outputLines || []).join(" ")
    ].join(" ")).join(" ")
  ].join(" "));

  if (/nd2|microscopythreshold|thresholdsweep|imageanalysisagent/.test(text)) return "nd2";
  if (/cnn|unet|medsam|deeplab|fibrosis|histopathology|microscopy|microscopyimage|cellinfiltration|segmentationmask|layeractivation/.test(text)) return "neural";
  if (/survival|kaplanmeier|cox|hazard|clinical|biostat|vte|propensity|competingrisk/.test(text)) return "survival";
  if (/knowledgegraph|graphqa|citation|evidence|researchagent|claim|sourcequality|hypothesis|rag|llm/.test(text)) return "evidence";
  if (/matching|ranking|embedding|vector|ats|resumejob|precision|recall|classifier|modelevaluation/.test(text)) return "tradeoff";
  if (/marketing|gtm|campaign|userinsight|productmarketing|growth|advertiser|positioning|measurement|analytics|lumina|travelplanner|marketpulse|marketresearch|marketmonitoring|catalysttracking/.test(text)) return "timeline";
  if (/nlp|medicaltext|semantic|dictionary|extraction|negation|certainty/.test(text)) return "nlp";
  if (/clustering|cluster|som|topology|segmentation|cohort/.test(text)) return "cluster";
  return "workflow";
}

function buildProjectAlgorithmSummary(project, kind) {
  const title = project.navTitle || project.title || "project";
  const map = {
    nd2: "The useful layer is the operating control: study metadata, cached threshold curves, channel selection, replicate behavior, and export status move together.",
    neural: "The demo should make the model path inspectable: input signal, learned activation field, output confidence, and export gate stay visible.",
    survival: "The project is strongest when the cohort definition, estimator choice, assumption check, and collaborator-facing interpretation are shown together.",
    tradeoff: "The core logic is a measurable tradeoff: change the run configuration, then inspect precision, recall, ranking quality, and the chosen operating point.",
    evidence: "The review surface should show how claims connect to evidence, citations, limitations, and the final answer instead of presenting a black-box summary.",
    timeline: "The product or marketing work becomes credible when user signal, strategy, execution step, and measured outcome are shown as a connected workflow.",
    nlp: "The workflow turns text into auditable objects: dictionary setup, extraction, certainty or negation review, and exportable outputs.",
    cluster: "The value is in making the selected grouping inspectable through topology, validation, profile signals, and use-case interpretation.",
    workflow: "The project is presented as a structured operating workflow: input, logic, review gate, output, and limitation."
  };
  return map[kind] || ("The " + title + " workflow is shown as source-backed hiring evidence.");
}

function enrichProjectStages(project, kind) {
  const existing = normalizeArray(project.stages).filter((stage) => stage && (stage.label || stage.inputTitle || stage.operationTitle || stage.outputTitle));
  if (existing.length >= 3) return existing.slice(0, 3);

  const title = project.navTitle || project.title || "project";
  const summary = project.summary || title;
  const owned = normalizeStringArray(project.owned).slice(0, 4);
  const baseInput = owned.length ? owned.slice(0, 3) : [summary];

  const blueprints = {
    nd2: [
      stage("Scan", "Study directory", ["ND2 files", "Study config", "Marker and treatment labels"], "Parse image and metadata", ["Read metadata", "Map channels", "Organize groups and replicates"], "Study index", ["File manifest", "Channel map", "Replicate-aware metadata"], "Reliable study structure comes before any threshold slider can be trusted."),
      stage("Precompute", "Indexed microscopy data", ["RGB channels", "Ratio channels", "Replicate groupings"], "Generate threshold curves", ["Sweep candidate thresholds", "Cache preview statistics", "Prepare group summaries"], "Instant response cache", ["Threshold curves", "Preview overlays", "Boxplot-ready values"], "Precomputation turns slow image review into an interactive inspection loop."),
      stage("Inspect", "Cached curves", ["Channel tabs", "Treatment groups", "Replicate hover data"], "Operate the review agent", ["Move threshold", "Compare group separation", "Check stability"], "Threshold decision", ["Selected threshold", "Visible uncertainty", "Reviewer rationale"], "The reviewer sees why a threshold works instead of accepting a static cutoff."),
      stage("Export", "Accepted settings", ["Configuration metadata", "Statistical tests", "Figures"], "Prepare transparent output", ["Export Excel/PNG views", "Record parameters", "Package reports"], "Reproducible package", ["Figures", "Statistics", "Config trace"], "The export is useful because the operating choices remain attached to the result.")
    ],
    neural: [
      stage("Prepare", "Raw imaging signal", ["Histology or microscopy images", "Labels or review notes", "QC constraints"], "Normalize model input", ["Register signal", "Standardize intensity", "Separate review sets"], "Model-ready input", ["Aligned tensors", "Candidate labels", "Review metadata"], "The deep-learning workflow starts with data discipline."),
      stage("Model", "Prepared tensors", ["Signal pattern", "Noise and artifacts", "Candidate classes"], "Train or compare models", ["Run CNN-style workflow", "Track confidence", "Review failure modes"], "Candidate output", ["Activation traces", "Class probabilities", "Mask or label"], "The model is treated as operating behavior, not a single model name."),
      stage("Inspect", "Candidate output", ["Predicted mask", "Confidence score", "Layer activations"], "Review before export", ["Inspect activation field", "Adjust confidence gate", "Compare against domain expectations"], "Defensible decision", ["Accepted result", "Flagged failures", "Confidence-gated export"], "This is why the workbench belongs here: evidence can be inspected."),
      stage("Report", "Reviewed output", ["Validated mask", "Classification result", "QC annotations"], "Translate to study evidence", ["Summarize groups", "Prepare figures", "Document settings"], "Research-ready analysis", ["Figures", "Statistics", "Reusable settings"], "The reporting layer connects model output to scientific workflow.")
    ],
    survival: [
      stage("Cohort", "Clinical event data", ["Exposure definition", "Outcomes", "Covariates"], "Define analysis cohort", ["Apply inclusion rules", "Align index dates", "Prepare event times"], "Analysis table", ["Groups", "Event times", "Confounder matrix"], "The cohort stage determines whether later estimates are interpretable."),
      stage("Balance", "Observed groups", ["Baseline risk", "Treatment assignment", "Missingness"], "Check confounding", ["Estimate adjustment", "Review balance", "Prepare estimators"], "Comparable groups", ["Balance diagnostics", "Weighted data", "Estimator-ready table"], "Balance diagnostics are the trust gate."),
      stage("Estimate", "Comparable groups", ["Event times", "Censoring", "Competing events"], "Run time-to-event analysis", ["Kaplan-Meier", "Cox-style comparison", "Sensitivity checks"], "Risk estimates", ["Curves", "Effect estimates", "Subgroup contrasts"], "Method choice stays visible."),
      stage("Explain", "Risk estimates", ["Curve separation", "Adjusted results", "Limitations"], "Translate for collaborators", ["Summarize uncertainty", "Flag assumptions", "Prepare visuals"], "Clinical story", ["Risk summary", "Decision-facing visual", "Reusable notes"], "The output is designed for scientific discussion.")
    ],
    tradeoff: [
      stage("Parse", "Source packet", baseInput, "Convert evidence into comparable fields", ["Extract signals", "Clean identifiers", "Remove unsupported claims"], "Comparable records", ["Candidate fields", "Project signals", "Reviewer notes"], "The first gate is faithful parsing."),
      stage("Embed", "Comparable records", ["Text spans", "Keyword requirements", "Project evidence"], "Create matching signals", ["Map skills", "Score overlaps", "Prepare retrieval runs"], "Rankable evidence", ["Feature vectors", "Keyword matrix", "Similarity scores"], "The demo should expose why a match ranks highly."),
      stage("Tune", "Retrieval runs", ["Precision", "Recall", "Top matches"], "Compare operating points", ["Inspect frontier", "Select balanced run", "Flag weak evidence"], "Chosen run", ["Winner setting", "Score delta", "Reviewer caveat"], "The operating point is visible rather than hidden."),
      stage("Review", "Chosen run", ["Ranked evidence", "Unsupported gaps", "JD needs"], "Prepare output", ["Summarize fit", "List gaps", "Export review notes"], "Reviewer package", ["Ranked result", "ATS notes", "Next edit"], "Good matching includes limitations.")
    ],
    evidence: [
      stage("Question", "Review objective", baseInput, "Frame answerable hypotheses", ["Break down the question", "Name required evidence", "Set source boundary"], "Issue tree", ["Hypotheses", "Evidence needs", "Known limits"], "The demo starts with a reviewable question."),
      stage("Collect", "Source materials", ["Documents", "Links", "Notes"], "Gather support and counterevidence", ["Extract claims", "Attach sources", "Track limitations"], "Evidence table", ["Support rows", "Counter rows", "Source quality"], "Good research keeps counterevidence visible."),
      stage("Score", "Evidence table", ["Claims", "Citations", "Confidence"], "Check traceability", ["Map claim to source", "Rate confidence", "Reject unsupported text"], "Traceable answer", ["Supported claims", "Caveats", "Confidence score"], "The answer is credible because claims can be traced."),
      stage("Output", "Traceable answer", ["Findings", "Caveats", "Next checks"], "Package reviewer narrative", ["Write concise finding", "Show limitation", "Recommend next step"], "Decision brief", ["Conclusion", "So-what", "Open question"], "The result stays caveat-aware.")
    ],
    timeline: [
      stage("Signal", "User or market input", baseInput, "Identify the problem pattern", ["Read user evidence", "Separate segments", "Name the blocker"], "Opportunity frame", ["Target user", "Pain point", "Success signal"], "The project becomes stronger when the user problem is inspectable."),
      stage("Strategy", "Opportunity frame", ["Audience", "Message", "Channel or product idea"], "Define the operating plan", ["Prioritize MVP", "Map GTM logic", "Choose measurement"], "Launch plan", ["Positioning", "Workflow", "KPI frame"], "Strategy is tied to a measurable behavior."),
      stage("Execute", "Launch plan", ["Collateral", "Prototype", "Campaign or workflow"], "Build and test the asset", ["Create demo", "Run analysis", "Collect feedback"], "Working artifact", ["Screenshots", "Findings", "Iteration notes"], "Execution evidence matters more than broad claims."),
      stage("Learn", "Working artifact", ["Metrics", "Feedback", "Blockers"], "Interpret outcome honestly", ["Compare signal", "Document limitation", "Name next action"], "Decision note", ["What improved", "What is uncertain", "Next step"], "The output is useful because it includes what not to overclaim.")
    ],
    nlp: [
      stage("Load", "Text resources", ["Documents", "Dictionaries", "Custom phrases"], "Validate extraction setup", ["Load resources", "Check conflicts", "Expose coverage"], "Ready engine", ["Entry counts", "Validation report", "Coverage signal"], "Dictionary quality is a first-class dependency."),
      stage("Extract", "Source text", ["Sentences", "Domain phrases", "Uncertainty"], "Run semantic extraction", ["Process text", "Attach roles", "Mark certainty"], "Semantic objects", ["Concept text", "Codes", "Role and certainty"], "Extraction must be inspectable."),
      stage("Filter", "Semantic objects", ["Roles", "Certainty", "Positions"], "Review and refine output", ["Filter by role", "Find negation", "Compare overlaps"], "Reviewable concepts", ["Accepted objects", "Flagged uncertainty", "Comparison stats"], "Filtering turns raw NLP into a useful workflow."),
      stage("Export", "Reviewed concepts", ["Rows", "Codes", "Metadata"], "Prepare downstream output", ["Export table", "Create simple view", "Document settings"], "Reusable NLP output", ["CSV-like rows", "Code list", "Audit notes"], "Output formats support reproducible review.")
    ],
    cluster: [
      stage("Prepare", "Feature table", baseInput, "Normalize comparison fields", ["Clean features", "Scale values", "Track missingness"], "Model matrix", ["Feature table", "QC flags", "Group labels"], "Clustering depends on feature discipline."),
      stage("Map", "Model matrix", ["Features", "Distances", "Candidate clusters"], "Build topology", ["Train map", "Inspect neighbors", "Compare lenses"], "Cluster map", ["Topology", "Candidate groups", "Quality metrics"], "The map shows why groups are near each other."),
      stage("Validate", "Cluster map", ["Cluster profiles", "Validation metrics", "Use case"], "Check interpretability", ["Inspect signals", "Compare alternatives", "Flag weak splits"], "Selected grouping", ["Profile", "Validation", "Caveat"], "Validation keeps the grouping from becoming decorative."),
      stage("Explain", "Selected grouping", ["Signals", "Audience", "Use case"], "Translate to decision view", ["Name segments", "Summarize risks", "Recommend next step"], "Segment story", ["Cluster profile", "Business or research use", "Next action"], "The result must be explainable.")
    ],
    workflow: [
      stage("Frame", "Source evidence", baseInput, "Define project purpose", ["Map evidence to JD", "Name workflow boundary", "Keep source-backed claims only"], "Problem frame", ["Target problem", "Relevant signals", "Known limits"], "This prevents the project from becoming a vague portfolio item."),
      stage("Operate", "Problem frame", ["Inputs", "Tools", "Constraints"], "Run the main workflow", ["Apply method", "Compare choices", "Track reviewer-visible logic"], "Working artifact", ["Output", "Quality check", "Decision note"], "The workflow shows how the work happens."),
      stage("Review", "Working artifact", ["Result", "Metric or signal", "Limitation"], "Inspect quality", ["Check evidence", "Flag gaps", "Summarize tradeoff"], "Reviewable result", ["Supported result", "Caveat", "Next step"], "The limitation stays visible."),
      stage("Package", "Reviewable result", ["Summary", "Evidence", "Next action"], "Prepare hiring evidence", ["Write concise summary", "Attach materials", "Align JD terms"], "Vibe ID project", ["Demo frame", "ATS terms", "Source boundary"], "The output is structured for review.")
    ]
  };

  return existing.concat(blueprints[kind] || blueprints.workflow).slice(0, 3);
}

function stage(label, inputTitle, inputLines, operationTitle, operationLines, outputTitle, outputLines, pmNote) {
  return {
    label: compactStageText(label, 22),
    inputTitle: compactStageText(inputTitle, 42),
    inputLines: compactStageLines(inputLines),
    operationTitle: compactStageText(operationTitle, 42),
    operationLines: compactStageLines(operationLines),
    outputTitle: compactStageText(outputTitle, 42),
    outputLines: compactStageLines(outputLines),
    pmNote: compactStageText(pmNote, 110)
  };
}

function enrichProjectMetrics(project, kind, keywords) {
  const metrics = normalizeMetrics(project.metrics);
  if (metrics.length >= 3) return metrics.slice(0, 6);
  const defaults = {
    nd2: [{ label: "Operating range", value: "0-4095", category: "Coverage" }, { label: "Review mode", value: "interactive", category: "Workflow" }, { label: "Output", value: "Excel / PNG", category: "Export" }],
    neural: [{ label: "Review path", value: "input -> activation -> output", category: "Model" }, { label: "Gate", value: "confidence", category: "QC" }, { label: "Output", value: "mask / class", category: "Result" }],
    survival: [{ label: "Methods", value: "KM / Cox", category: "Statistics" }, { label: "Gate", value: "assumption check", category: "Validity" }, { label: "Output", value: "risk summary", category: "Result" }],
    tradeoff: [{ label: "Lens", value: "precision / recall", category: "Evaluation" }, { label: "Output", value: "ranked evidence", category: "Result" }, { label: "Gate", value: "unsupported gaps", category: "Review" }],
    evidence: [{ label: "Lens", value: "claim trace", category: "Review" }, { label: "Output", value: "decision brief", category: "Result" }, { label: "Gate", value: "source quality", category: "Evidence" }],
    timeline: [{ label: "Lens", value: "signal -> strategy", category: "Product" }, { label: "Output", value: "decision note", category: "Result" }, { label: "Gate", value: "honest limitation", category: "Review" }],
    nlp: [{ label: "Lens", value: "certainty / role", category: "NLP" }, { label: "Output", value: "semantic objects", category: "Result" }, { label: "Gate", value: "coverage", category: "QC" }],
    cluster: [{ label: "Lens", value: "topology", category: "Model" }, { label: "Output", value: "cluster profile", category: "Result" }, { label: "Gate", value: "validation", category: "QC" }],
    workflow: [{ label: "Lens", value: "input / logic / output", category: "Workflow" }, { label: "Output", value: "reviewable artifact", category: "Result" }, { label: "Gate", value: "source boundary", category: "Evidence" }]
  };
  return metrics.concat(defaults[kind] || defaults.workflow).filter((metric, index, arr) =>
    arr.findIndex((item) => cleanComparable(item.label + item.value) === cleanComparable(metric.label + metric.value)) === index
  ).slice(0, 6);
}

function enrichProjectTech(project, kind, keywords) {
  const tech = normalizeStringArray(project.relatedTech).map(cleanId);
  const kindTech = {
    nd2: ["python", "fastapi", "react", "statistics", "excel"],
    neural: ["python", "pytorch", "cnn", "model-evaluation"],
    survival: ["r", "python", "statistics", "survival-analysis"],
    tradeoff: ["python", "embeddings", "model-evaluation", "ats"],
    evidence: ["llm", "research", "source-quality", "workflow"],
    timeline: ["analytics", "product-strategy", "gtm", "figma"],
    nlp: ["python", "nlp", "data-cleaning"],
    cluster: ["python", "r", "clustering", "validation"],
    workflow: []
  };
  return tech.concat(kindTech[kind] || []).concat(keywords.slice(0, 4).map(cleanId)).filter(unique).slice(0, 10);
}

function enrichOwnedWork(project, kind) {
  const owned = normalizeStringArray(project.owned);
  if (owned.length >= 2) return owned.slice(0, 5);
  const title = project.navTitle || project.title || "project";
  const defaults = {
    nd2: "Structured the image-analysis workflow so threshold choice, replicate statistics, and export metadata remain reviewable.",
    neural: "Presented the model workflow through input signal, layer evidence, confidence gate, and output review.",
    survival: "Separated cohort definition, estimator choice, assumption checks, and collaborator-facing interpretation.",
    tradeoff: "Made the ranking or matching tradeoff inspectable through score movement, top evidence, and limitation notes.",
    evidence: "Connected claims to support, counterevidence, confidence, and source limitations.",
    timeline: "Mapped user or market signal into strategy, execution, measurement, and next-step learning.",
    nlp: "Kept extraction output auditable through roles, certainty, coverage, and export-ready objects.",
    cluster: "Linked grouping output to topology, validation, profile signals, and use-case interpretation.",
    workflow: "Converted the project into a reviewable workflow with input, logic, output, and source boundary."
  };
  return owned.concat((defaults[kind] || defaults.workflow) + " (" + title + ").").slice(0, 5);
}

function linkProjectsToExperience(project, experiences) {
  if (!experiences || !experiences.length) return;
  const projectText = cleanComparable([project.title, project.summary, (project.relatedTech || []).join(" ")].join(" "));
  const matches = experiences.filter((exp) => cleanComparable([
    exp.role,
    exp.organization,
    (exp.bullets || []).join(" "),
    (exp.relatedTech || []).join(" ")
  ].join(" ")).split("").length && containsAnySharedSignal(projectText, exp));
  if (!project.relatedExp || !project.relatedExp.length) project.relatedExp = matches.slice(0, 2).map((exp) => exp.id).filter(Boolean);
}

function containsAnySharedSignal(projectText, exp) {
  const tokens = normalizeStringArray(exp.relatedTech).concat(extractCapitalizedPhrases((exp.bullets || []).join(" "))).map(cleanComparable).filter((token) => token.length > 3);
  return tokens.some((token) => projectText.indexOf(token) !== -1);
}

function buildProjectWidget(project, kind) {
  const title = project.navTitle || project.title || "project";
  if (kind === "nd2") return buildNd2Widget(title);
  if (kind === "neural") return buildNeuralWidget(title);
  if (kind === "survival") return buildSurvivalWidget(title);
  if (kind === "tradeoff") return buildTradeoffWidget(title);
  if (kind === "evidence") return buildEvidenceWidget(title);
  if (kind === "timeline") return buildTimelineWidget(title);
  if (kind === "nlp") return buildNlpWidget(title);
  if (kind === "cluster") return buildClusterWidget(title);
  return buildWorkflowWidget(title);
}

function buildNd2Widget(title) {
  return {
    type: "nd2-agent-lab",
    title: "Operate the " + shortWidgetTitle(title) + " control surface",
    help: "Switch lenses and move the operating point. Preview, group signal, stability, and export status update together.",
    defaultChannel: "green",
    defaultThreshold: 1840,
    min: 0,
    max: 4095,
    channels: [
      { id: "green", label: "Primary signal", color: "#16a34a", signal: 83, note: "Strong signal with visible group separation.", groups: groupRows([34, 58, 72, 66]) },
      { id: "red", label: "Secondary signal", color: "#dc2626", signal: 68, note: "Moderate signal; useful after checking consistency.", groups: groupRows([28, 44, 51, 49]) },
      { id: "ratio", label: "Ratio view", color: "#2563eb", signal: 76, note: "Ratio view stabilizes differences across samples.", groups: groupRows([31, 54, 65, 59]) }
    ]
  };
}

function buildNeuralWidget(title) {
  return {
    type: "neural-workbench",
    title: "Inspect the " + shortWidgetTitle(title) + " workbench",
    help: "Draw or load a signal, inspect layer activations, toggle layers, and see how export confidence changes.",
    note: "This demo mirrors the model decision path: input signal, learned filters, pooled evidence, and confidence-gated output.",
    min: 20,
    max: 90,
    value: 52,
    defaultPreset: "fibrosis",
    presets: [
      { id: "fibrosis", label: "Fibrosis band", note: "Dense diagonal signal." },
      { id: "clusters", label: "Cell clusters", note: "Grouped cellular signal." },
      { id: "artifact", label: "Artifact", note: "Noise-heavy pattern." }
    ],
    layers: [
      { id: "conv1", label: "Conv 1", defaultVisible: true },
      { id: "conv2", label: "Conv 2", defaultVisible: true },
      { id: "pool", label: "Pool", defaultVisible: true },
      { id: "dense", label: "Dense", defaultVisible: true }
    ],
    classes: [
      { id: "fibrosis", label: "Fibrosis mask", color: "#b45309" },
      { id: "cell", label: "Cell infiltration", color: "#2563eb" },
      { id: "background", label: "Background", color: "#0f766e" },
      { id: "artifact", label: "Artifact", color: "#dc2626" }
    ]
  };
}

function buildSurvivalWidget(title) {
  return {
    type: "survival-causal-lab",
    title: "Compare estimators for " + shortWidgetTitle(title),
    help: "Switch the cohort lens. Balance, curves, and estimator rows update together so the statistical reasoning stays inspectable.",
    defaultCohort: "primary",
    cohorts: [
      cohort("primary", "Primary cohort", 84, "Largest usable signal after adjustment.", [98, 94, 90, 84, 78, 71], [97, 90, 82, 72, 62, 51], [["Unadjusted KM", "Visible gap", 62, "descriptive"], ["Cox PH", "HR 0.78", 78, "adjusted"], ["Sensitivity", "stable", 86, "lead"]]),
      cohort("moderate", "Moderate-risk", 78, "Smaller signal with a narrower separation.", [99, 96, 92, 88, 83, 78], [98, 94, 88, 81, 75, 68], [["Unadjusted KM", "Small gap", 58, "screen"], ["Cox PH", "HR 0.84", 70, "adjusted"], ["Sensitivity", "watch", 74, "check"]]),
      cohort("assumption", "Assumption check", 81, "Assumption review changes the confidence of the result.", [99, 95, 91, 86, 80, 73], [98, 93, 87, 80, 72, 64], [["Naive view", "overstates", 48, "watch"], ["Adjusted", "HR 0.82", 73, "check"], ["Robust check", "credible", 80, "lead"]])
    ]
  };
}

function buildTradeoffWidget(title) {
  return {
    type: "tradeoff-frontier",
    title: "Tune the " + shortWidgetTitle(title) + " evaluation frontier",
    help: "Select a run and inspect how precision, recall, ranking quality, and the chosen operating point move together.",
    xLabel: "recall",
    yLabel: "precision",
    winner: "balanced",
    baseline: { label: "baseline", precision: 0.58, recall: 0.44 },
    runs: [
      tradeoffRun("strict", "Strict", 0.86, 0.46, "Trace score", "82", "+18 vs baseline", "High precision but misses weaker evidence."),
      tradeoffRun("balanced", "Balanced", 0.78, 0.72, "Fit score", "88", "+24 vs baseline", "Best review setting because it captures evidence without overclaiming."),
      tradeoffRun("broad", "Broad", 0.62, 0.88, "Coverage", "81", "+17 vs baseline", "Useful for discovery, weaker for final output.")
    ]
  };
}

function buildEvidenceWidget(title) {
  return {
    type: "evidence-path",
    title: "Trace claims for " + shortWidgetTitle(title),
    help: "Switch evidence views and inspect which claims are supported, limited, or still missing.",
    nodes: [
      { id: "q", label: "Question", x: 12, y: 50 },
      { id: "s1", label: "Source A", x: 36, y: 24 },
      { id: "s2", label: "Source B", x: 36, y: 72 },
      { id: "claim", label: "Claim", x: 64, y: 50 },
      { id: "out", label: "Output", x: 88, y: 50 }
    ],
    edges: [["q", "s1"], ["q", "s2"], ["s1", "claim"], ["s2", "claim"], ["claim", "out"]],
    views: [
      evidenceView("source", "Source map", ["q-s1", "q-s2"], ["q", "s1", "s2"], 0.66, 2, "Source coverage is visible before the final answer.", "Draft answer is constrained to available sources.", [["The source packet supports the project context.", true], ["A missing metric should not be invented.", true], ["External impact is verified.", false]]),
      evidenceView("claim", "Claim check", ["s1-claim", "s2-claim", "claim-out"], ["s1", "s2", "claim", "out"], 0.82, 3, "Claim trace is strongest when support and caveat are shown together.", "Supported claims can move into the final project narrative.", [["Workflow ownership is supported.", true], ["Tool evidence is visible.", true], ["A limitation remains stated.", true]])
    ]
  };
}

function buildTimelineWidget(title) {
  return {
    type: "timeline-pattern-lab",
    title: "Replay the " + shortWidgetTitle(title) + " signal timeline",
    help: "Select a pattern. The signal, execution step, evidence bars, and learning note update together.",
    defaultPattern: "signal",
    patterns: [
      { id: "signal", label: "User signal", score: 84, note: "The strongest project evidence starts from a clear user or market signal.", phases: phaseRows(["Input", "Insight", "MVP", "Measure"], [42, 68, 76, 64]), evidence: ["User need named", "Segment or audience visible", "Measurement frame retained"] },
      { id: "execution", label: "Execution", score: 78, note: "Execution evidence shows the work moved past ideation.", phases: phaseRows(["Plan", "Build", "Test", "Iterate"], [48, 80, 62, 70]), evidence: ["Artifact exists", "Feedback or metric checked", "Limitation documented"] },
      { id: "learning", label: "Learning", score: 72, note: "The useful ending is what changed and what remains uncertain.", phases: phaseRows(["Metric", "Blocker", "Decision", "Next"], [58, 44, 74, 66]), evidence: ["Outcome interpreted", "No unsupported scale claim", "Next step named"] }
    ]
  };
}

function buildNlpWidget(title) {
  return {
    type: "nlp-extraction-lab",
    title: "Inspect extraction behavior for " + shortWidgetTitle(title),
    help: "Choose a sample. Semantic objects, certainty, coverage, and export readiness update together.",
    defaultSample: "primary",
    samples: [
      { id: "primary", label: "Primary text", text: "Source text contains a target concept, a context note, and a limitation.", coverage: 84, objects: [{ text: "target concept", role: "SIGNAL", certainty: "YES", score: 88 }, { text: "limitation", role: "CAVEAT", certainty: "YES", score: 76 }] },
      { id: "uncertain", label: "Uncertain text", text: "Possible signal appears, but evidence is incomplete.", coverage: 72, objects: [{ text: "possible signal", role: "SIGNAL", certainty: "UNCLEAR", score: 70 }, { text: "incomplete evidence", role: "CAVEAT", certainty: "YES", score: 82 }] }
    ]
  };
}

function buildClusterWidget(title) {
  return {
    type: "cluster-topology-lab",
    title: "Inspect clusters for " + shortWidgetTitle(title),
    help: "Switch analytical lenses and focus a cluster to see topology, validation, and interpretation together.",
    defaultLens: "fit",
    defaultCluster: "a",
    clusters: [
      { id: "a", label: "Cluster A", shortLabel: "A" },
      { id: "b", label: "Cluster B", shortLabel: "B" },
      { id: "c", label: "Cluster C", shortLabel: "C" }
    ],
    lenses: [
      clusterLens("fit", "Fit lens", "QE/TE stable", "Score 82", "Topology separates interpretable groups.", "Signal stays coherent across nearest neighbors."),
      clusterLens("validation", "Validation lens", "QC check", "Score 76", "Validation checks whether the split is usable.", "Weak splits are kept visible.")
    ]
  };
}

function buildWorkflowWidget(title) {
  return buildEvidenceWidget(title);
}

function groupRows(values) {
  const labels = ["Control", "Treatment A", "Treatment B", "Treatment C"];
  return values.map((value, index) => ({ label: labels[index] || "Group " + (index + 1), value }));
}

function cohort(id, label, balance, note, treated, control, rows) {
  return {
    id,
    label,
    balance,
    separation: Math.abs(treated[treated.length - 1] - control[control.length - 1]),
    note,
    curves: { treated, control },
    estimators: rows.map((row) => ({ label: row[0], value: row[1], score: row[2], tag: row[3] }))
  };
}

function tradeoffRun(id, label, precision, recall, scoreName, scoreValue, deltaLabel, takeaway) {
  return {
    id,
    label,
    precision,
    recall,
    scoreName,
    scoreValue,
    deltaLabel,
    takeaway,
    ranking: [
      { label: "Top evidence", score: Math.round(precision * 95), match: "high" },
      { label: "Source fit", score: Math.round(recall * 90), match: "covered" },
      { label: "Gap risk", score: Math.round((1 - Math.abs(precision - recall)) * 82), match: "watch" }
    ]
  };
}

function evidenceView(id, label, highlightEdges, highlightNodes, traceScore, citations, note, answer, claimRows) {
  return {
    id,
    label,
    highlightEdges,
    highlightNodes,
    traceScore,
    citations,
    note,
    answer,
    claims: claimRows.map((row) => ({ text: row[0], supported: row[1] }))
  };
}

function phaseRows(labels, values) {
  return labels.map((label, index) => ({ label, value: values[index] || 50 }));
}

function clusterLens(id, label, qeTe, clusterScore, smartPoint, smartNote) {
  const nodes = [
    { id: "a1", label: "A1", x: 24, y: 24, r: 8, color: "#0f766e", clusterId: "a" },
    { id: "a2", label: "A2", x: 38, y: 38, r: 7, color: "#0f766e", clusterId: "a" },
    { id: "b1", label: "B1", x: 74, y: 28, r: 9, color: "#2563eb", clusterId: "b" },
    { id: "b2", label: "B2", x: 88, y: 44, r: 7, color: "#2563eb", clusterId: "b" },
    { id: "c1", label: "C1", x: 55, y: 66, r: 8, color: "#b45309", clusterId: "c" }
  ];
  return {
    id,
    label,
    summary: label,
    qeTe,
    clusterScore,
    smartPoint,
    smartNote,
    mapNodes: nodes,
    links: [["a1", "a2"], ["a2", "c1"], ["c1", "b1"], ["b1", "b2"]],
    comparison: [
      { label: "Topology", detail: "Neighbor structure is reviewable.", status: "lead", tag: "use" },
      { label: "Validation", detail: "Weak separation remains visible.", status: "check", tag: "check" }
    ],
    comparisonNote: "The cluster view is useful only when topology and interpretation agree.",
    clusterProfiles: {
      a: profileCluster("Stable signal", ["coherent", "usable"], "Use as the first interpretation group."),
      b: profileCluster("High-variance signal", ["watch", "review"], "Use only after validation."),
      c: profileCluster("Bridge group", ["mixed", "borderline"], "Use as a transition or caveat group.")
    }
  };
}

function profileCluster(summary, badges, useCase) {
  return {
    summary,
    badges,
    useCase,
    why: "The profile keeps interpretation tied to visible signals.",
    signals: [
      { label: "coherence", value: "high", score: 82 },
      { label: "separation", value: "medium", score: 66 },
      { label: "review need", value: "visible", score: 74 }
    ]
  };
}

function shortWidgetTitle(title) {
  return cleanText(title).replace(/\b(project|system|platform|workflow|analysis)\b/gi, "").replace(/\s+/g, " ").trim().slice(0, 42) || "project";
}

function normalizeScreenshots(items, sourcePack, projectTitle) {
  const imageMap = buildImageAssetMap(sourcePack);
  return normalizeArray(items).map((shot, index) => {
    const rawSrc = cleanText(shot.src || shot.href || shot.name || "");
    const asset = findImageAsset(rawSrc, imageMap);
    const src = asset ? asset.dataUrl : (rawSrc && /^data:image\//i.test(rawSrc) ? rawSrc : "");
    if (!src) return null;
    return {
      src,
      alt: cleanText(shot.alt || projectTitle + " screenshot " + (index + 1)),
      caption: cleanText(shot.caption || shot.label || asset && captionFromFileName(asset.name) || "Screenshot " + (index + 1))
    };
  }).filter(Boolean).slice(0, 8);
}

function attachImageEvidence(projects, sourcePack) {
  const imageAssets = sourcePack.imageAssets || [];
  if (!projects.length || !imageAssets.length) return;
  const attachedNames = new Set();
  projects.forEach((project) => {
    (project.screenshots || []).forEach((shot) => {
      const asset = imageAssets.find((item) => shot.src === item.dataUrl);
      if (asset) attachedNames.add(cleanComparable(asset.name));
    });
  });

  const remaining = imageAssets.filter((asset) => !attachedNames.has(cleanComparable(asset.name)));
  if (!remaining.length) return;

  const target = projects.find((project) => projectMatchesImageEvidence(project)) || projects[0];
  target.screenshots = (target.screenshots || []).concat(remaining.map((asset, index) => ({
    src: asset.dataUrl,
    alt: captionFromFileName(asset.name) + " for " + (target.title || "project"),
    caption: captionFromFileName(asset.name) || "Screenshot " + (index + 1)
  }))).slice(0, 8);
}

function projectMatchesImageEvidence(project) {
  const text = cleanComparable([
    project.id,
    project.title,
    project.navTitle,
    project.source,
    project.summary,
    (project.owned || []).join(" ")
  ].join(" "));
  return /lumina|screenshot|prototype|product|mvp|interface|growth|insight|ai/.test(text);
}

function buildImageAssetMap(sourcePack) {
  const map = {};
  (sourcePack.imageAssets || []).forEach((asset) => {
    const base = path.basename(asset.name || "");
    [asset.name, base, base.replace(/\.[^.]+$/, ""), cleanId(base), cleanComparable(base)].forEach((key) => {
      if (key) map[String(key).toLowerCase()] = asset;
    });
  });
  return map;
}

function findImageAsset(rawSrc, imageMap) {
  const value = String(rawSrc || "");
  if (!value || !imageMap) return null;
  const base = path.basename(value.split("?")[0]);
  const keys = [value, base, base.replace(/\.[^.]+$/, ""), cleanId(base), cleanComparable(base)].map((key) => String(key || "").toLowerCase());
  return keys.map((key) => imageMap[key]).find(Boolean) || null;
}

function captionFromFileName(name) {
  const stem = path.basename(String(name || ""), path.extname(String(name || "")));
  return cleanText(stem.replace(/^kailin[_\s-]*/i, "").replace(/[_-]+/g, " ")) || "Screenshot";
}

function normalizeMetrics(metrics) {
  return normalizeArray(metrics).map((metric) => {
    if (typeof metric === "string") {
      return { label: "Metric", value: cleanText(metric), category: "Evidence" };
    }
    return {
      label: cleanText(metric.label || metric.name || "Metric"),
      value: cleanText(metric.value || metric.amount || ""),
      category: cleanText(metric.category || "Evidence")
    };
  }).filter((metric) => metric.value || metric.label !== "Metric").slice(0, 8);
}

function normalizeEducation(items) {
  return normalizeArray(items).map((item) => ({
    id: cleanId(item.id || item.institution || item.school || "education"),
    institution: cleanText(item.institution || item.school || item.organization || ""),
    school: cleanText(item.school || item.institution || item.organization || ""),
    location: cleanText(item.location || ""),
    degree: cleanText(item.degree || item.program || ""),
    dates: cleanText(item.dates || item.date || ""),
    gpa: cleanText(item.gpa || ""),
    details: cleanText(item.details || item.note || "")
  })).filter((item) => item.institution || item.degree).slice(0, 4);
}

function normalizeCoursework(items) {
  return normalizeArray(items).map((item, index) => ({
    id: cleanId(item.id || item.title || "coursework-" + index),
    title: cleanText(item.title || item.name || "Relevant coursework"),
    bullets: normalizeStringArray(item.bullets).slice(0, 4)
  })).filter((item) => item.title || item.bullets.length).slice(0, 5);
}

function normalizeProfileMaterials(items, inventory) {
  const fromDraft = normalizeArray(items).map((item, index) => ({
    id: cleanId(item.id || item.label || "material-" + index),
    label: cleanText(item.label || item.name || "Material"),
    type: cleanText(item.type || "Source"),
    href: cleanText(item.href || ""),
    note: cleanText(item.note || item.description || "")
  }));
  const fromInventory = inventory.map((item, index) => ({
    id: cleanId(item.name || "upload-" + index),
    label: item.name,
    type: item.kind === "resume" ? "Resume" : "Uploaded material",
    href: "",
    note: item.parseMode + " / " + item.textChars + " text chars"
  }));
  return fromDraft.concat(fromInventory).filter((item, index, arr) =>
    arr.findIndex((candidate) => candidate.id === item.id) === index
  ).slice(0, 12);
}

function normalizeSkillItems(items, keywords, group) {
  const source = Array.isArray(items) && items.length ? items : (group === "analytical" ? keywords.slice(0, 16).map((label) => ({ label })) : []);
  return source.map((item, index) => {
    const label = cleanText(typeof item === "string" ? item : item.label || item.name || "");
    if (!label) return null;
    return {
      id: cleanId(item.id || label),
      label,
      color: item.color || COLORS[index % COLORS.length],
      relatedProjects: normalizeStringArray(item.relatedProjects),
      relatedExp: normalizeStringArray(item.relatedExp)
    };
  }).filter(Boolean).slice(0, group === "analytical" ? 28 : 12);
}

function normalizeSkillLayout(layout, analyticalSkills, licensesCertifications) {
  if (layout && (layout.primary || layout.secondary)) {
    return {
      primary: normalizeSkillPanel(layout.primary, analyticalSkills.length ? "analytical" : "quant", analyticalSkills.length ? "Marketing & Product Skills" : "Quantitative Toolkit"),
      secondary: normalizeArray(layout.secondary).map((panel) => normalizeSkillPanel(panel, "stack", "Tools")).filter(Boolean).slice(0, 3),
      hideExperienceContext: Boolean(layout.hideExperienceContext)
    };
  }
  if (analyticalSkills.length || licensesCertifications.length) {
    return {
      primary: { group: analyticalSkills.length ? "analytical" : "quant", title: analyticalSkills.length ? "Marketing & Product Skills" : "Quantitative Toolkit" },
      secondary: [
        { group: "stack", title: "Tools" },
        licensesCertifications.length ? { group: "certifications", title: "Credentials" } : null
      ].filter(Boolean),
      hideExperienceContext: true
    };
  }
  return {
    primary: { group: "quant", title: "Quantitative Toolkit" },
    secondary: [{ group: "stack", title: "Technical Stack" }],
    hideExperienceContext: false
  };
}

function normalizeSkillPanel(panel, fallbackGroup, fallbackTitle) {
  if (!panel) return { group: fallbackGroup, title: fallbackTitle };
  const rawGroup = cleanText(panel.group || "");
  const rawTitle = cleanText(panel.title || "");
  return {
    group: normalizeSkillGroup(rawGroup, rawTitle, fallbackGroup),
    title: rawTitle || fallbackTitle
  };
}

function normalizeSkillGroup(group, title, fallbackGroup) {
  const value = cleanComparable([group, title].filter(Boolean).join(" "));
  if (["quant", "stack", "certifications", "analytical"].includes(group)) return group;
  if (/tool|software|technical|stack|excel|powerpoint|python|sql|react|figma|tableau|powerbi/.test(value)) return "stack";
  if (/cert|license|credential/.test(value)) return "certifications";
  if (/quant|toolkit|model|valuation|dcf|ratio|statistic|finance|financial|analysis|research|marketing|product|gtm|strategy|user|growth/.test(value)) return "analytical";
  return fallbackGroup || "analytical";
}

function buildLinks(profileDraft, student) {
  const links = [];
  const email = cleanText(profileDraft.email || student.email || "");
  const linkedin = cleanText(profileDraft.linkedin || student.linkedin || "");
  const github = cleanText(profileDraft.github || student.github || "");
  if (email) links.push({ label: "Email", value: email, href: "mailto:" + email });
  if (linkedin) links.push({ label: "LinkedIn", value: linkedin.replace(/^https?:\/\//, ""), href: linkedin });
  if (github) links.push({ label: "GitHub", value: github.replace(/^https?:\/\//, ""), href: github });
  return links;
}

function buildAtsKeywordLayer(payload, sourcePack) {
  const ats = payload.atsProfile || {};
  const keywords = (sourcePack.targetKeywords && sourcePack.targetKeywords.length
    ? sourcePack.targetKeywords
    : mergeKeywords(ats.targetKeywords, sourcePack.targetKeywords)
  ).slice(0, 36);
  const projectCount = normalizeArray(payload.projects).length;
  const experienceCount = normalizeArray(payload.experience).length;
  const screenshotCount = normalizeArray(payload.projects).reduce((sum, project) =>
    sum + normalizeArray(project.screenshots).filter((shot) => shot && shot.src).length, 0);
  const workbookEvidence = normalizeArray(sourcePack.workbookFiles).some((file) => file.text && file.text.length > 120);
  const imageEvidence = normalizeArray(sourcePack.imageAssets).length > 0;
  const text = cleanSourceText([
    collectPayloadText(payload),
    sourcePack.resumeText,
    normalizeArray(sourcePack.workbookFiles).map((file) => file.name + " " + file.text).join(" "),
    normalizeArray(sourcePack.imageAssets).map((file) => file.name).join(" ")
  ].join(" "));
  const matchedKeywords = keywords.filter((keyword) => containsTerm(text, keyword));
  const missingKeywords = keywords.filter((keyword) => !containsTerm(text, keyword));
  const suggestions = normalizeStringArray(ats.suggestions).concat(
    missingKeywords.slice(0, 5).map((keyword) => "Use source-backed evidence before adding '" + keyword + "'.")
  );
  const parseSignals = normalizeStringArray(ats.parseSignals).concat([
    "Keyword layer retained for V7 filtering and JD-specific read-more alignment.",
    projectCount + " projects and " + experienceCount + " experiences mapped into the generated V7 page.",
    "Visual evidence: " + screenshotCount + " screenshots" + (imageEvidence ? " available." : " not uploaded."),
    "Worksheet evidence: " + (workbookEvidence ? "parsed into project-stage signals." : "not present or text-light.")
  ]);

  return {
    targetKeywords: keywords,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 12),
    suggestions: suggestions.filter(unique).slice(0, 7),
    parseSignals: parseSignals.filter(unique).slice(0, 8),
    riskFlags: normalizeStringArray(ats.riskFlags).slice(0, 8),
    evidenceSignals: [
      projectCount + " projects",
      experienceCount + " experiences",
      screenshotCount + " screenshots",
      workbookEvidence ? "worksheet parsed" : "worksheet not parsed"
    ]
  };
}

function collectPayloadText(payload) {
  return [
    JSON.stringify(payload.profile || {}),
    JSON.stringify(payload.directory || {}),
    JSON.stringify(payload.analyticalSkills || []),
    JSON.stringify(payload.stack || []),
    JSON.stringify(payload.quantToolkit || []),
    JSON.stringify(payload.experience || []),
    JSON.stringify(payload.projects || []),
    JSON.stringify(payload.education || []),
    JSON.stringify(payload.coursework || [])
  ].join(" ");
}

function chooseReadMoreKeyword(bullet, keywords, stackLabels) {
  const plain = cleanText(bullet);
  const candidates = [];
  keywords.concat(stackLabels).forEach((label, index) => {
    if (containsTerm(plain, label)) candidates.push({ label, score: 1200 - index * 12 });
  });
  extractMetrics(plain).forEach((label) => candidates.push({ label, score: 820 }));
  extractCapitalizedPhrases(plain).forEach((label) => candidates.push({ label, score: 620 + scoreSignal(label) }));
  const ranked = dedupeCandidateLabels(candidates).sort((a, b) => b.score - a.score);
  if (!ranked.length) return "Evidence";
  const selected = [ranked[0].label];
  for (let i = 1; i < ranked.length; i += 1) {
    if (selected.length >= 2) break;
    if (isRedundantLabel(selected[0], ranked[i].label)) continue;
    if (ranked[i].score < Math.max(520, ranked[0].score * 0.58)) continue;
    selected.push(ranked[i].label);
  }
  return formatReadMoreKeyword(selected.map(polishKeywordLabel).join(" + "), keywords, stackLabels);
}

function formatReadMoreKeyword(value, keywords, stackLabels) {
  const pool = mergeKeywords(keywords, stackLabels);
  const parts = splitKeywordParts(value)
    .map((part) => expandKeywordPart(part, pool))
    .map(cleanKeywordToken)
    .filter((part) => part && !isWeakLabel(part));
  const out = [];
  parts.forEach((part) => {
    const label = polishKeywordLabel(part);
    if (!label || out.some((existing) => isRedundantLabel(existing, label))) return;
    out.push(label);
  });
  return out.slice(0, 2).join(" + ");
}

function splitKeywordParts(value) {
  return String(value || "")
    .replace(/[.…]+/g, " ")
    .replace(/\s+\+\s+/g, " | ")
    .replace(/\s+\/\s+/g, " | ")
    .replace(/\s*,\s*/g, " | ")
    .replace(/\s*;\s*/g, " | ")
    .replace(/\s+\band\b\s+/gi, " | ")
    .split("|")
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function expandKeywordPart(part, pool) {
  const cleaned = cleanKeywordToken(part);
  if (!cleaned) return "";
  const hit = pool.find((label) => {
    const left = cleanComparable(label);
    const right = cleanComparable(cleaned);
    return right.length >= 4 && left !== right && left.indexOf(right) !== -1;
  });
  return hit || cleaned;
}

function cleanKeywordToken(value) {
  let text = stripTags(value)
    .replace(/[.…]+/g, " ")
    .replace(/[()[\]{}"“”‘’]/g, " ")
    .replace(/\s*[;:,.]\s*$/g, "")
    .replace(/\b(?:such as|including|using|through|across)\b\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(/\s+/).filter(Boolean);
  while (words.length && isWeakLabel(words[0])) words.shift();
  while (words.length && isWeakLabel(words[words.length - 1])) words.pop();
  text = words.slice(0, 4).join(" ");
  return text;
}

function extractKeywordsFromText(text) {
  const curated = [
    "Python", "R", "SQL", "SAS", "machine learning", "predictive modeling", "model evaluation",
    "advanced statistics", "experimentation", "forecasting", "product analytics", "stakeholder communication",
    "go-to-market", "GTM", "product marketing", "measurement", "analytics", "attribution",
    "AI", "user insights", "campaign measurement", "cross-functional", "sales enablement",
    "performance marketing", "financial modeling", "valuation", "DCF", "M&A", "credit analysis",
    "Excel", "PowerPoint", "survival analysis", "clinical data", "regression", "ANOVA",
    "ROC", "PR-AUC", "Tableau", "data cleaning", "dashboards"
  ].filter((term) => containsTerm(text, term));

  const phrases = extractCapitalizedPhrases(text)
    .map(cleanKeywordToken)
    .filter((phrase) => phrase.length <= 32 && !isNoisyKeyword(phrase));
  return mergeKeywords(curated, phrases).slice(0, 34);
}

function mergeKeywords() {
  const out = [];
  Array.prototype.slice.call(arguments).forEach((list) => {
    normalizeStringArray(list).forEach((item) => {
      const text = cleanText(item);
      if (!text) return;
      const key = cleanComparable(text);
      if (!out.some((existing) => cleanComparable(existing) === key)) out.push(text);
    });
  });
  return out;
}

function buildParseRisks(sourcePack) {
  const risks = [];
  sourcePack.files.forEach((file) => {
    if (/failed/i.test(file.parseMode)) risks.push(file.name + " had a parsing warning; verify extracted evidence.");
    if (!file.text && file.kind !== "resume") risks.push(file.name + " was used as inventory only.");
  });
  if (!sourcePack.resumeText) risks.push("Resume text could not be extracted; generation relied on metadata and notes.");
  return risks;
}

function parseJsonObject(value) {
  const raw = String(value || "").trim();
  try {
    return JSON.parse(raw);
  } catch (_) {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("No JSON object found in DeepSeek response.");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(typeof item === "string" ? item : item && (item.label || item.name || item.text || item.value) || "")).filter(Boolean);
}

function cleanText(value) {
  return String(value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function cleanSourceText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function cleanId(value) {
  return cleanText(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "item";
}

function cleanComparable(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function containsTerm(text, term) {
  const source = cleanComparable(text);
  const needle = cleanComparable(term);
  return needle && source.indexOf(needle) !== -1;
}

function inferName(text) {
  const firstLine = String(text || "").split(/\r?\n/).map((line) => cleanText(line)).find(Boolean);
  if (!firstLine || firstLine.length > 80) return "";
  return firstLine;
}

function emphasizeSummary(summary, keywords) {
  let text = escapeHtml(summary || "");
  keywords.slice(0, 8).forEach((keyword) => {
    const escaped = escapeRegex(keyword);
    if (!escaped || keyword.length < 3) return;
    text = text.replace(new RegExp("\\b(" + escaped + ")\\b", "i"), "<strong>$1</strong>");
  });
  return text;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isTextExtension(extension) {
  return /^(txt|md|csv|tsv|json|js|jsx|ts|tsx|py|ipynb|html|css|scss|sql|r)$/i.test(extension);
}

function isImageExtension(extension) {
  return /^(png|jpg|jpeg|webp)$/i.test(extension);
}

function mimeFromExtension(extension, fallback) {
  if (fallback && /^image\//i.test(fallback)) return fallback;
  const ext = String(extension || "").toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  return "image/png";
}

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value || null));
}

function extractMetrics(text) {
  const out = [];
  const pattern = /(?:under\s+)?[$]?\d[\d,./-]*(?:\.\d+)?\+?%?(?:\/\d+(?:\.\d+)?)?(?:\s*(?:years?|months?|samples?|views?|registrations?|accuracy|CPM|CTR|GPA|channels?|events?|features?|patients?|documents?|hours?))?/gi;
  let match;
  while ((match = pattern.exec(String(text || "")))) {
    const value = cleanText(match[0]);
    if (value && !/^\d$/.test(value)) out.push(value);
  }
  return out.slice(0, 8);
}

function extractCapitalizedPhrases(text) {
  const out = [];
  const pattern = /\b(?:[A-Z][A-Za-z0-9+.#-]*|[A-Z]{2,}|[A-Za-z]+(?:[-/][A-Za-z0-9+.#]+)+)(?:\s+(?:[A-Z][A-Za-z0-9+.#-]*|[A-Z]{2,}|[a-z][A-Za-z0-9+.#-]{2,})){0,2}\b/g;
  let match;
  while ((match = pattern.exec(String(text || "")))) {
    const phrase = cleanText(match[0]);
    if (phrase && !isWeakLabel(phrase)) out.push(phrase);
  }
  return out.filter(unique).slice(0, 32);
}

function scoreSignal(label) {
  let score = 0;
  if (/\d/.test(label)) score += 80;
  if (/[A-Z]{2,}/.test(label)) score += 70;
  if (/\b(model|analytics|measurement|strategy|research|pipeline|valuation|segmentation|survival|causal|stakeholder|experiment|dashboard|classification)\b/i.test(label)) score += 70;
  return score;
}

function dedupeCandidateLabels(candidates) {
  const seen = new Set();
  return candidates.map((candidate) => ({
    label: cleanText(candidate.label),
    score: candidate.score || 0
  })).filter((candidate) => {
    const key = cleanComparable(candidate.label);
    if (!key || seen.has(key) || isWeakLabel(candidate.label)) return false;
    seen.add(key);
    return true;
  });
}

function isRedundantLabel(a, b) {
  const left = cleanComparable(a);
  const right = cleanComparable(b);
  return left === right || left.indexOf(right) !== -1 || right.indexOf(left) !== -1;
}

function isWeakLabel(value) {
  const text = cleanComparable(value);
  const stop = new Set(["and", "the", "for", "with", "from", "into", "using", "across", "through", "data", "project", "experience", "work", "team", "results", "responsibilities"]);
  return !text || text.length < 3 || stop.has(text);
}

function isNoisyKeyword(value) {
  const text = cleanText(value);
  if (!text) return true;
  if (/^(assist|develop|support|define|execute|measure|create|communicate|translate|partner|own|lead)\b/i.test(text)) return true;
  if (/\b(role|company|location|responsibilities|qualifications|minimum|preferred|requirements?|candidate|early career)\b/i.test(text)) return true;
  if (/\b(and|or|the|for|with|to|of|in)$/i.test(text)) return true;
  if (text.split(/\s+/).length > 4) return true;
  return false;
}

function polishKeywordLabel(value) {
  const acronyms = new Set(["ai", "ats", "auc", "cnn", "dcf", "etl", "gpa", "gtm", "html", "jd", "kpi", "llm", "mna", "nlp", "pr", "qc", "r", "rag", "roc", "sas", "sql", "ui", "ux"]);
  return cleanText(value).replace(/[-_]+/g, " ").split(" ").map((word) => {
    const lower = word.toLowerCase();
    if (acronyms.has(lower)) return lower === "mna" ? "M&A" : word.toUpperCase();
    if (/^[A-Z0-9.+/]+$/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ").replace(/\bPr Auc\b/g, "PR-AUC").replace(/\bKaplan Meier\b/g, "Kaplan-Meier").slice(0, 36);
}

function unique(value, index, arr) {
  return arr.indexOf(value) === index;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function pad2(value) {
  return String(value).padStart(2, "0");
}
