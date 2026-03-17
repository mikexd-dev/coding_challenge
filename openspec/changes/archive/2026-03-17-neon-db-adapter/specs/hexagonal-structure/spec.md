## MODIFIED Requirements

### Requirement: Infrastructure layer directory exists
The project SHALL have a `src/infrastructure/` directory containing data access adapters, database connection, and repository implementations.

#### Scenario: Persistence adapter located in infrastructure layer
- **WHEN** a developer checks `src/infrastructure/persistence/`
- **THEN** `storage.ts` exists as an async shim delegating to the repository factory
- **AND** `in-memory-repository.ts` exists implementing `CandidateRepository`
- **AND** `neon-repository.ts` exists implementing `CandidateRepository`
- **AND** `repository-factory.ts` exists with `getRepository()`, `setRepository()`, `resetRepository()`

#### Scenario: Database module located in infrastructure layer
- **WHEN** a developer checks `src/infrastructure/db/`
- **THEN** `schema.ts` exists with the Drizzle table definition
- **AND** `connection.ts` exists with the Neon connection singleton

### Requirement: Domain layer contains repository interface
The project SHALL have a `src/domain/repositories/` directory containing the `CandidateRepository` interface, with no imports from infrastructure or framework modules.

#### Scenario: Repository interface in domain layer
- **WHEN** a developer checks `src/domain/repositories/`
- **THEN** `candidate-repository.ts` exists with the `CandidateRepository` interface
- **AND** `index.ts` exists re-exporting the interface
