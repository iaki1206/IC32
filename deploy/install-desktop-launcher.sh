#!/usr/bin/env bash
set -Eeuo pipefail

APP_USER="${SUDO_USER:-${USER}}"
USER_HOME="$(getent passwd "${APP_USER}" | cut -d: -f6)"
DESKTOP_DIR=""
if command -v xdg-user-dir >/dev/null 2>&1; then
  DESKTOP_DIR="$(sudo -u "${APP_USER}" xdg-user-dir DESKTOP 2>/dev/null || true)"
fi
DESKTOP_DIR="${DESKTOP_DIR:-${USER_HOME}/Desktop}"
BIN_DIR="${USER_HOME}/.local/bin"
LAUNCHER="${BIN_DIR}/ic32-learning-platform-launcher"
DESKTOP_FILE="${DESKTOP_DIR}/IC32-Learning-Platform.desktop"

mkdir -p "${DESKTOP_DIR}" "${BIN_DIR}"

cat > "${LAUNCHER}" <<'LAUNCHER_SCRIPT'
#!/bin/sh
exec xdg-open "https://gmtek.tail77a865.ts.net/IC33"
LAUNCHER_SCRIPT

cat > "${DESKTOP_FILE}" <<DESKTOP_ENTRY
[Desktop Entry]
Version=1.0
Type=Application
Name=IC32 / IC33 Learning Platform
Comment=Open the private IC32 and IC33 learning platform
Exec=${LAUNCHER}
Icon=web-browser
Terminal=false
Categories=Education;Network;
StartupNotify=true
DESKTOP_ENTRY

chmod +x "${LAUNCHER}" "${DESKTOP_FILE}"
chown "${APP_USER}:${APP_USER}" "${LAUNCHER}" "${DESKTOP_FILE}"

if command -v gio >/dev/null 2>&1; then
  sudo -u "${APP_USER}" gio set "${DESKTOP_FILE}" metadata::trusted true 2>/dev/null || true
fi

printf 'Launcher installed at: %s\n' "${DESKTOP_FILE}"
printf 'It opens: https://gmtek.tail77a865.ts.net/IC33\n'
printf 'If the icon is not visible, open the Desktop folder and press F5.\n'
