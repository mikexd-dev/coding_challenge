## Context

The hexagonal architecture has two separate hexagons connected by HTTP: the backend (API routes → domain model → storage) and the frontend (React page → service layer → fetch). They already share types via `src/domain/types/candidate.ts` as the API contract.

Validation rules currently live only inside the `Candidate` model methods as inline checks. The frontend has no awareness of these rules — it submits forms blindly and relies on HTTP error responses. The `ui/api/candidates.ts` service layer exists but the page doesn't use it.

## Goals / Non-Goals

**Goals:**
- Single source of truth for validation rules, shared across backend and frontend
- Client-side validation that gives immediate feedback before hitting the API
- Frontend uses the existing service layer instead of inline fetch calls
- Clean up unnecessary scaffolding (empty `application/` directory)

**Non-Goals:**
- Changing any existing API contracts or HTTP response shapes
- Adding new API endpoints
- Introducing a form library or state management beyond what exists
- Application service layer — not needed for single-adapter architecture

## Decisions

### 1. Shared validation as pure functions in `src/domain/validation/`

**Decision:** Create a validation module exporting pure functions (`isValidName`, `isValidReason`, `canTransition`) and constants (`MIN_REASON_LENGTH`). Both the `Candidate` model and frontend components import from here.

**Why:** Pure functions with no class/domain imports are safe to share across the HTTP boundary. The frontend gets the rules without importing backend domain objects. The backend model remains the authoritative enforcer — shared functions are the rules, the model is the judge.

**Alternative considered:** Duplicating rules on the frontend — rejected because they'd drift out of sync immediately.

### 2. Candidate model delegates to shared functions, keeps throwing errors

**Decision:** Refactor `shortlist()` and `reject()` to call the shared validation functions, but keep the `ValidationError` / `InvalidTransitionError` throwing behavior in the model itself.

**Why:** The shared functions return booleans (predicates). The model decides what to do when validation fails (throw typed domain errors). This keeps the domain error hierarchy as a backend concern while the validation predicates are universal.

### 3. Frontend validates on input, still submits to API

**Decision:** The frontend uses shared validation functions to show inline error messages and disable submit buttons. The API call still happens — the backend remains the authority. Client-side validation is a UX convenience, not a security boundary.

**Why:** Defense in depth. The frontend prevents obvious mistakes. The backend enforces invariants. Neither trusts the other.

### 4. Hide decision form for non-NEW candidates

**Decision:** Use `canTransition(status)` from the shared module to conditionally render the decision form. If a candidate is already SHORTLISTED or REJECTED, the form doesn't appear.

**Why:** Showing a form for an impossible action is confusing UX. The shared `canTransition` function ensures the UI stays consistent with the business rule without hardcoding status checks in the component.

### 5. Refactor page.tsx to use ui/api/candidates.ts

**Decision:** Replace all inline `fetch()` calls in `page.tsx` with imports from `ui/api/candidates.ts` (`getAllCandidates`, `createCandidate`, `submitDecision`).

**Why:** The service layer already exists and handles error extraction. Using it removes duplicated fetch logic and keeps the page focused on UI state, not HTTP mechanics.

### 6. Delete empty `application/` directory

**Decision:** Remove `src/application/` entirely.

**Why:** In this Next.js app the API routes are the driving adapter — they call the domain model directly. An application service layer would only be needed if we had multiple driving adapters sharing orchestration logic. Empty directories create false expectations about architecture.

## Risks / Trade-offs

- **Shared module import path** — Both frontend and backend import from `@/domain/validation/`. This works because Next.js compiles both sides from the same `src/` tree. If the project ever splits into separate packages, this module would need to move to a shared package. Mitigation: the module is pure functions with zero dependencies, easy to extract later.
- **Validation divergence risk** — If someone adds a new rule to the model but forgets to update the shared module, frontend and backend will disagree. Mitigation: the model imports from the shared module, so rules flow one direction. Tests verify both sides use the same constants.
- **No form library** — Inline validation without a form library means manual state management for error messages. Mitigation: the form is small (2 inputs), a library would be over-engineering. If the form grows, revisit.
