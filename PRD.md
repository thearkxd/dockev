# Dockev – Product Requirements Document (PRD)

## 1. Overview

### Product Vision
Developers working on multiple local projects struggle with scattered folders, forgotten contexts, and slow project startup workflows.

Dockev is a **local-first desktop application** that acts as a **central hub for all development projects**, allowing developers to organize, search, and instantly open projects with their preferred tools.

The goal is to **reduce context switching**, **increase daily productivity**, and **replace the desktop file system as the primary project entry point**.

---

## 2. Target User

- Professional / advanced software developers
- Works on multiple projects simultaneously
- Uses multiple IDEs:
  - VS Code
  - Cursor
  - JetBrains IDEs
  - Terminal
- Values:
  - Speed
  - Minimal UI
  - Keyboard-first workflows
  - Local-first tools

---

## 3. In Scope / Out of Scope

### In Scope
- Local project management
- IDE launching
- Project categorization
- Tech stack detection
- Developer productivity features

### Out of Scope
- Cloud sync
- Team collaboration
- Issue / task tracking
- Authentication & accounts
- SaaS features

---

## 4. User Problems

1. Projects are scattered across the filesystem
2. Difficult to remember which projects are active
3. Opening a project requires multiple manual steps
4. Context switching costs time and focus
5. Different projects require different IDEs

---

## 5. Goals & Success Metrics

### Goals
- Open any project in **≤ 2 seconds**
- Reduce time spent searching for projects
- Become a **daily-used tool**
- Replace desktop folders as the main project entry point

### Success Metrics
- Average time to open a project
- Number of projects actively managed
- Daily usage frequency
- Reduction in manual folder navigation

---

## 6. Functional Requirements

### 6.1 Project Management
- Add project with:
  - Project name
  - Folder path
  - Category
  - Tech stack tags
  - Default IDE
- Edit project metadata
- Archive project (soft delete)
- Restore archived projects

---

### 6.2 Categorization & Tagging
- User-defined categories (e.g. Web, Mobile, Backend)
- Multiple tags per project
- Auto-detect tech stack using:
  - `package.json`
  - `requirements.txt`
  - `android/ios` folders
- User can accept or modify auto-detected tags

---

### 6.3 Project Launching
- Open project with:
  - Default IDE
  - Any supported IDE
  - Terminal
- IDE support:
  - VS Code
  - Cursor
  - JetBrains IDEs
- One-click project launch

---

### 6.4 Search & Filtering
- Global search by:
  - Project name
  - Tag
  - Path
- Filters:
  - Category
  - Tech stack
  - Active / Archived
  - Recently opened

---

### 6.5 Favorites & Recents
- Mark projects as favorites
- Show recently opened projects
- Favorites pinned to top of dashboard

---

### 6.6 Workspace Groups (Phase 2)
- Group multiple projects into a workspace
- Open all projects in a workspace at once
- Workspace examples:
  - Mobile + Backend
  - Monorepo services

---

### 6.7 Terminal Presets (Phase 3)
- Configure per-project commands:
  - `npm run dev`
  - `expo start`
  - `docker-compose up`
- Run commands automatically on project open

---

### 6.8 Project Health Insights (Phase 3)
- Git status:
  - Clean / Dirty
  - Last commit date
- Missing dependencies detection
- Inactive project warnings

---

## 7. Non-Functional Requirements

- Cross-platform (Windows, macOS, Linux)
- Fast startup time (< 1.5s)
- Local data storage
- No internet dependency
- Keyboard-friendly navigation
- Graceful handling of missing / moved folders

---

## 8. Technology Stack

### 8.1 Desktop Framework
- **Electron**
  - Full filesystem access
  - Cross-platform support
  - Native OS integrations

---

### 8.2 Frontend (Renderer Process)
- **React**
- **TypeScript**
- **Vite** (fast dev & build)
- **Tailwind CSS** (utility-first, consistent UI)
- **Radix UI** or **Headless UI** (accessible primitives)

---

### 8.3 State Management
- **Zustand**
  - Simple
  - Lightweight
  - Perfect for desktop apps

---

### 8.4 Backend (Main Process)
- **Node.js**
- Native modules:
  - `fs` – filesystem access
  - `path` – path normalization
  - `child_process` – IDE & terminal execution
  - `os` – platform-specific behavior

---

### 8.5 Data Storage
- **electron-store**
  - JSON-based local storage
  - No database overhead
  - Easy backup & portability

Stored data:
- Project metadata
- Categories
- Tags
- User preferences
- IDE configurations

---

### 8.6 IDE Integration
- Launch via CLI commands:
  - `code <path>`
  - `cursor <path>`
  - `webstorm <path>`
- Configurable per OS

---

### 8.7 Optional / Future
- Global shortcuts:
  - `electron-global-shortcut`
- Git insights:
  - `simple-git`
- AI features:
  - OpenAI / local LLM (future, optional)

---

## 9. MVP Scope

### MVP Must-Haves
- Add / edit / remove projects
- Category & tag support
- Open project with IDE
- Search & filter
- Favorites
- Recent projects

### Post-MVP
- Workspaces
- Terminal presets
- Project health insights
- Global keyboard shortcut

---

## 10. Risks & Constraints

- Feature creep
- Over-engineering
- Performance issues with large project lists

Mitigation:
- Strict MVP scope
- Incremental feature rollout
- Daily dogfooding by the developer

---

## 11. Guiding Principles

- Local-first
- Fast over fancy
- Developer-centric
- Minimal cognitive load
- Keyboard-first when possible
