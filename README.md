# IC32 Learning App - ISA/IEC 62443 Standards Interactive Learning Platform

A modern, intuitive web application for learning the IC32 course based on ISA/IEC 62443 standards for securing industrial control systems.

## Overview

This application transforms the comprehensive IC32 course material into an interactive learning experience with:

- **Hierarchical Navigation**: 15 course sections organized by day with expandable topics
- **Interactive Models**: Visual representations of the Purdue Reference Model, Security Levels, and IACS Lifecycle
- **Learning Goals**: 10 core objectives with clear correlations to course sections
- **Concept Mapping**: Shows relationships and dependencies between different security concepts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Features

### 1. Sections View
- Browse all 15 course sections organized by Day 1 and Day 2
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
- Goals organized by category:
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
12. Security Program Requirements for IACS Service Providers
13. Developing Secure Products & Services
14. Security Profiles for ISA 62443
15. IACS Security Protection Scheme

## Learning Objectives

The course covers 10 core learning goals:

1. Describe the importance of control system security
2. Describe the structure and content of the ISA/IEC 62443 series
3. Explain the importance of awareness as an effective countermeasure
4. Define principles behind creating an effective security program
5. Discuss basics of risk analysis, industrial networking, and network security
6. Discuss concepts forming ISA/IEC 62443 basis (defense in depth, zones, conduits)
7. Describe how to apply risk mitigation techniques
8. Explain how secure software development strategies make systems secure
9. Describe how to validate or verify security of systems
10. Describe how security profiles for ISA/IEC 62443 can be utilized

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
# Clone or navigate to the project directory
cd ic32-learning-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Development

### Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── LearningApp.tsx       # Main app with navigation
│   │   ├── ModelsPage.tsx        # Models visualization
│   │   └── GoalsPage.tsx         # Learning goals
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── ContentPanel.tsx      # Main content display
│   │   ├── ContextPanel.tsx      # Related concepts
│   │   ├── ReferenceModelViewer.tsx
│   │   ├── SecurityLevelsViewer.tsx
│   │   └── LifecycleViewer.tsx
│   ├── contexts/                 # React contexts
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities
│   ├── App.tsx                   # App wrapper
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/
│   └── courseData.json           # Course content
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
- **Spatial Organization**: Use layout to show relationships
- **Accessibility First**: Readable, navigable, inclusive design
- **Color Coding**: 
  - Deep Blue (#1e40af) for primary elements
  - Orange (#ea580c) for important/security concepts
  - Gray for neutral backgrounds

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
- High contrast color scheme
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

**Application Version**: 1.0.0  
**Course Version**: 6.0 (IC32)  
**Last Updated**: 2025

---

**Built with ❤️ for cybersecurity professionals learning ISA/IEC 62443 standards**
