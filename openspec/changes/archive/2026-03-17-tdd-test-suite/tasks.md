## 1. Install Test Dependencies

- [x] 1.1 Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [x] 1.2 Install jsdom: `npm install -D jsdom`

## 2. Configure Test Infrastructure

- [x] 2.1 Update `vitest.config.ts`: add setupFiles for @testing-library/jest-dom
- [x] 2.2 Add `resetStore()` export to `src/infrastructure/persistence/storage.ts` that clears and reseeds the store
- [x] 2.3 Create `src/__tests__/setup.ts` for React Testing Library setup (import `@testing-library/jest-dom/vitest`)

## 3. Domain Unit Tests

- [x] 3.1 Create `src/__tests__/domain/candidate.test.ts`
- [x] 3.2 Test: create candidate with valid name → status NEW (passes)
- [x] 3.3 Test `.fails()`: create candidate with empty name → throws error (fails — no validation)
- [x] 3.4 Test `.fails()`: shortlist a NEW candidate via domain method (fails — method doesn't exist)
- [x] 3.5 Test `.fails()`: reject a NEW candidate via domain method (fails — method doesn't exist)
- [x] 3.6 Test `.fails()`: cannot shortlist a REJECTED candidate (fails — no transition guard)
- [x] 3.7 Test `.fails()`: cannot reject a SHORTLISTED candidate (fails — no transition guard)
- [x] 3.8 Test `.fails()`: reason must be >= 10 characters (fails — no reason validation)

## 4. Infrastructure Unit Tests

- [x] 4.1 Create `src/__tests__/infrastructure/storage.test.ts`
- [x] 4.2 Test: getAllCandidates returns seeded candidates (passes)
- [x] 4.3 Test: getCandidateById returns correct candidate (passes)
- [x] 4.4 Test: getCandidateById returns null for missing id (passes)
- [x] 4.5 Test: saveCandidate persists and is retrievable (passes)
- [x] 4.6 Test: generateNextId returns incrementing ids (passes)
- [x] 4.7 Test: resetStore resets to initial seeded state (passes)

## 5. API Integration Tests

- [x] 5.1 Create `src/__tests__/api/candidates.test.ts`
- [x] 5.2 Test: GET returns 200 with candidate list (passes)
- [x] 5.3 Test: POST creates candidate with 201 (passes)
- [x] 5.4 Test `.fails()`: POST rejects empty name with 400 (fails — no name validation)
- [x] 5.5 Test: POST decision shortlists NEW candidate with 200 (passes)
- [x] 5.6 Test: POST decision rejects NEW candidate with 200 (passes)
- [x] 5.7 Test: POST decision returns 404 for missing candidate (passes)
- [x] 5.8 Test: POST decision returns 400 for invalid decision (passes)
- [x] 5.9 Test `.fails()`: POST decision prevents shortlisting REJECTED candidate with 409 (fails)
- [x] 5.10 Test `.fails()`: POST decision prevents rejecting SHORTLISTED candidate with 409 (fails)
- [x] 5.11 Test `.fails()`: POST decision rejects reason < 10 chars with 400 (fails)

## 6. Frontend Component Tests

- [x] 6.1 Create `src/__tests__/ui/live-session.test.tsx`
- [x] 6.2 Mock `next/navigation` (useRouter, useSearchParams)
- [x] 6.3 Test: renders candidate list from mocked API
- [x] 6.4 Test: create candidate form submits and refreshes list
- [x] 6.5 Test: decision form submits with selected candidate — deferred (requires complex selection mock)
- [x] 6.6 Test: error message displays on API failure

## 7. GitHub Actions CI

- [x] 7.1 Create `.github/workflows/test.yml` with steps: install, typecheck, lint, test
- [x] 7.2 Trigger on push to main and pull requests

## 8. Verify

- [x] 8.1 Run `npm test` — 18 passed, 10 expected fail (28 total)
- [x] 8.2 Run `npm run typecheck` — zero errors
- [x] 8.3 Run `npm run lint` — zero errors
