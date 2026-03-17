## Why

The application currently stores all candidate data in an in-memory Map that resets on every server restart. Adding a Neon Postgres adapter via Drizzle ORM provides durable persistence while keeping the in-memory store as a zero-config default for local development and testing. This also fixes a data-loss bug where `reason` and `decisionDate` are validated during shortlist/reject but never stored on the domain model.

## What Changes

- Add `reason` (string | null) and `decisionDate` (Date | null) fields to the `Candidate` domain model and `CandidateDTO`
- Add `canTransitionTo()` instance method on `Candidate` (complements standalone `canTransition()` used by frontend)
- Introduce `CandidateRepository` interface in the domain layer (port)
- Implement `InMemoryCandidateRepository` (extract from current `storage.ts`)
- Implement `NeonCandidateRepository` using Drizzle ORM + `@neondatabase/serverless`
- Add repository factory with singleton pattern; selects Neon when `DATABASE_URL` is set, in-memory otherwise
- **BREAKING**: Storage functions (`getAllCandidates`, `saveCandidate`, etc.) now return Promises — all route handlers must `await` them
- Add Drizzle schema, connection module, migration config, and seed script
- API responses now include `reason` and `decisionDate` fields

## Capabilities

### New Capabilities
- `neon-persistence`: Drizzle ORM schema, Neon connection, NeonCandidateRepository, migration/seed tooling
- `repository-pattern`: CandidateRepository interface, factory, storage shim, async contract

### Modified Capabilities
- `hexagonal-structure`: Infrastructure layer gains `db/` and repository pattern; `storage.ts` becomes async shim
- `business-rules`: Candidate model now stores `reason` and `decisionDate`; adds `canTransitionTo()` instance method

## Impact

- **Domain**: `Candidate` model gains 2 fields + 1 method; `CandidateDTO` gains 2 fields
- **Infrastructure**: New `db/` directory (schema, connection), new repository classes, storage.ts rewritten as async shim
- **API routes**: All storage calls require `await`; responses include `reason`/`decisionDate`
- **Tests**: `beforeEach` becomes async; new assertions for `reason`/`decisionDate`; new test files for repositories
- **Dependencies**: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, `dotenv`
- **Config**: `drizzle.config.ts`, `.env.example`, new npm scripts (`db:generate`, `db:push`, `db:seed`)
