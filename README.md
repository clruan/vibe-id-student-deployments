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

Use the V3 page system as the standard template for future student Web IDs:

- Keep one candidate per Vercel project.
- Fit the candidate resume, project artifacts, screenshots, and supporting files into `assets/content.js` and `User_data/`.
- Preserve the V3 interaction model: page navigation, scroll sections, skill-panel transitions, project accordion, screenshot dialog, and Three.js background.
- Do not add the multi-job-function selector.
- Do not add the User V3 program header, profile snapshot cards, selected-results cards, publications, peer cards, or generic marketing sections unless explicitly requested.

Every template change should be committed separately in Git so it can be reverted with `git revert <commit>`.
