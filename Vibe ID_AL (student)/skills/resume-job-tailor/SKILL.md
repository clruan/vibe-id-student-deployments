---
name: resume-job-tailor
description: Lightly tailor a candidate CV, resume app, or resume data file to a target job while preserving the original CV's factual claims. Use when creating job-specific resume variants, rewriting experience bullets for a role, selecting relevant projects, or re-ordering skills/results based on job requirements.
---

# Resume Job Tailor

Use this skill when a resume should be adjusted to fit a job description without inventing new credentials.

## Workflow

1. Identify the source of truth.
   - Prefer the original CV/resume PDF or the repo's base resume data file.
   - Treat existing dates, employers, degrees, publications, metrics, and project outcomes as fixed facts.

2. Extract the job requirements.
   - Group requirements into role lens categories: domain, core tools, methods, workflow style, stakeholder needs, and seniority.
   - Mark requirements as direct match, adjacent match, or unsupported.

3. Tailor lightly.
   - Reorder sections, projects, skills, and result cards so direct matches appear first.
   - Rewrite bullets to foreground relevant facts already present in the CV.
   - Preserve original metrics and scope unless the source explicitly supports a change.
   - Use job vocabulary only where it accurately describes existing work.

4. Add selected projects.
   - Pick 2-4 projects that prove the role lens.
   - For each project, show what the candidate owned, the method/tooling, and the measurable outcome or review surface.
   - If the app supports project demos, choose projects with distinct visual or interaction logic.

5. Validate.
   - Check every tailored bullet against the original CV/base data.
   - Ensure no role variant claims a tool, domain, employer, publication, or metric absent from the source.
   - Confirm the rendered app or generated file still loads.

## Bullet Rules

- Start bullets with concrete actions: built, trained, benchmarked, designed, advised, reduced, delivered.
- Keep the evidence visible: method + artifact + result.
- Prefer "emphasized", "foregrounded", or reordered evidence over exaggerated seniority.
- Avoid unsupported claims such as production ownership, team leadership, revenue impact, or deployment scale unless the source states them.

## Output Pattern

For resume app variants:

- Keep one base resume object as the factual source.
- Build job variants through a factory that overrides summaries, bullet wording, project order, results, and skill emphasis.
- Store selected project IDs on experience items when the UI can render related-project chips.

For document resumes:

- Produce a tailored version and a short audit note listing which source facts support the changes.
