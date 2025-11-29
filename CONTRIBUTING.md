# Contributing to daed

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Commit Guidelines](#commit-guidelines)
- [Style Guide](#style-guide)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Reporting Bugs

### Before Submitting a Bug Report

- Check the [existing issues](https://github.com/daeuniverse/daed/issues) to see if the problem has already been reported
- Make sure you are using the latest version
- Collect relevant information (OS, browser, Node.js version, etc.)

### How to Submit a Good Bug Report

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Describe the behavior you observed and what you expected
- Include screenshots or recordings if applicable
- Include any relevant logs or error messages

[Open a Bug Report →](https://github.com/daeuniverse/daed/issues/new?template=bug_report.md)

## Suggesting Features

### Before Submitting a Feature Request

- Check if the feature has already been requested or implemented
- Consider whether your idea fits the scope of the project

### How to Submit a Good Feature Request

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this feature would be useful
- Include mockups or examples if possible

[Open a Feature Request →](https://github.com/daeuniverse/daed/issues/new?template=feature_request.md)

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9
- [Git](https://git-scm.com/)

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/<your-username>/daed.git
   cd daed
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/daeuniverse/daed.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Pull Request Process

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** and ensure:
   - Code follows the project's style guide
   - All tests pass (`pnpm test`)
   - Linting passes (`pnpm lint`)

3. **Commit your changes** following the [commit guidelines](#commit-guidelines)

4. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request** against `main`

6. **Wait for review** — maintainers will review your PR and may request changes

### Tips for a Successful PR

- Keep PRs focused and atomic — one feature or fix per PR
- Write a clear description of what your PR does
- Link any related issues
- Add screenshots for UI changes
- Be responsive to feedback

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new feature                                             |
| `fix`      | A bug fix                                                 |
| `docs`     | Documentation only changes                                |
| `style`    | Changes that do not affect the meaning of the code        |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf`     | A code change that improves performance                   |
| `test`     | Adding missing tests or correcting existing tests         |
| `chore`    | Changes to the build process or auxiliary tools           |

### Examples

```bash
feat(ui): add dark mode toggle button
fix(api): handle null response from server
docs: update README with new badges
chore(deps): update dependencies
```

## Style Guide

### Code Style

- We use [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config)
- Run `pnpm lint` to check and auto-fix issues
- Use TypeScript for all new code
- Prefer functional components with hooks

### File Naming

- React components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities/hooks: `camelCase.ts` (e.g., `useAuth.ts`)
- Test files: `*.test.ts` or `*.test.tsx`

### Project Structure

```
src/
├── components/     # Reusable UI components
│   └── ui/         # Base UI components (shadcn/ui)
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── schemas/        # GraphQL schemas and types
├── contexts/       # React context providers
└── lib/            # Utility functions
```

---

Thank you for contributing! 🎉
