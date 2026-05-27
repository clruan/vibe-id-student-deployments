# AI_Resume_User_V7 Implementation Log

## Scope

- Build a local AI Resume V7 template engine.
- Use Duke Ruan, Frank Yin, and Aaron Li as test profiles.
- Keep the visual and project logic close to Duke/Frank User V3.
- Avoid job-variant fitting and Vercel changes.

## Source Profiles

- Duke: `AI_Resume_User_V3_Duke/assets/data/base.js`
- Frank: `AI_Resume_User_V3_Frank/assets/data/frank.js`
- Aaron: `Vibe ID_AL (student)/AI_Resume_V4_Arron/assets/content.js`

## Implemented

1. Created `AI_Resume_User_V7` from the User V3 scaffold with the broader widget support from the Aaron Vibe ID page.
2. Added `assets/data/duke-source.js`, `assets/data/frank.js`, and the Aaron Vibe ID source adapter.
3. Added `assets/data/profiles.js` to normalize those sources into one local profile registry.
4. Added `assets/template-engine.js` to choose a profile from the URL and expose `window.resumeContent`.
5. Updated `index.html` so it has no loaded program header, no profile snapshot block, and no job router.
6. Updated project toggling to show/hide details immediately.
7. Updated CSS spacing so the right page nav and left skill rail do not overlap the main content.
8. Added a `.gitignore` exception for `AI_Resume_User_V7` so git status can monitor the V7 tree.
9. Rebuilt Duke's V7 project layer from the CV/source data so the ND2 pipeline agent is separate from the microscopy deep-learning project.
10. Added Duke-specific advanced widgets for ND2 threshold exploration, survival/causal analysis, causal concept navigation, InkPulse pattern timelines, and medical NLP extraction.
11. Removed the VIP mode/toggle and rendered endorsements directly for experience and project cards.
12. Removed page-4 Evidence Notes and added optional profile-material sections for coursework, certifications, keywords, technical details, and source links.
13. Expanded Aaron's V7 project detail renderer to show Vibe ID AL problem statements, approaches, result lists, screenshots, and the Market Pulse mentor endorsement.
14. Added profile-customizable skill layout with Quantitative Toolkit as the default primary section.
15. Customized Aaron's skill panels to Quantitative Toolkit, Analytical Skills, and Certificates, and hid repeated experience-level analyst/tool boxes.
16. Added project preview endorsement badges and repeated project endorsements before and after demos.
17. Simplified Aaron demos to screenshot evidence plus source/demo links and moved verbose ATS keywords into a translucent ATS Signal Layer.
18. Created the V7 filter-first layout from the V6 baseline.
19. Removed the fixed left skill bubble rail and moved skill interaction into the intro section.
20. Added multi-select skill filtering for related projects and experiences.
21. Reordered the main pages so projects appear before experience.
22. Added project-level related-skill strips and one-line experience previews.
23. Updated the Vibe_ID generator to emit the V7 layout for future template builds.
24. Restyled the intro into a LinkedIn-style profile card with a blue/violet AI cover, avatar initials, compact headline, and contact chips.
25. Capped intro skill groups at 10 visible chips by default and added per-panel expand/collapse state.
26. Changed experience rendering so only the first contribution is visible by default; non-first bullets render inside a collapsed details drawer.
27. Added related-skill strips to experience cards and tightened wrapping/line clamps to prevent experience text overflow.
28. Rebuilt filtered results as compact project/experience summary cards with direct jump buttons.
29. Optimized the Vibe_ID generator so it copies the V7 `index.html` shell and patches only title/meta/cache/data scripts; also mapped legacy `courseworkProjects` to renderer-ready `coursework`.
30. Added a no-WebGL fallback guard for the Three.js background.
31. Replaced stack icon chips and project/experience skill pills with one shared text-pill renderer so toolkit and stack skills use the same format and font everywhere.
32. Changed selected-skill filtering to match any selected skill instead of requiring every selected skill, preventing the experience section from disappearing under mixed filters.
33. Limited the Projects accordion to four rows by default and added a simple show-more/show-fewer project control.
34. Removed the `Interactive profile` label, flattened hero contact links, and reduced selected-results/project/experience card layering.
35. Added profile-photo rendering in the hero avatar and a local Aaron headshot fallback.
36. Centered page 2 and page 3 panels with a narrower max width.
37. Reserved a desktop right navigation lane and set all main section containers, including intro skill filters, to the same max body width.
38. Changed the intro identity from a floating card to an expanded profile header/banner with a transparent outer shell.
39. Rebuilt Selected Results from two project previews with related skills, one quantifiable metric, and a direct `Check demo` opener.
40. Hid endorsement blocks in standard mode so Projects and Experience stay quieter by default.
41. Added Simple Icons CDN mappings alongside Devicon for broader stack-logo coverage.
42. Reduced experience preview weight, removed bold HTML from experience bullets, and changed experience accents to dark gray.
43. Added a WebGL preflight guard before creating the Three.js renderer.
44. Restored page 1 as a single shared card that contains both the LinkedIn-style intro and Selected Results.
45. Added expandable `+N` skill overflow buttons for related-skill strips across selected results, projects, filtered results, and experience cards.
46. Added organization logo slots to experience and education rows with mapped favicon sources and initials placeholders.
47. Fixed project-card breakage caused by invalid nested buttons: project accordion headers are now non-button elements with button semantics, and skill overflow buttons capture their own clicks before header toggling.
48. Fixed unstable intro filter show/hide controls by replacing repeated direct listeners with one delegated listener on the intro skill root.
49. Added no-WebGL fallbacks for the neural workbench widget and adjusted unavailable organization logos to use placeholders.
50. Reordered related-skill strips by active selected filters and highlighted the selected matches in project, experience, selected-result, and filtered-result contexts.
51. Added synchronized inline and floating clear-filter controls so filters can always be cleared after scrolling or repeated interactions.
52. Removed duplicate filtered project/experience result cards from the intro filter output; the filter now leaves only a compact summary while the real sections update below.
53. Strengthened active filter chips and highlighted related-skill pills with clearer rings, borders, and shadow.
54. Added `AI_Resume_User_V7_Aaron` as a separate Aaron-focused V7 folder with Aaron as the default profile.
55. Added a root Vercel serverless chat endpoint backed by DeepSeek `deepseek-v4-flash`.
56. Rewired the client chatbot to call `/api/chat` and keep API keys out of browser JavaScript.
57. Copied Aaron's image and document artifacts into the Aaron V7 folder and rewrote Aaron asset links to local `User_data/Aaron Li/...` paths.
58. Pointed Aaron's visible research paper action at the PDF copy instead of the DOCX source.
59. Added client and server request timeouts around DeepSeek chat calls so the widget falls back instead of staying on `Thinking...`.
60. Mirrored the chat API into `AI_Resume_User_V7_Aaron/api/chat.js` for Vercel deployments whose Root Directory is the Aaron folder.
61. Made project-level Expert Endorsements visible in standard mode, changed the treatment to red, and added robust company-logo fallback rendering.

## Verification

- `node --check` passes for every JavaScript file under `AI_Resume_User_V7/assets`.
- Template-engine smoke test passes for `duke`, `frank`, and `aaron`; the old `arron` typo remains a hidden compatibility alias.
- Local static server smoke test passes at `http://localhost:8087/AI_Resume_User_V7/?profile=aaron`.
- Browser CDP smoke test confirms 32 visible skill filter chips, no side skill rail DOM, two project skill strips, five experience previews, and page navigation order `Intro > Projects > Experience > Details`.
- Vibe_ID generator sample rebuild passes and emits the V7 filter intro with `Projects` before `Experience`.
- 2026-05-25 update: `node --check` passes for all JavaScript under `AI_Resume_User_V7/assets` and `skills/vibe-id-generator`.
- 2026-05-25 update: Vibe_ID generator sample rebuild passes at `/tmp/vibe-id-generator-sample-test` and emits the single-profile `profile.js` data block from the V7 shell.
- 2026-05-25 update: Chrome headless CDP smoke test passes at `http://localhost:8097/AI_Resume_User_V7/?profile=duke`: LinkedIn hero present, 10 default toolkit and 10 default stack chips, expand-to-26 toolkit works, 4/4 experience cards have collapsed drawers and related-skill strips, 8 project rows have related-skill strips, filtered result jump buttons render, experience jump activates a visible target, and no horizontal overflow appears on desktop or mobile.
- 2026-05-25 update 2: Chrome headless CDP smoke test passes at `http://localhost:8097/AI_Resume_User_V7/?profile=duke`: no `Interactive profile` text, 10 toolkit and 10 stack filters, zero intro tech-icon chips, four default project rows, show-more expands to eight projects, all four experience cards remain visible with multi-stack filters, contact backgrounds are transparent, and project/experience panels are centered.
- 2026-05-25 update 2: Aaron profile smoke test confirms the hero avatar loads `1775700440236.jpg` and hides the initials fallback after image load.
- 2026-05-25 update 3: `node --check` passes for all JavaScript under `AI_Resume_User_V7/assets` and `skills/vibe-id-generator`.
- 2026-05-25 update 3: Vibe_ID generator sample rebuild passes at `/tmp/vibe-id-generator-sample-test`.
- 2026-05-25 update 3: Chrome headless CDP smoke test passes at `http://localhost:8097/AI_Resume_User_V7/?profile=duke`: all four page bodies are 1120px wide, intro skill filters are 1120px wide, right nav keeps a 130px gap from main content, no horizontal overflow or console errors appear, Selected Results has two project cards with `Check demo`, standard mode renders zero endorsements, stack filters show 10 logo images, Python filtering leaves four experience cards visible, and experience preview weight is 500 with no bold tags.
- 2026-05-25 update 4: Chrome headless CDP smoke test passes at `http://localhost:8097/AI_Resume_User_V7/?profile=duke`: page 1 has a non-transparent shared card background and shadow, all page bodies remain 1120px wide, clicking a `+N` skill button expands six hidden pills in place, all four experience rows and both education rows render organization logo slots, five logo images and one placeholder are present, and no console/page errors appear.
- 2026-05-26 update: `node --check` passes for all JavaScript under `AI_Resume_User_V7/assets` and `skills/vibe-id-generator`; Vibe_ID generator sample rebuild passes at `/tmp/vibe-id-generator-sample-test`.
- 2026-05-26 update: Chrome headless CDP regression passes across `duke`, `frank`, and `aaron`: project headers no longer render as nested `<button>` elements, every visible project header keeps its demo badge and skill strip attached, each visible project opens and renders detail content, project-header `+N` skills expand without toggling the project, and intro filter `Show all` / `Show fewer` toggles remain stable after repeated skill-filter re-renders.
- 2026-05-26 update 2: Chrome headless CDP regression passes across `duke`, `frank`, and `aaron`: selected Python/Excel filters move to the first visible related-skill pill in matching projects and experiences, selected pills render highlighted, the floating clear button is visible after scrolling, clearing removes all active filters and resets the summary, and `Show all` / `Show fewer` still toggles correctly after clearing.
- 2026-05-26 update 3: `node --check` passes for shared V7, Aaron V7, and the Vibe_ID generator; generator sample rebuild passes; Chrome headless CDP verifies `AI_Resume_User_V7_Aaron/` defaults to Aaron, selected skill chips have visible ring/shadow, duplicate filtered project/experience result cards and jump buttons render at zero count, and clear filters resets the state.
- 2026-05-26 update 4: `node --check` passes for shared V7, Aaron V7, and `/api/chat`; local HTTP checks return 200 for Aaron's copied research screenshot PNG and paper PDF; Chrome headless CDP confirms the Research Agent project renders four screenshots with zero missing images and links `Open research paper` to the PDF.
- 2026-05-26 update 5: Chrome headless CDP confirms the chat FAB opens, a user question submits, the typing indicator clears, and a fallback assistant response renders when `/api/chat` is unavailable on the local static server.
- 2026-05-26 update 6: Public Vercel `/api/chat` check returned 404, indicating the deployment root did not include the repo-level API folder; the Aaron-folder API mirror was added to support that configuration.
- 2026-05-27 update: Chrome headless CDP confirms Aaron project cards render `Expert Endorsement` in standard mode, use the red eyebrow color, and include a company logo slot.

## Duke Source Checks

- CV facts used: U-Net, Med-SAM, DeepLabV3 microscopy segmentation; CNN cell classification with 97% accuracy on 20,000+ samples; recurrent VTE survival analysis with Kaplan-Meier, Cox proportional hazards, and competing risks; KNOWNET, InkPulse, PyNile, and ND2-Analysis-Pipeline projects.
- GitHub/repo facts used: `nd2-analysis-pipeline` supports interactive 0-4095 threshold sliders, multi-channel ND2 analysis, group boxplots, statistical tests, JSON/Excel exports, and FastAPI + React/Plotly tooling.
