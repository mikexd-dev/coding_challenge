# Candidate Management System

A production-quality candidate management system refactored from a prototype, demonstrating clean architecture, domain-driven design, and full-stack engineering best practices.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000/live-session

## Approach

1. **Analyze the codebase** — understood what was broken before touching anything. Identified a high-severity Next.js vulnerability, missing business rule enforcement, an anemic domain model, business logic in route handlers, and weak TypeScript usage.

2. **Fix security vulnerability** — updated Next.js to the latest version not affected by the CVE, along with required syntax changes (async params in route handlers).
   ![Next.js vulnerability](assets/image.png)

3. **Set up tooling guardrails** — established code quality infrastructure before writing any feature code:
   - **Prettier** — consistent formatting (no semicolons, single quotes, 2-space indent)
   - **ESLint** — flat config with strict TypeScript rules, no `any` allowed
   - **Husky + lint-staged** — pre-commit hooks enforce formatting and linting on staged files
   - **Commitlint** — conventional commits enforced via commit-msg hook
   - **Vitest** — test framework configured with path aliases
   - **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`

4. **Restructure to lightweight hexagonal architecture** — separated concerns into clear layers before implementing business logic:
   - `domain/` — models and type definitions (zero framework imports)
   - `application/` — service layer (placeholder, built out in next phase)
   - `infrastructure/` — data access adapters (persistence)
   - `app/` — Next.js route handlers (driving adapter, thin HTTP translation)
   - `ui/` — frontend components and API client

5. **Implement business rules and domain logic** — enrich the domain model with encapsulated state transitions, validation, and domain-specific error types.

6. **Refactor the frontend** — extract components, wire to the stable API contract, add client-side validation and UX improvements.

7. **Add tests** — unit tests for domain logic (highest-value), integration tests for API routes.

## Architecture

```
src/
  domain/                          # Pure business logic
    models/candidate.ts            # Candidate aggregate
    types/candidate.ts             # DTOs, enums, request/response types
  application/                     # Use case orchestration (service layer)
  infrastructure/                  # Adapters (implements domain ports)
    persistence/storage.ts         # In-memory repository
  app/                             # Next.js framework layer (driving adapter)
    api/candidates/                # REST API routes
    live-session/                  # UI page
  ui/                              # Frontend API client
    api/candidates.ts              # Typed fetch wrappers
```

**Why hexagonal?** The challenge evaluates separation of concerns and domain-driven design. Hexagonal architecture makes the dependency rule explicit: domain imports nothing, application imports domain, infrastructure implements domain ports, and the framework layer (app/) is just wiring. This keeps business logic testable in isolation and framework-agnostic.

**Why lightweight?** For 2 endpoints and an in-memory store, full ports-and-adapters ceremony (one-class-per-use-case, explicit port interfaces) would be over-engineering. The structure accommodates growth without premature abstraction.

## Business Rules

- `NEW` candidates can be `SHORTLISTED` or `REJECTED`
- `SHORTLISTED` candidates cannot be `REJECTED`
- `REJECTED` candidates cannot be `SHORTLISTED`
- `reason` must be at least 10 characters

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| TypeScript strict mode | `strict: true` | Challenge evaluates TS best practices; surfaced real bugs (`as any`, null unsafety) |
| Vitest over Jest | Vitest | Native ESM, faster, Next.js compatible — no ts-jest config needed |
| ESLint flat config | `eslint.config.mjs` | ESLint 9+ standard, no legacy `.eslintrc` baggage |
| Prettier style | Match team backend | Consistency across repos (semi: false, singleQuote, trailingComma: es5) |
| printWidth 100 vs 200 | 100 | Backend uses 200 which hurts readability in review context |
| Domain types naming | `domain/types/` not `domain/contracts/` | "contracts" implies external API boundaries; these are domain-level definitions |

## Testing Strategy

- **Unit tests** for domain model — highest value, test business rule enforcement (status transitions, validation) in isolation with no framework dependencies
- **Integration tests** for API routes — verify HTTP translation layer maps domain results to correct status codes and response shapes
- **No mocking of the data layer** in integration tests — the in-memory store is fast enough to use directly

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run format       # Prettier format
npm run format:check # Prettier check (CI)
npm run typecheck    # TypeScript strict check
npm test             # Run Vitest
npm run test:watch   # Vitest in watch mode
```
