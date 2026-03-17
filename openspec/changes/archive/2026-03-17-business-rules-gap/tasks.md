## 1. Domain Errors

- [x] 1.1 Create `src/domain/errors/domain-error.ts` with base `DomainError` class extending `Error`
- [x] 1.2 Create `ValidationError` extending `DomainError` in the same directory
- [x] 1.3 Create `InvalidTransitionError` extending `DomainError` in the same directory
- [x] 1.4 Create `CandidateNotFoundError` extending `DomainError` in the same directory
- [x] 1.5 Create `src/domain/errors/index.ts` barrel export

## 2. Rich Domain Model

- [x] 2.1 Change `public status` to `private _status` with a `get status()` getter in `Candidate`
- [x] 2.2 Add name validation in `Candidate.create()` — throw `ValidationError` for empty/whitespace-only names
- [x] 2.3 Add `shortlist(reason: string)` method — guard: only `NEW` can transition, reason >= 10 chars
- [x] 2.4 Add `reject(reason: string)` method — guard: only `NEW` can transition, reason >= 10 chars
- [x] 2.5 Remove `.fails()` from domain tests in `src/__tests__/domain/candidate.test.ts` and verify all pass

## 3. Route Handler Error Mapping

- [x] 3.1 Update `POST /api/candidates` route to catch `ValidationError` and return 400 for empty names
- [x] 3.2 Update `POST /api/candidates/:id/decision` route to use `candidate.shortlist(reason)` / `candidate.reject(reason)` instead of direct status mutation
- [x] 3.3 Add try/catch error mapping: `ValidationError → 400`, `InvalidTransitionError → 409`, `CandidateNotFoundError → 404`
- [x] 3.4 Remove `.fails()` from API tests in `src/__tests__/api/candidates.test.ts` and verify all pass

## 4. Verification

- [x] 4.1 Run full test suite (`npm test`) — all 10 previously-failing tests now pass
- [x] 4.2 Run `npm run typecheck` — zero type errors
- [x] 4.3 Run `npm run lint` — zero lint errors
