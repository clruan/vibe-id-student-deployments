import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { Player } from "https://esm.sh/@remotion/player@4.0.472?deps=react@18.2.0,react-dom@18.2.0";
import { interpolate, useCurrentFrame } from "https://esm.sh/remotion@4.0.472?deps=react@18.2.0,react-dom@18.2.0";

const STAGES = [
  { label: "Intake", short: "Packet", detail: "Resume and artifacts" },
  { label: "Parse", short: "Evidence", detail: "Resume, worksheet, screenshots, and source notes are parsed into evidence inventory" },
  { label: "JD Map", short: "Signals", detail: "Job description requirements are mapped to source-backed proof signals" },
  { label: "Intro", short: "Identity", detail: "Hero, summary, contact links, and target-role framing are drafted" },
  { label: "Experience", short: "Bullets", detail: "Experience bullets and read-more keywords are generated with source constraints" },
  { label: "Projects", short: "Proof", detail: "Projects, stages, screenshots, metrics, and materials are assembled" },
  { label: "HTML", short: "Download", detail: "A downloadable self-contained V7 HTML page is packaged" }
];

const DEFAULT_KEYWORDS = [
  "data scientist",
  "python",
  "sql",
  "r",
  "product analytics",
  "finance",
  "excel",
  "machine learning",
  "forecasting",
  "dashboard",
  "experimentation",
  "user research"
];

function compact(value, fallback) {
  const text = String(value || "").trim();
  return text || fallback || "";
}

function truncate(value, max) {
  const text = String(value || "");
  if (text.length <= max) return text;
  return text.slice(0, Math.max(4, max - 3)).replace(/\s+\S*$/, "") + "...";
}

function normalizeKeyword(value) {
  return String(value || "")
    .replace(/\.[A-Za-z0-9]+$/g, "")
    .replace(/[_/|]+/g, " ")
    .replace(/\b(resume|identity|role|ats|score|current|suggestion|materials?|files?|uploaded|download|html|pdf|docx?|xlsx?|csv|png|jpg|jpeg)\b/gi, " ")
    .replace(/[^A-Za-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function addKeyword(out, value) {
  const text = normalizeKeyword(value);
  if (!text || text.length < 2 || text.length > 34) return;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 3) return;
  const key = text.replace(/[^a-z0-9]+/g, "");
  if (!key || out.some((item) => item.replace(/[^a-z0-9]+/g, "") === key)) return;
  out.push(text);
}

function extractKnownKeywords(text, out) {
  const haystack = String(text || "").toLowerCase();
  DEFAULT_KEYWORDS.concat([
    "platform analytics",
    "google analytics",
    "a/b testing",
    "conversion analysis",
    "valuation",
    "dcf",
    "m&a",
    "gtm",
    "product marketing",
    "biostatistics",
    "survival analysis",
    "nlp",
    "fastapi",
    "react",
    "pytorch",
    "tableau",
    "sas",
    "clinical data",
    "market research"
  ]).forEach((keyword) => {
    if (haystack.includes(keyword.toLowerCase())) addKeyword(out, keyword);
  });
}

function buildKeywordTicker(props) {
  const out = [];
  (Array.isArray(props.keywordChips) ? props.keywordChips : []).forEach((item) => addKeyword(out, item));
  extractKnownKeywords([
    props.targetRole,
    (props.materialNames || []).join(" "),
    (props.experienceLines || []).join(" "),
    (props.suggestions || []).join(" ")
  ].join(" "), out);
  DEFAULT_KEYWORDS.forEach((keyword) => addKeyword(out, keyword));
  return out.slice(0, 18);
}

function KnitScene(props) {
  const stage = Math.max(0, Math.min(STAGES.length - 1, Number(props.stage || 0)));
  const fileCount = Number(props.fileCount || 0);
  const variantCount = Number(props.variantCount || 0);
  const frame = useCurrentFrame();
  const pulse = interpolate(frame % 60, [0, 30, 59], [0.96, 1.04, 0.96]);
  const drift = interpolate(frame % 120, [0, 60, 119], [-5, 5, -5]);
  const progress = Math.max(0.06, (stage + 1) / STAGES.length);
  const keywords = buildKeywordTicker(props);
  const loopKeywords = keywords.concat(keywords);
  return React.createElement(
    "div",
    { className: "motion-stage" },
    React.createElement("div", { className: "motion-depth-grid" }),
    React.createElement("div", { className: "motion-poly motion-poly-a" }),
    React.createElement("div", { className: "motion-poly motion-poly-b" }),
    React.createElement(
      "div",
      { className: "motion-hero-card" },
      React.createElement(
        "div",
        { className: "motion-title" },
        React.createElement("span", null, "Knit Process"),
        React.createElement("strong", null, STAGES[stage].label),
        React.createElement("p", null, truncate(STAGES[stage].detail, 74))
      ),
      React.createElement(
        "div",
        { className: "motion-stage-meter" },
        React.createElement("span", null, String(stage + 1)),
        React.createElement("b", null, "/ " + STAGES.length)
      ),
      React.createElement(
        "div",
        { className: "motion-step-rail" },
        React.createElement("i", { style: { width: `${progress * 100}%`, transform: `translateY(${Math.round(drift / 4)}px)` } }),
        STAGES.map((item, index) =>
          React.createElement(
            "div",
            {
              key: item.label,
              className: "motion-knot-wrap" + (index === stage ? " is-active" : "") + (index < stage ? " is-done" : ""),
              style: { left: `${(index / Math.max(STAGES.length - 1, 1)) * 100}%`, transform: `translateX(-50%) scale(${index === stage ? pulse : 1})` },
              tabIndex: 0,
              title: item.detail
            },
            React.createElement("div", { className: "motion-knot" }, React.createElement("span", null, String(index + 1))),
            React.createElement("strong", { className: "motion-step-label" }, item.label),
            React.createElement("span", { className: "motion-step-detail" }, item.short),
            React.createElement("span", { className: "motion-tooltip" }, item.detail)
          )
        )
      ),
      React.createElement(
        "section",
        { className: "motion-keyword-panel", "aria-label": "Keyword reel" },
        React.createElement(
          "div",
          { className: "motion-signal-line" },
          React.createElement("span", null, fileCount + " files"),
          React.createElement("span", null, variantCount ? variantCount + " outputs" : compact(props.studentName, "source-backed")),
          React.createElement("span", null, compact(props.targetRole, "target fit"))
        ),
        React.createElement(
          "div",
          { className: "motion-keyword-ticker" },
          React.createElement(
            "div",
            {
              className: "motion-keyword-track",
              style: { "--keyword-count": String(Math.max(keywords.length, 1)) }
            },
            loopKeywords.map((keyword, index) =>
              React.createElement(
                "span",
                { className: "motion-keyword-chip", key: keyword + index },
                truncate(keyword, 28)
              )
            )
          )
        )
      )
    )
  );
}

function RemotionHost() {
  const [state, setState] = useState({ stage: 0, fileCount: 0, variantCount: 0, materialNames: [], suggestions: [] });
  const [wide, setWide] = useState(() => window.innerWidth >= 760);

  useEffect(() => {
    const onStage = (event) => {
      setState((current) => Object.assign({}, current, event.detail || {}));
    };
    window.addEventListener("vibe-generator-stage", onStage);
    return () => window.removeEventListener("vibe-generator-stage", onStage);
  }, []);

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 760);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return React.createElement(Player, {
    component: KnitScene,
    inputProps: state,
    durationInFrames: 180,
    compositionWidth: wide ? 1120 : 320,
    compositionHeight: wide ? 340 : 420,
    fps: 30,
    loop: true,
    autoPlay: true,
    controls: false,
    style: { width: "100%", height: "100%" }
  });
}

const root = document.getElementById("remotion-root");
if (root) {
  createRoot(root).render(React.createElement(RemotionHost));
}
