// Electron main process for the IC32 desktop app.
// Serves the built Vite SPA (dist/public) through a custom, privileged
// "app://" protocol so that:
//  - absolute URLs such as fetch("/courseData.json") keep working,
//  - client-side routes (wouter) fall back to index.html,
//  - the origin is stable, so localStorage progress persists between runs.

const { app, BrowserWindow, protocol, net, shell, Menu } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");

const SCHEME = "app";
const HOST = "ic32";
const PUBLIC_DIR = path.join(__dirname, "..", "dist", "public");

protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const candidate = path.normalize(path.join(PUBLIC_DIR, decoded));
  // Prevent path traversal outside the public directory.
  if (!candidate.startsWith(PUBLIC_DIR)) return null;
  try {
    if (fs.statSync(candidate).isFile()) return candidate;
  } catch {
    /* not found */
  }
  return null;
}

function registerAppProtocol() {
  protocol.handle(SCHEME, (request) => {
    const { pathname } = new URL(request.url);
    // Real file -> serve it; otherwise SPA fallback to index.html.
    const file = resolveFile(pathname) || path.join(PUBLIC_DIR, "index.html");
    return net.fetch(pathToFileURL(file).toString());
  });
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: "IC32 Learning Platform",
    icon: path.join(__dirname, "icons", "icon.png"),
    backgroundColor: "#0b1220",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());

  // Open external links in the system browser instead of inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(`${SCHEME}://`)) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(`${SCHEME}://`)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.loadURL(`${SCHEME}://${HOST}/`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Single instance: a second launch just focuses the existing window.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    registerAppProtocol();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
