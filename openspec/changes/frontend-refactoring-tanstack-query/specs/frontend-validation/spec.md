## MODIFIED Requirements

### Requirement: Client-side name validation
The create candidate form SHALL use the `useFieldValidation` hook with `isValidName` validator to show an inline error and disable the submit button when the name is empty or whitespace-only.

#### Scenario: Empty name shows error
- **WHEN** the user clears the name input and blurs or attempts to submit
- **THEN** an inline error message is displayed indicating the name is required
- **AND** the Create button is disabled

#### Scenario: Valid name enables submit
- **WHEN** the user enters a non-empty name
- **THEN** no error message is shown
- **AND** the Create button is enabled

### Requirement: Client-side reason validation
The decision form SHALL use the `useFieldValidation` hook with `isValidReason` validator to show an inline error and disable the submit button when the reason is shorter than `MIN_REASON_LENGTH` characters.

#### Scenario: Short reason shows error
- **WHEN** the user enters a reason shorter than 10 characters
- **THEN** an inline error message is displayed indicating the minimum length
- **AND** the Submit Decision button is disabled

#### Scenario: Valid reason enables submit
- **WHEN** the user enters a reason of 10 or more characters
- **THEN** no error message is shown
- **AND** the Submit Decision button is enabled

### Requirement: Page uses service layer
The live session page SHALL use TanStack Query hooks (`useQuery`, `useMutation`) that wrap `lib/api/candidates.ts` functions (`getAllCandidates`, `createCandidate`, `submitDecision`) via the `useCandidates` hook.

#### Scenario: Fetching candidates uses TanStack Query
- **WHEN** the page loads
- **THEN** `useQuery` calls `getAllCandidates()` from the service layer

#### Scenario: Creating a candidate uses mutation
- **WHEN** the user submits the create form
- **THEN** `useMutation` calls `createCandidate(name)` from the service layer

#### Scenario: Submitting a decision uses mutation with optimistic update
- **WHEN** the user submits the decision form
- **THEN** `useMutation` calls `submitDecision(id, decision, reason)` with optimistic cache update
