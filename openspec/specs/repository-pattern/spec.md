# repository-pattern Specification

## Purpose
Repository pattern providing a domain-level interface for candidate persistence with pluggable implementations.

## Requirements
### Requirement: CandidateRepository interface
The system SHALL define a `CandidateRepository` interface in `src/domain/repositories/candidate-repository.ts` with methods: `getAll(): Promise<Candidate[]>`, `getById(id: string): Promise<Candidate | null>`, `save(candidate: Candidate): Promise<void>`, `nextId(): Promise<string>`, `reset(): Promise<void>`.

#### Scenario: Interface is exported
- **WHEN** `src/domain/repositories/index.ts` is inspected
- **THEN** it re-exports the `CandidateRepository` type

### Requirement: InMemoryCandidateRepository implements CandidateRepository
The system SHALL provide an `InMemoryCandidateRepository` class in `src/infrastructure/persistence/in-memory-repository.ts` that stores candidates in a `Map` and seeds two candidates on construction.

#### Scenario: Seeds two candidates
- **WHEN** a new `InMemoryCandidateRepository` is constructed
- **THEN** `getAll()` returns 2 candidates (Alice Johnson, Bob Williams)

#### Scenario: All methods return Promises
- **WHEN** any repository method is called
- **THEN** the return value is a `Promise`

### Requirement: Repository factory selects implementation
The system SHALL provide a `getRepository()` factory in `src/infrastructure/persistence/repository-factory.ts` that returns `NeonCandidateRepository` when `DATABASE_URL` is set and `InMemoryCandidateRepository` otherwise. The factory SHALL use singleton pattern with lazy initialization.

#### Scenario: No DATABASE_URL returns in-memory
- **WHEN** `getRepository()` is called without `DATABASE_URL`
- **THEN** an `InMemoryCandidateRepository` instance is returned

#### Scenario: DATABASE_URL set returns Neon
- **WHEN** `getRepository()` is called with `DATABASE_URL` set
- **THEN** a `NeonCandidateRepository` instance is returned

#### Scenario: Test override via setRepository
- **WHEN** `setRepository(mockRepo)` is called before `getRepository()`
- **THEN** subsequent `getRepository()` calls return the mock

### Requirement: Storage shim delegates to factory
The system SHALL rewrite `src/infrastructure/persistence/storage.ts` as async functions that delegate to `getRepository()`. All functions (`getAllCandidates`, `getCandidateById`, `saveCandidate`, `resetStore`, `generateNextId`) SHALL return Promises.

#### Scenario: Storage functions are async
- **WHEN** any storage function is called
- **THEN** the return value is a `Promise`

#### Scenario: Import paths unchanged
- **WHEN** route handlers import from `@/infrastructure/persistence/storage`
- **THEN** the imports resolve correctly with the same function names
