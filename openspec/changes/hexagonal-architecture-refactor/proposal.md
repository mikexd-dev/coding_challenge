## Why

The current codebase has all code in a flat structure with no architectural boundaries — models, data access, contracts, and route handlers sit alongside each other with no layering. The challenge evaluates architecture and separation of concerns. This change restructures into a lightweight hexagonal layout so that subsequent changes (business rules, domain enrichment, frontend refactor) land in the correct layer from the start.

## What Changes

- **Restructure `src/` to lightweight hexagonal layout**:
  - `domain/` — domain models and types (move `models/candidate.ts`, `contracts/candidate.ts`)
  - `application/` — thin service layer placeholder (empty for now, signals intent)
  - `infrastructure/` — data access adapters (move `data/storage.ts`)
  - `app/` — Next.js route handlers and pages (already here, stays)
  - `ui/` — frontend API client (already here, stays)
- **Move existing files** into the new structure with updated import paths
- **No behavioral changes** — no new business rules, no domain errors, no frontend refactor, no new code beyond what's needed to make imports resolve

## Capabilities

### New Capabilities
- `hexagonal-structure`: Folder layout following lightweight hexagonal architecture with domain-driven intent — establishes the layered directory structure for all subsequent work

### Modified Capabilities
<!-- None — no existing specs -->

## Impact

- **All import paths change** — `@/models/candidate` → `@/domain/models/candidate`, `@/data/storage` → `@/infrastructure/persistence/storage`, `@/contracts/candidate` → `@/domain/types/candidate`
- **API contract unchanged** — all endpoints behave identically
- **Frontend unchanged** — no component refactoring
- **Zero new functionality** — purely structural
- **Depends on**: `project-tooling-setup` (completed)
