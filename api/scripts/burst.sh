#!/usr/bin/env bash
# Burst test against the deployed Worker. Usage: scripts/burst.sh N PARALLEL [MESSAGE]
# Prints one line per response kind with its count. Never prints answers.
set -euo pipefail
U=${URL:-https://itairotem-ai-api.itairotem23.workers.dev}
N=$1; P=$2; MSG=${3:-hello}
body=$(python3 -c 'import json,sys;print(json.dumps({"messages":[{"role":"user","content":sys.argv[1]}]}))' "$MSG")
seq "$N" | xargs -P "$P" -I{} curl -s -o /dev/null -w '%{http_code} %{content_type}\n' -X POST \
  -H "Origin: https://itairotem.com" -H "Content-Type: application/json" -d "$body" "$U/chat" | sort | uniq -c
