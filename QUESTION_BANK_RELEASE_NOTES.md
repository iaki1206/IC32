# IC32 Question Bank Release Notes

## Consolidated bank

The release contains **279 unique questions**. The attached question list contributed 110 source items; 55 were added after deduplication and 55 were excluded as redundant or materially overlapping with existing questions. All 279 questions have answer keys.

## Explanation anchors

After a learner selects an answer, the interface reveals the correctness state, the correct answer, the explanation, and a `Review anchor` control. The control opens the related OT/ICS Hub module using a stable URL anchor.

The current anchor distribution is:

| Anchor | Focus | Questions |
|---|---|---:|
| WHY | OT/ICS fundamentals, risk and people | 81 |
| WHAT | ISA/IEC 62443, requirements and security levels | 88 |
| WHERE | Zones, conduits and Purdue architecture | 25 |
| FLOW | OT networking, protocols and OSI | 31 |
| SEE | Passive monitoring and visibility | 23 |
| IMPROVE | Lifecycle, patch management and secure development | 31 |

## Multiple-answer questions

Questions marked `Select all that apply` support selecting more than one option. The selected set is compared with the keyed set without regard to selection order. The answer and explanation remain hidden until a selection is made.

## Validation

The final validator reports zero issues for duplicate option letters, contaminated option text, missing answer keys, or invalid explanation anchors. TypeScript checking and the production build pass. The Vite chunk-size notice is informational and does not prevent execution.

## Installation

```bash
cd /home/iaki/Downloads
[ -d ic32 ] && mv ic32 "ic32-backup-$(date +%Y%m%d-%H%M%S)"
unzip IC32-private-OT-Hub-v1.5-UK-English-Anchored-Questions.zip
cd ic32
pnpm install --frozen-lockfile
pnpm run build
NODE_ENV=production pnpm start
```

In a second terminal:

```bash
sudo tailscale serve --bg http://127.0.0.1:3000
sudo tailscale serve status
```
