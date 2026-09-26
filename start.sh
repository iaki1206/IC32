#!/bin/bash
set -e

APP_DIR="/home/cris/IC32"
TARGET_ROUTE="${1:-/}"
APP_URL="http://localhost:3000${TARGET_ROUTE}"
ICON_PATH="$APP_DIR/icon.png"

cd "$APP_DIR"

open_browser() {
    local url="$1"
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" >/dev/null 2>&1 &
    elif command -v exo-open >/dev/null 2>&1; then
        exo-open --launch WebBrowser "$url" >/dev/null 2>&1 &
    elif command -v firefox >/dev/null 2>&1; then
        firefox "$url" >/dev/null 2>&1 &
    elif command -v chromium >/dev/null 2>&1; then
        chromium "$url" >/dev/null 2>&1 &
    fi
}

send_notify() {
    local title="$1"
    local message="$2"
    if command -v notify-send >/dev/null 2>&1; then
        if [ -f "$ICON_PATH" ]; then
            notify-send "$title" "$message" --icon="$ICON_PATH" 2>/dev/null || true
        else
            notify-send "$title" "$message" 2>/dev/null || true
        fi
    fi
}

is_server_ready() {
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
    if [ "$code" = "200" ] || [ "$code" = "304" ] || [ "$code" = "307" ] || [ "$code" = "301" ] || [ "$code" = "302" ]; then
        return 0
    else
        return 1
    fi
}

echo "============================================================"
echo "         IC32 - ISA/IEC 62443 Learning Platform"
echo "============================================================"

# Check if application is already running
if is_server_ready; then
    echo "[i] The application is already running at:"
    echo "    $APP_URL"
    echo ""
    echo "[>] Opening application in browser..."
    open_browser "$APP_URL"
    send_notify "IC32 Learning Platform" "Application is already running. Opened in browser!"
    echo "[OK] Done! This window will close in 3 seconds."
    sleep 3
    exit 0
fi

echo "[*] Starting development server (npm run dev)..."
echo ""

# Ensure .env exists to prevent malformed URI errors
if [ ! -f "$APP_DIR/.env" ]; then
    cat << 'ENVEOF' > "$APP_DIR/.env"
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
ENVEOF
fi

# Free any stray process listening on port 3000 before starting
PORT_PID=$(lsof -ti tcp:3000 -sTCP:LISTEN 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
    kill -9 "$PORT_PID" 2>/dev/null || true
    sleep 0.5
fi

if [ -f "$APP_DIR/dist/index.js" ]; then
    echo "[*] Starting IC32 production server in background..."
    setsid -f env NODE_ENV=production node "$APP_DIR/dist/index.js" > "$APP_DIR/server.log" 2>&1
else
    echo "[*] Starting development server in background..."
    setsid -f npm run dev > "$APP_DIR/server.log" 2>&1
fi

echo -n "[*] Initialising server"
READY=0
for i in $(seq 1 40); do
    if is_server_ready; then
        READY=1
        break
    fi
    echo -n "."
    sleep 0.5
done
echo ""

if [ $READY -eq 1 ]; then
    echo ""
    echo "============================================================"
    echo " [OK] Server is ACTIVE!"
    echo " [OK] Address: $APP_URL"
    echo " [OK] Opening default web browser..."
    echo "============================================================"
    echo ""
    echo " -> To STOP the application:"
    echo "    Double-click 'Stop Server' on your Desktop."
    echo "============================================================"
    echo ""
    
    open_browser "$APP_URL"
    send_notify "IC32 Learning Platform" "Application started! Opened in browser: $APP_URL"
    exit 0
else
    echo ""
    echo "[!] The server took too long to start or encountered an error."
    echo "Check the log file: $APP_DIR/server.log"
    send_notify "IC32 Learning Platform" "Eroare la pornirea serverului. Verifică server.log!"
    exit 1
fi
