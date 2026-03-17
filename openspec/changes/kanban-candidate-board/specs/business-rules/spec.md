## ADDED Requirements

### Requirement: Drag-and-drop enforces transition rules
The drag-and-drop system SHALL enforce the same transition rules as the domain model: only `NEW` candidates can change status.

#### Scenario: NEW candidate can be dragged
- **WHEN** a candidate has status `NEW`
- **THEN** the candidate card is draggable

#### Scenario: SHORTLISTED candidate cannot be dragged
- **WHEN** a candidate has status `SHORTLISTED`
- **THEN** the candidate card is not draggable (drag is disabled)

#### Scenario: REJECTED candidate cannot be dragged
- **WHEN** a candidate has status `REJECTED`
- **THEN** the candidate card is not draggable (drag is disabled)

### Requirement: Drag does not bypass reason requirement
A drag-and-drop action SHALL NOT complete a status transition directly. The user MUST still provide a reason via the Sheet form before the API call is made.

#### Scenario: Drop opens form instead of completing transition
- **WHEN** a NEW candidate is dropped on the SHORTLISTED column
- **THEN** the Sheet opens with the decision form
- **AND** no API call is made until the user submits the form with a valid reason
