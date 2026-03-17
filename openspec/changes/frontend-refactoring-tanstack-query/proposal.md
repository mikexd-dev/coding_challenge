## Why

The `LiveSessionContent` component is a god component — it mixes API fetching, loading/error state, sheet UI state, event handlers, and layout rendering in one place. Manual `useState` + `useEffect` for data fetching lacks caching, retry, deduplication, and optimistic updates. A frontend architecture audit scored state management 6/10 and DRY/reuse 6/10, identifying custom hooks and server state management as the top improvement opportunities.

## What Changes

- **BREAKING**: Replace manual `useState`/`useEffect` data fetching with TanStack Query (`useQuery` + `useMutation`)
- Add `QueryClientProvider` wrapper with React Query Devtools
- Extract `useCandidates` hook — encapsulates all candidate CRUD with optimistic updates on decision submission
- Extract `useCandidateSheet` hook — encapsulates sheet open/close/prefill state
- Extract `useFieldValidation` hook — DRY up duplicate validation logic in forms
- Add `react-error-boundary` for graceful error recovery with reset capability
- Optimistic UX: decision submit instantly moves card to target column, rolls back on API error
- Refactor `LiveSessionContent` from god component to thin orchestration shell

## Capabilities

### New Capabilities
- `tanstack-query-setup`: QueryClientProvider configuration, default options, devtools integration, and query/mutation patterns for candidate data
- `optimistic-updates`: Optimistic cache manipulation on decision mutations with rollback on error
- `error-boundary`: React error boundary wrapping the live session with fallback UI and query reset on recovery
- `custom-hooks`: `useCandidates`, `useCandidateSheet`, and `useFieldValidation` hooks that decouple logic from presentation

### Modified Capabilities
- `frontend-validation`: Forms use `useFieldValidation` hook instead of inline useState + validation logic

## Impact

- **Dependencies**: New packages `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-error-boundary`
- **Files modified**: `src/app/layout.tsx` (provider), `src/app/live-session/page.tsx` (major refactor), `src/components/create-candidate-form.tsx` (use hook), `src/components/update-status-form.tsx` (use hook)
- **New files**: `src/app/providers.tsx`, `src/hooks/use-candidates.ts`, `src/hooks/use-candidate-sheet.ts`, `src/hooks/use-field-validation.ts`
- **APIs**: No backend changes — same endpoints, TanStack Query wraps existing `lib/api/candidates.ts` functions
- **Tests**: Need `QueryClientProvider` wrapper in test renders
