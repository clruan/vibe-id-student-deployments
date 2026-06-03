# Phase0 / Phase1 Vibe ID + ATS Protocol

Date: 2026-05-28

## Dataset Split

Calibration set:
- Aaron Li: finance, investment research, AI-assisted analyst workflow
- Frank Yin: biostatistics methods, simulation, clinical analytics
- Duke Ruan: AI engineering, clinical analytics, explainable data products

Blind test:
- Zach Zhou: biostatistics and clinical data analysis

The calibration set is used to tune schema, prompt boundaries, ATS keyword surfaces, and default visual weight. Zach should stay held out until the Phase0 checks and Phase1 UI rules are stable.

## Phase0 Acceptance Checks

- Vibe ID schema has stable fields: identity label, target role, source-backed skill groups, selected projects, quantified metrics, ATS profile.
- ATS inputs are explicit: resume text, target role, optional JD, target keywords, parse signals, risk flags.
- Featured Project cards prefer metrics with `category` values such as `Improvement`, `Quality`, `Coverage`, `Impact`, or `Scale`.
- Repeated generation should preserve the same top identity, same primary skill family, and same first two featured projects.
- No output may invent resume facts. Any estimated improvement number must be marked as an estimate or omitted.

## Phase1 UI Rules

- Default state stays quiet: profile, two featured projects, skill filters, and project rows only.
- ATS readiness lives on Details, not the first viewport.
- Expert Endorsement uses neutral typography and light borders; no red alarm treatment in standard mode.
- Improvement metrics should be short and source-backed, for example `10-15m -> 1-3m`, `80x faster`, `2 mo saved`, or `+22%`.
- Raw ATS keyword lists remain screen-reader/SEO available but visually hidden unless a richer ATS readiness card is present.

## Test Command

Run ATS-only DeepSeek validation from `Resume-Agent-MVP`:

```bash
node ats_vibe_phase_test.js --model deepseek-v4-flash --data-dir test_mvp/vibe_phase0 --out-suffix _vibe_phase0_flash
```

Expected outputs:
- `test_results/ats_vibe_phase0_flash.json`
- `test_results/ats_vibe_phase0_flash.md`

