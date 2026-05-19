# Changelog

## v4 - 2026-04-03

- Created `AI_Resume_V4` as a new fork from `AI_Resume_V3_AG`.
- Rebuilt the skill system so the Intro chips remain static, the later-page sidebar renders on demand, and the previous cross-page flash / details-page bleed is removed.
- Changed Experience and Projects behavior so unrelated skills no longer stay on screen as muted chips; only the related skills appear when a card is hovered or selected.
- Replaced the old Intro-to-Experience skill move with an individual chip burst animation that flies into the Experience area with nonlinear easing, then dissipates.
- Kept the left-side empty gutter for later pages, with the sidebar only appearing when an Experience or Project is actually activated.
- Simplified Experience focus styling to a clean border-led emphasis instead of a gradient wash.
- Strengthened Project accordion rows with deeper lift, accent rails, and brighter focused surfaces.
- Upgraded the Project demo cue with clearer `Check Demo` messaging in both the section copy and the accordion badge.
- Added `aria-expanded` updates on project headers for clearer open/closed state.
- Bolded key phrases inside Experience bullets for faster scanning.

## v3_AG - 2026-03-30

- Created `AI_Resume_V3_AG` fork for a modern, bright, borderless design.
- Refined the intro layout so page 1 centers independently of the sidebar pages and the hero summary now emphasizes key phrases.
- Suppressed skill-panel movement on initial load, then replaced the block-level page transition with sub-500ms FLIP animation so individual skill chips fly between intro and sidebar layouts.
- Tightened skill-panel edge handling with wider sidebar spacing, softer containment, and static ordering unless the highlighted skill set actually changes.
- Reworked the skill layouts so page transitions move the existing chip nodes between the intro-flow skill section and the later-page sidebar dock, and highlight reordering now animates only the chips whose state changed instead of reloading whole lists.
- **UI & Layout:** Extracted Experience and Projects into separate pages (Pages 2 and 3).
- **Interactivity:** Added interactive skill highlighting to Work Experience sections (similar to Projects).
- **Navigation:** Replaced small page navigation dots with explicit floating text buttons (Intro, Experience, Projects, Details).
- **Visuals:** Replaced harsh borders with soft glows and added 3D hover effects. Added image placeholders for Peer Reviews.
- **Light Theme & Borderless Makeover:** Restructured the color palette to a premium light theme (`#f8fafc`) with slightly opaque teal particles. Systematically eliminated all solid and dashed borders, relying entirely on modern, diffuse drop-shadows for depth.
- **Sidebar Realignment:** Reworked the intro-to-sidebar motion so page transitions now animate individual skills while the sidebar keeps a softer masked edge and better chip spacing.
- **Collision Prevention:** Kept the protected left/right padding for pages with the sidebar, but gave page 1 its own centered padding so the intro card no longer drifts off-center.
- **Project Accordions:** Cleaned up redundant toggle arrows on the AI Project headers, embedding the expand/collapse arrow directly into the `Demo & Algo` badge (rotating 180° on click).

## v0.1 - 2026-03-28

- Created a new `AI_Resume` portfolio from scratch in a clean project directory.
- Built a recruiter-first landing page focused on AI project capability instead of a generic personal website layout.
- Added role-fit lenses so hiring managers can filter the page by LLM systems, applied AI, AI UX, or research AI.
- Added a capability map covering RAG, agent workflows, explainable AI interfaces, multimodal biomedical AI, human-AI collaboration analytics, and evaluation habits.
- Added five project cards with impact bullets, deliverables, workflow visualizations, and stack badges.
- Added an interactive workflow blueprint section to explain the common AI delivery pattern behind the portfolio.
- Added a LinkedIn-ready colleague recommendation section with structured placeholder slots.
- Split content, behavior, and styling into separate files for easier future maintenance.

## v0.2 - 2026-03-28

- Reworked the page into a resume-style layout for a more trustworthy presentation.
- Removed role-fit filters, roadmap content from the page, and portfolio-style marketing language.
- Repositioned the content toward an AI product manager target with more emphasis on quantitative skills and stakeholder-facing work.
- Rebuilt the project section into a compact algorithm viewer with intermediate steps and project-specific interactive controls.
- Reduced visual noise and replaced decorative effects with a more restrained editorial design.

## v0.3 - 2026-03-29

### Architecture — from single-page to multi-page scroll

- Replaced the single-page resume sheet layout with a three-page scroll-driven design where each page emphasizes one theme.
- **Page 1 (Hero):** Name, summary, contact, photo placeholder, and Selected Results. Skill panels appear at the bottom of the viewport.
- **Page 2 (Experience & Projects):** Full work experience list and AI project accordion. Skill panels fly to the left sidebar.
- **Page 3 (Credentials):** Education, Awards, Publications, and Peer Evaluations. Skill panels remain in the sidebar.

### GSAP + Three.js integration

- Added a Three.js animated particle-field background with 600 particles, proximity-based connecting lines, and a mouse-reactive camera.
- Integrated GSAP ScrollTrigger for scroll-driven page entrance animations (fade-in + upward slide per section).
- Built a GSAP-powered fly animation that moves the Quantitative Toolkit and Technical Stack panels between the bottom of the viewport (page 1) and a fixed left sidebar (pages 2 and 3), reversing when the user scrolls back.
- Added page-navigation dots on the right edge with active-state tracking tied to ScrollTrigger enter/enterBack callbacks.
- Three.js camera tilts slightly based on overall scroll progress for subtle depth.

### Skill panel behavior

- Skill panels are now `position: fixed` elements that live outside the page sections.
- On page 1 they sit at the bottom in a horizontal two-column layout; on pages 2–3 they fly to a vertical sidebar on the left.
- Hovering or activating a project still highlights related skills/tech chips with the same visual treatment as v0.2, now applied across the persistent panels.

### Content updates from LaTeX sources

- Added the **Volunteer Research Assistant** role (UMN College of Science and Engineering, Nov 2025–Present) with four bullets covering InkPulse, KNOWNET, AI-assisted exam tools, and NLP toolkit work — sourced from `Job_resume_ds.tex` and `main.tex`.
- Added a fourth project: **Causal & Survival Analysis in Venous Thromboembolism** (MIMIC-IV, doubly robust estimators, competing risks) with four algorithm stages and a ranking widget comparing IPW, doubly robust, and unadjusted estimators.
- Added a **Publications** section with three peer-reviewed papers from `main.tex` (Blood 2023, Frontiers in Medicine 2023, Translational Research 2022).
- Added an **Awards** section showing Graduate Scholarship ($20,000/yr) and Undergraduate Scholarship ($16,000/yr).
- Added a **Peer Evaluations** section with four LinkedIn-style recommendation cards (lab collaborator, project lead, faculty advisor, research teammate).
- Included GPA (3.78/4.00) in the M.S. education entry.

### Technical Stack expansion

- Added AI-specific tools and frameworks to the Technical Stack: **OpenAI API**, **Claude / Anthropic**, **LangChain**, **HuggingFace**, **Pinecone**, **ChromaDB**.
- Added general tools: **TypeScript**, **TensorFlow**, **Flask**.
- Expanded the Quantitative Toolkit with: **Prompt engineering**, **Agent workflows**, **RAG pipelines**, **Embedding evaluation**.
- Icons use devicon CDN where available; new entries without devicon icons use two-letter initial fallbacks.

### Project section redesign

- Replaced the side-by-side project list + detail panel with an **accordion layout**: each project is a collapsible card.
- Clicking a project header expands the card to reveal the full algorithm viewer, metrics, tech chips, ownership/impact notes, and the interactive widget demo.
- GSAP animates the project detail entrance (opacity + translate).
- All three original widget types (ranking, knowledge-graph, ROI/threshold) are preserved and fully functional inside the accordion.

### Chat updates

- Chat system context now includes publications data for richer answers.
- Local keyword fallback handles "publication" and "paper" queries.

### Retained from v0.2

- AI chat floating action button with Anthropic API support and local keyword fallback.
- Photo placeholder in the hero section.
- All three original interactive project demos (ranking behavior, evidence-path graph, threshold/ROI structure).
- Tech-chip and quant-tag highlighting on project hover/activation.
- Responsive breakpoints at 1080px and 760px.
- `prefers-reduced-motion` media query disabling animations.
