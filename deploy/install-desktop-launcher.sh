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
rm -f "${DESKTOP_FILE}" "${LAUNCHER}"

cat > "${LAUNCHER}" <<'LAUNCHER_SCRIPT'
#!/bin/sh
set -eu
URL="https://gmtek.tail77a865.ts.net/"
SERVICE="ic32-learning-platform.service"

if ! systemctl is-active --quiet "$SERVICE"; then
  if command -v pkexec >/dev/null 2>&1; then
    pkexec systemctl start "$SERVICE"
  else
    TERMINAL="$(command -v x-terminal-emulator || command -v xfce4-terminal || command -v gnome-terminal || true)"
    if [ -n "$TERMINAL" ]; then
      "$TERMINAL" -e sh -c "sudo systemctl start '$SERVICE'; sleep 2" &
    else
      notify-send "IC32 Learning Platform" "Please start $SERVICE with sudo." 2>/dev/null || true
      exit 1
    fi
  fi
fi

for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 2 http://127.0.0.1:3000/ >/dev/null 2>&1; then
    exec xdg-open "$URL"
  fi
  sleep 1
done

notify-send "IC32 Learning Platform" "The service did not become ready. Check: sudo systemctl status $SERVICE" 2>/dev/null || true
exit 1
LAUNCHER_SCRIPT

cat > "${DESKTOP_FILE}" <<DESKTOP_ENTRY
[Desktop Entry]
Version=1.0
Type=Application
Name=IC32 Learning Platform
Comment=Start the private IC32 service and open it in the browser
Exec=${LAUNCHER}
TryExec=xdg-open
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

printf 'New desktop button generated: %s\n' "${DESKTOP_FILE}"
printf 'Click it to start the private service and open https://gmtek.tail77a865.ts.net/\n'
printf 'If it is not visible, open the Desktop folder and press F5.\n'
