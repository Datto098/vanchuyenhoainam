#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/.deploy/web-test"
BUNDLE="$ROOT_DIR/.deploy/web-test.tar.gz"

HOST="${DEPLOY_HOST:?Set DEPLOY_HOST}"
USER="${DEPLOY_USER:-deploy}"
BASE_DIR="${DEPLOY_BASE_DIR:-/var/www}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"
APP_NAME="${DEPLOY_WEB_APP_NAME:-auto_tags_web}"
KEY_DIR="${DEPLOY_KEY_FILE:-}"
DEPLOY_DIR="$BASE_DIR/$APP_NAME"
TEMP_DIR="$BASE_DIR/temp_$APP_NAME"
SSH_TARGET="$USER@$HOST"
SSH_ARGS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
SCP_ARGS=(-P "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
if [[ -n "$KEY_DIR" ]]; then SSH_ARGS+=(-i "$KEY_DIR"); SCP_ARGS+=(-i "$KEY_DIR"); fi

bash "$ROOT_DIR/deployInfo/web/test/build.sh"
tar -czf "$BUNDLE" -C "$ARTIFACT_DIR" .
ssh "${SSH_ARGS[@]}" "$SSH_TARGET" "mkdir -p '$TEMP_DIR' '$DEPLOY_DIR' && rm -rf '$TEMP_DIR'/*"
scp "${SCP_ARGS[@]}" "$BUNDLE" "$SSH_TARGET:$TEMP_DIR/app.tar.gz"
ssh "${SSH_ARGS[@]}" "$SSH_TARGET" "cd '$TEMP_DIR' && tar -xzf app.tar.gz && rm app.tar.gz && rsync -a --delete ./ '$DEPLOY_DIR/'"
ssh "${SSH_ARGS[@]}" "$SSH_TARGET" "cd '$DEPLOY_DIR' && pm2 startOrReload ecosystem.config.cjs --update-env && pm2 save"

echo "Web deployed to $SSH_TARGET:$DEPLOY_DIR"
