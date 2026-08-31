# 🎓 Study Planner Pro — Next.js Academic Command Center

**Study Planner Pro** is a modern Progressive Web App (PWA) built with **Next.js 14/15 App Router**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**, styled with the **Nur Alam Task & Project Management** UI/UX design system.

---

## 📍 Project Location & Address

- **Absolute Directory Path (Windows)**:
  ```
  C:\Users\HP\.gemini\antigravity\scratch\study-planner-pro
  ```
- **Live Localhost URL**:
  ```
  http://localhost:3000
  ```

---

## 🚀 Quick Start Guide

### 1. Navigate to the project directory:
```bash
cd "C:\Users\HP\.gemini\antigravity\scratch\study-planner-pro"
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run development server:
```bash
npm run dev
```

### 4. Create production build:
```bash
npm run build
npm run start
```

---

## 📂 Project Architecture

```
study-planner-pro/
├── public/                     # Static assets, icons, manifest
├── src/
│   ├── app/                    # Next.js App Router (11 Routes)
│   │   ├── layout.tsx          # Root Layout & Metadata
│   │   ├── client-layout.tsx   # Global Shell (Sidebar, TopBar, Unified Dock)
│   │   ├── globals.css         # Nur Alam Theme Variables & Custom CSS
│   │   ├── page.tsx            # Command Center Dashboard
│   │   ├── calendar/           # Academic Calendar (Month & Week Views)
│   │   ├── subjects/           # Course Workspaces Grid
│   │   │   └── [id]/           # Course Workspace (Notes & Kanban Board)
│   │   ├── assignments/        # Cross-Subject Tasks & Projects
│   │   ├── exams/              # Exams, GPA & Letter Grades Manager
│   │   ├── resources/          # Multi-Format Files & In-App PDF Reader
│   │   ├── focus/              # Pomodoro Timer with Custom Break Durations
│   │   └── analytics/          # Progress Charts (Attendance, Trends, Tasks)
│   ├── components/             # Reusable UI Components
│   │   ├── dock/
│   │   │   └── UnifiedFloatingDock.tsx # Smart Control Island (Leo, Music, Stickies)
│   │   ├── copilot/            # Leo AI Study Copilot Agent
│   │   ├── music/              # Spotify & Web Audio Ambient Sound Synthesizer
│   │   ├── stickies/           # Floating Sticky Notes Scratchpad
│   │   ├── wallpaper/          # Live Wallpaper Engine with Blur & Opacity
│   │   ├── resources/          # In-App PDF Reader & Media Preview Lightbox
│   │   ├── dashboard/          # Timetable, Weekly Schedule, Streak, Ring
│   │   ├── subjects/           # Subject Cards, Markdown Editor, Kanban
│   │   ├── focus/              # Circular SVG Pomodoro Timer
│   │   ├── analytics/          # Recharts Visualization Cards
│   │   ├── DailyQuoteBar.tsx   # Daily Inspirational Quotes
│   │   ├── Sidebar.tsx         # Navigation Sidebar
│   │   ├── TopBar.tsx          # Search Pill, Profile, Streak, Theme Toggle
│   │   └── ThemeProvider.tsx   # Light/Dark Theme Context
│   ├── store/
│   │   ├── AppContext.tsx      # Central Relational State Management & Reducer
│   │   └── seed-data.ts        # Initial University Courses, Timetable & Tasks
│   └── types/
│       └── index.ts            # TypeScript Domain Definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🌟 Key Features

1. **Command Center Overview**:
   - Hero project banner with live semester summary
   - 1-Click attendance logging (*Present ✓, Absent ✗, Cancelled —*)
   - Mandatory **75% Attendance Criteria Ring**
   - Active login streak tracker with animated flame

2. **In-App PDF Document Reader (`/resources`)**:
   - Interactive embedded multi-page viewer for lecture slides and past exams
   - Zoom, Fit-Width, Fullscreen Reading Mode, Print, and Open-in-New-Tab

3. **Course Workspaces (`/subjects/[id]`)**:
   - In-app Markdown Notes Editor with auto-saving
   - Drag-and-drop 3-Column Kanban Board (*To-Do, In Progress, Submitted*)

4. **Exams & GPA Calculator (`/exams`)**:
   - Schedule exams with dates, 24-hour times, locations, and weightage
   - Track marks obtained, percentages, and letter grades (*A+, A, B*) with automatic GPA calculation

5. **Focus Mode Pomodoro (`/focus`)**:
   - Customizable focus (15–60m) and break (5–20m) intervals with Web Audio completion chimes

6. **Unified Smart Control Island**:
   - **Leo AI**: 24/7 AI tutor for formula explanations, AVL tree & DB quizzes
   - **Study Beats**: Spotify player + Web Audio ambient sound mixer
   - **Stickies**: Multi-color quick notes with pin-to-top support
   - **Zero Clutter**: Single compact dock where opening one tool automatically tucks away the others
