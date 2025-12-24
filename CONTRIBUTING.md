# Contributing to Dockev

First off, thank you for considering contributing to Dockev! 🎉

This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details**:
  - OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
  - Node.js version: [e.g., 18.17.0]
  - Dockev version: [e.g., 0.1.0]

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Use case**: Why is this feature useful?
- **Proposed solution** (if you have one)
- **Alternatives considered** (if any)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** using clear commit messages
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Getting Started

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/thearkxd/dockev.git
   cd dockev
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add type annotations where helpful

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling

- Use Tailwind CSS for styling
- Follow existing design patterns
- Ensure dark mode compatibility
- Keep styles responsive

### Git Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:

```
feat: add project description field
fix: resolve module detection issue on Windows
docs: update installation instructions
```

## Project Structure

```
dockev/
├── electron/             # Electron main process
│   ├── main.ts           # Main process entry point
│   └── preload.js        # Preload script
├── src/                  # React application
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── package.json          # Project dependencies
├── PRD.md                # Product Requirements Document
├── README.md             # Main documentation
└── CONTRIBUTING.md       # This file
```

## Testing

Before submitting a pull request, please ensure:

- [ ] Your code follows the existing style
- [ ] You've tested your changes on your OS
- [ ] You've tested both light and dark themes (if UI changes)
- [ ] No console errors or warnings
- [ ] Documentation is updated (if needed)

## Questions?

Feel free to:

- Open an issue for questions
- Start a discussion on GitHub Discussions
- Reach out to maintainers

Thank you for contributing to Dockev! 🚀
