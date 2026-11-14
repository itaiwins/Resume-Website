#!/bin/sh
# Deploys public/ as the Worker `itairotem-ai`. Refuses to deploy uncommitted changes.
#   sh scripts/deploy.sh        preview config (wrangler.jsonc): static assets, noindex everywhere
#   sh scripts/deploy.sh prod   production config (wrangler.prod.jsonc): src/worker.js in front,
#                               indexable on itairotem.com only (MEXA-2172)
set -eu
cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "deploy: commit first" >&2
  exit 1
fi
if [ "${1:-}" = "prod" ]; then
  npx wrangler deploy -c wrangler.prod.jsonc
else
  npx wrangler deploy
fi
