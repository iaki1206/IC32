# IC32 – aplicație desktop (Windows & Linux)

Aplicația poate fi instalată ca program desktop, care merge offline. Este construită cu
[Electron](https://www.electronjs.org/) și [electron-builder](https://www.electron.build/).

## Instalare (pentru utilizatori)

Descarcă installerul de pe pagina **Releases** a repository-ului.

| Sistem | Fișier | Cum instalezi |
|---|---|---|
| Windows 10/11 | `IC32-Setup-<versiune>.exe` | Dublu-click pe fișier și urmezi pașii. Se creează shortcut-uri în Start Menu și pe Desktop. Dezinstalarea se face din *Settings → Apps*. |
| Linux (orice distribuție) | `IC32-<versiune>-linux-x86_64.AppImage` | `chmod +x IC32-*.AppImage && ./IC32-*.AppImage` |
| Ubuntu / Debian | `IC32-<versiune>-linux-amd64.deb` | `sudo apt install ./IC32-*.deb`, apoi aplicația apare în meniu ca **IC32 Learning Platform**. |

> Pe Windows, installerul nu este semnat digital. SmartScreen poate afișa „Windows protected your PC”.
> Apasă **More info → Run anyway**.

Progresul (quiz-uri, bookmark-uri, notițe) se salvează local și rămâne între sesiuni.

## Build (pentru dezvoltatori)

Ai nevoie de Node 22+ și pnpm.

```bash
pnpm install
pnpm desktop:dev            # pornește aplicația în Electron
pnpm desktop:build:linux    # creează release/*.AppImage și release/*.deb
pnpm desktop:build:win      # creează release/IC32-Setup-*.exe (se rulează pe Windows)
```

## Build automat (GitHub Actions)

Workflow-ul [`.github/workflows/desktop-release.yml`](.github/workflows/desktop-release.yml) face build pe Windows și pe Linux.

```bash
# modifică "version" în package.json, apoi:
git tag v1.5.0
git push origin v1.5.0
```

Installerele apar automat în **Releases**. Workflow-ul se poate porni și manual, din tab-ul *Actions* (*Run workflow*).
În cazul ăsta fișierele apar ca *artifacts* ale rulării.

## Cum funcționează

- `vite build --mode desktop` construiește aplicația web fără pluginurile Manus, care sunt necesare doar în varianta găzduită.
- [`electron/main.cjs`](electron/main.cjs) servește `dist/public` prin protocolul `app://ic32/`, cu fallback la `index.html` pentru rutele SPA.
- Link-urile externe se deschid în browserul de sistem.
