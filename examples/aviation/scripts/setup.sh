#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) { console.error("Please select Node.js 24 in your cloud environment."); process.exit(1); }'
npm ci --ignore-scripts --no-audit --no-fund
npm run verify
