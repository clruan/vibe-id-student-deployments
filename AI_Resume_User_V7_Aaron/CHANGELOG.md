# Changelog

## local-template-v7-aaron-assets-deepseek-chat - 2026-05-26

- Added a Vercel `/api/chat` endpoint for DeepSeek chat completions using `deepseek-v4-flash`.
- Updated the portfolio chatbot to call the serverless endpoint instead of browser-side vendor keys.
- Copied Aaron screenshots, resume, workbook, and paper files into `AI_Resume_User_V7_Aaron/User_data/Aaron Li/` so deployed assets are self-contained.
- Rewrote Aaron V7 screenshot, resume, and artifact links to local `User_data/Aaron Li/...` paths.
- Changed the visible research paper action to open the PDF instead of DOCX so the browser does not show a blank document page.
- Bumped the cache key for the asset and chat update.

## local-template-v7-aaron-folder-filter-summary - 2026-05-26

- Added an Aaron-focused V7 folder at `AI_Resume_User_V7_Aaron`, with the default profile route locked to Aaron.
- Renamed the local viewer shell from the explicit V7 viewer label to a neutral profile preview.
- Kept skill filtering active while removing the duplicate filtered project/experience result cards and their black jump buttons.
- Made selected skill chips and selected related-skill pills more pronounced with stronger borders, rings, and shadow.
- Bumped the cache key for the filter-summary and Aaron-folder update.

## local-template-v7-filter-skill-priority-clear - 2026-05-26

- Reordered project, experience, selected-result, and filtered-result related-skill strips so active filter skills move to the front and render highlighted.
- Ensured active selected skills stay visible before overflow truncation, so a matching selected skill is not hidden behind `+N`.
- Added an always-available floating `Clear filters` control whenever a filter is active, plus an inline clear action in the filter summary.
- Kept the existing header clear button synchronized with global/inline clear actions after filter state changes.
- Bumped the cache key for the filter-priority and clear-control update.

## local-template-v7-project-header-filter-bind-fix - 2026-05-26

- Fixed project cards breaking after `+N` skill overflow buttons were added by removing invalid nested button markup from project headers.
- Kept project headers keyboard/click accessible with `role="button"` and explicit Enter/Space handling.
- Changed related-skill `+N` click handling to capture and stop the event before it can toggle the surrounding project card.
- Replaced repeated direct filter event binding with one delegated intro-skill listener so `Show all` / `Show fewer` cannot accumulate duplicate handlers after re-renders.
- Added no-WebGL fallbacks for the background and neural-workbench demo in headless/no-GPU environments.
- Changed the CITIC organization logo mapping to a placeholder fallback to avoid a broken favicon request.

## local-template-v7-intro-card-expand-org-logos - 2026-05-25

- Wrapped the hero identity and Selected Results together inside one shared intro card while keeping the skill filters as the next section.
- Made every related-skill overflow chip interactive: clicking `+N` expands the hidden leftover skills in place and switches to a collapse control.
- Added organization logo slots to Experience and Education rows, using mapped university/company favicon logos where available and initials placeholders otherwise.
- Bumped the V7 cache key so local browser previews pick up the card, expansion, and logo updates.

## local-template-v7-nav-results-logo-readability - 2026-05-25

- Reserved a fixed right-side navigation lane on desktop and unified all main section widths so Intro, Projects, Experience, Details, and intro skill filters align at the same body width.
- Changed the intro identity area from a floating name card into an expanded profile header/banner with no outer card shadow.
- Rebuilt Selected Results as exactly two project preview cards with related skills, one key quantifiable metric, and a `Check demo` button that opens the matching project.
- Switched standard mode to hide endorsement blocks, reducing noise in project and experience previews.
- Darkened toolkit, stack, filter, expand, and jump controls to black/dark gray and added more technical-stack logos via Devicon plus the `simple-icons` npm CDN package.
- Reduced experience text weight, stripped bold HTML from experience previews/details, and softened experience borders for easier long-sentence reading.
- Added a preflight WebGL context check so the Three.js background falls back cleanly without console errors in non-WebGL/headless browsers.

## local-template-v7-unified-skills-project-limit - 2026-05-25

- Unified quantitative toolkit and technical stack chips into the same text-pill format across intro filters, project rows, filtered summaries, and experience rows.
- Changed skill filtering from strict all-selected matching to broader any-selected matching so experience cards remain visible for mixed-skill filters.
- Limited the Projects section to four rows by default with a simple black show-more control.
- Simplified experience expansion copy to `Read more` and styled it as black inline text.
- Removed the explicit `Interactive profile` badge and flattened contact info so it renders as inline text links instead of bubbles.
- Added profile-photo support in the hero avatar and wired Aaron's local headshot into the V7 profile fallback.
- Tightened Selected Results into a more compact evidence strip and centered Projects/Experience panels with a narrower max width.

## local-template-v7-linkedin-filter-jump - 2026-05-25

- Restyled the intro as a LinkedIn-style profile card with a blue/violet AI cover band, avatar initials, compact headline, and contact chips.
- Capped intro skill panels at 10 visible chips by default with per-panel expand/collapse controls.
- Changed experience cards to show only the first contribution by default and collapse all non-first bullets behind a details control.
- Added related-skill strips to every experience card, matching the project related-skill treatment.
- Reworked filtered results into compact project and experience summary cards with direct jump/open buttons.
- Added overflow wrapping and line clamps for experience/project text to reduce horizontal spill and paragraph weight.
- Updated the Vibe_ID generator to reuse the V7 `index.html` shell instead of duplicating it, and preserved `courseworkProjects` as a `coursework` alias.
- Guarded the Three.js background so no-WebGL browser contexts fall back without a runtime error.

## local-template-v7-filter-first - 2026-05-25

- Created `AI_Resume_User_V7` from the V6 engine baseline.
- Replaced the fixed left skill bubble rail with selectable intro skill filters.
- Connected skill filters to both project and experience relationships.
- Moved Projects before Experience and widened the main content area.
- Added related-skill strips at the top of each project row.
- Added one-line experience previews from the first bullet.
- Updated the Vibe_ID generator so emitted templates use the same V7 skill-filter layout and project-first order.

## local-template-v7 - 2026-05-21

- Created `AI_Resume_User_V7` as a local-only template-engine prototype.
- Reused the Duke/Frank User V3 visual system and project widget standard.
- Added `assets/template-engine.js` to route local profiles with `?profile=duke`, `?profile=frank`, or `?profile=aaron`.
- Added `assets/data/profiles.js` to adapt Duke V3, Frank V3, and Aaron Vibe ID AL source data into the shared renderer shape.
- Removed the loaded job-variant router, top program header, and profile snapshot section from the V7 page.
- Made project accordion toggles immediate by removing the project-detail entrance animation and height transition.
- Adjusted page navigation and skill/sidebar rails so they reserve space on desktop and collapse away from content on smaller screens.
- Split Duke's microscopy work correctly: `nd2-agent` is the interactive ND2 pipeline/agent project, while `deep-imaging` is the U-Net, Med-SAM, DeepLabV3, and CNN microscopy deep-learning project.
- Strengthened Duke's project set with V3-standard interactive widgets for ND2 thresholding, deep-learning microscopy, VTE survival/causal analysis, causal learning, InkPulse timelines, KNOWNET evidence paths, medical NLP, and resume matching.
- Removed VIP mode and the endorsement toggle; experience and project endorsements render directly.
- Removed the Evidence Notes section from page 4.
- Expanded Aaron V7 rendering so Vibe ID AL coursework, certifications, analyst keyword groups, technical skill details, source links, project STAR blocks, screenshots, and the one Market Pulse mentor endorsement appear inside the V7 standard.
- Added template-level skill layout rules: quantitative toolkit is the default primary skill section, technical stack is default secondary, and profiles can override the secondary panels.
- Customized Aaron's skill layout to show Quantitative Toolkit as primary, with Analytical Skills and Certificates as secondary panels; removed repeated experience-level analyst skill/tool boxes.
- Added project-preview endorsement badges with name and institution/company slots, and repeated stronger project endorsements before and after the Check Demo area.
- Simplified Aaron's Check Demo area to use Vibe ID AL screenshots and source/demo links instead of the long reconstructed widget.
- Moved verbose finance keywords/source material into a translucent ATS Signal Layer.
