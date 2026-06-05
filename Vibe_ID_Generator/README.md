# Vibe ID Generator

Static Vercel-friendly intake page for generating source-backed V7 Vibe ID payloads.

- Page: `/Vibe_ID_Generator/`
- Friendly routes: `/generator`, `/vibe-id-generator`, `/vibe-id-generation`
- API: `/api/generate-vibe`
- Scope: independent experiment. It does not edit or depend on `Resume-Agent-MVP` templates.

## Project Generation Standard

This generator now post-processes DeepSeek project drafts with Duke-style V7 demo blueprints:

- every project gets concrete workflow stages instead of a plain portfolio paragraph;
- supported project types get a lightweight V7 widget scaffold such as ND2 control, CNN workbench, survival estimator, evidence graph, tradeoff frontier, GTM timeline, NLP extraction, or clustering topology;
- source boundaries stay explicit, so screenshots, metrics, links, tools, and scope are not invented when missing.

## Environment

Set `DEEPSEEK_API_KEY` in Vercel. Optional:

- `DEEPSEEK_ENDPOINT`
- `DEEPSEEK_MODEL`

The API accepts resume, optional materials, GitHub/profile URLs, a selected built-in JD or custom JD, and returns 1-3 variants. Each variant includes:

- `html`: downloadable single-file V7 HTML using the existing V7 shell and Duke-style skill bubbles.
- `htmlFileName`: suggested `.html` filename.
- `payload`: the underlying V7 JSON payload for debugging or reuse.
