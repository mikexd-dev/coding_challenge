## Context

Current structure is flat:
```
src/
  app/           # Next.js routes + API routes
  contracts/     # DTOs and type definitions
  models/        # Candidate class
  data/          # In-memory Map store
  ui/            # Frontend API client
  __tests__/     # Empty
```

All layers sit at the same level with no architectural boundaries. This change moves files into a hexagonal layout so that subsequent changes (business rules, domain errors, service layer, frontend refactor) land in the correct layer.

## Goals / Non-Goals

**Goals:**
- Establish `domain/`, `application/`, `infrastructure/` directory structure
- Move existing files into correct layers
- Update all import paths to resolve correctly
- All existing functionality works identically after restructuring
- Pass all tooling checks (TypeScript, ESLint, Prettier, build)

**Non-Goals:**
- Adding business rule enforcement or validation
- Enriching the domain model (encapsulation, transition methods)
- Creating domain error types
- Adding repository interface/port (just move the concrete storage)
- Frontend component refactoring
- Adding tests
- Any behavioral changes whatsoever

## Decisions

### 1. File mapping strategy
**Choice**: Move files, don't copy. Delete old locations.

| Current | New | Rationale |
|---------|-----|-----------|
| `models/candidate.ts` | `domain/models/candidate.ts` | Domain entity belongs in domain layer |
| `contracts/candidate.ts` | `domain/types/candidate.ts` | DTOs and types are domain contracts |
| `data/storage.ts` | `infrastructure/persistence/storage.ts` | Data access is an infrastructure concern |
| `app/` | `app/` (stays) | Next.js requires this location for routing |
| `ui/` | `ui/` (stays) | Already correctly placed |
| `__tests__/` | `__tests__/` (stays) | Will be organized per-layer in future changes |

**Alternative**: Rename `contracts/` to `domain/types/` in-place — rejected because we want the full hexagonal directory tree visible from the start.

### 2. Empty `application/` directory
**Choice**: Create `application/` with a `.gitkeep` file.
**Rationale**: Signals architectural intent. The service layer will be added in a subsequent change. Without it, the hexagonal layout looks incomplete to a reviewer.

### 3. `domain/types/` vs `domain/contracts/`
**Choice**: `domain/types/`
**Rationale**: "contracts" implies external API boundaries. These are domain-level type definitions (status enums, DTOs, request/response shapes). "types" is more accurate for TypeScript and doesn't overload the term.

### 4. `infrastructure/persistence/` vs `infrastructure/`
**Choice**: Nest under `persistence/` subdirectory.
**Rationale**: Infrastructure may later include other adapters (e.g., external APIs, messaging). Starting with a subdirectory prevents future restructuring.

## Risks / Trade-offs

- **All imports break at once** → Mitigation: single atomic change, run `tsc --noEmit` to verify all paths resolve before committing.
- **Next.js `app/` directory must stay** → No risk, we're not moving it. Only internal imports from `app/` route handlers change.
- **Empty `application/` may look premature** → Mitigation: `.gitkeep` + the proposal explains this is scaffolding for subsequent work.
