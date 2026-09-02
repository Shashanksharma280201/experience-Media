#!/usr/bin/env bash
# Screenshot the running site at desktop and mobile.
# usage: scripts/shoot.sh <path> <label> [wait-ms]
set -euo pipefail

PATH_="${1:-/}"
LABEL="${2:-shot}"
WAIT="${3:-3200}"
PORT="${PORT:-3123}"
OUT="${SHOT_DIR:-/tmp/shots}"
mkdir -p "$OUT"

for spec in "1440,900:desktop" "390,844:mobile"; do
  size="${spec%%:*}"; name="${spec##*:}"
  playwright screenshot \
    --viewport-size="$size" \
    --wait-for-timeout="$WAIT" \
    --full-page \
    "http://localhost:$PORT$PATH_" \
    "$OUT/${LABEL}-${name}.png" >/dev/null 2>&1
  echo "$OUT/${LABEL}-${name}.png"
done
