## Context

Vitest is already installed and configured with path aliases. The `src/__tests__/` directory exists with a `.gitkeep`. No test dependencies for React component testing are installed yet. The codebase uses Next.js 14+ app router with API route handlers. Business rules are documented but NOT enforced — tests for those rules will intentionally fail to prove the gap.

## Goals / Non-Goals

**Goals:**
- Write tests that specify expected behavior for ALL business rules (including unenforced ones)
- Organize tests by architectural layer (domain, infrastructure, api, ui)
- Demonstrate which functionality works (green) vs what's missing (red)
- Set up GitHub Actions CI to run quality checks on every push/PR
- Install React Testing Library for component tests

**Non-Goals:**
- Implementing the missing business rules (separate change)
- E2E tests with Playwright (deferred until features complete)
- 100% coverage — focus on business-critical paths
- Mocking the data layer — use real in-memory store

## Decisions

### 1. Test file organization
**Choice**: Co-locate by layer under `src/__tests__/`
```
src/__tests__/
  domain/candidate.test.ts        # Unit: model behavior
  infrastructure/storage.test.ts  # Unit: persistence
  api/candidates.test.ts          # Integration: route handlers
  ui/live-session.test.tsx        # Component: React rendering
```
**Rationale**: Mirrors the hexagonal structure. Each layer's tests have different concerns and dependencies.
**Alternative**: Co-locate tests next to source files (`candidate.test.ts` next to `candidate.ts`) — valid but harder to see coverage gaps at a glance.

### 2. API route testing approach
**Choice**: Call route handler functions directly (import `GET`/`POST` and invoke with `NextRequest`)
**Rationale**: Next.js app router exports plain async functions. No need for a test server — just construct `NextRequest` objects and assert on `NextResponse`. Fast, no HTTP overhead.
**Alternative**: Spin up the dev server and use `fetch` — slower, more flaky, unnecessary for these tests.

### 3. Intentionally failing tests
**Choice**: Write tests for unenforced business rules with `it()` (not `it.skip()` or `it.todo()`) and let them fail
**Rationale**: The user explicitly wants failing tests to document the gap. Red tests are more visible than skipped ones — they show up in CI as failures and demand attention. We'll tag them with descriptive names so it's clear they're expected to fail.
**Alternative**: Use `it.todo()` — doesn't actually run, so it doesn't prove the gap exists.
**Compromise**: Use `it.fails()` (Vitest feature) for tests that are expected to fail — this way CI stays green while still documenting the gap. Tests marked `.fails()` will fail the suite when the implementation is added (forcing you to convert them to regular `it()`).

### 4. Frontend testing environment
**Choice**: Vitest with `jsdom` environment, scoped per-file via `// @vitest-environment jsdom` comment
**Rationale**: Domain and API tests run in `node` environment (faster). Only UI tests need `jsdom`. Per-file environment avoids slowing down the entire suite.
**Alternative**: Global jsdom environment — penalizes all tests with jsdom overhead.

### 5. Shared test state
**Choice**: Reset the in-memory store before each test using a `resetStore()` helper
**Rationale**: The store is a module-level `Map`. Tests mutate it. Without reset, test order affects results. Export a `resetStore()` from storage.ts for test use only.
**Alternative**: Mock the store — rejected per user preference (no mocking data layer).

## Risks / Trade-offs

- **`it.fails()` tests must be converted when rules are implemented** → Mitigation: descriptive test names and a clear comment block explaining the pattern.
- **Adding `resetStore()` to production code** → Mitigation: only used in tests, could be gated behind `process.env.NODE_ENV === 'test'` but that's over-engineering for an in-memory store.
- **React Testing Library needs careful Next.js mocking** → Mitigation: mock `next/navigation` (useRouter, useSearchParams) — standard pattern for app router components.
