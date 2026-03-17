## 1. Shared Validation Module

- [x] 1.1 Create `src/domain/validation/rules.ts` with `MIN_REASON_LENGTH`, `isValidName`, `isValidReason`, `canTransition`
- [x] 1.2 Create `src/domain/validation/index.ts` barrel export
- [x] 1.3 Add unit tests for all validation functions in `src/__tests__/domain/validation.test.ts`

## 2. Refactor Candidate Model

- [x] 2.1 Refactor `Candidate.create()` to use `isValidName` from shared validation
- [x] 2.2 Refactor `shortlist()` and `reject()` to use `isValidReason` and `canTransition` from shared validation
- [x] 2.3 Run existing domain and API tests to confirm no behavioral change

## 3. Frontend Validation and Service Layer

- [x] 3.1 Refactor `page.tsx` to import and use `getAllCandidates`, `createCandidate`, `submitDecision` from `ui/api/candidates.ts` instead of inline fetch calls
- [x] 3.2 Add client-side name validation — inline error message and disabled Create button when name is empty
- [x] 3.3 Add client-side reason validation — inline error message and disabled Submit Decision button when reason is shorter than 10 characters
- [x] 3.4 Hide decision form for non-NEW candidates, show a message indicating the candidate has already been decided
- [x] 3.5 Display API error messages in the existing error banner on 400/409 responses

## 4. Cleanup

- [x] 4.1 Remove empty `src/application/` directory

## 5. Verification

- [x] 5.1 Run `npm test` — all existing tests pass, new validation tests pass
- [x] 5.2 Run `npm run typecheck` — zero type errors
- [x] 5.3 Run `npm run lint` — zero lint errors
