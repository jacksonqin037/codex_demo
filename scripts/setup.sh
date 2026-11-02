#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node -e 'if(Number(process.versions.node.split(".")[0])<22)throw new Error("Use Node.js 22 or newer (recommended: 24)")'
npm ci --ignore-scripts --no-audit --no-fund
npm run check
npm test
npm run build
