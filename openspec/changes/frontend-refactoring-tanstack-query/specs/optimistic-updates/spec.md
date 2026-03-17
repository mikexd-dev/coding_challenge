## ADDED Requirements

### Requirement: Decision mutation optimistically updates the candidate list
When a decision is submitted, the candidate list cache SHALL be optimistically updated to reflect the new status before the API responds.

#### Scenario: Card moves instantly on decision submit
- **WHEN** the user submits a SHORTLIST decision for a NEW candidate
- **THEN** the candidate's status in the cache is immediately set to `SHORTLISTED`
- **AND** the card appears in the SHORTLISTED column without waiting for the API response

#### Scenario: Card moves instantly on reject decision
- **WHEN** the user submits a REJECT decision for a NEW candidate
- **THEN** the candidate's status in the cache is immediately set to `REJECTED`
- **AND** the card appears in the REJECTED column without waiting for the API response

### Requirement: Sheet closes immediately on optimistic submit
The candidate sheet SHALL close as soon as the decision mutation begins, not after the API responds.

#### Scenario: Sheet closes on submit
- **WHEN** the user submits a valid decision in the sheet
- **THEN** the sheet closes immediately
- **AND** the card is already in the target column

### Requirement: Rollback on mutation error
If the decision API call fails, the candidate list cache SHALL roll back to the state before the optimistic update.

#### Scenario: Card rolls back on API error
- **WHEN** a decision mutation fails (API returns error)
- **THEN** the candidate's status reverts to its previous value in the cache
- **AND** the card moves back to its original column
- **AND** an error message is displayed to the user

### Requirement: Cache re-syncs after mutation settles
The candidate list SHALL be re-fetched from the API after any decision mutation completes, regardless of success or failure.

#### Scenario: Successful mutation triggers refetch
- **WHEN** a decision mutation succeeds
- **THEN** the `['candidates']` query is invalidated and refetched

#### Scenario: Failed mutation triggers refetch
- **WHEN** a decision mutation fails and the cache is rolled back
- **THEN** the `['candidates']` query is invalidated and refetched

### Requirement: In-flight queries cancelled before optimistic update
Before applying an optimistic update, any in-flight candidate queries SHALL be cancelled to prevent them from overwriting the optimistic data.

#### Scenario: Pending fetch cancelled on mutation
- **WHEN** a decision mutation starts while a candidate fetch is in progress
- **THEN** the in-flight fetch is cancelled before the optimistic cache update is applied
