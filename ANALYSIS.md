# Assignment Analysis - Candidate Management System

## Executive Summary

This project transforms a quick prototype of a candidate management system into a **production-quality application** using clean architecture, domain-driven design, comprehensive testing, and modern frontend patterns. The work was completed across **8 pull requests** and **27 commits**, following a disciplined, incremental approach.

---

## 1. What Was Given (The Problem)

A recruiting platform prototype with **critical issues**:

| Problem Area | Details |
|---|---|
| **Missing Business Rules** | Status transitions not enforced (could shortlist rejected candidates, reject shortlisted ones). Reason length not validated. |
| **Poor Architecture** | Business logic mixed into API route handlers. No separation of concerns. |
| **Code Quality** | Weak TypeScript types, poor error handling, code duplication, no tests. |
| **Frontend** | Single monolithic page component with inline styles. Raw fetch calls. No validation feedback. |

---

## 2. What Was Delivered (The Solution)

### Architecture: Lightweight Hexagonal / Clean Architecture

```
src/
  domain/            --> Pure business logic (zero framework imports)
    models/          --> Candidate aggregate with encapsulated state
    validation/      --> Shared validation rules (single source of truth)
    repositories/    --> Port interfaces (contracts)
    errors/          --> Typed domain errors
    types/           --> DTOs and interfaces

  infrastructure/    --> Adapters implementing domain ports
    persistence/     --> In-memory + Neon PostgreSQL repositories
    db/              --> Drizzle ORM schema and connection

  app/               --> Next.js driving adapter
    api/candidates/  --> REST endpoints (GET, POST, decision, reset)
    live-session/    --> Main UI page

  components/        --> React UI components (shadcn/ui + custom)
  hooks/             --> Custom React hooks (TanStack Query, optimistic updates)
  lib/               --> Utilities and typed API client
```

### Business Rules Enforced at Domain Level

| Rule | Implementation |
|---|---|
| NEW -> SHORTLISTED | `candidate.shortlist(reason)` with guard |
| NEW -> REJECTED | `candidate.reject(reason)` with guard |
| SHORTLISTED is terminal | `canTransitionTo()` returns false |
| REJECTED is terminal | `canTransitionTo()` returns false |
| Reason >= 10 chars | Validated in domain + shared frontend rules |
| Name non-empty | Validated at creation via factory method |

---

## 3. Development Approach & Methodology

### Incremental, Test-Driven Strategy (8 PRs)

```
PR 1: Tooling Setup          --> Foundation (ESLint, Prettier, Husky, strict TS)
PR 2: TDD Setup              --> Write tests FIRST to expose gaps
PR 3: Business Rules Fix     --> Make failing tests pass (domain model)
PR 4: Shared Validation      --> Extract rules for frontend + backend
PR 5: shadcn UI Components   --> Break monolith into reusable components
PR 6: Frontend Refactoring   --> TanStack Query, optimistic UI, accessibility
PR 7: Neon DB Adapter        --> PostgreSQL with repository factory pattern
PR 8: E2E Tests + CI/CD      --> Playwright tests, GitHub Actions pipeline
```

**Key Insight**: Tests were written *before* fixes. The 10 failing tests became the exact specification, preventing over-engineering and ensuring no regressions.

---

## 4. Technical Highlights

### 4.1 Domain Model (Encapsulated Aggregate)

- **Immutable public properties**: `id`, `name` (readonly)
- **Private state**: `_status`, `_reason`, `_decisionDate` (accessed via getters)
- **Factory method**: `Candidate.create()` validates inputs at creation
- **Transition methods**: `shortlist(reason)` and `reject(reason)` enforce all business rules internally
- **Error types**: `ValidationError`, `InvalidTransitionError`, `CandidateNotFoundError`

The model *owns its own rules* - route handlers just catch errors and map to HTTP codes.

### 4.2 API Error Mapping

| Domain Error | HTTP Status | Meaning |
|---|---|---|
| `ValidationError` | 400 Bad Request | Invalid input (empty name, short reason) |
| `CandidateNotFoundError` | 404 Not Found | Candidate ID doesn't exist |
| `InvalidTransitionError` | 409 Conflict | Illegal state transition |

### 4.3 Shared Validation (Deliberate Trade-off)

Validation predicates (`isValidName`, `isValidReason`, `canTransition`) live in `domain/validation/rules.ts` and are imported by **both** backend API routes and frontend forms.

- **Pro**: Single source of truth - rules can never drift between frontend and backend
- **Con**: Technically violates hexagonal architecture (frontend imports from domain)
- **Verdict**: Conscious trade-off documented in README - pragmatism over purity at this scale

### 4.4 Frontend Architecture

| Feature | Technology | Purpose |
|---|---|---|
| Data Fetching | TanStack Query v5 | Automatic caching, retry, invalidation |
| Optimistic Updates | React 19 `useOptimistic` + `useTransition` | Instant drag-and-drop feedback |
| Drag & Drop | @dnd-kit | Kanban board with keyboard navigation |
| UI Components | shadcn/ui + Radix | Accessible, consistent design system |
| Error Handling | React Error Boundary | Graceful failure recovery |
| Inline Validation | Custom `useFieldValidation` hook | Real-time form feedback using shared rules |

### 4.5 Repository Pattern (Pluggable Persistence)

```
CandidateRepository (Port/Interface)
    |
    +-- InMemoryCandidateRepository  (default, no setup needed)
    |
    +-- NeonCandidateRepository      (PostgreSQL via Drizzle ORM)

RepositoryFactory --> selects implementation based on DATABASE_URL env var
```

- **In-memory**: Fast, pre-seeded with sample data, no external dependencies
- **Neon PostgreSQL**: Production-grade, persistent, serverless-compatible
- **Lazy loading**: Neon driver only imported when DATABASE_URL is set

### 4.6 Accessibility

- ARIA live regions for drag-and-drop announcements
- Keyboard navigation for kanban board
- Screen reader support
- Focus management on interactions
- WCAG 2.1 audit findings addressed in dedicated commit

---

## 5. Testing Strategy

### Test Pyramid

```
         /  E2E  \           9 Playwright scenarios (full user workflows)
        /----------\
       / Component  \        6+ React Testing Library tests
      /--------------\
     /  Integration   \      8+ API route tests (HTTP status codes)
    /------------------\
   /  Infrastructure    \    6+ repository contract tests
  /----------------------\
 /    Domain (Unit)       \  15+ model + validation tests
/==========================\
```

### Layer Details

| Layer | What's Tested | Framework |
|---|---|---|
| **Domain** | Candidate creation, state transitions, validation guards, error throwing | Vitest |
| **Validation** | `isValidName`, `isValidReason`, `canTransition` predicates | Vitest |
| **Infrastructure** | Repository CRUD operations, both in-memory and Neon adapters | Vitest |
| **Integration** | API routes return correct status codes (200, 201, 400, 404, 409) | Vitest |
| **Component** | Form validation, rendering, user interactions | Vitest + Testing Library |
| **E2E** | Create candidate, shortlist, reject, business rule enforcement, drag-and-drop | Playwright |

**Total: 50+ test cases** across all layers.

**Key decision**: No mocking of the data layer - the in-memory store is fast enough to use directly in tests, giving higher confidence than mocked tests.

---

## 6. DevOps & CI/CD

### Pipeline (GitHub Actions)

Every PR to `main` runs:
1. TypeScript strict type checking
2. ESLint linting
3. Prettier format verification
4. Vitest unit + integration tests
5. Playwright E2E tests

### Quality Gates

| Gate | Tool |
|---|---|
| Pre-commit hooks | Husky + lint-staged (format + lint on staged files) |
| Commit messages | Commitlint (conventional commits) |
| Automated review | CodeRabbit AI reviewer on every PR |
| CI/CD | GitHub Actions (all checks must pass) |
| Deployment | Vercel (automatic from main) |

---

## 7. Key Design Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| **Tooling before features** | Guardrails must exist before code grows; retrofitting is painful |
| **Tests before fixes** | Failing tests = exact specification; prevents over-engineering |
| **Hexagonal architecture** | Clean separation, but kept lightweight (no unnecessary layers) |
| **No application layer** | Only 1 domain; Next.js API routes serve as the driving adapter |
| **Shared validation** | Anti-pattern acknowledged, but single source of truth > theoretical purity |
| **In-memory default** | Zero-setup development; Neon is opt-in for production |
| **Numeric IDs (not UUIDs)** | Kept from prototype; would use UUIDs in real production |
| **E2E tests last** | Written after UI stabilized to avoid test churn |

---

## 8. Technologies Used

### Core Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict mode)

### Frontend
- TanStack Query v5, @dnd-kit, shadcn/ui, Radix UI, Tailwind CSS 4, Lucide Icons, Sonner (toasts)

### Backend
- Drizzle ORM, Neon PostgreSQL serverless driver

### Testing
- Vitest, React Testing Library, Playwright

### DevOps
- ESLint (flat config), Prettier, Husky, lint-staged, Commitlint, GitHub Actions, CodeRabbit, Vercel

---

## 9. What Was Evaluated vs What Was Delivered

| Evaluation Criteria | How It Was Addressed |
|---|---|
| **Architecture & Design** | Hexagonal architecture with domain/infrastructure/app layers, repository pattern, factory pattern |
| **Domain-Driven Design** | Encapsulated Candidate aggregate, typed domain errors, transition guards, factory method |
| **Code Quality** | Strict TypeScript, SOLID principles, clean error handling, no `any` types |
| **Full-Stack Skills** | Backend (domain model, API design, DB adapter) + Frontend (Kanban board, DnD, optimistic UI, accessibility) |
| **Problem-Solving** | Systematic approach: tooling -> tests -> fixes -> features -> polish |
| **Tool Usage** | AI-assisted development, CodeRabbit reviews, comprehensive CI/CD |

---

## 10. Strengths to Highlight in Presentation

1. **Disciplined methodology** - Didn't jump to coding; established tooling and tests first
2. **Domain model owns its rules** - Business logic is testable in isolation, not scattered across routes
3. **Single source of truth for validation** - Frontend and backend can never disagree on rules
4. **Production-grade UX** - Kanban board with drag-and-drop, optimistic updates, inline validation, accessibility
5. **Comprehensive testing** - 50+ tests across 5 layers, no mocking of data layer
6. **CI/CD pipeline** - Nothing merges without all quality checks passing
7. **Pluggable persistence** - Swap between in-memory and PostgreSQL with an env var
8. **Incremental delivery** - 8 focused PRs, each independently reviewable and deployable
9. **Documented decisions** - README + dev-log explain the *why* behind every architectural choice
10. **Live deployment** - Working demo on Vercel proves everything works end-to-end
