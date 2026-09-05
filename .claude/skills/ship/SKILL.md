---
name: ship
description: Use when Marc wants the simulator released — "/ship", "ship it", "push and deploy", "deploy the site", "put it live". Pushes main to GitHub and deploys src/ to the Cloudflare Pages project impact-sim, then verifies production is actually serving the new build.
---

# Ship the simulator

Pushes `main` to GitHub and deploys `src/` to Cloudflare Pages production.

Nothing tracked in the repo records the deploy target — there is no `wrangler.toml`,
and `.wrangler/` is gitignored. **This file is the record.**

| Fact | Value |
| ---- | ----- |
| Pages project | `impact-sim` |
| Production branch | `main` |
| Deploy directory | `src/` (static; no build step) |
| Live URL | https://impact-sim.pages.dev |
| Git remote | `git@github-marcsstevenson:marcsstevenson/impact-sim.git` |

## Procedure

1. **Check the tree and the branch.**
   ```bash
   git status --porcelain          # must be empty
   git log --oneline origin/main..main
   ```
   Uncommitted changes: stop and ask — do not commit on Marc's behalf as part of shipping.
   On a feature branch: ask whether to merge to `main` first. He has always chosen
   merge-to-main over deploying a branch to production.

2. **Run both checkers. They are the gate.**
   ```bash
   node tools/check-personas.js
   node tools/check-runtime.js
   ```
   Both must end in "All persona invariants pass" / "All persona runtime checks pass".
   Never push on a failure — fix it or report it.

3. **Push.**
   ```bash
   git push origin main
   ```

4. **Deploy.**
   ```bash
   npx --no-install wrangler pages deploy src --project-name impact-sim --branch main --commit-dirty=false
   ```
   Note the deployment-specific URL it prints (e.g. `https://65b10b81.impact-sim.pages.dev`).
   `--branch main` is what makes it a production deployment rather than a preview.

5. **Verify by hash, not by eye.** See the warning below.
   ```bash
   LOCAL=$(python -c "import hashlib;print(hashlib.sha256(open('src/img/01-af8-national.jpg','rb').read()).hexdigest()[:16])")
   DEPLOY=$(curl -s "https://<deployment-id>.impact-sim.pages.dev/img/01-af8-national.jpg" | python -c "import sys,hashlib;print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest()[:16])")
   PROD=$(curl -s "https://impact-sim.pages.dev/img/01-af8-national.jpg?cb=$RANDOM" | python -c "import sys,hashlib;print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest()[:16])")
   ```
   Hash whichever file the change actually touched. All three must match.

   **Use `curl -sL`, and hash `/` rather than `/index.html`.** Pages answers
   `/index.html` with a 308 to `/`, so a plain `curl -s` returns an empty body and
   hashes to `e3b0c44298fc1c14` — the SHA-256 of nothing. That reads as a failed
   deploy when the deploy was fine. Seeing `e3b0c442...` means you fetched nothing,
   not that the file is wrong.

6. **Report** the live URL, the deployment id, what shipped, and the checker results.

## Cloudflare's edge cache will lie to you

A plain `curl https://impact-sim.pages.dev/nz-cascading-impact-simulator.js` immediately
after a deploy has returned the **previous** build. That once looked exactly like a failed
deploy — every corrected doctrine citation still appeared wrong — and was nearly reported
as one.

Two requests defeat it:

- the **deployment-specific URL** (`https://<id>.impact-sim.pages.dev/...`), which is never cached
- production with a **cache-busting query** (`?cb=$RANDOM`)

If those two agree with local and plain production disagrees, the deploy is fine and the
edge is just briefly stale. The JS is served `max-age=0, must-revalidate`, so it settles
within a minute; re-check plain production before reporting anything as broken.

## Common mistakes

| Mistake | What happens | Fix |
| ------- | ------------ | --- |
| Trusting a plain production `curl` right after deploy | Stale edge copy reads as a failed deploy | Hash the deployment URL and a cache-busted production URL |
| Deploying without `--branch main` | Lands as a preview; production unchanged | Always pass `--branch main` |
| Deploying `.` instead of `src` | Ships the repo, not the site | The deploy directory is `src/` |
| Pushing with a checker failing | Broken doctrine or panel references go live | Both checkers first, every time |
| Committing Marc's in-progress work to get a clean tree | Ships things he did not intend | Stop and ask |

## Browser check (optional)

For a change that is visible rather than structural, load https://impact-sim.pages.dev and
confirm in the console rather than by screenshot alone — the fade-in animation makes an
early screenshot look dimmed and broken when it is fine:

```js
startGame('af8');
await new Promise(r => setTimeout(r, 2200));   // the first event is on a 1s delay
document.querySelector('#event-feed .event-shot').getAttribute('src');
```
