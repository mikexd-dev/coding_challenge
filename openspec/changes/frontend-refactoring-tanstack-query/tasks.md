## 1. Dependencies

- [x] 1.1 Install `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-error-boundary`

## 2. Query Provider Setup

- [x] 2.1 Create `src/app/providers.tsx` — client component with `QueryClientProvider` (staleTime 30s, retry 1 for queries, retry 0 for mutations) and `ReactQueryDevtools`
- [x] 2.2 Update `src/app/layout.tsx` — wrap children with `<Providers>`

## 3. Custom Hooks

- [x] 3.1 Create `src/hooks/use-field-validation.ts` — `useFieldValidation(validator, errorMessage)` returning `{ value, error, isValid, handleChange, reset }`
- [x] 3.2 Create `src/hooks/use-candidate-sheet.ts` — `useCandidateSheet()` returning `{ sheetState, openFromClick, openFromDrop, close }`
- [x] 3.3 Create `src/hooks/use-candidates.ts` — `useCandidates()` with `useQuery(['candidates'], getAllCandidates)`, `useMutation` for `createCandidate` with `invalidateQueries`, `useMutation` for `submitDecision` with optimistic update (onMutate: cancel queries + snapshot + update cache, onError: rollback, onSettled: invalidate)

## 4. Refactor Forms to Use Hooks

- [x] 4.1 Update `src/components/create-candidate-form.tsx` — replace inline `useState` + validation with `useFieldValidation(isValidName, 'Name is required')`
- [x] 4.2 Update `src/components/update-status-form.tsx` — replace inline `useState` + validation for reason with `useFieldValidation(isValidReason, errorMsg)`

## 5. Refactor Page Component

- [x] 5.1 Update `src/app/live-session/page.tsx` — replace all `useState`/`useEffect` with `useCandidates()` and `useCandidateSheet()`, wire optimistic mutation to close sheet on submit, display mutation errors
- [x] 5.2 Add `ErrorBoundary` wrapper from `react-error-boundary` around `LiveSessionContent` with fallback UI (error message + "Try again" button) and `onReset` that invalidates all queries

## 6. Testing

- [x] 6.1 Create `src/__tests__/test-utils.tsx` — `renderWithProviders` helper that wraps components in `QueryClientProvider` with fresh `QueryClient`
- [x] 6.2 Update `src/__tests__/ui/live-session.test.tsx` — use `renderWithProviders`, update assertions for new hook-driven data flow
- [x] 6.3 Run `npm run typecheck && npm run lint && npm run test` — all pass
