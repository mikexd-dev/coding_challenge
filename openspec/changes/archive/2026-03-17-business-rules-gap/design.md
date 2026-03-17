## Context

The Candidate domain model is currently anemic — a plain data class with `public status` that anyone can mutate directly. Business logic (decision-to-status mapping) lives in the route handler (`[id]/decision/route.ts`), and there is zero validation for names, reasons, or state transitions. A TDD test suite with 10 intentionally failing tests documents exactly what's missing.

The hexagonal structure already exists (`domain/`, `infrastructure/`, `application/`), but the domain layer has no behavior — it's just types and a data bag. This change fills in the domain layer with real business rules.

## Goals / Non-Goals

**Goals:**
- Candidate model encapsulates all business rules (transitions, validation)
- Domain errors are typed and map cleanly to HTTP status codes
- All 10 failing TDD tests pass without modifying the test files
- Route handlers delegate to domain logic, don't contain it

**Non-Goals:**
- Application service layer (Step 3 of the roadmap — separate PR)
- Repository port/interface and dependency inversion (Step 4)
- Thinning route handlers to pure adapters (Step 5)
- Changing API request/response contracts
- Adding new endpoints or features

## Decisions

### 1. Private status with getter, not readonly

**Decision:** Change `public status` to `private _status` with a `get status()` getter.

**Why:** The domain model must control its own state transitions. A public setter allows anyone to write `candidate.status = 'REJECTED'` from anywhere, bypassing all guards. A private field forces all transitions through `shortlist()` and `reject()`.

**Alternative considered:** Using `readonly` — rejected because the model itself needs to mutate status during valid transitions.

### 2. Domain error class hierarchy

**Decision:** Create a base `DomainError` class with three subclasses:
- `ValidationError` — invalid input (empty name, short reason)
- `InvalidTransitionError` — illegal state transition (shortlist a rejected candidate)
- `CandidateNotFoundError` — entity lookup failure

**Why:** Typed errors let route handlers map to HTTP codes mechanically (`ValidationError → 400`, `InvalidTransitionError → 409`, `CandidateNotFoundError → 404`) instead of parsing error message strings. Each error carries a descriptive message for debugging.

**Alternative considered:** String-based errors with status code hints — rejected because it's fragile and couples the domain to HTTP concepts.

### 3. Validation lives in the domain model, not route handlers

**Decision:** `Candidate.create()` validates name. `shortlist(reason)` and `reject(reason)` validate reason length and transition legality.

**Why:** This is the core DDD principle — the domain protects its own invariants. If validation lives in route handlers, a future caller (CLI tool, service, test) could bypass it. The domain model is the single source of truth for "what makes a valid candidate."

### 4. Route handlers catch domain errors and map to HTTP

**Decision:** Route handlers wrap service calls in try/catch and map `DomainError` subclasses to HTTP status codes. The existing `ErrorResponse` type (`{ error: string }`) is preserved.

**Why:** This keeps the API contract unchanged while giving callers more specific error messages. The route handler's job becomes: parse request → call domain → catch errors → return response.

### 5. Transition rule: only NEW → SHORTLISTED or NEW → REJECTED

**Decision:** Both transitions are one-way from `NEW`. Once shortlisted or rejected, the status is final.

**Why:** This matches the business requirement documented in the UI and test suite. There is no "undo" flow in the current spec.

## Risks / Trade-offs

- **Breaking `public status` access** → Any code that writes `candidate.status = x` will break at compile time. Mitigation: search for all usages (only in route handlers and tests) and update them to use domain methods. The tests already expect the new methods.
- **Error message coupling** → Some tests assert on specific error messages. Mitigation: use stable, descriptive messages and only assert on status codes in API tests.
- **Route handler complexity temporarily increases** → Adding try/catch error mapping before the application service layer exists means route handlers are still fat. Mitigation: this is explicitly temporary — the next PR introduces `CandidateService` and thins the handlers.
