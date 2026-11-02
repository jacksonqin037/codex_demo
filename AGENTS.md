# Experiment Lab: repository instructions

## Environment
- Node.js 24 recommended; Node >=22 required. No GPU, database, Python, or external npm dependencies.
- Install and verify: `bash scripts/setup.sh`.
- Develop: `npm run dev` (port 3000, bound to 0.0.0.0).
- Checks: `npm run check`, `npm test`, `npm run build`.
- `.env.example` is documentation. Node does not automatically load `.env`; use environment settings or `node --env-file=.env server.mjs` locally.

## Application contract
- Chinese interface. Preserve accessible labels, keyboard control, responsive layout.
- `src/engine.mjs`: authoritative model registry, parameter validation, units, state transitions and readings shared by browser/server/tests.
- `public/app.mjs`: SVG instruments and interactive apparatus; derive all readings and needle angles from the shared model.
- `server.mjs`: static HTTP plus POST /api/scenes; do not expose environment values to the browser.
- Do not execute planner-generated HTML/JS. Validate structured scenes against registered models and compatible instruments.
- Explicitly reject unsupported experiments or apparatus. Do not silently label keyword templates as general AI generation.
- Instruments are ideal instructional diagrams. For named real equipment, require manufacturer documentation and validated ranges, terminals, and controls.
- Keep RC charging/discharging continuous; distinguish pause from opening circuit; use signed current during discharge.
- Every new physical model needs analytical/reference validation and meaningful numerical tests.
- Do not add dependencies without a concrete need. Commit package-lock.json when package inputs change.
- Never commit API keys, .env, generated dist or local hosting identity.
