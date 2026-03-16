## 1. Install Dependencies

- [x] 1.1 Install Prettier: `npm install -D prettier`
- [x] 1.2 Install ESLint + TypeScript plugin: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier`
- [x] 1.3 Install Husky + lint-staged: `npm install -D husky lint-staged`
- [x] 1.4 Install commitlint: `npm install -D @commitlint/cli @commitlint/config-conventional`
- [x] 1.5 Install Vitest: `npm install -D vitest @vitejs/plugin-react`

## 2. Configuration Files

- [x] 2.1 Create `.prettierrc` (semi: false, singleQuote: true, tabWidth: 2, trailingComma: es5, printWidth: 100)
- [x] 2.2 Create `eslint.config.mjs` (flat config, @typescript-eslint/strict, prettier integration)
- [x] 2.3 Create `commitlint.config.js` (extends @commitlint/config-conventional)
- [x] 2.4 Create `vitest.config.ts` (TypeScript support, `@/` path alias → `src/`, passWithNoTests)
- [x] 2.5 Add lint-staged config to `package.json` (`*.{ts,tsx}` → prettier --write + eslint --fix)

## 3. Git Hooks

- [x] 3.1 Initialize Husky: add `"prepare": "husky"` to package.json scripts, run `npx husky init`
- [x] 3.2 Create `.husky/pre-commit` hook running `npx lint-staged`
- [x] 3.3 Create `.husky/commit-msg` hook running `npx --no -- commitlint --edit $1`

## 4. TypeScript Strict Mode

- [x] 4.1 Update `tsconfig.json`: enable `strict: true`, `noUncheckedIndexedAccess: true`
- [x] 4.2 Add package.json scripts: `"lint"`, `"format"`, `"format:check"`, `"test"`, `"typecheck"`

## 5. Fix Existing Code for Strict Compliance

- [x] 5.1 Fix `src/data/storage.ts`: type `saveCandidate` param as `Candidate`, handle undefined in `generateNextId`
- [x] 5.2 Fix `src/app/api/candidates/route.ts`: remove `as any`, use `CreateCandidateRequest` type
- [x] 5.3 Fix `src/app/api/candidates/[id]/decision/route.ts`: remove `as any`, add null check for candidate, type `newStatus`, fix Next.js 15 async params
- [x] 5.4 Fix `src/models/candidate.ts`: remove unused `DecisionAction` import
- [x] 5.5 Run Prettier on all files, fix ESLint errors (unused vars → `_` prefix, catch clause pattern)
- [x] 5.6 Verify `npx tsc --noEmit` passes with zero errors

## 6. Verify All Tooling

- [x] 6.1 Run `npm run format:check` — all files pass
- [x] 6.2 Run `npm run lint` — zero errors
- [x] 6.3 Run `npm run typecheck` — zero errors
- [x] 6.4 Run `npm test` — Vitest runs successfully (zero tests, exit 0)
- [x] 6.5 Verify app builds: `npm run build` — all routes compile successfully
