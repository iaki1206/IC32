# OT/ICS Knowledge Hub — content map and pedagogical anchors

**Author:** Manus AI  
**Purpose:** comprehensive organisation of the ten visual sources into a coherent route, easy to review and extend.

## Learning principle

The material is not presented as an isolated collection of cards. It follows the questions that an OT specialist goes through in a real analysis:

> **WHY → WHAT → WHERE → FLOW → SEE → TEST → IMPROVE**

| Anchor | Memory question | Core content | Next link |
|---|---|---|---|
| **WHY** | Why do we protect? | Assets, vulnerabilities, threats, risk and physical impact | Risk justifies the standard's requirements |
| **WHAT** | What does the standard require? | IEC 62443, 4 parts, 7 FR, SL-T/SL-C/SL-A, maturity levels | Requirements must be placed within an architecture |
| **WHERE** | Where do we place controls? | Zones, conduits, OT DMZ, the Purdue model, Process Safety Zone | The architecture carries protocols and flows |
| **FLOW** | How do data flow? | IPv4, OSI, IT/OT protocols, L2 communications and fieldbus | Flows must be observed to detect deviations |
| **SEE** | How do we observe? | Wireshark, passive discovery, Modbus, S7, DNP3, EtherNet/IP, PROFINET and BACnet | Observations determine whether active validation is necessary |
| **TEST** | How do we validate safely? | Nmap organised by impact, rate control, NSE, OT ports and laboratory | Results must be turned into improvements |
| **IMPROVE** | How do we improve? | 20 prompts for assets, risk, architecture, IR, monitoring, governance and career | Improvement restarts the cycle from risk and inventory |

## Inventory and sorting of sources

| Source file | Extracted theme | Destination module | Elements retained |
|---|---|---|---|
| `1785584308655.jpeg` | IEC 62443 concepts | WHY / WHAT | Zones, conduits, defence in depth, definitions, FR1–FR7, SL0–SL4, SL-T/SL-C/SL-A, maturity levels |
| `457da1e1-96d1-49f5-893a-da7976dd2a2b.webp` | IEC 62443 overview | WHY / WHAT | Industrial domains, importance, physical example, 4 parts, concepts and practical lessons |
| `359dac8a-98fe-4f8a-b666-bd1d14894ea0.webp` | Zones and Conduits | WHERE | Definitions, examples of assets, Enterprise–DMZ–Control–Field architecture and benefits |
| `e6819bd7-49a9-4398-bbcf-1e4985f671c2.webp` | ATT&CK reference architecture | WHERE | Purdue levels 0–5, OT DMZ, servers, HMI, DCS, SCADA, PLC, RTU, IED, Safety Zone and flows |
| `cc8d6433-c85b-4752-ad2d-395960eb17a1.webp` | IPv4 classes | FLOW | Classes A–E, masks, bits, capacities, special addresses, reserved ranges and the transition to CIDR |
| `80547f96-35b3-4ac2-a828-48a6ab894500.webp` | OSI: IT vs OT | FLOW | Protocols across all seven layers, L2 protocols, fieldbus and observations on OSI mapping |
| `8ee55309-4661-4a68-be8d-dbf01d40e6b4.webp` | Wireshark for OT | SEE | Discovery filters, utilities, signs of suspicious activity, Modbus and other OT protocols |
| `3c44a531-ae45-4fac-af59-74b1cdf0f066.webp` | Nmap for OT | TEST | Discovery, scanning, rate control, NSE, export, OT ports and lab targets |
| `ba54cfea-1d94-4a94-a7b9-6b7c77882e96.webp` | Nmap examples | TEST | 26 examples for targets, ports, detection, troubleshooting, export, timing, IPv6 and lab techniques |
| `1ce65247-1068-47d5-aac2-162f0efce4ca.webp` | 20 AI prompts | IMPROVE | All 20 categories, intents and prompts, with interactive substitution `[industry]` |

## Deduplication decisions

The two general IEC 62443 sources are merged without removing concepts: one provides the compact schema of FR/SL/maturity, while the other explains the purpose, the four-part structure, the industries and the physical impact. The Zones/Conduits and Purdue sources are combined into a single module: the first explains the design rule, and the second shows asset placement. The two Nmap sheets are merged into a single library, ordered by impact and supplemented with explicit warnings.

## Interactive elements implemented

| Function | Pedagogical role |
|---|---|
| Seven-anchor map | Provides a stable mental story for the entire domain |
| Full-text search | Allows rapid locating of a protocol, port, FR or command |
| Links between modules | Shows conceptual relationships, not just chapter order |
| Memory anchor | Reduces each module to a memorable sentence |
| Local progress | Keeps modules marked as learned on the device |
| Recall Lab | Verifies essential notions and displays feedback only after the answer |
| Copy commands/prompts | Transforms the material into a reusable practical reference |
| Personalisation `[industry]` | Adapts the 20 prompts to the studied domain |
| Collapsible visual sources | Enables verification of the transcription against the original image |

## Safety rule for practical material

The Nmap, NSE examples and testing techniques are presented exclusively for laboratories, cyber ranges or environments for which explicit authorisation exists. In production OT, start with passive monitoring, document the targets, establish a test window and a rollback plan, limit rate and parallelism, and have the operational team monitor the process.

## Workflow for future materials

For each new batch of images the same method is maintained: full transcription; marking illegible text without assumptions; identifying duplicates; choosing an existing anchor or creating a new one; separating facts from recommendations; adding the visual source; integrating into search, progress and Recall Lab; verifying TypeScript, build, desktop and phone.
