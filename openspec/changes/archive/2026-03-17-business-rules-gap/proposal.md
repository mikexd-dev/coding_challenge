## Why

The Candidate domain model is anemic — it's a pure data bag with no behavior, no validation, and no transition guards. Business rules (shortlisting, rejecting, name/reason validation) are either missing entirely or scattered in route handlers. The TDD test suite we wrote has 10 intentionally failing tests that prove these gaps exist. This is the core of the application and must be fixed before any further architecture work.

## What Changes

- Add `shortlist(reason)` and `reject(reason)` methods to the `Candidate` domain model
- Make `status` private with a getter — prevent direct external mutation
- Add name validation in `Candidate.create()` (reject empty/whitespace-only names)
- Add reason validation in transition methods (minimum 10 characters)
- Add transition guards: only `NEW` candidates can be shortlisted or rejected
- Create typed domain errors: `ValidationError`, `InvalidTransitionError`, `CandidateNotFoundError`
- Update route handlers to catch domain errors and map them to HTTP status codes (400, 404, 409)

## Capabilities

### New Capabilities
- `business-rules`: Domain model behavior (shortlist/reject methods, transition guards, input validation) and typed domain errors with HTTP error mapping

### Modified Capabilities
<!-- None — hexagonal structure changes deferred to a separate PR -->

## Impact

- **Domain model** (`src/domain/models/candidate.ts`): Major rewrite — private status, behavior methods, validation
- **New domain errors** (`src/domain/errors/`): New directory with error classes
- **Route handlers** (`src/app/api/candidates/route.ts`, `src/app/api/candidates/[id]/decision/route.ts`): Add error catching and HTTP status mapping; remove inline business logic from decision route
- **Tests**: All 10 `.fails()` tests in `candidate.test.ts` and `candidates.test.ts` should flip to passing
- **No breaking API changes**: Same endpoints, same request/response shapes — only error responses become more specific
