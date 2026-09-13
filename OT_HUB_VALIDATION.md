# Validation OT/ICS Knowledge Hub

## Desktop verification

The application loads in the production build at `http://127.0.0.1:3000/`. The main navigation displays the new tab **OT/ICS Hub** between IC32 and Reference Library. The tab opens without error and displays the mnemonic pathway **WHY → WHAT → WHERE → FLOW → SEE → TEST → IMPROVE**.

The desktop interface correctly displays the banner, progress, search field, the seven anchors, the module map, the memory anchor, links between modules, structured content, optional visual sources and Recall Lab. On load no answers are exposed to the Recall Lab questions.

| Verified element | Result |
|---|---|
| Tab OT/ICS Hub | Visible and functional |
| 7-anchor path | Visible, ordered and clickable |
| Default WHY module | Readable and well laid out |
| Local progress | Initially 0%, available for interaction |
| Visual sources | Collapsible section present |
| Recall Lab | 7 questions, answers hidden until selected |
| TypeScript/Vite build | Successful |

## Verification of interactive modules

The module **TEST — Nmap for OT lab** displays the authorisation rule before the commands, separates low-impact discovery from aggressive detection and marks high-risk techniques as lab-only. All extracted commands are present, and each row has an individual copy control.

The module **IMPROVE — 20 AI OT/ICS prompts** displays all 20 prompts, allows customisation of the `[industry]` field and offers a copy button for each prompt. The WHY/WHAT/WHERE/FLOW/SEE/TEST/IMPROVE links are visible on cards, preserving the relationship between the library and the pedagogical pathway.

| Test | Result |
|---|---|
| Navigation WHY → TEST → IMPROVE | Successful |
| Warning before Nmap commands | Visible |
| Number of AI prompts | 20 |
| Default replacement `[industry]` | `manufacturing` |
| Copy buttons | Present for commands and prompts |
| Separation of high-risk techniques | Visible and explicit |

## Verification after final rebuild

After completing the final extracted details, the application was rebuilt and restarted. The **OT/ICS Hub** tab remains available and loads without errors. The build contains 7 modules, 20 AI prompts, 10 source images and 40 occurrences of Nmap commands/related documentation. The desktop layout maintains the visual hierarchy, does not present text overlaps in the main area, and offers side navigation plus top anchors.

## Feedback and progress

In Recall Lab, choosing the correct answer to the first question changed the score from `0/7` to `1/7` and displayed the message `Correct.` only after selection. Marking the WHY module as learned updated progress from `0%` to `14%` and the button label to `Learned`; the state is saved in `localStorage` for the current device.

## Responsive verification — phone

Screenshots were generated and inspected at `390×844` and `390×2400`. The header, main tabs, banner, progress, search, the seven anchors and the module map rearrange vertically without major overlaps. Text remains readable, and commands and tables use adapted containers or horizontal scrolling where necessary. The hub can be opened directly with `?tab=ot`, for example `https://gmtek.tail77a865.ts.net/?tab=ot`.

## British English localisation validation

The complete OT/ICS Hub was reviewed after localisation. The primary navigation, search field, seven learning anchors, module map, memory anchors, progress controls, source-image panel and Recall Lab now display in British English. The document language is set to `en-GB`. Course JSON data was parsed successfully after normalisation, all 224 knowledge-check items remain present, and no active Romanian text with diacritics was detected. The visible OT/ICS wording uses British forms including `authorisation`, `organisational`, `prioritisation`, `modelling`, `defence`, `fibre`, `standardised`, `centralised` and `memorisation`.
