## Why

Validation rules (name not empty, reason >= 10 chars, only NEW can transition) are hardcoded inside the backend `Candidate` model. The frontend has zero client-side validation — users submit invalid data, hit the API, and only then see errors. Additionally, the frontend page (`page.tsx`) bypasses the existing `ui/api/candidates.ts` service layer with inline `fetch()` calls, and the `application/` directory is empty scaffolding that adds confusion to the hexagonal structure.

## What Changes

- Extract shared validation rules (pure functions + constants) into `src/domain/validation/` — importable by both backend domain model and frontend components
- Refactor `Candidate` model to delegate to shared validation functions instead of inline checks
- Add client-side validation in the frontend using the shared rules (disable submit, show inline errors)
- Refactor `page.tsx` to use the existing `ui/api/candidates.ts` service layer instead of raw `fetch()` calls
- Remove empty `application/` directory — unnecessary for current single-adapter architecture
- Hide the decision form when a candidate's status is not `NEW` (prevents impossible transitions)

## Capabilities

### New Capabilities
- `shared-validation`: Pure validation functions and constants (`isValidName`, `isValidReason`, `canTransition`, `MIN_REASON_LENGTH`) shared between backend domain model and frontend UI
- `frontend-validation`: Client-side form validation using shared rules — inline error messages, disabled submit buttons, transition-aware UI that hides the decision form for non-NEW candidates

### Modified Capabilities
- `business-rules`: Refactor `Candidate` model to delegate validation to shared functions from `src/domain/validation/` instead of inline checks — no behavioral change, same rules enforced

## Impact

- `src/domain/validation/` — new directory with shared validation module
- `src/domain/models/candidate.ts` — refactor to import from shared validation (no behavior change)
- `src/app/live-session/page.tsx` — add client-side validation, use `ui/api/candidates.ts`, hide decision form for decided candidates
- `src/ui/api/candidates.ts` — no changes expected (already correctly structured)
- `src/application/` — deleted (empty directory)
- `src/__tests__/` — new tests for shared validation, frontend validation behavior
- Existing API tests must continue to pass unchanged
