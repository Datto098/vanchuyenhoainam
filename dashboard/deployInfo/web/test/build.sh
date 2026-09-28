#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/.deploy/web-test"
: "${NEXT_PUBLIC_API_URL:?Set NEXT_PUBLIC_API_URL, for example https://api-agent.dttech.site/api}"
export NEXT_PUBLIC_API_URL

cd "$ROOT_DIR"
pnpm build:web
rm -rf "$ARTIFACT_DIR"
mkdir -p "$ARTIFACT_DIR/apps/web/.next"
cp -R "$ROOT_DIR/apps/web/.next/standalone/." "$ARTIFACT_DIR/"
cp -R "$ROOT_DIR/apps/web/.next/static" "$ARTIFACT_DIR/apps/web/.next/static"
if [[ -d "$ROOT_DIR/apps/web/public" ]]; then cp -R "$ROOT_DIR/apps/web/public" "$ARTIFACT_DIR/apps/web/public"; fi
cp "$ROOT_DIR/deployInfo/web/test/ecosystem.config.cjs" "$ARTIFACT_DIR/ecosystem.config.cjs"
printf 'NEXT_PUBLIC_API_URL=%s\n' "$NEXT_PUBLIC_API_URL" > "$ARTIFACT_DIR/apps/web/.env.production"

echo "Web artifact ready: $ARTIFACT_DIR"
