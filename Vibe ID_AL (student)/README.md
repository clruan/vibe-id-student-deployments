# Vibe ID_AL

Local workspace for vibe-coding the Vibe ID interactive resume page.

## Quick Start

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

The root URL serves `AI_Resume_V4_Arron/index.html`. The server serves the whole workspace so page assets can load from `User_data/`.

## Useful Commands

```powershell
npm run check
```

Runs `node --check` across the page JavaScript files.

```powershell
npm run dev:root
```

Same as `npm run dev`; kept as an explicit reminder that the whole folder is served for local asset paths.

## Project Map

- `AI_Resume_V4_Arron/index.html` - page shell, metadata, script loading, hero photo path.
- `AI_Resume_V4_Arron/assets/content.js` - main resume/project content to vibe-code.
- `AI_Resume_V4_Arron/assets/styles.css` - visual system and responsive layout.
- `AI_Resume_V4_Arron/assets/js/` - page rendering, interactions, skill panels, project accordion, Three.js background.
- `User_data/Aaron Li/` - portrait, resume PDF, project screenshots, and source artifacts.
- `skills/` - local workflow notes for rebuilding or tailoring this WebID resume pattern.

## Editing Flow

1. Start the server with `npm run dev`.
2. Edit `AI_Resume_V4_Arron/assets/content.js` for copy, projects, skills, links, and artifact paths.
3. Edit `AI_Resume_V4_Arron/assets/styles.css` for layout and visual changes.
4. Run `npm run check` before publishing or sharing.

For a new candidate, copy `AI_Resume_V4_Arron/` to a new `AI_Resume_V4_<Name>/` folder and use the relevant notes in `skills/v4-webid-resume-builder/SKILL.md`.
