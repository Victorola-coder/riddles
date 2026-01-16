# Contributing to Riddle Quest 🧩

Thank you for your interest in contributing to Riddle Quest! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Adding Riddles](#adding-riddles)

## 🤝 Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

1. **Fork the repository** and clone your fork:

```bash
git clone https://github.com/Victorola-coder/riddles.git
cd riddles
```

2. **Install dependencies**:

```bash
npm install
# or
bun install
```

3. **Create a branch** for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

4. **Make your changes** following our [coding standards](#coding-standards)

5. **Test your changes**:

```bash
npm run dev
npm run lint
npm run build
```

## 🔄 Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/daily-streak`)
- `fix/` - Bug fixes (e.g., `fix/gem-calculation`)
- `docs/` - Documentation updates (e.g., `docs/readme-update`)
- `refactor/` - Code refactoring (e.g., `refactor/game-store`)
- `test/` - Adding tests (e.g., `test/riddle-validator`)

### Project Structure

Follow the existing Atomic Design pattern:

- `components/atoms/` - Basic building blocks
- `components/molecules/` - Component combinations
- `components/organisms/` - Complex components
- `lib/store/` - Zustand state management
- `lib/utils/` - Utility functions
- `lib/constants/` - Game configuration and riddles
- `types/` - TypeScript type definitions

## 📝 Coding Standards

### TypeScript

- **Always use TypeScript** - No JavaScript files
- **Strict mode enabled** - Follow TypeScript strict rules
- **No `any` types** - Use proper types or `unknown`
- **Type everything** - Functions, props, state, etc.

### Code Style

- **Format code** - Use Prettier (if configured) or follow existing style
- **Meaningful names** - Use descriptive variable and function names
- **DRY principle** - Don't Repeat Yourself
- **KISS principle** - Keep It Simple, Stupid
- **Comments** - Add comments for complex logic, not obvious code

### React/Next.js

- **Functional components** - Use function components, not classes
- **Hooks** - Use React hooks for state and side effects
- **Server Components** - Use Server Components by default, add `"use client"` only when needed
- **Accessibility** - Follow WCAG 2.1 AA guidelines
- **Performance** - Optimize images, use `next/image`, lazy load when appropriate

### Example Component

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";

interface ExampleProps {
  title: string;
  onAction: () => void;
}

export function Example({ title, onAction }: ExampleProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={onAction}>Click me</Button>
    </div>
  );
}
```

## 📦 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(game): add daily streak system
fix(gems): correct gem calculation for hard riddles
docs(readme): update installation instructions
refactor(store): simplify game state management
```

## 🔍 Pull Request Process

1. **Update documentation** if your changes affect user-facing features
2. **Add tests** if applicable (we'll add testing framework in Phase 2)
3. **Ensure linting passes**: `npm run lint`
4. **Ensure build succeeds**: `npm run build`
5. **Update TASKS.md** if you complete a task
6. **Write clear PR description**:
   - What changes were made
   - Why they were made
   - How to test
   - Screenshots (if UI changes)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Build passes successfully
- [ ] Linting passes

## 🐛 Reporting Bugs

Use GitHub Issues with the following template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

Open an issue with:

- **Clear description** of the feature
- **Use case** - Why is this feature needed?
- **Proposed solution** - How should it work?
- **Alternatives considered** - Other approaches you thought about

## 🧩 Adding Riddles

We welcome new riddles! Add them to `lib/constants/riddles.ts`:

```typescript
{
  id: "unique-id",
  question: "Your riddle question here?",
  answer: "answer" | ["answer1", "answer2"], // Support multiple valid answers
  difficulty: "easy" | "medium" | "hard",
  category?: "Logic" | "Wordplay" | "Math", // Optional
  hint1?: "First letter hint",
  hint2?: "Word length hint",
  tags?: ["tag1", "tag2"]
}
```

### Riddle Guidelines

- **Quality over quantity** - Well-crafted, solvable riddles
- **Difficulty balance** - Ensure appropriate difficulty level
- **Original or attributed** - Use original riddles or attribute sources
- **No offensive content** - Keep it family-friendly
- **Test your riddle** - Make sure it's solvable and fun

## ❓ Questions?

- Open a GitHub Discussion for general questions
- Check existing Issues and PRs first
- Review the [PRD.md](./PRD.md) for project goals

## 🙏 Thank You!

Your contributions make Riddle Quest better for everyone. We appreciate your time and effort!

---

**Happy coding!** 🎉
