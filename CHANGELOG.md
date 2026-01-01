# Changelog

All notable changes to Dockev will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

## [0.2.0]

### Added

- **Desktop Widget**: Quick access overlay with `Alt+D` shortcut
- **Widget Quick Actions**: Search projects, open in Terminal/Folder
- **Widget Pinning**: Ability to pin the widget to the desktop
- **Settings Integration**: "Open Widget" button in Settings page
- **Persisted State**: Widget saves and restores its position
- Project description field
- Custom project colors
- Light/dark theme support
- Default package manager selection in settings
- OS-specific dev server commands (Windows, macOS, Linux)
- Module management features (edit, merge, custom dev server commands)
- Project color customization
- Individual module node_modules checking and installation

### Changed

- **Branding**: Updated application icons and logos
- Improved project card UI
- Enhanced module detection
- Better error handling

### Fixed

- Package.json path resolution for module installations
- Project folder deletion after move operation
- Module path handling improvements

## [0.1.0]

### Added

- Initial release
- Project management (add, edit, delete, organize)
- Multi-IDE support (VS Code, Cursor, WebStorm, Terminal)
- Spotlight search (Cmd/Ctrl + K)
- Git integration (status, branches, commits, diffs)
- Multi-module project support
- Technology stack detection
- Project statistics and insights
- Customizable dev server commands
- Environment variables support
- Project categorization and tagging
- Context menus for quick actions
- Settings page with IDE management
- Auto tech-stack detection

[Unreleased]: https://github.com/thearkxd/dockev/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/thearkxd/dockev/releases/tag/v0.1.0
