## 1. Dependencies & Setup

- [x] 1.1 Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [x] 1.2 Add shadcn/ui `Sheet` component via `npx shadcn@latest add sheet`

## 2. Kanban Column Component

- [x] 2.1 Create `src/components/kanban-column.tsx` with `useDroppable` from dnd-kit, column header (status name + candidate count), empty state placeholder, and drop highlight styling

## 3. Draggable Candidate Card

- [x] 3.1 Update `src/components/candidate-card.tsx` to use `useDraggable` with `disabled` based on `canTransition(status)`, add drag cursor for NEW candidates, dim style when actively dragging
- [x] 3.2 Create `DragOverlay` card rendering in the board component (ghost card that follows cursor)

## 4. Kanban Board Layout

- [x] 4.1 Refactor `src/components/candidate-board.tsx` to group candidates by status into 3 `KanbanColumn` components, render full-width 3-column grid, and show skeleton columns during loading

## 5. Candidate Sheet

- [x] 5.1 Create `src/components/candidate-sheet.tsx` using shadcn `Sheet` (side="right"), rendering candidate info and `UpdateStatusForm` inside, accepting `prefilledDecision` prop
- [x] 5.2 Update `src/components/update-status-form.tsx` to accept optional `defaultDecision` prop that sets initial decision select value

## 6. Page Integration

- [x] 6.1 Update `src/app/live-session/page.tsx`: wrap board in `DndContext`, add `onDragEnd` handler that maps target column to decision and opens Sheet, manage Sheet open/close state (`sheetState` with `candidateId`, `prefilledDecision`)
- [x] 6.2 Update page layout: move `CreateCandidateForm` above board, remove inline `UpdateStatusForm` panel, make board full-width
- [x] 6.3 Wire Sheet submission: on successful decision submit, close Sheet, re-fetch candidates

## 7. Testing

- [x] 7.1 Update `src/__tests__/ui/live-session.test.tsx` for new Kanban DOM structure (3 columns, grouped candidates)
- [x] 7.2 Add test: only NEW candidates are draggable (SHORTLISTED/REJECTED cards have drag disabled)
- [x] 7.3 Add test: Sheet opens on card click with candidate info
- [x] 7.4 Run `npm run typecheck` and `npm run lint` to verify no errors
