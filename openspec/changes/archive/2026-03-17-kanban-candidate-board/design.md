## Context

The live-session page currently renders candidates in a flat auto-fill grid with a side panel for creating and updating candidates. Selection is URL-driven (`?candidateId=`). State lives in `LiveSessionContent` using React hooks — no external state library. The domain model enforces that only `NEW` candidates can transition to `SHORTLISTED` or `REJECTED`.

The UI uses shadcn/ui (Radix primitives), Tailwind CSS, React 19, and Next.js 16 (App Router). There is no existing drag-and-drop in the project.

## Goals / Non-Goals

**Goals:**
- Visual Kanban layout with 3 fixed columns grouped by `CandidateStatus`
- Drag-and-drop to move NEW candidates between columns, triggering the decision flow
- Slide-out Sheet panel for status updates (replaces inline form)
- Enforce business rules at the UI level (prevent invalid drags)
- Maintain existing API contract — no backend changes

**Non-Goals:**
- Reordering cards within a column (no intra-column sorting)
- Persisting column order or card position to backend
- Adding new statuses or changing the state machine
- Mobile touch-optimized drag (basic touch support from dnd-kit is acceptable)
- Undo/redo for drag operations

## Decisions

### 1. Drag-and-drop library: `@dnd-kit` over alternatives

**Choice**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`

**Rationale**: Built for React, supports React 19, lightweight (~15KB gzip), accessible (keyboard DnD), highly composable. `react-beautiful-dnd` is deprecated. `@hello-pangea/dnd` is maintained but heavier and less flexible.

**Alternatives rejected**:
- `react-beautiful-dnd`: Deprecated, no React 19 support
- `@hello-pangea/dnd`: Heavier, opinionated animations we don't need
- Native HTML5 DnD: Poor cross-browser consistency, no accessibility

### 2. Slide-out panel: shadcn/ui Sheet

**Choice**: Use shadcn `Sheet` component (Radix `Dialog` variant with slide animation)

**Rationale**: Already in the shadcn ecosystem — zero new runtime dependency. Accessible, composable, slides from right by default. Replaces the inline `UpdateStatusForm` section.

**Alternatives rejected**:
- Custom sidebar with CSS transitions: More code, less accessible
- Radix Dialog (modal): Blocks interaction with board, wrong UX pattern
- Drawer: Typically bottom-up, not right-side

### 3. DnD architecture: DndContext at page level, droppable columns, draggable cards

**Choice**:
- `DndContext` wraps the entire `CandidateBoard` in `live-session/page.tsx`
- Each `KanbanColumn` uses `useDroppable({ id: status })`
- Each `CandidateCard` uses `useDraggable({ id: candidate.id, data: { candidate } })`
- `DragOverlay` renders a ghost card during drag
- `onDragEnd` determines source/target column and opens Sheet if valid transition

**Rationale**: Keeps DnD context at the highest necessary level. Columns are drop targets identified by status string. Cards carry candidate data for the overlay and transition logic.

### 4. Drag validation: disable at source, not reject at target

**Choice**: Cards with `SHORTLISTED` or `REJECTED` status have `disabled: true` on `useDraggable`. They cannot be picked up at all.

**Rationale**: Better UX than allowing drag and then rejecting the drop. Uses `canTransition(status)` from domain validation — same function the form uses. Single source of truth for business rules.

### 5. Sheet trigger on drag: open after drop, pre-fill decision

**Choice**: When a valid `onDragEnd` fires (NEW card dropped on SHORTLISTED/REJECTED column):
1. Map target column to decision: `SHORTLISTED` → `"SHORTLIST"`, `REJECTED` → `"REJECT"`
2. Set sheet state: `{ open: true, candidate, prefilledDecision }`
3. Sheet renders `UpdateStatusForm` with `defaultDecision` prop
4. User must still enter reason and submit — drag alone does NOT complete the transition

**Rationale**: Enforces the reason requirement from business rules. Drag is a shortcut to open the form, not a bypass. The API call only happens on form submission.

### 6. Layout: remove right panel, full-width Kanban

**Choice**: The page layout changes from `grid-cols-[2fr_1fr]` to full-width board. The `CreateCandidateForm` moves above the board (or into a header area). The `UpdateStatusForm` is exclusively in the Sheet.

**Rationale**: Kanban needs horizontal space for 3 columns. The Sheet overlay provides the detail view without sacrificing board width.

### 7. State management: keep React hooks, add sheet state

**Choice**: Add to existing `LiveSessionContent`:
- `sheetState: { open: boolean, candidateId: string | null, prefilledDecision: DecisionAction | null }`
- Remove URL-based `selectedId` (the Sheet replaces it)

**Rationale**: Sheet is transient UI state, not worth URL persistence. Simplifies the component by removing `useSearchParams` dependency for selection.

## Risks / Trade-offs

- **[Breaking change to board layout]** → Existing tests assert flat grid DOM structure. Mitigation: update tests alongside implementation.
- **[dnd-kit React 19 compatibility]** → dnd-kit v6+ targets React 18. Mitigation: test with React 19 during install; if issues arise, use `--legacy-peer-deps` or pin to compatible version.
- **[No intra-column reorder]** → Users might expect to reorder within a column. Mitigation: explicitly a non-goal; cards render in creation order within each column.
- **[Sheet must be submitted]** → Drag feels like it should "just work" but requires reason input. Mitigation: clear UX — Sheet auto-opens with pre-filled decision and focus on reason field.
- **[Accessibility]** → dnd-kit provides keyboard DnD support out of the box. Mitigation: ensure `aria-label` on draggable cards and announcements on drag events.
