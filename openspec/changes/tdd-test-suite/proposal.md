## Why

The codebase has zero tests and critical business rules that are NOT enforced (status transition guards, reason validation, name validation). Before implementing the missing validations, we write tests that specify the expected behavior — tests for unenforced rules will fail (red), proving the gap. This TDD approach documents what works, what doesn't, and creates a safety net for the implementation phase. We also add GitHub Actions CI to run tests on every push.

## What Changes

- **Domain unit tests** — test `Candidate` model behavior:
  - Creation with valid/invalid inputs (empty name should fail — currently doesn't)
  - Status transitions via domain methods (shortlist, reject — methods don't exist yet, tests will fail)
  - Transition guards: cannot shortlist rejected, cannot reject shortlisted (will fail)
  - Reason validation: minimum 10 characters (will fail)
- **Infrastructure unit tests** — test in-memory storage:
  - CRUD operations (getAllCandidates, getCandidateById, saveCandidate, generateNextId)
  - These should pass — storage layer works correctly
- **API integration tests** — test route handlers end-to-end:
  - GET /api/candidates — list candidates (should pass)
  - POST /api/candidates — create candidate (should pass for valid, fail for empty name validation)
  - POST /api/candidates/[id]/decision — status transitions (should fail for business rule violations)
  - Error responses: 404 for missing candidate (should pass), 400 for invalid decision (should pass)
- **Frontend component tests** — React Testing Library:
  - Render candidate list
  - Create candidate form interaction
  - Decision form interaction
  - Error display
- **GitHub Actions CI** — `.github/workflows/test.yml` running lint, typecheck, and tests on push/PR
- **Install test dependencies** — @testing-library/react, @testing-library/jest-dom, jsdom

## Capabilities

### New Capabilities
- `test-suite`: Vitest unit tests for domain and infrastructure, API integration tests for route handlers, React Testing Library component tests, and GitHub Actions CI pipeline

### Modified Capabilities
<!-- None -->

## Impact

- **New test files** in `src/__tests__/` organized by layer (domain, infrastructure, api, ui)
- **New dev dependencies** — @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom
- **New CI workflow** — `.github/workflows/test.yml`
- **vitest.config.ts** may need updates for jsdom environment (frontend tests)
- **Expected failing tests** — business rule tests will fail intentionally to document the implementation gap. These will go green when business rules are implemented in a subsequent change.
- **No production code changes** — this change only adds tests and CI
