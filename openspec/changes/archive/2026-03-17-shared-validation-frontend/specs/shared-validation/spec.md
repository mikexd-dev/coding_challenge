## ADDED Requirements

### Requirement: Shared validation constants
The system SHALL export validation constants from `src/domain/validation/` that define the rules for candidate operations.

#### Scenario: MIN_REASON_LENGTH is defined
- **WHEN** `MIN_REASON_LENGTH` is imported from the validation module
- **THEN** its value is `10`

### Requirement: Name validation function
The system SHALL export an `isValidName` function that returns `true` for non-empty, non-whitespace-only strings.

#### Scenario: Empty string is invalid
- **WHEN** `isValidName('')` is called
- **THEN** it returns `false`

#### Scenario: Whitespace-only string is invalid
- **WHEN** `isValidName('   ')` is called
- **THEN** it returns `false`

#### Scenario: Valid name is accepted
- **WHEN** `isValidName('Alice')` is called
- **THEN** it returns `true`

### Requirement: Reason validation function
The system SHALL export an `isValidReason` function that returns `true` when the trimmed reason is at least `MIN_REASON_LENGTH` characters.

#### Scenario: Short reason is invalid
- **WHEN** `isValidReason('short')` is called
- **THEN** it returns `false`

#### Scenario: Reason of exactly 10 trimmed characters is valid
- **WHEN** `isValidReason('1234567890')` is called
- **THEN** it returns `true`

#### Scenario: Non-string reason is invalid
- **WHEN** `isValidReason` is called with a non-string value
- **THEN** it returns `false`

### Requirement: Transition check function
The system SHALL export a `canTransition` function that returns `true` only when the given status is `NEW`.

#### Scenario: NEW status can transition
- **WHEN** `canTransition('NEW')` is called
- **THEN** it returns `true`

#### Scenario: SHORTLISTED status cannot transition
- **WHEN** `canTransition('SHORTLISTED')` is called
- **THEN** it returns `false`

#### Scenario: REJECTED status cannot transition
- **WHEN** `canTransition('REJECTED')` is called
- **THEN** it returns `false`
