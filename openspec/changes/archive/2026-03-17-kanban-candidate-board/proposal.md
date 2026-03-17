## Why

The current candidate board displays all candidates in a flat grid, making it difficult to visualize pipeline status at a glance. A Kanban-style board with drag-and-drop provides an intuitive, visual workflow that mirrors how hiring teams naturally think about candidate progression through stages.

## What Changes

- **BREAKING**: Replace flat grid `CandidateBoard` with a 3-column Kanban layout (NEW | SHORTLISTED | REJECTED)
- Add drag-and-drop capability for candidate cards between columns using `@dnd-kit`
- Add a right-side sliding panel (`Sheet`) that opens on card click or drag-to-column, containing the status update form
- Enforce business rules visually: only NEW candidates are draggable; SHORTLISTED/REJECTED columns reject invalid drops
- Pre-fill the decision field when dragging to a target column (drag to SHORTLISTED → decision=SHORTLIST)
- Remove the inline `UpdateStatusForm` from the page layout; it moves into the Sheet panel

## Capabilities

### New Capabilities
- `kanban-board`: Kanban column layout, candidate grouping by status, drag-and-drop interactions, drop validation, and drag overlay rendering
- `candidate-sheet`: Right-side sliding panel for viewing candidate details and submitting status decisions, with support for pre-filled decisions from drag actions

### Modified Capabilities
- `frontend-validation`: The status update form gains an optional pre-filled decision prop and moves from inline layout to Sheet context
- `business-rules`: No rule changes, but drag-and-drop must enforce existing transition rules visually (prevent invalid drags/drops)

## Impact

- **Dependencies**: New packages `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`; new shadcn component `Sheet`
- **Components modified**: `candidate-board.tsx` (major refactor), `candidate-card.tsx` (add draggable), `update-status-form.tsx` (accept pre-filled decision), `live-session/page.tsx` (DndContext wrapper, Sheet state, layout change)
- **New components**: `kanban-column.tsx`, `candidate-sheet.tsx`, `ui/sheet.tsx`
- **Tests**: Existing `live-session.test.tsx` will need updates for new Kanban DOM structure
- **APIs**: No backend changes — same endpoints, same business logic
