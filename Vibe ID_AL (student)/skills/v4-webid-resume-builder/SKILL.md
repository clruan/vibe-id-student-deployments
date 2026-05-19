---
name: v4-webid-resume-builder
description: Build a single-candidate WebID interactive resume in the V4_Arron pattern — hero with profile photo, intro skill panels, STAR-style AI project cards (Problem / Approach / Result / Visual Evidence + lightbox), Education + Coursework page. Use this when a candidate provides a resume PDF, 1–2 AI project artifacts (worksheet, results, screenshots), and a profile photo, and wants the same look-and-feel as `AI_Resume_V4_Arron/`.
---

# V4 WebID Resume Builder

Builds a complete `AI_Resume_V4_<Name>/` directory matching the V4_Arron design system. Use this skill when onboarding a new candidate with the same content depth and STAR project storytelling.

## What the candidate must provide

1. **Resume PDF** — primary fact source for profile, experience, education, skills, and the resume's PROJECT section.
2. **AI project artifacts** — for each AI project: a worksheet/spec (xlsx/docx), a results/paper artifact, and 1–3 screenshots of the live demo or tool.
3. **Profile photo** — square JPG/PNG, ideally 800×800 or larger.

## Canonical template

`AI_Resume_V4_Arron/` is the reference. Treat its file tree, JS architecture, HTML structure, and CSS as fixed. Only edit data and copy — do not touch the renderer logic.

Key files to know:
- `index.html` — page shell. Edit only `<title>`, `<meta description>`, and the hero `<img src>` path.
- `assets/content.js` — full data replacement target.
- `assets/styles.css` / `assets/js/*` — leave alone.

## Workflow

### 1. Identify source of truth
- Read the resume PDF cover-to-cover. Treat dates, employers, degrees, GPA, metrics, project names, license names, and skill list as fixed facts.
- Open each AI project artifact (worksheet, results, screenshots) — these are the source for the STAR-style project content.
- Anything not in these sources is unverified. **Do not invent.**

### 2. Fork the canonical template
- Copy `AI_Resume_V4_Arron/` to `AI_Resume_V4_<Name>/`.
- Edit only `index.html` (title + meta + photo path) and `assets/content.js` (full data replacement).
- Do not change JS, CSS, or HTML structure.

### 3. Save user assets to `User_data/<Name>/`
- Place the profile photo at `User_data/<Name>/<photo>.jpg`.
- For each AI project create `User_data/<Name>/<Project Folder>/` and save:
  - `1.jpg`, `2.jpg`, `3.jpg` — three demo screenshots (in display order).
  - The original worksheet / results files for downloadable artifact links.

### 4. Build the candidate content (replace `assets/content.js`)

Required top-level fields:
- **profile** — `name` (full legal), `summary` (2 sentences), `summaryHtml` (same with `<strong>` on target role + key methods), `location`, `phone`, `email`, `linkedin`, `resume` (path to PDF).
- **quantToolkit** — chip array. Every chip must be supported by the resume's Skills section or a verifiable Experience / Project bullet. Each chip has `{ label, relatedProjects: [], relatedExp: [] }` so the sidebar can highlight context.
- **stack** — every entry is `{ id, label, color }`. Items used **only** in projects (e.g. React, Vite, Vercel for a React demo) get `projectOnly: true` so they stay queryable for the project's chip row but disappear from the global Technical Stack panel.
- **experience** — 2–4 items, each with `{ id: "exp-N", role, organization, location, dates, bullets[], relatedTech[] }`. Bullets bold key facts with `<strong>`.
- **education** — `{ degree, school, dates, gpa, note }`.
- **coursework** — the resume's PROJECT section as 1–3 sub-items with `{ title, bullets[] }`.
- **links** — array of `{ label, value, href }` for footer / hero contact.
- **projects** — one entry per AI project, in this STAR shape:
  - `id`, `navTitle`, `navMeta` — **HR-impressive one-liner** that leads with an AI keyword and a concrete metric.
  - `title`, `source` (kept in data but not rendered as eyebrow), `summary` (legacy, kept for chat context).
  - `tagline` — one sentence, no jargon.
  - `problemStatement: { narrative }` — 1–2 sentences combining *who* + *facing* + *unanswered question*.
  - `approach: { description, aiStack[], classicStack[] }` — `description` is a single concise paragraph; `aiStack` is the AI-keyword chip array shown in the Approach card; `classicStack` is kept in data but not currently rendered.
  - `result` — array of 3 short outcome bullets.
  - `screenshots` — array of `{ src, alt, caption }` pointing at `User_data/<Name>/<Project>/1.jpg|2.jpg|3.jpg`.
  - `relatedTech` — only tools actually used in this project (matched by `id` against `stack`).
  - `accent` — hex color for the project's accent (matches `--project-accent` CSS var).
  - `artifactLinks` — `{ label, href, note }` for live demo / source artifacts. Keep it minimal — one link is OK.
  - Legacy fields kept in data (not rendered): `metrics`, `owned`, `algorithmSummary`, `stages`, `widget`. Leave them empty or omit; renderers gracefully ignore.

### 5. Wire the photo and meta
- Replace the hero placeholder in `index.html`:
  ```html
  <div class="hero-photo" id="photo-placeholder">
    <img src="../User_data/<Name>/<photo>.jpg" alt="<Full Name> portrait">
  </div>
  ```
- Update `<title>` to `<Full Name> | <Target Role> Resume`.
- Update `<meta name="description">` to a one-sentence elevator pitch.

### 6. Validate before delivery
- `node --check` every JS file in `assets/` and `assets/js/`.
- Parse content with: `node -e "global.window={}; require('.../assets/content.js'); ..."` to confirm `profile`, `experience`, `projects`, `quantToolkit`, `stack` arrays are populated and shaped correctly.
- Start a static server (`python -m http.server`) and `curl` `index.html`, `assets/content.js`, the photo, and each screenshot — all must return HTTP 200.
- Open the page in a browser:
  - Page 1 hero shows real photo + summary + intro skill panels.
  - Page 2 experience cards expand and skill chips highlight on hover.
  - Page 3 project accordions open into STAR cards with Problem / Approach / Result / Visual Evidence.
  - Click any screenshot thumbnail → lightbox opens with prev/next navigation.
  - Page 4 shows Education + Coursework only (no Awards / Publications / Peers).

## STAR Storytelling Rules

| STAR | V4_Arron field | Rule |
|---|---|---|
| **S**ituation | `problemStatement.narrative` (sentence 1) | Who is this for, facing what gap |
| **T**ask | `problemStatement.narrative` (sentence 2) | The unanswered question, often phrased as "Can/Should/Which..." |
| **A**ction | `approach.description` + `approach.aiStack` | One paragraph + AI-keyword chips |
| **R**esult | `result[]` | Three concrete outcome bullets — target metric, deliverable, scope |

The `tagline` sits above STAR as a one-line jargon-free hook, and `navMeta` is the HR-scannable one-liner shown in the collapsed accordion header.

### One-liner navMeta formula

`[AI keyword] [project type] — [concrete outcome / metric]`

Example: "Vibe-coded AI market tool — cuts an analyst's first-pass ticker review from 15 min to 30 sec".

## AI Keyword Chip Library

Use only the ones that genuinely apply to the project:

`Vibe coding` · `Agentic workflow` · `Agent` · `Prompt engineering` · `RAG` · `LLM` · `Hypothesis-driven research` · `Source-quality control` · `MVP scoping` · `AI-assisted` · `Confidence-aware AI` · `Agentic prototyping`

Add a new keyword only if it appears verbatim in the candidate's project artifacts.

## Source-of-Truth Rules

- Every experience bullet must trace to the resume PDF.
- Every project metric, tool, and outcome must trace to its artifact (worksheet / paper / deck / live demo URL).
- Do not claim production scale, team leadership, paid clients, or revenue impact unless the source explicitly states it.
- Tighten language. Do not stretch facts to match a target role — instead, reorder evidence so the relevant facts appear first.
- When the resume's Technical Skills section omits a tool the candidate clearly used in a project (e.g. React for a React demo), keep the tool in the project's `relatedTech` and mark its stack entry `projectOnly: true` — never list it as a global Technical Stack skill if not in the resume.

## Conventions

- Folder name: `AI_Resume_V4_<FirstName>` (match `AI_Resume_V4_Arron`).
- Photo path: any filename inside `User_data/<Name>/`; point `index.html` at it.
- Project screenshot filenames: standardize on `1.jpg / 2.jpg / 3.jpg` inside the project's `User_data` folder, in display order.
- Chat fab: keep `chat.js` removed from `index.html` if the candidate does not want the floating AI chat button (V4_Arron default — no chat).
- Sections to keep on Page 4: Education + Coursework only.
- Sections explicitly removed (do not re-add): Selected Results, Publications, Peer Evaluations, Capability Themes (Awards), interactive widget panels.

## Output

- A working `AI_Resume_V4_<Name>/` directory.
- A short audit note listing which resume / artifact source backs which content field, and any items the candidate should review before publishing.
- One smoke-test screenshot or curl-output snippet confirming the page loads.

## Composition with `resume-job-tailor`

If the candidate also wants role-specific tailoring of bullets (separate skill at `skills/resume-job-tailor/`), run that workflow **first** to derive the role-tailored experience bullets, then feed the tailored resume into this skill as the primary fact source.
