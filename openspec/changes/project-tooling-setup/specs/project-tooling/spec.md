## ADDED Requirements

### Requirement: Prettier formatting enforced
The project SHALL use Prettier with configuration matching Laguna backend conventions: no semicolons, single quotes, 2-space indent, ES5 trailing commas, and 100-character print width.

#### Scenario: Prettier config exists and is valid
- **WHEN** a developer checks the project root
- **THEN** a `.prettierrc` file exists with `semi: false`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: "es5"`, `printWidth: 100`

#### Scenario: All source files pass formatting
- **WHEN** `npx prettier --check "src/**/*.{ts,tsx}"` is run
- **THEN** all files pass with zero formatting violations

### Requirement: ESLint with strict TypeScript rules
The project SHALL use ESLint 9+ flat config with @typescript-eslint strict rules and Prettier integration to prevent style conflicts.

#### Scenario: ESLint config exists as flat config
- **WHEN** a developer checks the project root
- **THEN** an `eslint.config.mjs` file exists using flat config format with @typescript-eslint and eslint-config-prettier

#### Scenario: All source files pass linting
- **WHEN** `npx eslint "src/**/*.{ts,tsx}"` is run
- **THEN** all files pass with zero errors

#### Scenario: ESLint does not conflict with Prettier
- **WHEN** both Prettier and ESLint are run on the same file
- **THEN** no conflicting rules are reported (eslint-config-prettier disables style rules)

### Requirement: Husky pre-commit hook runs lint-staged
The project SHALL use Husky to run lint-staged on pre-commit, executing Prettier and ESLint on staged files only.

#### Scenario: Husky installs on npm install
- **WHEN** `npm install` is run
- **THEN** the `prepare` script runs `husky` and `.husky/` directory is configured

#### Scenario: Pre-commit hook runs lint-staged
- **WHEN** a developer runs `git commit`
- **THEN** lint-staged executes Prettier (write) and ESLint (fix) on staged `*.ts` and `*.tsx` files

#### Scenario: Commit blocked on lint failure
- **WHEN** staged files contain unfixable lint errors
- **THEN** the commit is rejected with the lint error output

### Requirement: Commitlint enforces conventional commits
The project SHALL use commitlint with @commitlint/config-conventional to enforce structured commit messages.

#### Scenario: Commitlint config exists
- **WHEN** a developer checks the project root
- **THEN** a `commitlint.config.js` file exists extending `@commitlint/config-conventional`

#### Scenario: Valid conventional commit passes
- **WHEN** a developer commits with message `feat: add candidate validation`
- **THEN** the commit-msg hook passes

#### Scenario: Invalid commit message rejected
- **WHEN** a developer commits with message `added stuff`
- **THEN** the commit-msg hook rejects with a commitlint error

### Requirement: Vitest configured for unit testing
The project SHALL use Vitest as the test framework with TypeScript support and path aliases matching tsconfig.

#### Scenario: Vitest config exists
- **WHEN** a developer checks the project root
- **THEN** a `vitest.config.ts` file exists with TypeScript support and `@/` path alias resolving to `src/`

#### Scenario: Test command runs Vitest
- **WHEN** `npm test` is executed
- **THEN** Vitest runs and reports results (passes with zero tests initially)

#### Scenario: Test files can import source using path aliases
- **WHEN** a test file uses `import { Candidate } from '@/models/candidate'`
- **THEN** the import resolves correctly and the test compiles

### Requirement: Strict TypeScript configuration
The project SHALL enable strict TypeScript compiler options to catch type errors at compile time.

#### Scenario: tsconfig.json has strict mode enabled
- **WHEN** a developer checks `tsconfig.json`
- **THEN** `strict: true`, `noUncheckedIndexedAccess: true` are set in compilerOptions

#### Scenario: Existing code compiles under strict mode
- **WHEN** `npx tsc --noEmit` is run
- **THEN** zero type errors are reported (existing code has been fixed to comply)

### Requirement: Existing code passes all tooling checks
All existing source files SHALL be updated minimally to pass strict TypeScript, ESLint, and Prettier without changing behavior.

#### Scenario: Type-unsafe patterns are fixed
- **WHEN** existing code is reviewed after tooling setup
- **THEN** all `as any` casts are replaced with proper types, non-null assertions are replaced with null checks, and untyped parameters have type annotations

#### Scenario: No behavioral changes
- **WHEN** the application is run after tooling fixes
- **THEN** all existing functionality (list candidates, create candidate, submit decision) works identically to before
