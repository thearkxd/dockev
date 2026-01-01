# Dockev 🚀

> Your personal command center for all development projects

Dockev is a beautiful, local-first desktop application that helps developers organize, discover, and instantly launch their projects. Say goodbye to hunting through folders and hello to a streamlined workflow! ✨

![Dockev](https://img.shields.io/badge/version-0.1.0-blue)
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

### 🖥️ Desktop Widget (New!)
- **Alt+D to Toggle**: Quickly access your projects from anywhere with a custom global shortcut
- **Always Accessible**: Runs as a lightweight, transparent overlay on your desktop
- **Persistent**: Remembers its position on your screen
- **Quick Actions**: 
  - Open projects in Terminal or File Explorer with one click.
  - Pin the widget to keep it visible while you work.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** (for Git integration features)
- Your favorite IDE(s) installed (VS Code, Cursor, WebStorm, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thearkxd/dockev.git
   cd dockev
   ```

2. **Install dependencies**

   ```bash
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

5. **Run tests**
   ```bash
   npm run test          # Run tests in watch mode
   npm run test:run      # Run tests once
   npm run test:ui       # Run tests with UI
   npm run test:coverage # Run tests with coverage report
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

## 🧪 Testing

Dockev uses [Vitest](https://vitest.dev/) for testing:

- **Unit Tests**: Test utility functions and business logic
- **Component Tests**: Test React components with React Testing Library
- **Coverage**: Generate coverage reports with `npm run test:coverage`

Test files are located in `src/**/__tests__/` directories.

---

---

## 📁 Project Structure

```
dockev/
├── electron/             # Electron main process
│   ├── main.ts           # Main process entry point
│   └── preload.js        # Preload script
├── src/                  # React application
│   ├── components/       # UI components
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── package.json          # Project dependencies
├── PRD.md                # Product Requirements Document
└── README.md             # This file
```

---

## 🎨 Screenshots

<img src="https://raw.githubusercontent.com/thearkxd/dockev/main/screenshots/screenshot_1.png" alt="Dockev Screenshot">
<img src="https://raw.githubusercontent.com/thearkxd/dockev/main/screenshots/screenshot_2.png" alt="Dockev Screenshot">
<img src="https://raw.githubusercontent.com/thearkxd/dockev/main/screenshots/screenshot_3.png" alt="Dockev Screenshot">
<img src="https://raw.githubusercontent.com/thearkxd/dockev/main/screenshots/screenshot_4.png" alt="Dockev Screenshot">
<img src="https://raw.githubusercontent.com/thearkxd/dockev/main/screenshots/screenshot_5.png" alt="Dockev Screenshot">

## ⚠️ Known Limitations

- **First Launch**: On first launch, Dockev will detect installed IDEs automatically. Make sure your IDEs are in your system PATH.
- **Large Projects**: Projects with thousands of files may take longer to scan for modules and tech stack detection.
- **Git Integration**: Git features require Git to be installed and accessible from the command line.
- **IDE Detection**: IDE detection works best when IDEs are installed in standard locations or added to system PATH.
- **Platform Differences**: Some features may behave slightly differently across Windows, macOS, and Linux due to platform-specific implementations.

---

## 🔧 Troubleshooting

### IDE Not Detected

- Ensure your IDE is installed and accessible from the command line
- Check that the IDE command is in your system PATH
- Use "Detect IDEs" button in Settings to manually trigger detection
- Add custom IDE manually in Settings if automatic detection fails

### Projects Not Loading

- Verify the project path is correct and accessible
- Check file system permissions
- Ensure the project folder exists and is not corrupted

### Dev Server Not Starting

- Verify the package manager (npm/yarn/pnpm) is installed
- Check that the dev script exists in package.json
- Review custom dev server commands in project config
- Check environment variables are set correctly

### Git Status Not Showing

- Ensure Git is installed: `git --version`
- Verify the project is a Git repository: `git status`
- Check Git remote URL is configured correctly

---

## 🛠️ Building for Production

To build Dockev for production:

```bash
# Build the React app
npm run build

# Build Electron app (requires electron-builder)
npm run build:electron
```

**Note**: `electron-builder` configuration is not included by default. You'll need to add an `electron-builder` configuration to `package.json` or create an `electron-builder.yml` file for platform-specific builds.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

Quick start:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for developers, by developers
- Inspired by tools like Raycast, Spotlight, and other productivity apps
- Thanks to all the amazing open-source libraries that make this possible

---

## 📞 Support

Having issues? Found a bug? Want to suggest a feature?

- 🐛 [Open an issue](https://github.com/thearkxd/dockev/issues)
- 💬 [Start a discussion](https://github.com/thearkxd/dockev/discussions)
- 📖 [Read the contributing guide](CONTRIBUTING.md)
- 📝 [View the changelog](CHANGELOG.md)

---

## 🌍 Languages

- 🇬🇧 [English](README.md) (current)
- 🇹🇷 [Türkçe](README.tr.md)

---

**Made with ❤️ and lots of ☕**

_Happy coding! 🚀_
