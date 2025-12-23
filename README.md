# Dockev 🚀

> Your personal command center for all development projects

Dockev is a beautiful, local-first desktop application that helps developers organize, discover, and instantly launch their projects. Say goodbye to hunting through folders and hello to a streamlined workflow! ✨

![Dockev](https://img.shields.io/badge/version-0.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

---

## 🌟 What is Dockev?

Ever found yourself:

- 🗂️ Scrolling through endless folders trying to find that one project?
- 🤔 Forgetting where you put that experimental repo?
- ⏱️ Wasting time navigating file systems instead of coding?
- 🔄 Switching between multiple IDEs and terminals?

**Dockev solves all of that!** It's your personal project hub that keeps everything organized, searchable, and just one click away.

---

## ✨ Features

### 🎯 Core Features

- **📁 Project Management**: Add, organize, and categorize all your projects in one place
- **🔍 Spotlight Search**: macOS Spotlight-like search that finds projects instantly (press `Cmd/Ctrl + K`)
- **💻 Multi-IDE Support**: Open projects in VS Code, Cursor, WebStorm, or any custom IDE
- **🔧 Tech Stack Detection**: Automatically detects technologies in your projects
- **📊 Project Insights**: View project stats, Git status, and module information
- **🎨 Beautiful UI**: Modern, dark-themed interface that's easy on the eyes
- **⚡ Fast & Lightweight**: Built with Electron and React for snappy performance

### 🚀 Advanced Features

- **📦 Multi-Module Projects**: Support for projects with multiple sub-projects (e.g., mobile app + backend)
- **🔗 Git Integration**: View Git status, branches, commits, and diffs directly in the app
- **🌐 GitHub Integration**: Quick access to open projects on GitHub
- **⚙️ Customizable**: Configure dev server commands, environment variables, and more
- **🏷️ Smart Categorization**: Organize projects by category (Web, Backend, Mobile, etc.)
- **📝 Project Details**: View README, package.json info, and project statistics
- **🎯 Context Menus**: Right-click on projects for quick actions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** (for Git integration features)
- Your favorite IDE(s) installed (VS Code, Cursor, WebStorm, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dockev.git
   cd dockev
   ```

2. **Install dependencies**

   ```bash
   cd desktop
   npm install
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 How to Use

### Adding Your First Project

1. Click the **"New Project"** button (or press `Cmd/Ctrl + N`)
2. Enter your project name
3. Select the project folder path
4. Choose a category and default IDE
5. Add tags if you want (optional)
6. Click **"Add Project"** 🎉

### Quick Actions

- **Open Project**: Click on any project card to open it in your default IDE
- **Search**: Press `Cmd/Ctrl + K` to open Spotlight search
- **Context Menu**: Right-click on any project for more options:
  - Open in specific IDE
  - Reveal in Explorer/Finder
  - Open in GitHub (if Git remote is configured)
  - Archive or Delete

### Managing Projects

- **View Details**: Click on a project to see its full details page
- **Configure**: Click the "Config" button to customize dev server commands and environment variables
- **Manage Tech Stack**: Add, remove, or update technology versions
- **View Git Changes**: See all pending changes and diffs directly in the app

### Settings

Access settings by clicking the gear icon in the sidebar:

- Set your default IDE
- Add custom IDEs
- Configure auto tech-stack detection
- Customize appearance (dark/light/system theme)

---

## 🛠️ Tech Stack

Dockev is built with modern web technologies:

- **⚛️ React 19** - UI framework
- **⚡ Electron** - Desktop app framework
- **🎨 Tailwind CSS** - Styling
- **📘 TypeScript** - Type safety
- **🚀 Vite** - Build tool
- **🔄 React Router** - Navigation
- **🎯 Iconify** - Icon library

---

## 📁 Project Structure

```
dockev/
├── desktop/              # Main application
│   ├── electron/         # Electron main process
│   ├── src/              # React application
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── package.json
├── PRD.md                # Product Requirements Document
└── README.md             # This file
```

---

## 🎨 Screenshots

_(Add screenshots here when available)_

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for developers, by developers
- Inspired by tools like Raycast, Spotlight, and other productivity apps
- Thanks to all the amazing open-source libraries that make this possible

---

## 📞 Support

Having issues? Found a bug? Want to suggest a feature?

- 🐛 [Open an issue](https://github.com/yourusername/dockev/issues)
- 💬 [Start a discussion](https://github.com/yourusername/dockev/discussions)
- 📧 Email: your-email@example.com

---

## 🌍 Languages

- 🇬🇧 [English](README.md) (current)
- 🇹🇷 [Türkçe](README.tr.md)

---

**Made with ❤️ and lots of ☕**

_Happy coding! 🚀_
