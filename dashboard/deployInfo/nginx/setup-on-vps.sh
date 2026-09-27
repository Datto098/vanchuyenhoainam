#!/usr/bin/env bash
set -euo pipefail

EMAIL="${1:-}"
WEB_DOMAIN="${2:?Web domain is required}"
API_DOMAIN="${3:?API domain is required}"
WEB_PORT="${4:-3004}"
API_PORT="${5:-3006}"
CONFIG_PREFIX="auto-tags"
AVAILABLE_DIR="/etc/nginx/sites-available"
ENABLED_DIR="/etc/nginx/sites-enabled"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run this script as root."
  exit 1
fi
if [[ ! "$EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
  echo "A valid email is required for Let's Encrypt."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

backup_suffix="$(date +%Y%m%d%H%M%S)"
for config in "$CONFIG_PREFIX-web" "$CONFIG_PREFIX-api"; do
  if [[ -f "$AVAILABLE_DIR/$config" ]]; then
    cp "$AVAILABLE_DIR/$config" "$AVAILABLE_DIR/$config.backup-$backup_suffix"
  fi
done

cat > "$AVAILABLE_DIR/$CONFIG_PREFIX-web" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $WEB_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
EOF

cat > "$AVAILABLE_DIR/$CONFIG_PREFIX-api" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $API_DOMAIN;
    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 10s;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }
}
EOF

ln -sfn "$AVAILABLE_DIR/$CONFIG_PREFIX-web" "$ENABLED_DIR/$CONFIG_PREFIX-web"
ln -sfn "$AVAILABLE_DIR/$CONFIG_PREFIX-api" "$ENABLED_DIR/$CONFIG_PREFIX-api"

nginx -t
systemctl enable nginx
systemctl reload nginx

certbot --nginx \
  --non-interactive \
  --agree-tos \
  --redirect \
  --keep-until-expiring \
  --email "$EMAIL" \
  --cert-name auto-tags \
  -d "$WEB_DOMAIN" \
  -d "$API_DOMAIN"

nginx -t
systemctl reload nginx
systemctl enable --now certbot.timer 2>/dev/null || true

echo "Nginx and HTTPS are ready:"
echo "  Web: https://$WEB_DOMAIN -> 127.0.0.1:$WEB_PORT"
echo "  API: https://$API_DOMAIN -> 127.0.0.1:$API_PORT"
echo "  Health: https://$API_DOMAIN/api/health"
