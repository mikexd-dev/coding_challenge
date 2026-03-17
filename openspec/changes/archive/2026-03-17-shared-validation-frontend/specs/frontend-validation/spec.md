## ADDED Requirements

### Requirement: Client-side name validation
The create candidate form SHALL show an inline error and disable the submit button when the name is empty or whitespace-only.

#### Scenario: Empty name shows error
- **WHEN** the user clears the name input and blurs or attempts to submit
- **THEN** an inline error message is displayed indicating the name is required
- **AND** the Create button is disabled

#### Scenario: Valid name enables submit
- **WHEN** the user enters a non-empty name
- **THEN** no error message is shown
- **AND** the Create button is enabled

### Requirement: Client-side reason validation
The decision form SHALL show an inline error and disable the submit button when the reason is shorter than `MIN_REASON_LENGTH` characters.

#### Scenario: Short reason shows error
- **WHEN** the user enters a reason shorter than 10 characters
- **THEN** an inline error message is displayed indicating the minimum length
- **AND** the Submit Decision button is disabled

#### Scenario: Valid reason enables submit
- **WHEN** the user enters a reason of 10 or more characters
- **THEN** no error message is shown
- **AND** the Submit Decision button is enabled

### Requirement: Decision form hidden for non-NEW candidates
The decision form SHALL only be rendered when the selected candidate has status `NEW`.

#### Scenario: NEW candidate shows decision form
- **WHEN** a candidate with status `NEW` is selected
- **THEN** the decision form is displayed

#### Scenario: SHORTLISTED candidate hides decision form
- **WHEN** a candidate with status `SHORTLISTED` is selected
- **THEN** the decision form is not displayed
- **AND** a message indicates the candidate has already been decided

#### Scenario: REJECTED candidate hides decision form
- **WHEN** a candidate with status `REJECTED` is selected
- **THEN** the decision form is not displayed
- **AND** a message indicates the candidate has already been decided

### Requirement: Page uses service layer
The live session page SHALL use `ui/api/candidates.ts` functions (`getAllCandidates`, `createCandidate`, `submitDecision`) instead of inline `fetch()` calls.

#### Scenario: Fetching candidates uses service layer
- **WHEN** the page loads
- **THEN** it calls `getAllCandidates()` from the service layer

#### Scenario: Creating a candidate uses service layer
- **WHEN** the user submits the create form
- **THEN** it calls `createCandidate(name)` from the service layer

#### Scenario: Submitting a decision uses service layer
- **WHEN** the user submits the decision form
- **THEN** it calls `submitDecision(id, decision, reason)` from the service layer

### Requirement: API errors displayed to user
The page SHALL display error messages returned by the API in the existing error banner.

#### Scenario: Validation error from API
- **WHEN** the API returns a 400 with an error message
- **THEN** the error message is displayed in the error banner

#### Scenario: Transition error from API
- **WHEN** the API returns a 409 with an error message
- **THEN** the error message is displayed in the error banner
