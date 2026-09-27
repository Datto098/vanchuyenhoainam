#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$ROOT_DIR/deployInfo/api/test/deploy.sh"
bash "$ROOT_DIR/deployInfo/web/test/deploy.sh"
