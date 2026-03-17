## MODIFIED Requirements

### Requirement: Decision form hidden for non-NEW candidates
The decision form SHALL only be rendered when the selected candidate has status `NEW`. The form now renders inside the candidate Sheet instead of inline on the page.

#### Scenario: NEW candidate shows decision form
- **WHEN** a candidate with status `NEW` is selected and the Sheet is open
- **THEN** the decision form is displayed inside the Sheet

#### Scenario: SHORTLISTED candidate hides decision form
- **WHEN** a candidate with status `SHORTLISTED` is selected and the Sheet is open
- **THEN** the decision form is not displayed
- **AND** a message indicates the candidate has already been decided

#### Scenario: REJECTED candidate hides decision form
- **WHEN** a candidate with status `REJECTED` is selected and the Sheet is open
- **THEN** the decision form is not displayed
- **AND** a message indicates the candidate has already been decided

## ADDED Requirements

### Requirement: Update status form accepts default decision
The `UpdateStatusForm` SHALL accept an optional `defaultDecision` prop that pre-selects the decision dropdown value.

#### Scenario: Form renders with default decision
- **WHEN** the form is rendered with `defaultDecision="REJECT"`
- **THEN** the decision select shows "Reject" as the selected value

#### Scenario: Form renders without default decision
- **WHEN** the form is rendered without `defaultDecision`
- **THEN** the decision select defaults to "SHORTLIST"
