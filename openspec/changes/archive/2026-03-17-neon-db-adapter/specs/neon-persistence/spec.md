## ADDED Requirements

### Requirement: Drizzle schema defines candidates table
The system SHALL define a `candidates` Drizzle schema in `src/infrastructure/db/schema.ts` with columns: `id` (varchar PK), `name` (varchar, not null), `status` (varchar, not null, default 'NEW'), `reason` (text, nullable), `decision_date` (timestamp with timezone, nullable), `created_at` (timestamp with timezone, not null, default now).

#### Scenario: Schema exports candidates table
- **WHEN** `src/infrastructure/db/schema.ts` is inspected
- **THEN** it exports a `candidates` pgTable with all required columns and constraints

### Requirement: Neon connection is lazy singleton
The system SHALL create a Drizzle client from `DATABASE_URL` on first access via `getDb()` in `src/infrastructure/db/connection.ts`. Subsequent calls SHALL return the same instance.

#### Scenario: Connection created on first call
- **WHEN** `getDb()` is called with `DATABASE_URL` set
- **THEN** a `NeonHttpDatabase` instance is returned

#### Scenario: Missing DATABASE_URL throws
- **WHEN** `getDb()` is called without `DATABASE_URL`
- **THEN** an `Error` is thrown with message "DATABASE_URL environment variable is not set"

### Requirement: NeonCandidateRepository implements CandidateRepository
The system SHALL provide a `NeonCandidateRepository` class in `src/infrastructure/persistence/neon-repository.ts` implementing `CandidateRepository` with Drizzle queries against the Neon database.

#### Scenario: getAll returns all candidates
- **WHEN** `getAll()` is called on a seeded database
- **THEN** all candidate rows are returned as rehydrated `Candidate` domain objects

#### Scenario: getById returns matching candidate
- **WHEN** `getById('c_1')` is called on a seeded database
- **THEN** the matching `Candidate` is returned with correct fields

#### Scenario: getById returns null for unknown id
- **WHEN** `getById('nonexistent')` is called
- **THEN** `null` is returned

#### Scenario: save performs upsert
- **WHEN** `save()` is called with a candidate whose id already exists
- **THEN** the existing row is updated (not duplicated)

#### Scenario: nextId generates incrementing id
- **WHEN** `nextId()` is called on a database with candidates c_1 and c_2
- **THEN** `'c_3'` is returned

#### Scenario: reset clears and re-seeds
- **WHEN** `reset()` is called
- **THEN** the table contains exactly 2 seed candidates (Alice Johnson, Bob Williams)

### Requirement: Drizzle config and tooling
The system SHALL provide `drizzle.config.ts` at project root and npm scripts `db:generate`, `db:push`, `db:seed` for migration and seeding workflows.

#### Scenario: drizzle.config.ts is valid
- **WHEN** `drizzle.config.ts` is inspected
- **THEN** it points to the schema file, uses PostgreSQL dialect, and reads `DATABASE_URL`

#### Scenario: Seed script populates database
- **WHEN** `npm run db:seed` is executed with valid `DATABASE_URL`
- **THEN** the candidates table contains exactly 2 seed rows
