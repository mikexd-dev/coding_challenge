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
- **THEN** a `Candidate` is returned with status `NEW`

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
- **THEN** the transition succeeds
