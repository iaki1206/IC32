# New OT/ICS Materials Validation

Date: 2026-09-06

The production build passed TypeScript and Vite checks after adding the new interactive content. The WHAT module renders the ISA/IEC 62443 series map with six colour-coded families: General, Policies & Procedures, System, Component, Profiles and Evaluation. The visual layout is responsive and the colour-band memory route is visible.

The Security Levels interactive review renders selectable SL 0–4 cards and reveals the selected level's protection and threat interpretation. The build remains in British English and the existing learning path, progress state, module anchors and Recall Lab remain available.

Next validation targets: IMPROVE lifecycle and patch-management interaction, FLOW OSI encapsulation simulator, and responsive behaviour on narrow screens.


## FLOW and IMPROVE validation

The FLOW module renders the interactive OSI encapsulation simulator with Layer 7–1 cards, a reset control, a next-step control, send/receive guidance, and the existing IT-versus-OT protocol table. The simulator starts with the pure application payload and exposes the layering logic without removing the existing protocol reference content.

The IMPROVE module retains all 20 AI prompts and now reports two additional resources for the IACS lifecycle and patch-management interactions. The British English copy, industry substitution and safety guidance remain intact.

The visible layout remains responsive at the tested desktop viewport. The final mobile check should confirm that the seven-layer OSI grid wraps cleanly and that the lifecycle and patch controls remain usable on narrow screens.


## OSI interaction validation

The OSI simulator was tested by pressing “Add next header”. The stack highlights the active layers and the current data unit updates to include the newly added header. The interface remains readable at the tested viewport, with Reset and step controls visible beside the simulator heading.

The simulator correctly communicates the core teaching sequence from the supplied video: encapsulation on send, transmission, and reverse-order header removal on receive.
