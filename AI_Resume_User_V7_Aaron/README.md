# AI Resume User V7 Aaron

Aaron-focused local V7 folder. Opening this folder without query parameters defaults to Aaron Li.

V7 moves skill matching into the intro: users select skill chips to filter both projects and experience. The fixed left skill rail is removed, projects appear before experience, the Projects section starts at four rows with a show-more control, toolkit/stack chips share one dark text-pill format and start capped at 10 with expand controls, each project and experience starts with related skills, active filter skills move to the front of related-skill strips, `+N` related-skill overflow chips expand in place, and experience cards collapse non-first bullets behind `Read more`.

The current intro uses an expanded LinkedIn-style profile header with a blue/violet AI cover and compact headline. The intro and Selected Results now sit inside one shared card. Contact info is rendered as plain inline text links. Selected Results shows two project preview cards with related skills, a key metric, and direct `Check demo` buttons. Filtered skills now show a compact count summary only; the Projects and Experience sections below are the filtered source of truth.

Technical stack logos come from Devicon first and `simple-icons` through the jsDelivr npm CDN when a broader brand icon exists. Unknown tools fall back to initials.

Experience and education rows include organization logo slots. Known universities/companies use mapped favicon logos; unknown organizations fall back to initials placeholders.

Project headers deliberately avoid native `<button>` wrappers because related-skill overflow controls can also be buttons. This prevents browser DOM repair from breaking project card layout while preserving click and keyboard activation on the full header.

When filters are active, `Clear filters` appears in the filter header, filter summary, and as a floating control so the current filter state can be reset from anywhere on the page.

Chat is wired through the root Vercel function at `/api/chat`. Set `DEEPSEEK_API_KEY` in Vercel project environment variables; the function uses `deepseek-v4-flash` by default.

Aaron screenshots, the resume PDF, and the research paper PDF are copied into `AI_Resume_User_V7_Aaron/User_data/Aaron Li/` so the deployed folder is self-contained.

Simplest local view:

- Open `AI_Resume_User_V7/viewer.html` directly in a browser.
- Open `AI_Resume_User_V7_Aaron/viewer.html` for the Aaron-focused V7 folder.

Optional repo-root server routes:

- `http://localhost:8087/AI_Resume_User_V7/?profile=duke`
- `http://localhost:8087/AI_Resume_User_V7/?profile=frank`
- `http://localhost:8087/AI_Resume_User_V7/?profile=aaron`

The page uses `assets/template-engine.js` to choose one local profile and expose it as `window.resumeContent` for the shared V3-style renderers. It does not use job variants or Vercel routing.

`assets/content.js`, `assets/data/arron.js`, and `assets/js/shell.js` are retained from the scaffold for reference, but `index.html` does not load them in V7.

Duke V7 intentionally separates the ND2 imaging-analysis agent from the microscopy deep-learning project. The ND2 project covers the FastAPI + React threshold agent; the deep-learning project covers U-Net, Med-SAM, DeepLabV3, and CNN microscopy classification.

Aaron is the canonical spelling and route. The old `arron` query is kept only as a backward-compatible alias.
