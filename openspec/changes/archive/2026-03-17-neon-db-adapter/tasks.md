## 1. Domain Model Updates

- [x] 1.1 Add `reason` (string | null) and `decisionDate` (Date | null) fields to `Candidate` model with getters
- [x] 1.2 Expand `Candidate.create()` to accept optional `reason` and `decisionDate` for rehydration
- [x] 1.3 Store `reason` and `decisionDate` in `shortlist()` and `reject()` methods
- [x] 1.4 Add `canTransitionTo(target)` instance method delegating to standalone `canTransition()`
- [x] 1.5 Add `reason` and `decisionDate` to `CandidateDTO` type

## 2. Domain Tests

- [x] 2.1 Test `reason`/`decisionDate` are null for NEW candidate
- [x] 2.2 Test `reason`/`decisionDate` populated after shortlist/reject
- [x] 2.3 Test `canTransitionTo()` returns correct values for all status combinations
- [x] 2.4 Test `create()` rehydration with reason/decisionDate

## 3. Repository Interface

- [x] 3.1 Create `CandidateRepository` interface in `src/domain/repositories/candidate-repository.ts`
- [x] 3.2 Create barrel export in `src/domain/repositories/index.ts`

## 4. InMemory Repository

- [x] 4.1 Create `InMemoryCandidateRepository` in `src/infrastructure/persistence/in-memory-repository.ts`
- [x] 4.2 Write tests for `InMemoryCandidateRepository`

## 5. Repository Factory & Storage Shim

- [x] 5.1 Create `repository-factory.ts` with `getRepository()`, `setRepository()`, `resetRepository()`
- [x] 5.2 Rewrite `storage.ts` as async shim delegating to factory
- [x] 5.3 Update existing storage tests to use async/await

## 6. Route Updates

- [x] 6.1 Add `await` to all storage calls in `GET /api/candidates` and `POST /api/candidates`
- [x] 6.2 Add `await` to all storage calls in `POST /api/candidates/:id/decision`
- [x] 6.3 Include `reason` and `decisionDate` in all route response mappings
- [x] 6.4 Update API tests: async `beforeEach`, new assertions for `reason`/`decisionDate`

## 7. Drizzle & Neon Setup

- [x] 7.1 Install `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, `dotenv`
- [x] 7.2 Create Drizzle schema in `src/infrastructure/db/schema.ts`
- [x] 7.3 Create Neon connection singleton in `src/infrastructure/db/connection.ts`
- [x] 7.4 Create `drizzle.config.ts`
- [x] 7.5 Add `db:generate`, `db:push`, `db:seed` npm scripts
- [x] 7.6 Create seed script in `drizzle/seed.ts`
- [x] 7.7 Create `.env.example`

## 8. Neon Repository

- [x] 8.1 Create `NeonCandidateRepository` in `src/infrastructure/persistence/neon-repository.ts`
- [x] 8.2 Create integration tests (skipped without `DATABASE_URL`)

## 9. Validation

- [x] 9.1 Run `npx tsc --noEmit` — zero errors
- [x] 9.2 Run `npm run lint` — zero errors
- [x] 9.3 Run `npm test` — all tests pass
