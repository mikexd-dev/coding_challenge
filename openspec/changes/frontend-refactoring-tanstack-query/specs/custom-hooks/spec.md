## ADDED Requirements

### Requirement: useCandidates hook encapsulates all candidate data operations
The `useCandidates` hook SHALL return the candidate list, loading state, error state, and mutation functions for creating candidates and submitting decisions.

#### Scenario: Hook returns query data
- **WHEN** `useCandidates()` is called
- **THEN** it returns `{ candidates, isLoading, error, createCandidate, submitDecision }`

#### Scenario: Candidates are fetched on mount
- **WHEN** the component using `useCandidates` mounts
- **THEN** `getAllCandidates()` is called via `useQuery`
- **AND** `candidates` is populated with the result

#### Scenario: createCandidate invalidates the list
- **WHEN** `createCandidate.mutate(name)` is called and succeeds
- **THEN** the `['candidates']` query is invalidated and refetched

#### Scenario: submitDecision applies optimistic update
- **WHEN** `submitDecision.mutate({ candidateId, decision, reason })` is called
- **THEN** the cache is optimistically updated before the API responds

### Requirement: useCandidateSheet hook encapsulates sheet UI state
The `useCandidateSheet` hook SHALL manage the sheet's open state, selected candidate ID, and pre-filled decision.

#### Scenario: Hook returns sheet state and methods
- **WHEN** `useCandidateSheet()` is called
- **THEN** it returns `{ sheetState, openFromClick, openFromDrop, close }`

#### Scenario: openFromClick sets candidateId without prefill
- **WHEN** `openFromClick(id)` is called
- **THEN** `sheetState` becomes `{ open: true, candidateId: id, prefilledDecision: null }`

#### Scenario: openFromDrop sets candidateId with prefill
- **WHEN** `openFromDrop(id, 'SHORTLIST')` is called
- **THEN** `sheetState` becomes `{ open: true, candidateId: id, prefilledDecision: 'SHORTLIST' }`

#### Scenario: close resets sheet state
- **WHEN** `close()` is called
- **THEN** `sheetState` becomes `{ open: false, candidateId: null, prefilledDecision: null }`

### Requirement: useFieldValidation hook encapsulates field validation logic
The `useFieldValidation` hook SHALL accept a validator function and error message, and return field value, error state, validity, and a change handler.

#### Scenario: Hook returns field state
- **WHEN** `useFieldValidation(isValidName, 'Name is required')` is called
- **THEN** it returns `{ value, error, isValid, handleChange, reset }`

#### Scenario: Invalid input shows error
- **WHEN** `handleChange('')` is called with a value that fails validation
- **THEN** `error` is set to the provided error message
- **AND** `isValid` is `false`

#### Scenario: Valid input clears error
- **WHEN** `handleChange('Alice')` is called with a value that passes validation
- **THEN** `error` is `null`
- **AND** `isValid` is `true`

#### Scenario: reset clears value and error
- **WHEN** `reset()` is called
- **THEN** `value` is set to `''`
- **AND** `error` is set to `null`
