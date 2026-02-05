# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via [GitHub Security Advisories](https://github.com/YourGPT/copilot-sdk/security/advisories/new) (recommended) or by contacting the maintainers privately.

### What to Include

Please include the following information:

- Type of vulnerability (e.g., XSS, SQL injection, etc.)
- Step-by-step instructions to reproduce the issue
- Affected versions
- Any potential impact
- Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within 48 hours
- **Updates**: We will keep you informed of our progress
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

### Scope

This security policy applies to:

- `@yourgpt/copilot-sdk`
- `@yourgpt/llm-sdk`
- Official example applications

## Best Practices for Users

When using the Copilot SDK:

1. **Keep dependencies updated** - Regularly update to the latest version
2. **Validate inputs** - Always validate user inputs before passing to the SDK
3. **Secure API keys** - Never expose API keys in client-side code
4. **Use environment variables** - Store sensitive configuration in environment variables
5. **Review tool implementations** - Carefully review any custom tools for security implications

## Security Features

The SDK includes several security considerations:

- Server-side tool execution (sensitive operations stay on your server)
- No client-side API key exposure required
- Sandboxed tool execution environment

Thank you for helping keep Copilot SDK and its users safe!
