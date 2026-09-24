# Permanent private hosting through Tailscale

This deployment keeps IC32 and IC33 on the private miniPC/Kali host. The Node production process is managed by `systemd`, starts automatically after reboot, restarts after a failure, and is exposed through Tailscale Serve. Tailscale Serve is tailnet-only; it is not a public web deployment.

## First installation

Clone the repository into a real directory. The commands below use `/home/iaki/IC32`; change that directory if the local account uses another home path.

```bash
cd ~
git clone https://github.com/iaki1206/IC32.git "$HOME/IC32"
cd "$HOME/IC32"
chmod +x deploy/install-private-tailscale.sh deploy/update-private-tailscale.sh
sudo -v
./deploy/install-private-tailscale.sh
```

The script builds the application, installs `/etc/systemd/system/ic32-learning-platform.service`, enables it at boot, starts it, and configures Tailscale Serve for `127.0.0.1:3000`.

## Verify the service

```bash
sudo systemctl status ic32-learning-platform
curl -I http://127.0.0.1:3000/IC33
sudo tailscale serve status
```

Open the tailnet URL printed by `tailscale serve status` and append `/IC33` for the IC33 course. The IC32 course remains available at the root or `/IC32`.

## Update from GitHub

```bash
cd "$HOME/IC32"
./deploy/update-private-tailscale.sh
```

The update script uses `git pull --ff-only`, installs the lockfile dependencies, rebuilds the production bundle, and restarts the service.

## Troubleshooting

```bash
sudo journalctl -u ic32-learning-platform -n 100 --no-pager
sudo ss -ltnp | grep ':3000'
sudo tailscale status
sudo tailscale serve status
```

If port 3000 is already used by an old manually started process, stop that process before enabling the systemd service. Do not run a second `pnpm start` while the systemd service is active.

The file `TeamviewerRemoteLogin.pdf` is deliberately not included in the application or deployment.
