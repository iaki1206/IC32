#!/usr/bin/env bash
set -Eeuo pipefail

APP_USER="${SUDO_USER:-${USER}}"
USER_HOME="$(getent passwd "${APP_USER}" | cut -d: -f6)"
if command -v xdg-user-dir >/dev/null 2>&1; then
  DESKTOP_DIR="$(sudo -u "${APP_USER}" xdg-user-dir DESKTOP 2>/dev/null || true)"
fi
DESKTOP_DIR="${DESKTOP_DIR:-${USER_HOME}/Desktop}"
BIN_DIR="${USER_HOME}/.local/bin"
LAUNCHER="${BIN_DIR}/ic32-learning-platform-launcher"
DESKTOP_FILE="${DESKTOP_DIR}/IC32-Learning-Platform.desktop"

mkdir -p "${DESKTOP_DIR}" "${BIN_DIR}"

cat > "${LAUNCHER}" <<'LAUNCHER_SCRIPT'
#!/usr/bin/env bash
set -u

URL="https://gmtek.tail77a865.ts.net/IC33"
SERVICE="ic32-learning-platform"

if ! pkexec /bin/systemctl start "${SERVICE}"; then
  printf 'Could not start %s.\n' "${SERVICE}"
  printf 'Check: sudo systemctl status %s\n' "${SERVICE}"
  read -r -p 'Press Enter to close...'
  exit 1
fi

for attempt in $(seq 1 15); do
  if curl -fsSI --max-time 2 http://127.0.0.1:3000/IC33 >/dev/null 2>&1; then
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "${URL}" >/dev/null 2>&1 &
    else
      printf 'Application is running at: %s\n' "${URL}"
    fi
    exit 0
  fi
  sleep 1
done

printf 'The service started but did not answer on port 3000.\n'
printf 'Check: sudo journalctl -u %s -n 80 --no-pager\n' "${SERVICE}"
read -r -p 'Press Enter to close...'
exit 1
LAUNCHER_SCRIPT

cat > "${DESKTOP_FILE}" <<DESKTOP_ENTRY
[Desktop Entry]
Version=1.0
Type=Application
Name=IC32 / IC33 Learning Platform
Comment=Start the private IC32 and IC33 learning platform
Exec=${LAUNCHER}
Icon=web-browser
Terminal=true
Categories=Education;Network;
StartupNotify=true
DESKTOP_ENTRY

chmod +x "${LAUNCHER}" "${DESKTOP_FILE}"
chown "${APP_USER}:${APP_USER}" "${LAUNCHER}" "${DESKTOP_FILE}"

if command -v gio >/dev/null 2>&1; then
  sudo -u "${APP_USER}" gio set "${DESKTOP_FILE}" metadata::trusted true 2>/dev/null || true
fi

printf 'Launcher installed:\n  %s\n  %s\n' "${DESKTOP_FILE}" "${LAUNCHER}"
printf 'Double-click the desktop icon, approve the password prompt, and IC33 will open.\n'
