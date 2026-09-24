#!/usr/bin/env bash
set -Eeuo pipefail

APP_USER="${SUDO_USER:-${USER}}"
DESKTOP_DIR="${HOME}/Desktop"
if [[ "${APP_USER}" != "${USER}" ]]; then
  DESKTOP_DIR="$(eval echo "~${APP_USER}")/Desktop"
fi

mkdir -p "${DESKTOP_DIR}"

LAUNCHER="${DESKTOP_DIR}/IC32-Learning-Platform.desktop"
cat > "${LAUNCHER}" <<'DESKTOP'
[Desktop Entry]
Version=1.0
Type=Application
Name=IC32 / IC33 Learning Platform
Comment=Start the private IC32 and IC33 learning platform
Exec=sh -c 'pkexec systemctl start ic32-learning-platform && sleep 2 && xdg-open https://gmtek.tail77a865.ts.net/IC33'
Icon=web-browser
Terminal=true
Categories=Education;Network;
StartupNotify=true
DESKTOP

chmod +x "${LAUNCHER}"
chown "${APP_USER}:${APP_USER}" "${LAUNCHER}"

printf 'Desktop launcher created at: %s\n' "${LAUNCHER}"
printf 'Double-click it, approve the system password prompt, and IC33 will open.\n'
