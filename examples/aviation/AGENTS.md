# Aviation Interactive Lab — Codex project instructions

## Goal and scope
Build an original Chinese aviation teaching simulator inspired by the interaction patterns at https://luizmonteiro.com/Index.aspx. Existing code is an environment-validation starter with a fixed-card ADF and 2D wind kinematics. Full natural-language scene generation, VOR, HSI, RMI, altimetry and pitot-static experiments are planned, not implemented.

## Environment and commands
- Node.js 24.x and npm; no Python, GPU, database or API key required for the starter.
- Install/check: `bash scripts/setup.sh`
- Development: `npm run dev` on `0.0.0.0:5173` (HOST/PORT override supported).
- Ready probe: GET `/healthz` must return HTTP 200 and `{"ok":true}`.
- Verify: `npm run verify` (syntax, Node tests, static build).
- Production preview: `npm run preview` after build. Restart the server after editing source; refresh the browser.
- `npm run check` is a syntax check, not a type checker or full linter.

## Implementation rules
- Keep physics in `src/physics.js`, independent of DOM/rendering. Test physical invariants and boundaries.
- x east, y north, NM, kt, seconds. Angles clockwise from north; wind direction is FROM. SVG y is inverted. Magnetic variation is zero in this prototype.
- ADF fixed-card needle shows relative bearing; do not turn it into an RMI compass card. At the station, bearing is undefined. Never use a random animated needle as a measurement.
- Use original SVG/Canvas instruments with real scales, needles, knobs and parameter-driven state. Do not copy reference-site code, textures, logos or embedded legacy Flash assets.
- Keep user inputs as data; never evaluate description text or generated code with eval/Function/innerHTML.
- Before adding an LLM, define and validate a declarative scene schema. Place API calls in a server route; never expose secrets to browser code. Do not pretend keyword templates are general natural-language generation.
- Keep dependencies justified; update package-lock.json when adding one. Baseline works without external network calls.
- Chinese UI, labeled controls, keyboard access and responsive layout. Document scientific assumptions and pending features honestly.
- After behavior/UI changes, run verification and a browser interaction check where available. Document checks actually run and any limitations.
