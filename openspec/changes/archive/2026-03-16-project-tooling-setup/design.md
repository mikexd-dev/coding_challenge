## Context

The coding challenge project is a Next.js 14 app with zero development tooling — no linter, formatter, commit hooks, test framework, or strict TypeScript. The Laguna backend repo uses Prettier, ESLint (dual config), Husky, commitlint, lint-staged, and Jest. We align with team conventions where appropriate but make deliberate departures for this quality-focused challenge (e.g., strict TypeScript over the backend's loose config, Vitest over Jest for Next.js compatibility).

Current state:
- `tsconfig.json` exists but uses default/loose settings
- `package.json` has only `next`, `react`, `react-dom` + their `@types`
- No `.eslintrc`, `.prettierrc`, `.husky/`, test config, or related tooling
- Existing code has `as any` casts, non-null assertions (`!`), and untyped function params

## Goals / Non-Goals

**Goals:**
- Establish formatting, linting, commit conventions, and test infrastructure before any feature work
- Align with Laguna backend conventions where sensible (Prettier style, conventional commits)
- Make strict TypeScript the baseline — surface existing type issues now rather than during architecture refactor
- Ensure all tooling works with Next.js 14 app router

**Non-Goals:**
- Folder restructuring or architectural changes (that's `hexagonal-architecture-refactor`)
- Business rule implementation or domain model enrichment
- Frontend component refactoring
- CI/CD pipeline setup (no GitHub Actions — this is a local challenge)

## Decisions

### 1. Vitest over Jest
**Choice**: Vitest
**Rationale**: Native ESM support, faster execution, built-in TypeScript support without ts-jest, compatible with Next.js. The backend uses Jest because NestJS has deep Jest integration — that constraint doesn't apply here.
**Alternative**: Jest + ts-jest (what backend uses) — heavier config, slower, requires explicit transform setup.

### 2. ESLint flat config only (no legacy .eslintrc)
**Choice**: Single `eslint.config.mjs` using flat config format
**Rationale**: The backend has dual configs (legacy + flat) for migration reasons. We start fresh — no reason to carry legacy format. Flat config is the ESLint 9+ standard.
**Alternative**: `.eslintrc.js` (legacy) — would work but is deprecated.

### 3. Strict TypeScript (diverge from backend)
**Choice**: Enable `strict`, `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess`
**Rationale**: The challenge evaluates TypeScript best practices. The backend's loose config (strictNullChecks: false, noImplicitAny: false) is a pragmatic choice for a large existing codebase — we don't have that constraint. Strict mode catches the exact bugs present in the current code.
**Alternative**: Match backend's loose config — would miss the point of the challenge.

### 4. Prettier config matches backend exactly
**Choice**: Copy `.prettierrc` from backend (semi: false, singleQuote: true, tabWidth: 2, trailingComma: es5)
**Rationale**: Team consistency. One exception: reduce `printWidth` from 200 to 100 — 200 is unusually wide and hurts readability for a review context.
**Alternative**: Different style — no benefit, creates friction if reviewer compares.

### 5. Minimal existing code fixes
**Choice**: Fix only what's needed to pass strict TS + lint. No refactoring, no restructuring.
**Rationale**: Keep this change atomic. Type fixes are mechanical (add annotations, remove `as any`, handle nulls). Architecture changes belong in the next change.

## Risks / Trade-offs

- **Strict TS surfaces many errors at once** → Mitigation: fix them mechanically in this change. The codebase is ~300 lines, manageable in one pass.
- **Vitest unfamiliar to team using Jest** → Mitigation: API is nearly identical (describe/it/expect). Test files use same patterns.
- **printWidth 100 vs backend's 200** → Mitigation: deliberate choice documented here. Reviewer can see rationale.
- **Husky requires `prepare` script** → Mitigation: standard practice, added to package.json. Works on `npm install`.
