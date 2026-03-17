## ADDED Requirements

### Requirement: Domain unit tests for Candidate model
The test suite SHALL include unit tests for the Candidate domain model covering creation, status transitions, and validation. Tests for unenforced business rules SHALL use `it.fails()` to document the gap.

#### Scenario: Create candidate with valid name
- **WHEN** `Candidate.create('c_1', 'Alice')` is called
- **THEN** a Candidate is returned with status `NEW` and the given name

#### Scenario: Create candidate with empty name fails
- **WHEN** `Candidate.create('c_1', '')` is called
- **THEN** an error is thrown (expected to fail — validation not implemented)

#### Scenario: Shortlist a NEW candidate
- **WHEN** a NEW candidate's `shortlist(reason)` method is called with a valid reason (>= 10 chars)
- **THEN** the candidate status becomes `SHORTLISTED`

#### Scenario: Reject a NEW candidate
- **WHEN** a NEW candidate's `reject(reason)` method is called with a valid reason (>= 10 chars)
- **THEN** the candidate status becomes `REJECTED`

#### Scenario: Cannot shortlist a REJECTED candidate
- **WHEN** a REJECTED candidate's `shortlist(reason)` method is called
- **THEN** an error is thrown (expected to fail — transition guard not implemented)

#### Scenario: Cannot reject a SHORTLISTED candidate
- **WHEN** a SHORTLISTED candidate's `reject(reason)` method is called
- **THEN** an error is thrown (expected to fail — transition guard not implemented)

#### Scenario: Reason must be at least 10 characters
- **WHEN** a candidate's `shortlist(reason)` is called with reason shorter than 10 characters
- **THEN** an error is thrown (expected to fail — reason validation not implemented)

### Requirement: Infrastructure unit tests for storage
The test suite SHALL include unit tests for the in-memory persistence layer. All storage tests are expected to pass.

#### Scenario: getAllCandidates returns stored candidates
- **WHEN** `getAllCandidates()` is called after seeding
- **THEN** it returns an array of all candidates in the store

#### Scenario: getCandidateById returns correct candidate
- **WHEN** `getCandidateById('c_1')` is called
- **THEN** it returns the candidate with id `c_1`

#### Scenario: getCandidateById returns null for missing id
- **WHEN** `getCandidateById('nonexistent')` is called
- **THEN** it returns `null`

#### Scenario: saveCandidate persists candidate
- **WHEN** a new candidate is saved via `saveCandidate(candidate)`
- **THEN** it can be retrieved via `getCandidateById(candidate.id)`

#### Scenario: generateNextId returns incrementing ids
- **WHEN** `generateNextId()` is called
- **THEN** it returns an id with format `c_N` where N is one greater than the current max

### Requirement: API integration tests for candidates routes
The test suite SHALL include integration tests that call route handler functions directly with constructed NextRequest objects. Tests for unenforced validations SHALL use `it.fails()`.

#### Scenario: GET /api/candidates returns candidate list
- **WHEN** the GET handler is called
- **THEN** it returns 200 with an array of CandidateDTO objects

#### Scenario: POST /api/candidates creates a candidate
- **WHEN** the POST handler is called with `{ name: 'Test User' }`
- **THEN** it returns 201 with the created candidate having status `NEW`

#### Scenario: POST /api/candidates rejects empty name
- **WHEN** the POST handler is called with `{ name: '' }`
- **THEN** it returns 400 with an error message (expected to fail — validation not implemented)

#### Scenario: POST decision shortlists a NEW candidate
- **WHEN** the decision POST handler is called with `{ decision: 'SHORTLIST', reason: 'Good candidate for role' }` for a NEW candidate
- **THEN** it returns 200 with status `SHORTLISTED`

#### Scenario: POST decision rejects a NEW candidate
- **WHEN** the decision POST handler is called with `{ decision: 'REJECT', reason: 'Not enough experience' }` for a NEW candidate
- **THEN** it returns 200 with status `REJECTED`

#### Scenario: POST decision returns 404 for missing candidate
- **WHEN** the decision POST handler is called for id `nonexistent`
- **THEN** it returns 404 with error `Candidate not found`

#### Scenario: POST decision returns 400 for invalid decision
- **WHEN** the decision POST handler is called with `{ decision: 'INVALID' }`
- **THEN** it returns 400 with error `Invalid decision`

#### Scenario: POST decision prevents shortlisting a rejected candidate
- **WHEN** the decision POST handler is called with `SHORTLIST` for a REJECTED candidate
- **THEN** it returns 409 with an error (expected to fail — transition guard not implemented)

#### Scenario: POST decision prevents rejecting a shortlisted candidate
- **WHEN** the decision POST handler is called with `REJECT` for a SHORTLISTED candidate
- **THEN** it returns 409 with an error (expected to fail — transition guard not implemented)

#### Scenario: POST decision rejects reason shorter than 10 characters
- **WHEN** the decision POST handler is called with `{ reason: 'short' }`
- **THEN** it returns 400 with an error (expected to fail — reason validation not implemented)

### Requirement: Frontend component tests
The test suite SHALL include React Testing Library tests for the LiveSession page component, testing rendering and user interactions.

#### Scenario: Renders candidate list
- **WHEN** the LiveSession component mounts with mocked API data
- **THEN** candidate names and statuses are visible in the DOM

#### Scenario: Create candidate form submits
- **WHEN** a user types a name and clicks Create
- **THEN** the API is called with the name and the list refreshes

#### Scenario: Decision form submits
- **WHEN** a user selects a candidate, chooses a decision, enters a reason, and submits
- **THEN** the API is called with the decision and reason

#### Scenario: Error message displays on API failure
- **WHEN** an API call returns an error
- **THEN** an error message is displayed to the user

### Requirement: GitHub Actions CI pipeline
The project SHALL have a GitHub Actions workflow that runs quality checks on every push and pull request.

#### Scenario: CI runs on push to main
- **WHEN** code is pushed to `main` or a PR is opened against `main`
- **THEN** the workflow runs typecheck, lint, and test steps

#### Scenario: CI fails if tests fail
- **WHEN** any test fails (excluding `it.fails()` tests which are expected)
- **THEN** the workflow reports failure

### Requirement: Store reset helper for test isolation
The storage module SHALL export a `resetStore()` function that clears and reseeds the in-memory store, enabling test isolation.

#### Scenario: resetStore clears all data
- **WHEN** `resetStore()` is called
- **THEN** the store is reset to its initial seeded state (Alice Johnson, Bob Williams)
