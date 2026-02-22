# AGENTS.md - Developer Guide for Akker

Guidelines for agentic coding agents working in this repository.

## Project Overview

Akker is an Angular 21 application using standalone components, signals, Vitest for testing, Storybook for component development, and Tailwind CSS for styling.

---

## Coding Patterns

For detailed patterns and code examples by topic, see the skill files in `.agents/skills/`:

| Skill                  | When to Use                              |
| ---------------------- | ---------------------------------------- |
| **angular-components** | Creating/modifying `.component.ts` files |
| **angular-signals**    | Managing component or service state      |
| **angular-services**   | Creating/modifying `.service.ts` files   |
| **angular-templates**  | Writing component templates              |
| **angular-forms**      | Building reactive forms                  |
| **angular-routing**    | Configuring routes (`.routes.ts` files)  |
| **testing**            | Writing tests (`.spec.ts` files)         |
| **storybook**          | Creating stories (`.stories.ts` files)   |

---

## Build, Lint, and Test Commands

### Development

```bash
npm start           # Start dev server (ng serve)
npm run watch       # Build with watch mode (development)
npm run build       # Production build
```

### Testing

```bash
npm test            # Run all unit tests via Vitest
npx vitest run src/app/cards/search.service.spec.ts  # Single test file
npx vitest run --grep "SearchService"               # Tests matching pattern
npx vitest          # Watch mode
npm run test-storybook   # Storybook tests
npm run e2e         # E2E tests
```

### Linting & Formatting

```bash
npm run lint        # Run ESLint on all .ts and .html files
npm run format      # Format all files with Prettier
```

### Storybook

```bash
npm run storybook           # Start Storybook dev server
npm run build-storybook     # Build Storybook for production
```

---

## Import Guidelines

Imports are sorted by Prettier using `@trivago/prettier-plugin-sort-imports`:

```typescript
// Third-party imports
import { Component } from '@angular/common';
import { map } from 'rxjs/operators';

import { CardService } from '../services/card.service';
// Relative imports
import { CardComponent } from './card.component';
```

---

## Configuration Files

| File               | Purpose                                                                              |
| ------------------ | ------------------------------------------------------------------------------------ |
| `.prettierrc.js`   | Print width: 120, Single quotes, Trailing commas: all                                |
| `eslint.config.ts` | `object-shorthand: always`, selector prefix: `app`, `@angular-eslint/prefer-signals` |
| `vite.config.mts`  | Vitest configuration                                                                 |
| `tsconfig.json`    | Strict mode, `verbatimModuleSyntax`                                                  |

---

## Tailwind CSS

- Tailwind CSS v4
- Use `clsx` for conditional classes

---

## Git Hooks (Husky)

Pre-commit hooks run ESLint (auto-fix) and Prettier formatting.

---

## Additional Resources

- Copilot instructions: `.github/copilot-instructions.md`
- ESLint config: `eslint.config.ts`
- Prettier config: `.prettierrc.js`
- Vitest/Vite config: `vite.config.mts`
- TypeScript config: `tsconfig.json`
