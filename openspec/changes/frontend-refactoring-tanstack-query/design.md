## Context

`LiveSessionContent` currently manages all state via `useState` (candidates, loading, error, sheetState) and fetches data via a manual `useEffect` on mount calling `fetchCandidates()`. Forms duplicate validation logic inline. There is no error boundary — an unhandled error crashes the entire app.

The existing API layer (`src/lib/api/candidates.ts`) has 3 clean async functions (`getAllCandidates`, `createCandidate`, `submitDecision`) that will be reused as-is by TanStack Query.

## Goals / Non-Goals

**Goals:**
- Replace manual data fetching with TanStack Query for caching, retry, and deduplication
- Optimistic updates on decision submission (instant card move, rollback on error)
- Error boundary with fallback UI and recovery
- Decompose god component into focused custom hooks
- DRY up form validation logic

**Non-Goals:**
- Changing the API layer or backend — existing `lib/api/candidates.ts` functions are wrapped, not replaced
- Adding SSR/prefetching — this is a client-side SPA page
- Adding global state management (Zustand/Redux) — TanStack Query handles server state, hooks handle UI state
- Infinite scroll, pagination, or polling — candidate list is small

## Decisions

### 1. TanStack Query over SWR or manual fetch

**Choice**: `@tanstack/react-query` v5

**Rationale**: Best-in-class mutation support with `onMutate`/`onError`/`onSettled` lifecycle for optimistic updates. SWR's mutation API is less ergonomic for cache rollback. Manual fetch lacks caching, retry, and deduplication entirely.

**Alternatives rejected**:
- SWR: Simpler API but weaker mutation/optimistic update support
- Manual fetch + AbortController: Would fix cleanup but not caching, retry, or deduplication

### 2. QueryClient configuration

**Choice**: Create `src/app/providers.tsx` as a client component wrapping `QueryClientProvider`.

**Config**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: 0 },
  },
})
```

**Rationale**: 30s staleTime prevents unnecessary refetches on component remount. Mutations never retry (user should re-submit intentionally). Provider lives in `providers.tsx` to keep `layout.tsx` as a server component.

### 3. Optimistic update pattern for decisions

**Choice**: Cache snapshot + optimistic write + rollback on error.

```
onMutate:
  1. Cancel in-flight queries for ['candidates']
  2. Snapshot current cache
  3. Optimistically update cache: move candidate to target status
  4. Close sheet immediately
  Return: { previousCandidates } (for rollback)

onError:
  1. Rollback cache to snapshot
  2. Set error state for display

onSettled:
  1. Invalidate ['candidates'] to re-sync with server
```

**Rationale**: User sees instant feedback. If API fails, card rolls back to original column with an error message. `onSettled` always re-syncs regardless of success/failure.

### 4. Error boundary: `react-error-boundary` over custom class or Next.js error.tsx

**Choice**: `react-error-boundary` library wrapping `LiveSessionContent`

**Rationale**: Provides `useErrorBoundary` hook, `ErrorBoundary` component with `fallbackRender`, and `onReset` callback. On reset, we invalidate all queries. Next.js `error.tsx` works at route level but doesn't integrate with query invalidation. A custom class component is more boilerplate for the same result.

### 5. Hook architecture

**Choice**: Three custom hooks, each with a single responsibility:

| Hook | Owns | Replaces |
|------|------|----------|
| `useCandidates()` | `useQuery` + 2x `useMutation`, returns `{ candidates, isLoading, error, createCandidate, submitDecision }` | 3x `useState`, 1x `useEffect`, 3x handler functions |
| `useCandidateSheet()` | Sheet open/close/prefill state, returns `{ sheetState, openFromClick, openFromDrop, close }` | `useState<SheetState>`, 3x state setter functions |
| `useFieldValidation(validator, msg)` | Single field value + error, returns `{ value, error, isValid, handleChange, reset }` | Duplicated `useState` + validation in both forms |

**Rationale**: Each hook is testable in isolation. `LiveSessionContent` becomes ~40 lines of composition + JSX.

### 6. Devtools placement

**Choice**: Include `ReactQueryDevtools` in `providers.tsx`, only renders in development.

```tsx
<ReactQueryDevtools initialIsOpen={false} />
```

**Rationale**: Zero production impact (tree-shaken in prod builds). Invaluable for debugging query/mutation state during development.

## Risks / Trade-offs

- **[Bundle size increase]** → TanStack Query adds ~13KB gzipped. Mitigation: justified by the features gained (caching, retry, optimistic updates, devtools).
- **[React 19 compatibility]** → TanStack Query v5 supports React 18+. Mitigation: v5.x works with React 19; test during install.
- **[Optimistic rollback flash]** → On error, card briefly appears in target column then snaps back. Mitigation: acceptable UX — the snap-back IS the feedback. Error message also displays.
- **[Test complexity]** → Tests need `QueryClientProvider` wrapper. Mitigation: create a `renderWithProviders` test utility.
- **[Stale closure in mutations]** → Mutation callbacks may capture stale state. Mitigation: use `queryClient.setQueryData` for cache access instead of component state.
