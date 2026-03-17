## ADDED Requirements

### Requirement: Kanban column layout
The candidate board SHALL display candidates in a 3-column Kanban layout with columns for `NEW`, `SHORTLISTED`, and `REJECTED` statuses. Each column SHALL display a header with the status name and a count of candidates in that column.

#### Scenario: Candidates grouped by status
- **WHEN** the board renders with candidates of mixed statuses
- **THEN** each candidate card appears in the column matching its status
- **AND** each column header shows the count of candidates it contains

#### Scenario: Empty column
- **WHEN** a status has no candidates (e.g., no SHORTLISTED candidates)
- **THEN** the column is still rendered with a count of 0
- **AND** an empty state placeholder is displayed

#### Scenario: Loading state
- **WHEN** candidates are being fetched
- **THEN** skeleton placeholders are shown within each column

### Requirement: Drag-and-drop for NEW candidates
The board SHALL allow candidates with status `NEW` to be dragged between columns using `@dnd-kit`. Only `NEW` candidates SHALL be draggable.

#### Scenario: Dragging a NEW candidate
- **WHEN** the user starts dragging a candidate card with status `NEW`
- **THEN** a drag overlay (ghost card) is rendered following the cursor
- **AND** the original card is visually dimmed

#### Scenario: SHORTLISTED candidate is not draggable
- **WHEN** the user attempts to drag a candidate with status `SHORTLISTED`
- **THEN** the drag does not initiate
- **AND** the card has no drag cursor

#### Scenario: REJECTED candidate is not draggable
- **WHEN** the user attempts to drag a candidate with status `REJECTED`
- **THEN** the drag does not initiate
- **AND** the card has no drag cursor

### Requirement: Drop validation
The board SHALL visually indicate valid and invalid drop targets during drag operations.

#### Scenario: Dragging over a valid target column
- **WHEN** a NEW candidate is dragged over the SHORTLISTED or REJECTED column
- **THEN** the target column highlights to indicate it accepts the drop

#### Scenario: Dropping on the same column
- **WHEN** a NEW candidate is dropped back on the NEW column
- **THEN** no action is taken and no Sheet opens

#### Scenario: Valid drop triggers Sheet
- **WHEN** a NEW candidate is dropped on the SHORTLISTED or REJECTED column
- **THEN** the candidate Sheet opens with the decision pre-filled based on the target column

### Requirement: Drag overlay rendering
The board SHALL render a `DragOverlay` component during active drag operations that mirrors the dragged card's appearance.

#### Scenario: Drag overlay follows cursor
- **WHEN** a candidate card is being dragged
- **THEN** a visual copy of the card follows the pointer
- **AND** the overlay disappears when the drag ends

### Requirement: Full-width board layout
The board SHALL occupy the full width of the content area. The `CreateCandidateForm` SHALL be positioned above the board.

#### Scenario: Page layout
- **WHEN** the live session page renders
- **THEN** the create form appears above the Kanban board
- **AND** the board spans the full available width with 3 equal columns
