## Why

The current codebase has business logic embedded directly in Next.js route handlers, an anemic domain model (`Candidate` is a data bag with public mutable status), no repository abstraction, and zero business rule enforcement. The challenge explicitly evaluates architecture, DDD, and separation of concerns. This change restructures into lightweight hexagonal architecture with domain-driven intent — clean boundaries without over-engineering for the scope.

## What Changes

- **Restructure `src/` to lightweight hexagonal layout**:
  - `domain/` — pure business logic, zero framework imports
  - `application/` — thin service layer orchestrating domain operations
  - `infrastructure/` — adapters implementing domain ports (repository)
  - `app/` — Next.js route handlers as thin HTTP translation (driving adapter)
  - `ui/` — frontend components and API client (driving adapter)
- **Enrich the domain model** — `Candidate` becomes a proper aggregate with encapsulated status, transition methods (`shortlist(reason)`, `reject(reason)`), and domain-specific error types
- **Enforce business rules in the domain layer** — status transition guards (cannot shortlist rejected, cannot reject shortlisted), reason minimum 10 chars, proper validation
- **Introduce repository port/adapter** — `CandidateRepository` interface in domain, `InMemoryCandidateRepository` in infrastructure
- **Add application service** — single `CandidateService` orchestrating fetch → domain method → persist, keeping route handlers to HTTP concerns only
- **Domain error → HTTP mapping** — typed domain errors (`InvalidTransitionError`, `ValidationError`, `CandidateNotFoundError`) mapped to 400/404/409 in route handlers
- **Frontend refactor** — extract components from monolithic page.tsx, wire to existing `ui/api/candidates.ts` (currently unused), add client-side validation, disable invalid actions in UI
- **Add README** documenting architecture decisions, testing strategy, and approach

## Capabilities

### New Capabilities
- `candidate-management`: Domain aggregate, business rules, status transitions, repository port/adapter, application service, CRUD operations — the full vertical slice from domain to UI

### Modified Capabilities
<!-- None — no existing specs -->

## Impact

- **All source files** restructured into new directory layout — every import path changes
- **API contract unchanged** — `/api/candidates` GET/POST and `/api/candidates/[id]/decision` POST remain identical from the client's perspective
- **Domain model becomes the source of truth** for business rules — route handlers and frontend become thin wiring
- **Frontend** — component extraction from monolithic page.tsx, improved UX with validation feedback and disabled invalid transitions
- **Depends on**: `project-tooling-setup` (tooling guardrails should be in place first)
