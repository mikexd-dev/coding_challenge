## ADDED Requirements

### Requirement: CandidateCard component
The system SHALL provide a `CandidateCard` component that displays a candidate's name and status badge, and supports selection via click.

#### Scenario: Renders candidate name and status
- **WHEN** CandidateCard receives a candidate with name "Alice" and status "NEW"
- **THEN** it renders the name "Alice" and a StatusBadge showing "NEW"

#### Scenario: Selected state visual feedback
- **WHEN** CandidateCard is marked as selected
- **THEN** it renders with a highlighted border and background to indicate selection

#### Scenario: Unselected state
- **WHEN** CandidateCard is not selected
- **THEN** it renders with a default border and white background

#### Scenario: Click triggers selection callback
- **WHEN** the user clicks a CandidateCard
- **THEN** the `onSelect` callback is invoked with the candidate's id

### Requirement: CandidateBoard component
The system SHALL provide a `CandidateBoard` component that renders a responsive grid of CandidateCard components.

#### Scenario: Renders grid of candidates
- **WHEN** CandidateBoard receives a list of candidates
- **THEN** it renders one CandidateCard per candidate in a responsive grid layout

#### Scenario: Empty state
- **WHEN** CandidateBoard receives an empty candidate list and is not loading
- **THEN** it displays a message indicating no candidates exist yet

#### Scenario: Loading state with skeletons
- **WHEN** CandidateBoard is in loading state
- **THEN** it renders 3 skeleton placeholder cards instead of real candidate cards

### Requirement: CreateCandidateForm component
The system SHALL provide a `CreateCandidateForm` component with a name input and submit button that validates input before submission.

#### Scenario: Renders name input and submit button
- **WHEN** CreateCandidateForm is rendered
- **THEN** it displays a text input with placeholder "Candidate name" and a "Create" button

#### Scenario: Disables submit when name is invalid
- **WHEN** the name input is empty or whitespace-only
- **THEN** the Create button is disabled

#### Scenario: Enables submit when name is valid
- **WHEN** the name input contains a non-empty, non-whitespace value
- **THEN** the Create button is enabled

#### Scenario: Shows inline validation error
- **WHEN** the user clears the name input after typing
- **THEN** an inline error message is displayed below the input

#### Scenario: Submits and clears form
- **WHEN** the user submits with a valid name
- **THEN** the `onSubmit` callback is invoked with the name and the input is cleared

### Requirement: UpdateStatusForm component
The system SHALL provide an `UpdateStatusForm` component with a decision select, reason textarea, and submit button.

#### Scenario: Renders selected candidate info
- **WHEN** UpdateStatusForm receives a candidate
- **THEN** it displays the candidate's name and current status

#### Scenario: Shows decision form for NEW candidates
- **WHEN** the candidate's status is "NEW"
- **THEN** it renders a decision select (Shortlist/Reject), reason textarea, and Submit Decision button

#### Scenario: Shows decided message for non-NEW candidates
- **WHEN** the candidate's status is "SHORTLISTED" or "REJECTED"
- **THEN** it displays a message that the candidate has already been decided
- **AND** no form controls are rendered

#### Scenario: Disables submit when reason is too short
- **WHEN** the reason textarea contains fewer than MIN_REASON_LENGTH characters
- **THEN** the Submit Decision button is disabled

#### Scenario: Submits decision with callback
- **WHEN** the user submits with a valid reason
- **THEN** the `onSubmit` callback is invoked with the decision and reason

### Requirement: StatusBadge component
The system SHALL provide a `StatusBadge` component that renders a color-coded badge based on candidate status.

#### Scenario: NEW status renders blue badge
- **WHEN** StatusBadge receives status "NEW"
- **THEN** it renders a badge with blue styling and text "NEW"

#### Scenario: SHORTLISTED status renders green badge
- **WHEN** StatusBadge receives status "SHORTLISTED"
- **THEN** it renders a badge with green styling and text "SHORTLISTED"

#### Scenario: REJECTED status renders red badge
- **WHEN** StatusBadge receives status "REJECTED"
- **THEN** it renders a badge with red/destructive styling and text "REJECTED"

### Requirement: BusinessRules component
The system SHALL provide a `BusinessRules` component that displays the decision rules as a static list.

#### Scenario: Renders all business rules
- **WHEN** BusinessRules is rendered
- **THEN** it displays the transition rules (NEW can be SHORTLISTED or REJECTED, decisions are final) and the minimum reason length requirement
