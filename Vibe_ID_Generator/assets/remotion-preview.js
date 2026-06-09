import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { Player } from "https://esm.sh/@remotion/player@4.0.472?deps=react@18.2.0,react-dom@18.2.0";

const STAGES = [
  { label: "Intake", detail: "Resume and artifacts" },
  { label: "Parse", detail: "Evidence inventory" },
  { label: "JD Map", detail: "Target signals" },
  { label: "Intro", detail: "Hero and identity" },
  { label: "Experience", detail: "Bullets and read-more" },
  { label: "Projects", detail: "Proof and demos" },
  { label: "HTML", detail: "Downloadable page" }
];

const DEFAULT_TERMS = [
  "data scientist",
  "python",
  "sql",
  "product analytics",
  "finance",
  "excel",
  "market research",
  "machine learning",
  "forecasting",
  "experimentation",
  "dashboard",
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

function cleanTerm(value) {
  return String(value || "")
    .replace(/\.[A-Za-z0-9]+$/g, "")
    .replace(/[_/|]+/g, " ")
    .replace(/\b(resume|identity|role|ats|score|current|suggestion|materials?|files?|uploaded|download|html|pdf|docx?|xlsx?|csv|png|jpg|jpeg)\b/gi, " ")
    .replace(/[^A-Za-z0-9+#&.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function addTerm(out, value) {
  const text = cleanTerm(value);
  if (!text || text.length < 2 || text.length > 38) return;
  if (text.split(/\s+/).filter(Boolean).length > 4) return;
  const key = text.replace(/[^a-z0-9]+/g, "");
  if (!key || out.some((item) => item.replace(/[^a-z0-9]+/g, "") === key)) return;
  out.push(text);
}

function buildTickerTerms(props) {
  const out = [];
  (Array.isArray(props.keywordChips) ? props.keywordChips : []).forEach((item) => addTerm(out, item));
  const text = [
    props.jobText,
    props.targetRole,
    (props.materialNames || []).join(" "),
    (props.experienceLines || []).join(" "),
    (props.suggestions || []).join(" ")
  ].join(" ").toLowerCase();
  DEFAULT_TERMS.concat([
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
    "clinical data"
  ]).forEach((term) => {
    if (text.includes(term.toLowerCase())) addTerm(out, term);
  });
  DEFAULT_TERMS.forEach((term) => addTerm(out, term));
  return out.slice(0, 20);
}

function buildSummary(props) {
  if (props.previewSummary) return props.previewSummary;
  const role = compact(props.targetRole, "target role");
  const terms = buildTickerTerms(props).slice(0, 4).join(", ");
  return "Source-backed profile being knitted for " + role + (terms ? " across " + terms + "." : ".");
}

function initials(name) {
  return String(name || "V7")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "V7";
}

function contactLine(props) {
  return [
    props.email,
    props.phone,
    props.linkedin ? "LinkedIn" : "",
    props.github ? "GitHub" : ""
  ].filter(Boolean).join("  /  ");
}

function KnitScene(props) {
  const stage = Math.max(0, Math.min(STAGES.length - 1, Number(props.stage || 0)));
  const progress = Math.max(0.06, (stage + 1) / STAGES.length);
  const terms = buildTickerTerms(props);
  const loopTerms = terms.concat(terms);
  const name = compact(props.studentName, "Student Name");
  const role = compact(props.targetRole, "Target role");
  const contact = contactLine(props) || "Contact signals appear after resume parse";
  const photo = props.photoUrl || "";
  const fileCount = Number(props.fileCount || 0);

  return React.createElement(
    "div",
    { className: "motion-stage" },
    React.createElement(
      "div",
      { className: "motion-glass-steps", "aria-label": "Generation steps" },
      React.createElement("div", { className: "motion-step-track" }, React.createElement("i", { style: { width: `${progress * 100}%` } })),
      STAGES.map((item, index) =>
        React.createElement(
          "div",
          {
            key: item.label,
            className: "motion-step-dot" + (index === stage ? " is-active" : "") + (index < stage ? " is-done" : ""),
            style: { left: `${(index / Math.max(STAGES.length - 1, 1)) * 100}%` },
            tabIndex: 0,
            title: item.detail
          },
          React.createElement("span", null, String(index + 1)),
          React.createElement("strong", null, item.label),
          React.createElement("em", null, item.detail)
        )
      )
    ),
    React.createElement(
      "section",
      { className: "motion-vibe-preview", "aria-label": "Vibe ID intro preview" },
      React.createElement("div", { className: "motion-preview-band" }, React.createElement("span", null, "VIBE ID")),
      React.createElement(
        "div",
        { className: "motion-preview-body" },
        React.createElement(
          "div",
          { className: "motion-preview-avatar" + (photo ? " has-photo" : "") },
          photo ? React.createElement("img", { src: photo, alt: "" }) : React.createElement("span", null, initials(name))
        ),
        React.createElement("h3", null, truncate(name, 34)),
        React.createElement("p", { className: "motion-preview-role" }, truncate(role, 72)),
        React.createElement("p", { className: "motion-preview-summary" }, truncate(buildSummary(props), 150)),
        React.createElement("div", { className: "motion-preview-contact" }, truncate(contact, 96)),
        React.createElement(
          "div",
          { className: "motion-preview-build" },
          React.createElement("span", null, fileCount + " source" + (fileCount === 1 ? "" : "s")),
          React.createElement("span", null, STAGES[stage].label),
          React.createElement("span", null, props.variantCount ? props.variantCount + " HTML" : "knitting")
        )
      )
    ),
    React.createElement(
      "section",
      { className: "motion-jd-caption", "aria-label": "Job description reel" },
      React.createElement(
        "div",
        { className: "motion-caption-track" },
        loopTerms.map((term, index) =>
          React.createElement("span", { key: term + index }, truncate(term, 34))
        )
      )
    )
  );
}

function RemotionHost() {
  const [state, setState] = useState({ stage: 0, fileCount: 0, variantCount: 0, materialNames: [], suggestions: [] });
  const [layout, setLayout] = useState("mobile");

  useEffect(() => {
    const onStage = (event) => {
      setState((current) => Object.assign({}, current, event.detail || {}));
    };
    window.addEventListener("vibe-generator-stage", onStage);
    return () => window.removeEventListener("vibe-generator-stage", onStage);
  }, []);

  useEffect(() => {
    const node = document.getElementById("remotion-root");
    const update = () => {
      const width = node && node.clientWidth ? node.clientWidth : window.innerWidth;
      setLayout(width >= 760 ? "wide" : (width >= 420 ? "middle" : "mobile"));
    };
    update();
    if (node && "ResizeObserver" in window) {
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const composition = layout === "wide"
    ? { width: 1120, height: 560 }
    : (layout === "middle" ? { width: 760, height: 920 } : { width: 360, height: 520 });

  return React.createElement(Player, {
    component: KnitScene,
    inputProps: state,
    durationInFrames: 180,
    compositionWidth: composition.width,
    compositionHeight: composition.height,
    fps: 30,
    loop: true,
    autoPlay: false,
    controls: false,
    acknowledgeRemotionLicense: true,
    style: { width: "100%", height: "100%" }
  });
}

const root = document.getElementById("remotion-root");
if (root) {
  createRoot(root).render(React.createElement(RemotionHost));
}
