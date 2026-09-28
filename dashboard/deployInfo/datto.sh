#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTION="${1:-app}"
if [[ $# -gt 0 ]]; then shift; fi
if [[ "${1:-}" == "--" ]]; then shift; fi

# Production profile for the `datto` host in ~/.ssh/config.
export DEPLOY_HOST="${DEPLOY_HOST:-datto}"
export DEPLOY_USER="${DEPLOY_USER:-root}"
export DEPLOY_SSH_PORT="${DEPLOY_SSH_PORT:-22}"
export DEPLOY_BASE_DIR="${DEPLOY_BASE_DIR:-/var/www}"
export DEPLOY_API_APP_NAME="${DEPLOY_API_APP_NAME:-auto_tags_api}"
export DEPLOY_WEB_APP_NAME="${DEPLOY_WEB_APP_NAME:-auto_tags_web}"
export DEPLOY_WEB_DOMAIN="${DEPLOY_WEB_DOMAIN:-agent.dttech.site}"
export DEPLOY_API_DOMAIN="${DEPLOY_API_DOMAIN:-api-agent.dttech.site}"
export DEPLOY_WEB_PORT="${DEPLOY_WEB_PORT:-3014}"
export DEPLOY_API_PORT="${DEPLOY_API_PORT:-3016}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://api-agent.dttech.site/api}"

require_api_env() {
  if [[ ! -f "$ROOT_DIR/.env.deploy" ]]; then
    echo "Missing $ROOT_DIR/.env.deploy"
    echo "Create it with: cp deployInfo/api/test/api.env.example .env.deploy"
    exit 1
  fi
}

deploy_app() {
  require_api_env
  bash "$ROOT_DIR/deployInfo/deploy-all.sh"
}

install_nginx() {
  local email="${1:-}"
  if [[ -z "$email" ]]; then
    echo "A Let's Encrypt email is required."
    echo "Usage: pnpm deploy:datto:nginx -- admin@example.com"
    exit 1
  fi
  bash "$ROOT_DIR/deployInfo/nginx/install.sh" "$email"
}

case "$ACTION" in
  app)
    deploy_app
    ;;
  api)
    require_api_env
    bash "$ROOT_DIR/deployInfo/api/test/deploy.sh"
    ;;
  web)
    bash "$ROOT_DIR/deployInfo/web/test/deploy.sh"
    ;;
  nginx)
    install_nginx "${1:-}"
    ;;
  full)
    deploy_app
    install_nginx "${1:-}"
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Valid actions: app, api, web, nginx, full"
    exit 1
    ;;
esac
