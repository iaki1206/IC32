#!/usr/bin/env bash
set -Eeuo pipefail

# Run this script from the cloned IC32 repository on the private miniPC/Kali host.
# It configures an always-on production service and exposes it only through Tailscale Serve.

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="${SUDO_USER:-${USER}}"
PNPM_BIN="$(command -v pnpm || true)"
NODE_BIN="$(command -v node || true)"
SERVICE_NAME="ic32-learning-platform"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

if [[ -z "${PNPM_BIN}" || -z "${NODE_BIN}" ]]; then
  echo "Node.js and pnpm must be installed before running this script."
  echo "Install them first, then run this script again."
  exit 1
fi

if ! command -v tailscale >/dev/null 2>&1; then
  echo "The tailscale command is not available. Install and authenticate Tailscale first."
  exit 1
fi

cd "${APP_DIR}"
pnpm install --frozen-lockfile
pnpm run build

sudo tee "${SERVICE_FILE}" >/dev/null <<EOF
[Unit]
Description=IC32 and IC33 private learning platform
After=network-online.target tailscaled.service
Wants=network-online.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PATH=$(dirname "${PNPM_BIN}"):$(dirname "${NODE_BIN}"):/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=${PNPM_BIN} start
Restart=always
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now "${SERVICE_NAME}.service"

# Tailscale Serve is tailnet-only by design. This does not publish the site publicly.
sudo tailscale serve --bg http://127.0.0.1:3000

printf '\nPrivate service configured.\n'
sudo systemctl --no-pager --full status "${SERVICE_NAME}.service" || true
printf '\nTailscale Serve configuration:\n'
sudo tailscale serve status
printf '\nOpen the displayed tailnet URL and append /IC33 for the IC33 course.\n'
