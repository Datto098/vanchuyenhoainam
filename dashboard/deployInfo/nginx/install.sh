#!/usr/bin/env bash
set -euo pipefail

HOST="${DEPLOY_HOST:?Set DEPLOY_HOST}"
USER="${DEPLOY_USER:-deploy}"
SSH_PORT="${DEPLOY_SSH_PORT:-22}"
KEY_DIR="${DEPLOY_KEY_FILE:-}"
if [[ "${1:-}" == "--" ]]; then
  shift
fi
EMAIL="${1:-}"
WEB_DOMAIN="${DEPLOY_WEB_DOMAIN:?Set DEPLOY_WEB_DOMAIN}"
API_DOMAIN="${DEPLOY_API_DOMAIN:?Set DEPLOY_API_DOMAIN}"
WEB_PORT="${DEPLOY_WEB_PORT:-3004}"
API_PORT="${DEPLOY_API_PORT:-3006}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ ! "$EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
  echo "Usage: pnpm deploy:nginx -- your-email@example.com"
  exit 1
fi

SSH_ARGS=(-p "$SSH_PORT" -o StrictHostKeyChecking=accept-new)
if [[ -n "$KEY_DIR" ]]; then SSH_ARGS+=(-i "$KEY_DIR"); fi

echo "Installing Nginx configuration on $USER@$HOST..."
ssh "${SSH_ARGS[@]}" "$USER@$HOST" "bash -s -- '$EMAIL' '$WEB_DOMAIN' '$API_DOMAIN' '$WEB_PORT' '$API_PORT'" < "$SCRIPT_DIR/setup-on-vps.sh"
