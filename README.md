# Candidate Management System

A production-quality candidate management system refactored from a prototype, demonstrating clean architecture, domain-driven design, and full-stack engineering best practices.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000/live-session

## Approach

Detailed Approach to refer to [dev-logs.md](dev-logs.md) where I document the high level design decisions and trade-offs I made during the development process as raw notes.

But main rationale of the entire proecess is to establish the baseline standard first for subsequent commits. Then move to establish a current state of the codebase through writing tests. Determmine the tests that failed and only then proceed to fix them. This ensures that I don't break any existing functionality while adding new features. And incrementally while i add new features to also add tests, and in CI/CD pipeline to run all the tests to ensure that the codebase is always in a good state before PR can be merged. And in PR there is coderabbit to review the code and ensure that it meets the baseline standard.

## Architecture

```
src/
  domain/          # Pure business logic — shared between frontend and backend (zero framework imports)
  infrastructure/  # Adapters implementing domain ports (persistence, DB connection)
  app/             # Next.js driving adapter — API routes and UI pages
  components/      # Frontend UI components (shadcn/ui primitives + custom)
  hooks/           # Custom React hooks (TanStack Query, optimistic updates)
  lib/             # Shared utilities and typed API client
```

Keeping the architecture with the shape of hexagonal architecture but as lightweight as possible. There are also some anti-patterns in this nextjs repo that allows both frontend and backend to share the validation and type. Theoretically, they are considered 2 separate hexagonal architecture. However, I think it is a good trade-off for this project.

## Business Rules

- `NEW` candidates can be `SHORTLISTED` or `REJECTED`
- `SHORTLISTED` candidates cannot be `REJECTED`
- `REJECTED` candidates cannot be `SHORTLISTED`
- `reason` must be at least 10 characters

## Key Decisions

### 1. Tooling first, before any feature code

Established Prettier, ESLint (flat config), strict TypeScript (`strict: true`, `noUncheckedIndexedAccess`), Husky + lint-staged, and Commitlint before touching any logic. Guardrails need to exist before the codebase grows — retrofitting them later is painful and the first commit sets the standard every subsequent commit inherits.

### 2. Write tests against the existing code, see what fails

Rather than guessing what was broken, wrote unit tests for the domain model and API routes against the prototype as-is. The failing tests became the exact specification for what needed fixing — no over-engineering, no speculation.

### 3. Introduce hexagonal architecture to contain the fixes

With failing tests as a map, restructured into `domain/`, `infrastructure/`, and `app/` layers before rewriting logic. This meant fixes would land in the right layer (business rules in domain, not in route handlers) and the existing passing tests would not break during the refactor.

### 4. Enrich the domain model and enforce business rules

Made the `Candidate` aggregate enforce its own state transitions and validation. Route handlers now only translate domain errors to HTTP codes — they contain no business logic. This is where the failing tests turned green.

### 5. Shared validation as a deliberate anti-pattern

Validation predicates (`isValidName`, `isValidReason`, `canTransition`) live in `domain/validation/rules.ts` and are imported by both the API and the frontend. Strictly speaking, hexagonal architecture treats frontend and backend as two separate hexagons. The trade-off was made consciously — a single source of truth for rules is worth more than theoretical purity at this scale.

### 6. Frontend component refactoring with shadcn/ui

Broke the monolithic page into focused components (`CandidateBoard`, `CandidateCard`, `CandidateSheet`, `CreateCandidateForm`, `UpdateStatusForm`). Brought in shadcn/ui as the design system to get consistent, accessible primitives without writing custom CSS.

### 7. TanStack Query + `useOptimistic` for a responsive UI

Replaced manual `useEffect` fetch with TanStack Query for automatic cache invalidation and retry. Used React 19's `useOptimistic` for drag-and-drop card movements so the board updates instantly without waiting for the server round-trip.

### 8. DnD Kanban board with accessibility

Converted the flat list to a Kanban board using `@dnd-kit` — lightweight, keyboard-navigable, and React 19 compatible. Added ARIA live regions and focus management so the board is usable without a mouse.

### 9. E2E tests last, covering full user workflows

Playwright tests were written after the application was stable — covering create, shortlist, and reject flows end-to-end. Writing E2E before the UI settled would have meant constant test churn.

### 10. CI pipeline + CodeRabbit as the review gate

Every PR to `main` runs the full quality suite on GitHub Actions — typecheck, lint, format check, Vitest unit/integration tests, and Playwright E2E. CodeRabbit is set up as an automated code reviewer to catch issues before a human reviewer looks at the PR. Nothing merges to `main` without all checks green and review approved.

In a production setup this would extend to branch-based environments: `dev` for active development, `staging` for pre-release validation, and `main` for production — each with their own deployment target and environment variables.

## Testing Strategy

- **Unit tests** for domain model — highest value, test business rule enforcement (status transitions, validation) in isolation with no framework dependencies
- **Validation tests** — shared validation predicates tested independently
- **Infrastructure tests** — repository adapter contracts (in-memory and Neon)
- **Integration tests** for API routes — verify HTTP translation layer maps domain results to correct status codes and response shapes
- **Component tests** — UI components rendered with Testing Library, user interactions verified
- **E2E tests** with Playwright — full user workflows (create, shortlist, reject) against the running app
- **No mocking of the data layer** in integration tests — the in-memory store is fast enough to use directly

## Assumptions

- **In-memory storage by default** — no database setup required for development or review. Data resets on server restart.
- **Neon PostgreSQL optional** — set `DATABASE_URL` env var to enable persistent storage via Neon serverless driver.
- **Single-user** — no authentication or multi-tenancy. Suitable for the challenge scope.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run format       # Prettier format
npm run format:check # Prettier check (CI)
npm run typecheck    # TypeScript strict check
npm test             # Run Vitest (unit + integration)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:e2e:ui  # Playwright interactive UI mode
```
