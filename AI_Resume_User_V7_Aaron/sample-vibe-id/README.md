# Jialing Chen Vibe ID Example

Status: `ready_for_review`

This folder is the standalone version. It is not inside `Vibe_ID_Generator/generated_examples/20260619_jialing_chen`.

## Generation Method

- Built with Codex locally.
- DeepSeek API was not used.
- Original source project identities, screenshots, widgets, metrics, and artifact links are preserved.
- Jialing's HR-facing project sections are trimmed and ordered as evidence/deliverable, interactive demo or screenshots, then methodology.

## Candidate

- Name: Jialing Chen
- Undergraduate: Boston University, Sep 2020 - May 2024
- Master's: University of California, San Diego, Sep 2024 - Jun 2026
- Photo: formal business attire / suit version at `assets/jialing-chen-formal-profile.png`
- No black top-right Vibe ID corner badge.

## Mother Version

- HTML: `html/jialing-chen-mother-vibe-id.html`
- Payload: `payloads/jialing-chen-mother-payload.json`
- Mother profile note: `mother/jialing-chen-mother-vibe-id.json`

## Project Pool

1. Creative Brief Automation: `ai-design-strategy`, from Ruihang / `AI_Resume_User_V7_Ruihang/assets/data/ruihang-vibe-source.js`
2. Deep Learning Microscopy / CNN: `deep-imaging`, from Duke final V7 registry / `AI_Resume_User_V7/assets/data/profiles.js`
3. ND2 Imaging Analysis Agent: `nd2-agent`, from Duke final V7 registry / `AI_Resume_User_V7/assets/data/profiles.js`
4. COPD SOM Clustering: `copd-som`, from Frank / `AI_Resume_User_V7/assets/data/frank.js`
5. Market Pulse Copilot: `market-pulse`, from Aaron final V7 registry / `AI_Resume_User_V7/assets/data/arron-vibe-source.js` + `profiles.js`
6. Lumina AI Product: `lumina-ai-product`, from Kailin / `AI_Resume_User_V7/assets/data/kailin.js`

Local `User_data` links are included so original screenshot paths such as `../User_data/...` keep working from the standalone folder.

## Specialized Versions

All five specialized versions use the same source-backed six-project demo pool. Project detail pages are ordered as evidence/deliverable, interactive demo or screenshots, then methodology.

- Product Analytics Data Scientist: `html/jialing-chen-product-analytics-data-scientist.html` / `payloads/jialing-chen-product-analytics-data-scientist.json`
- AI Product Manager: `html/jialing-chen-ai-product-manager.html` / `payloads/jialing-chen-ai-product-manager.json`
- Clinical Data Scientist: `html/jialing-chen-clinical-data-scientist.html` / `payloads/jialing-chen-clinical-data-scientist.json`
- Market Intelligence Analyst: `html/jialing-chen-market-intelligence-analyst.html` / `payloads/jialing-chen-market-intelligence-analyst.json`
- Marketing Analytics Strategist: `html/jialing-chen-marketing-analytics-strategist.html` / `payloads/jialing-chen-marketing-analytics-strategist.json`

They are separate files and are not combined into one selector page.

## Verification

- JSON parse check passed for the mother payload, mother profile, job index, and all five specialized payloads.
- Chrome smoke check passed for the mother page and all five specialized pages.
- All six pages render 23 skill filter chips, three job-title Experience entries, and six projects.
- Every project detail page renders in the required order: evidence/deliverable, interactive demo or screenshots, then methodology.
- Profile photo and copied project screenshots load successfully.
- Black top-right Vibe ID corner badge is removed.
