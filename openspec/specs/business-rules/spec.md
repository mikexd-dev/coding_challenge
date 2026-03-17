## ADDED Requirements

### Requirement: Candidate name validation
The system SHALL reject candidate creation when the name is empty or whitespace-only, throwing a `ValidationError`.

#### Scenario: Empty name rejected
- **WHEN** `Candidate.create(id, '')` is called
- **THEN** a `ValidationError` is thrown with a message indicating the name is required

#### Scenario: Whitespace-only name rejected
- **WHEN** `Candidate.create(id, '   ')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Valid name accepted
- **WHEN** `Candidate.create(id, 'Alice Johnson')` is called
- **THEN** a `Candidate` is returned with status `NEW`

### Requirement: Candidate shortlist transition
The system SHALL provide a `shortlist(reason)` method on the `Candidate` model that transitions status from `NEW` to `SHORTLISTED`.

#### Scenario: Shortlist a NEW candidate
- **WHEN** `candidate.shortlist('Great candidate for the engineering role')` is called on a candidate with status `NEW`
- **THEN** the candidate's status becomes `SHORTLISTED`

#### Scenario: Shortlist a REJECTED candidate is blocked
- **WHEN** `candidate.shortlist(reason)` is called on a candidate with status `REJECTED`
- **THEN** an `InvalidTransitionError` is thrown

#### Scenario: Shortlist a SHORTLISTED candidate is blocked
- **WHEN** `candidate.shortlist(reason)` is called on a candidate with status `SHORTLISTED`
- **THEN** an `InvalidTransitionError` is thrown

### Requirement: Candidate reject transition
The system SHALL provide a `reject(reason)` method on the `Candidate` model that transitions status from `NEW` to `REJECTED`.

#### Scenario: Reject a NEW candidate
- **WHEN** `candidate.reject('Not enough relevant experience')` is called on a candidate with status `NEW`
- **THEN** the candidate's status becomes `REJECTED`

#### Scenario: Reject a SHORTLISTED candidate is blocked
- **WHEN** `candidate.reject(reason)` is called on a candidate with status `SHORTLISTED`
- **THEN** an `InvalidTransitionError` is thrown

#### Scenario: Reject a REJECTED candidate is blocked
- **WHEN** `candidate.reject(reason)` is called on a candidate with status `REJECTED`
- **THEN** an `InvalidTransitionError` is thrown

### Requirement: Reason validation
The system SHALL reject transition attempts when the reason is shorter than 10 characters, throwing a `ValidationError`.

#### Scenario: Short reason rejected on shortlist
- **WHEN** `candidate.shortlist('short')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Short reason rejected on reject
- **WHEN** `candidate.reject('no')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Reason of exactly 10 characters accepted
- **WHEN** `candidate.shortlist('1234567890')` is called on a `NEW` candidate
- **THEN** the transition succeeds

### Requirement: Typed domain errors
The domain layer SHALL define typed error classes that extend a base `DomainError`: `ValidationError`, `InvalidTransitionError`, and `CandidateNotFoundError`.

#### Scenario: ValidationError is a DomainError
- **WHEN** a `ValidationError` is thrown
- **THEN** it is an instance of `DomainError` and carries a descriptive `message`

#### Scenario: InvalidTransitionError is a DomainError
- **WHEN** an `InvalidTransitionError` is thrown
- **THEN** it is an instance of `DomainError` and carries a descriptive `message`

#### Scenario: CandidateNotFoundError is a DomainError
- **WHEN** a `CandidateNotFoundError` is thrown
- **THEN** it is an instance of `DomainError` and carries a descriptive `message`

### Requirement: API error mapping
Route handlers SHALL catch domain errors and map them to appropriate HTTP status codes.

#### Scenario: ValidationError maps to 400
- **WHEN** a `POST /api/candidates` request is sent with `{ name: '' }`
- **THEN** the response status is `400` with an error message

#### Scenario: InvalidTransitionError maps to 409
- **WHEN** a `POST /api/candidates/c_1/decision` request attempts to shortlist a `REJECTED` candidate
- **THEN** the response status is `409` with an error message

#### Scenario: CandidateNotFoundError maps to 404
- **WHEN** a `POST /api/candidates/nonexistent/decision` request is sent
- **THEN** the response status is `404` with an error message

#### Scenario: Reason validation maps to 400 at API level
- **WHEN** a `POST /api/candidates/c_1/decision` request is sent with a reason shorter than 10 characters
- **THEN** the response status is `400` with an error message

### Requirement: Candidate status is encapsulated
The `Candidate` class SHALL NOT expose a public writable `status` property. Status MUST only be readable via a getter and changeable via `shortlist()` and `reject()` methods.

#### Scenario: Status is readable
- **WHEN** `candidate.status` is accessed
- **THEN** the current status value is returned

#### Scenario: Status is not directly writable
- **WHEN** external code attempts to assign `candidate.status = 'REJECTED'`
- **THEN** a TypeScript compilation error occurs
