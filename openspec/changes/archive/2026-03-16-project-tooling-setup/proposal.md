## Why

The inherited prototype has zero development guardrails — no linter, no formatter, no commit conventions, no tests, and loose TypeScript. Before any architectural refactoring or feature work, we need tooling in place so every subsequent change is automatically validated against quality standards. This change is intentionally scoped to tooling only — folder restructuring and domain work come next.

## What Changes

- **Prettier** — semi: false, singleQuote, 2-space indent, trailingComma: es5 (aligned with Laguna backend `.prettierrc`)
- **ESLint** — flat config (`eslint.config.mjs`), @typescript-eslint with strict rules, prettier integration via eslint-config-prettier
- **Husky + lint-staged** — pre-commit hook runs prettier + eslint on staged `*.ts` and `*.tsx` files only
- **Commitlint** — @commitlint/config-conventional enforcing conventional commits
- **Vitest** — unit test framework (Next.js compatible, faster than Jest), configured with path aliases matching tsconfig
- **Strict TypeScript** — enable `strict`, `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess` (intentionally stricter than backend's loose config — this is a quality-focused challenge)
- **Fix existing code** to pass strict TypeScript and lint rules (minimal changes — type annotations, remove `as any`, add null checks)

## Capabilities

### New Capabilities
- `project-tooling`: ESLint, Prettier, Husky, commitlint, lint-staged, Vitest, strict TypeScript — development guardrails and quality enforcement

### Modified Capabilities
<!-- None — no existing specs -->

## Impact

- **New dev dependencies** — eslint, prettier, husky, @commitlint/cli, lint-staged, vitest, @typescript-eslint/*
- **TypeScript strictness increase** — existing code will surface type errors that must be fixed (the `as any` casts, `candidate!.status` mutations, untyped `saveCandidate(candidate: any)`)
- **No structural changes** — file locations stay the same, no new folders, no API changes
- **Git hooks added** — contributors must have husky installed (runs via `prepare` script)
