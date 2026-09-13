# IC32 Learning App - ISA/IEC 62443 Standards Interactive Learning Platform

A modern, intuitive web application for learning the IC32 course based on ISA/IEC 62443 standards for securing industrial control systems.

## Private access through Tailscale

The course is designed to run privately on the miniPC and to be reachable from the miniPC, laptop, and phone through the same Tailscale network. It is not published as a public GitHub Pages site. The miniPC must remain powered on and connected whenever the course is accessed from another device.

After installing Tailscale and signing in with the same account on all three devices, build and start the course on the miniPC:

```bash
pnpm install --frozen-lockfile
pnpm run build
NODE_ENV=production pnpm start
```

The local service listens on port `3000`. For a private Tailscale-only address, install Tailscale on the miniPC and run:

```bash
tailscale serve --bg http://127.0.0.1:3000
tailscale serve status
```

Open the private HTTPS address shown by `tailscale serve status` from the laptop or phone. Do not use `tailscale funnel`, because Funnel would publish the service to the public internet. To stop the private proxy, run `tailscale serve reset`.

## Overview

This application transforms the comprehensive IC32 course material into an interactive learning experience with:

- **Hierarchical Navigation**: 15 course sections organised by day with expandable topics
- **Interactive Models**: Visual representations of the Purdue Reference Model, Security Levels, and IACS Lifecycle
- **Learning Goals**: 10 core objectives with clear correlations to course sections
- **Concept Mapping**: Shows relationships and dependencies between different security concepts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **OT/ICS Knowledge Hub**: A separate interactive tab built from visual reference material, organised around the mnemonic path `WHY → WHAT → WHERE → FLOW → SEE → TEST → IMPROVE`
- **Complete Answer Feedback**: All 224 questions have answer keys, with correctness and explanations revealed only after the learner responds

## OT/ICS Knowledge Hub

Open the hub from the **OT/ICS Hub** top-level tab or directly at `/?tab=ot`. The hub contains seven connected modules: OT foundations, IEC 62443, zones and conduits with the Purdue architecture, networking and OT protocols, passive Wireshark monitoring, authorised Nmap laboratory practice, and a library of 20 reusable AI prompts.

The interface includes full-text search, mnemonic anchors, cross-links between topics, copy controls for commands and prompts, source-image verification, a seven-question Recall Lab, and progress stored locally in the browser. Nmap examples are educational material for laboratories and explicitly authorised test environments; do not use active scanning or evasion options in production OT networks. The hub also includes interactive visual lessons based on the supplied ISA/IEC 62443, Security Levels, IACS lifecycle, patch-management, Modbus TCP and OSI reference material.

New visual material can be added by placing its source image in `client/public/ot-assets/`, then extending `client/src/data/otCyberData.ts`. Each module uses a stable anchor and reusable content blocks for paragraphs, bullet groups, code libraries, tables, warnings, source images and interactive visualisers. The interactive presentation is implemented in `client/src/components/OTCyberHub.tsx`.

### New visual learning anchors

The **WHAT** module now provides a colour-coded ISA/IEC 62443 series map and an interactive SL 0–4 review. The **FLOW** module contains an original OSI encapsulation simulator: learners step through header addition, transmission and reverse-order decapsulation, then compare IT and OT protocols by layer. The **IMPROVE** module contains selectable IACS lifecycle phases and a controlled patch-management cycle covering information gathering, evaluation, testing, deployment and reporting.

The visual memory route is **STANDARDS → LEVELS → LIFECYCLE → PATCH → PROTOCOLS → OSI FLOW**. The diagrams are recreated as responsive, accessible UI components rather than being used only as static screenshots, so they remain usable on the miniPC, laptop and phone.

## Features

### 1. Sections View
- Browse all 15 course sections organised by Day 1 and Day 2
- Expandable topics with key points for each section
- Learning goals associated with each section
- Related sections shown in context panel
- Prerequisites and dependencies highlighted

### 2. Models View
Three interactive visualizations:

#### Purdue Reference Model
- 5 hierarchical levels from Enterprise to Process
- Clickable levels showing purpose, systems, and descriptions
- Visual representation of layered security approach

#### Security Levels (SL 0-4)
- Five protection levels with threat profiles
- Seven Foundational Requirements (FR) overview
- FR Vector notation explanation
- Interactive level selection with detailed descriptions

#### IACS Lifecycle
- Three continuous phases: Assess, Develop & Implement, Maintain
- Activities and outputs for each phase
- Key stakeholder roles and responsibilities
- Continuous process visualization

### 3. Goals View
- All 10 learning objectives clearly displayed
- Related sections for each goal
- Goals organised by category:
  - Fundamentals
  - Architecture & Design
  - Implementation & Verification
  - Advanced Topics
- Progress tracking capability

## Course Structure

### Day 1 Sections
1. Introduction to Control Systems Security
2. Awareness
3. ISA/IEC 62443 Series
4. ISA/IEC 62443 Models & Security Levels
5. Introduction to IACS Lifecycle
6. Security Requirements for IACS Asset Owners

### Day 2 Sections
7. Evolving Security Standards & Practices
8. Network Security Basics
9. Industrial Protocols
10. Introduction to Patch Management
11. Introduction to Security Risk Assessment for System Design
12. Security Programme Requirements for IACS Service Providers
13. Developing Secure Products & Services
14. Security Profiles for ISA 62443
15. IACS Security Protection Scheme

## Learning Objectives

The course covers 10 core learning goals:

1. Describe the importance of control system security
2. Describe the structure and content of the ISA/IEC 62443 series
3. Explain the importance of awareness as an effective countermeasure
4. Define principles behind creating an effective security programme
5. Discuss basics of risk analysis, industrial networking, and network security
6. Discuss concepts forming ISA/IEC 62443 basis (defence in depth, zones, conduits)
7. Describe how to apply risk mitigation techniques
8. Explain how secure software development strategies make systems secure
9. Describe how to validate or verify security of systems
10. Describe how security profiles for ISA/IEC 62443 can be utilised

## Key Concepts

### Seven Foundational Requirements (FR)
- **FR1 (IAC)**: Identification and Authentication Control
- **FR2 (UC)**: Use Control
- **FR3 (SI)**: System Integrity
- **FR4 (DC)**: Data Confidentiality
- **FR5 (RDF)**: Restrict Data Flow
- **FR6 (TRE)**: Timely Response to Events
- **FR7 (RA)**: Resource Availability

### Security Levels
- **SL 0**: No specific requirements
- **SL 1**: Protection against casual violation
- **SL 2**: Protection against simple means
- **SL 3**: Protection against sophisticated means
- **SL 4**: Protection against extended resources

### Reference Model Levels
- **Level 4**: Enterprise (Engineering, Business Planning & Logistics)
- **Level 3**: Operations/Systems Management (MES)
- **Level 2**: Supervisory Control (SCADA)
- **Level 1**: Basic Control (PLCs, RTUs)
- **Level 0**: Process (Sensors, Actuators)

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Routing**: Wouter (lightweight client-side router)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/iaki1206/IC32.git
cd IC32

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`. The production build can be tested locally with `pnpm build` followed by `pnpm preview`.

### Updating the private course

To update the course, pull the latest private repository contents on the miniPC, rebuild the application, and restart the local service:

```bash
git pull origin main
pnpm install --frozen-lockfile
pnpm run build
NODE_ENV=production pnpm start
```

Keep the repository private and do not enable a public GitHub Pages deployment. Tailscale controls network reachability; the GitHub repository controls the source code.

## Development

### Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── EnhancedLearningAppV2.tsx # Main platform navigation
│   │   ├── ModelsPage.tsx             # Models visualisation
│   │   └── GoalsPage.tsx              # Learning goals
│   ├── components/
│   │   ├── OTCyberHub.tsx        # Interactive OT/ICS knowledge hub
│   │   ├── KnowledgeCheckView.tsx # 224-question practice bank
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── ContentPanel.tsx      # Main content display
│   │   ├── ContextPanel.tsx      # Related concepts
│   │   ├── ReferenceModelViewer.tsx
│   │   ├── SecurityLevelsViewer.tsx
│   │   └── LifecycleViewer.tsx
│   ├── data/
│   │   └── otCyberData.ts        # OT/ICS modules, anchors, prompts, and recall checks
│   ├── contexts/                 # React contexts
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities
│   ├── App.tsx                   # App wrapper
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
│   ├── courseData.json           # Course content
│   └── ot-assets/                # Original OT/ICS visual sources
└── index.html
```

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Course Data

The course content is stored in `client/public/courseData.json` and includes:

- Course metadata (title, version, goals)
- 15 sections with topics and key points
- Models (Reference Model, Security Levels, Foundational Requirements)
- Correlations (section-to-goals mapping, section dependencies)

To update course content, modify the JSON file and restart the development server.

## Design Philosophy

The application follows a professional learning platform design with:

- **Information Hierarchy**: Clear visual distinction between sections, topics, and concepts
- **Progressive Disclosure**: Reveal complexity gradually
- **Spatial Organisation**: Use layout to show relationships
- **Accessibility First**: Readable, navigable, inclusive design
- **Colour Coding**: 
  - Deep Blue (#1e40af) for primary elements
  - Orange (#ea580c) for important/security concepts
  - Grey for neutral backgrounds

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight (~150KB gzipped)
- Fast initial load with code splitting
- Smooth animations and transitions
- Responsive images and lazy loading

## Accessibility

- Keyboard navigation support
- ARIA labels and semantic HTML
- High-contrast colour scheme
- Readable font sizes and spacing
- Mobile-friendly touch targets

## Future Enhancements

Potential features for future versions:

- Quiz and assessment modules
- Progress tracking and bookmarks
- Search functionality across all content
- Print/export capabilities
- Offline mode support
- Dark mode theme
- Multi-language support
- Video tutorials and case studies
- Interactive diagrams and flowcharts

## License

© 2025 International Society of Automation (ISA)

## Support

For questions or issues with the course content, please refer to the official ISA IC32 course materials.

For technical issues with the application, please check the browser console for error messages.

## Version

**Application Version**: 1.4.0 (British English edition)  
**Course Version**: 6.0 (IC32)  
**Last Updated**: 2026

---

**Built for cybersecurity professionals learning ISA/IEC 62443 standards**
