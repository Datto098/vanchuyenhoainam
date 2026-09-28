#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/.deploy/api-test"

if [[ ! -f "$ROOT_DIR/.env.deploy" ]]; then
  echo "Missing $ROOT_DIR/.env.deploy (copy from deployInfo/api/test/api.env.example)"
  exit 1
fi

REQUIRED_ENV_KEYS=(
  NODE_ENV API_PORT MONGODB_URI WEB_ORIGIN API_PUBLIC_URL
  JWT_ACCESS_SECRET JWT_REFRESH_SECRET TOKEN_ENCRYPTION_KEY
  ADMIN_EMAIL ADMIN_PASSWORD
)
for key in "${REQUIRED_ENV_KEYS[@]}"; do
  if ! grep -q "^${key}=." "$ROOT_DIR/.env.deploy"; then
    echo "Missing required deployment variable in .env.deploy: $key"
    exit 1
  fi
done

cd "$ROOT_DIR"
pnpm build:api
rm -rf "$ARTIFACT_DIR"
mkdir -p "$ARTIFACT_DIR/shared-types"
cp -R "$ROOT_DIR/apps/api/dist" "$ARTIFACT_DIR/dist"
cp "$ROOT_DIR/deployInfo/api/test/package.json" "$ARTIFACT_DIR/package.json"
cp "$ROOT_DIR/deployInfo/api/test/shared-package.json" "$ARTIFACT_DIR/shared-types/package.json"
cp -R "$ROOT_DIR/packages/shared-types/dist" "$ARTIFACT_DIR/shared-types/dist"
cp "$ROOT_DIR/deployInfo/api/test/ecosystem.config.cjs" "$ARTIFACT_DIR/ecosystem.config.cjs"
cp "$ROOT_DIR/.env.deploy" "$ARTIFACT_DIR/.env"

echo "API artifact ready: $ARTIFACT_DIR"
