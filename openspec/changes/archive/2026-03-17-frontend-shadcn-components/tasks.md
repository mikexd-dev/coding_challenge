## 1. Install remaining shadcn components

- [x] 1.1 Install shadcn components: card, input, select, badge, skeleton, textarea, label
- [x] 1.2 Verify all components are importable from `@/components/ui/*`

## 2. Create StatusBadge component

- [x] 2.1 Create `src/ui/components/status-badge.tsx` — maps CandidateStatus to shadcn Badge variants (NEW→default/blue, SHORTLISTED→green, REJECTED→destructive)

## 3. Create CandidateCard component

- [x] 3.1 Create `src/ui/components/candidate-card.tsx` — uses shadcn Card, displays name + StatusBadge, accepts `onSelect` callback, shows selected state via border/background classes

## 4. Create CandidateBoard component

- [x] 4.1 Create `src/ui/components/candidate-board.tsx` — responsive grid of CandidateCards, empty state message, loading state with 3 Skeleton cards

## 5. Create CreateCandidateForm component

- [x] 5.1 Create `src/ui/components/create-candidate-form.tsx` — shadcn Input + Button + Label, inline validation errors with `aria-invalid` and `aria-describedby`, disables submit when name invalid

## 6. Create UpdateStatusForm component

- [x] 6.1 Create `src/ui/components/update-status-form.tsx` — shows candidate info, shadcn Select for decision + Textarea for reason + Label + Button, validation errors with ARIA attributes, "already decided" message for non-NEW candidates

## 7. Create BusinessRules component

- [x] 7.1 Create `src/ui/components/business-rules.tsx` — static card displaying transition rules and minimum reason length

## 8. Refactor live-session page

- [x] 8.1 Refactor `src/app/live-session/page.tsx` to compose all new components, add loading state boolean, remove all inline styles, use Tailwind classes for page layout
- [x] 8.2 Replace inline error banner with styled error div using Tailwind destructive colors

## 9. Update tests

- [x] 9.1 Update existing tests to work with new component structure (fix selectors, use role-based queries)
- [x] 9.2 Verify all tests pass with `npm test`
