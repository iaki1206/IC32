#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICE_NAME="ic32-learning-platform"

cd "${APP_DIR}"
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm run build
sudo systemctl restart "${SERVICE_NAME}.service"
sudo systemctl --no-pager --full status "${SERVICE_NAME}.service"
