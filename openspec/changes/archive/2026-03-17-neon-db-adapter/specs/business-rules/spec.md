## MODIFIED Requirements

### Requirement: Candidate name validation
The system SHALL reject candidate creation when the name is empty or whitespace-only, throwing a `ValidationError`. The validation logic SHALL be delegated to `isValidName` from `src/domain/validation/`.

#### Scenario: Empty name rejected
- **WHEN** `Candidate.create(id, '')` is called
- **THEN** a `ValidationError` is thrown with a message indicating the name is required

#### Scenario: Whitespace-only name rejected
- **WHEN** `Candidate.create(id, '   ')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Valid name accepted
- **WHEN** `Candidate.create(id, 'Alice Johnson')` is called
- **THEN** a `Candidate` is returned with status `NEW`, reason `null`, and decisionDate `null`

### Requirement: Reason validation
The system SHALL reject transition attempts when the reason is shorter than 10 characters, throwing a `ValidationError`. The validation logic SHALL be delegated to `isValidReason` from `src/domain/validation/`.

#### Scenario: Short reason rejected on shortlist
- **WHEN** `candidate.shortlist('short')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Short reason rejected on reject
- **WHEN** `candidate.reject('no')` is called
- **THEN** a `ValidationError` is thrown

#### Scenario: Reason of exactly 10 characters accepted
- **WHEN** `candidate.shortlist('1234567890')` is called on a `NEW` candidate
- **THEN** the transition succeeds and `reason` is `'1234567890'` and `decisionDate` is set

## ADDED Requirements

### Requirement: Decision stores reason and date
The system SHALL store the `reason` string and a `decisionDate` timestamp on the `Candidate` model when `shortlist()` or `reject()` is called. New candidates SHALL have `reason: null` and `decisionDate: null`.

#### Scenario: Reason and date stored on shortlist
- **WHEN** `candidate.shortlist('Great candidate for the engineering role')` is called on a NEW candidate
- **THEN** `candidate.reason` equals `'Great candidate for the engineering role'`
- **AND** `candidate.decisionDate` is a `Date` close to the current time

#### Scenario: Reason and date stored on reject
- **WHEN** `candidate.reject('Not enough relevant experience')` is called on a NEW candidate
- **THEN** `candidate.reason` equals `'Not enough relevant experience'`
- **AND** `candidate.decisionDate` is a `Date` close to the current time

#### Scenario: New candidate has null reason and date
- **WHEN** `Candidate.create('c_1', 'Alice')` is called
- **THEN** `candidate.reason` is `null`
- **AND** `candidate.decisionDate` is `null`

### Requirement: Candidate rehydration with reason and date
The `Candidate.create()` factory SHALL accept optional `reason` and `decisionDate` parameters for rehydrating from persistence.

#### Scenario: Rehydration with all fields
- **WHEN** `Candidate.create('c_1', 'Alice', 'SHORTLISTED', 'Great fit', new Date('2025-01-15'))` is called
- **THEN** the candidate has status `SHORTLISTED`, reason `'Great fit'`, and the given decisionDate

### Requirement: canTransitionTo instance method
The `Candidate` class SHALL have a `canTransitionTo(target: CandidateStatus): boolean` method that returns `true` if the candidate can transition from its current status to the target status.

#### Scenario: NEW can transition to SHORTLISTED
- **WHEN** `candidate.canTransitionTo('SHORTLISTED')` is called on a NEW candidate
- **THEN** `true` is returned

#### Scenario: NEW can transition to REJECTED
- **WHEN** `candidate.canTransitionTo('REJECTED')` is called on a NEW candidate
- **THEN** `true` is returned

#### Scenario: NEW cannot transition to NEW
- **WHEN** `candidate.canTransitionTo('NEW')` is called on a NEW candidate
- **THEN** `false` is returned

#### Scenario: Terminal status cannot transition
- **WHEN** `candidate.canTransitionTo('REJECTED')` is called on a SHORTLISTED candidate
- **THEN** `false` is returned

### Requirement: API responses include reason and decisionDate
All candidate API responses SHALL include `reason` (string | null) and `decisionDate` (ISO string | null) in the `CandidateDTO`.

#### Scenario: GET returns reason and decisionDate
- **WHEN** `GET /api/candidates` is called
- **THEN** each candidate object includes `reason` and `decisionDate` fields

#### Scenario: Decision response includes reason and decisionDate
- **WHEN** a successful `POST /api/candidates/:id/decision` is made
- **THEN** the response includes the stored `reason` and `decisionDate` as ISO string
