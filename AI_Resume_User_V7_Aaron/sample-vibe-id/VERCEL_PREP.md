# Vercel Prep: Jialing Chen Sample Vibe ID

Target domain after push: `https://mingxuan-li.vibeid.co/sample-vibe-id/`.

Direct fallback path: `https://mingxuan-li.vibeid.co/AI_Resume_User_V7_Aaron/sample-vibe-id/`.

## What is included

- Standalone HTML pages under `html/`.
- Payload JSON under `payloads/` and `mother/`.
- Profile image under `assets/`.
- Source screenshots copied into `User_data/` so the Vercel deploy does not depend on local symlinks.
- Preview screenshots under `screenshots/`.

## Local smoke test before push

From repo root:

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/AI_Resume_User_V7_Aaron/sample-vibe-id/
http://127.0.0.1:8765/sample-vibe-id/
```

The second URL requires the repo-root `vercel.json` redirect only on Vercel; locally use the direct path unless your local server emulates Vercel redirects.

## Before push checklist

- Confirm `vercel.json` contains the `/sample-vibe-id` redirects.
- Confirm `.vercelignore` does not exclude `AI_Resume_User_V7_Aaron/sample-vibe-id/User_data/**`.
- Run a browser smoke check on the direct path.
- Push the repo or run the normal Vercel deployment flow.
