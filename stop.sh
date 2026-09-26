#!/bin/bash
APP_DIR="/home/cris/IC32"
ICON_PATH="$APP_DIR/icon-stop.png"

echo "============================================================"
echo "         IC32 - Stop Server"
echo "============================================================"

KILLED=0

# 1. Kill any process listening on port 3000
PIDS=$(lsof -ti tcp:3000 -sTCP:LISTEN 2>/dev/null || true)
if [ -n "$PIDS" ]; then
    echo "[*] Stopping processes listening on port 3000: $PIDS"
    for p in $PIDS; do
        kill -15 "$p" 2>/dev/null || true
    done
    sleep 0.5
    for p in $PIDS; do
        kill -9 "$p" 2>/dev/null || true
    done
    KILLED=1
fi

# 2. Kill any vite processes in IC32
PIDS_VITE=$(pgrep -f "vite.*IC32" 2>/dev/null || true)
if [ -n "$PIDS_VITE" ]; then
    echo "[*] Stopping Vite instances: $PIDS_VITE"
    for p in $PIDS_VITE; do
        kill -9 "$p" 2>/dev/null || true
    done
    KILLED=1
fi

# 3. Kill any node production server in IC32
PIDS_NODE=$(pgrep -f "node.*dist/index\.js" 2>/dev/null || true)
if [ -n "$PIDS_NODE" ]; then
    echo "[*] Stopping Node server instances: $PIDS_NODE"
    for p in $PIDS_NODE; do
        kill -9 "$p" 2>/dev/null || true
    done
    KILLED=1
fi

# 4. Also stop any active start.sh processes
PIDS_START=$(pgrep -f "start\.sh" 2>/dev/null || true)
if [ -n "$PIDS_START" ]; then
    for p in $PIDS_START; do
        if [ "$p" != "$$" ]; then
            kill -15 "$p" 2>/dev/null || true
        fi
    done
fi

if [ $KILLED -eq 1 ]; then
    echo "[OK] IC32 server has been successfully stopped."
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "IC32 Learning Platform" "IC32 server has been stopped successfully." --icon="$ICON_PATH" 2>/dev/null || true
    fi
else
    echo "[i] IC32 server was not running."
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "IC32 Learning Platform" "IC32 server is not currently running." --icon="$ICON_PATH" 2>/dev/null || true
    fi
fi

sleep 1
