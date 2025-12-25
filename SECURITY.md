# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Dockev seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue
- Discuss the vulnerability publicly until it has been resolved

### Please DO:

1. **Open a private security advisory** on GitHub: [Create Security Advisory](https://github.com/thearkxd/dockev/security/advisories/new)
2. Include the following information:
   - Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
   - Full paths of source file(s) related to the manifestation of the issue
   - The location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 5 business days
- **Updates**: We will provide regular updates on the progress of fixing the vulnerability
- **Resolution**: We will notify you when the vulnerability is fixed and ask you to verify the fix

### Disclosure Policy

- We will work with you to understand and resolve the issue quickly
- We will credit you for the discovery (unless you prefer to remain anonymous)
- We will not take legal action against security researchers who:
  - Act in good faith
  - Do not access more data than necessary
  - Do not modify or delete data
  - Do not disrupt our services

## Security Best Practices

When using Dockev:

- **Keep it updated**: Always use the latest version of Dockev
- **Review permissions**: Be cautious when granting file system access
- **Verify project paths**: Only add projects from trusted locations
- **Keep dependencies updated**: Regularly update Node.js and other dependencies

## Known Security Considerations

- Dockev requires file system access to manage projects
- Dockev may execute shell commands to launch IDEs and dev servers
- All data is stored locally in your browser's localStorage
- No data is transmitted to external servers

---

**Thank you for helping keep Dockev and our users safe!**
