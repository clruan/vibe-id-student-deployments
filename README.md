# Vibe ID Student Deployments

This repository contains two static Vibe ID student sites prepared for Vercel.

## Projects

- `Vibe ID_AL (student)` - Aaron Li
- `Vibe ID_RS (Student)` - Ruihang Shen

## Vercel Import Settings

Create two Vercel projects from this same GitHub repository.

### Vibe ID_AL

- Root Directory: `Vibe ID_AL (student)`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: `.`

### Vibe ID_RS

- Root Directory: `Vibe ID_RS (Student)`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: `.`

Each project includes its own `vercel.json` rewrite so `/` serves the candidate `index.html`.

## Standard V3 Fit Rule

Use `AI_Resume_User_V3_Duke` as the standard template for future student Web IDs:

- Keep one candidate per Vercel project.
- Fit the candidate resume, project artifacts, screenshots, and supporting files into `assets/data/base.js`, `assets/data/jobs.js`, and `User_data/`.
- Preserve the Duke User V3 program structure: program header, profile snapshot cards, mode toggle, results cards, skill-panel transitions, project accordion, screenshot dialog, and Three.js background.
- Register one target role in `assets/data/jobs.js` unless the user explicitly asks for multiple job functions.
- Keep template code separate from candidate data where possible so future projects, materials, and resumes can be dropped into the same standard.

Every template change should be committed separately in Git so it can be reverted with `git revert <commit>`.
