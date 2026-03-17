## ADDED Requirements

### Requirement: Sheet slides from right
The candidate detail panel SHALL be implemented as a shadcn/ui `Sheet` component that slides in from the right side of the viewport.

#### Scenario: Sheet opens on card click
- **WHEN** the user clicks a candidate card
- **THEN** the Sheet slides in from the right
- **AND** it displays the candidate's details and the decision form (if applicable)

#### Scenario: Sheet opens on valid drop
- **WHEN** a NEW candidate is dropped on a different status column
- **THEN** the Sheet slides in from the right with the decision pre-filled

#### Scenario: Sheet closes
- **WHEN** the user clicks the Sheet close button or clicks outside the Sheet
- **THEN** the Sheet slides out and closes
- **AND** no state change occurs

### Requirement: Pre-filled decision from drag
The Sheet SHALL accept an optional pre-filled decision value when opened via drag-and-drop.

#### Scenario: Drag to SHORTLISTED pre-fills decision
- **WHEN** a NEW candidate is dropped on the SHORTLISTED column
- **THEN** the Sheet opens with the decision select set to "SHORTLIST"
- **AND** the reason field is focused for immediate input

#### Scenario: Drag to REJECTED pre-fills decision
- **WHEN** a NEW candidate is dropped on the REJECTED column
- **THEN** the Sheet opens with the decision select set to "REJECT"
- **AND** the reason field is focused for immediate input

#### Scenario: Click opens without pre-fill
- **WHEN** the user clicks a NEW candidate card (not drag)
- **THEN** the Sheet opens with the default decision value (SHORTLIST)
- **AND** no pre-fill override is applied

### Requirement: Sheet displays candidate info
The Sheet SHALL display the candidate's name and current status.

#### Scenario: NEW candidate in Sheet
- **WHEN** a NEW candidate's Sheet is open
- **THEN** the candidate name, current status badge, and decision form are visible

#### Scenario: SHORTLISTED candidate in Sheet
- **WHEN** a SHORTLISTED candidate's Sheet is open (via click)
- **THEN** the candidate name and status badge are visible
- **AND** a message indicates the candidate has already been shortlisted
- **AND** no decision form is shown

#### Scenario: REJECTED candidate in Sheet
- **WHEN** a REJECTED candidate's Sheet is open (via click)
- **THEN** the candidate name and status badge are visible
- **AND** a message indicates the candidate has already been rejected
- **AND** no decision form is shown

### Requirement: Decision submission closes Sheet and updates board
The Sheet SHALL close and the board SHALL refresh after a successful decision submission.

#### Scenario: Successful decision submission
- **WHEN** the user submits a valid decision in the Sheet
- **THEN** the API is called with the decision and reason
- **AND** the Sheet closes
- **AND** the candidate list is re-fetched
- **AND** the card moves to the appropriate column
