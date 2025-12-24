# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please report it via one of the following methods:

1. **Email**: [your-email@example.com]
2. **GitHub Security Advisory**: Use the "Report a vulnerability" button on the repository's Security tab

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- The location of the affected code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Release**: Depends on severity and complexity

## Security Best Practices

When using Dockev:

- Keep your Node.js and dependencies up to date
- Only add projects from trusted sources
- Review environment variables before running dev servers
- Be cautious when using custom IDE commands

## Disclosure Policy

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide an initial assessment within 7 days
- We will keep you informed of our progress
- We will notify you when the vulnerability has been fixed
- We will credit you in the release notes (unless you prefer to remain anonymous)

Thank you for helping keep Dockev and our users safe! 🔒
