# hexagonal-structure Specification

## Purpose
Hexagonal architecture layer structure for the candidate management system.

## Requirements
### Requirement: Domain layer directory exists
The project SHALL have a `src/domain/` directory containing domain models and type definitions, with no imports from `application/`, `infrastructure/`, or framework-specific modules.

#### Scenario: Domain models located in domain layer
- **WHEN** a developer checks `src/domain/models/`
- **THEN** `candidate.ts` exists with the `Candidate` class

#### Scenario: Domain types located in domain layer
- **WHEN** a developer checks `src/domain/types/`
- **THEN** `candidate.ts` exists with `CandidateStatus`, `DecisionAction`, `CandidateDTO`, `CreateCandidateRequest`, `DecisionRequest`, and `ErrorResponse` type definitions

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

### Requirement: Application layer directory exists
The project SHALL have a `src/application/` directory as a placeholder for the service layer.

#### Scenario: Application directory is scaffolded
- **WHEN** a developer checks `src/application/`
- **THEN** the directory exists with a `.gitkeep` file

### Requirement: Old directories are removed
The project SHALL NOT retain the original `src/models/`, `src/contracts/`, or `src/data/` directories after restructuring.

#### Scenario: Legacy directories deleted
- **WHEN** a developer checks `src/`
- **THEN** no `models/`, `contracts/`, or `data/` directories exist

### Requirement: All import paths updated
All files that import from moved modules SHALL use the new paths. No broken imports.

#### Scenario: Route handlers use new import paths
- **WHEN** `src/app/api/candidates/route.ts` is inspected
- **THEN** imports reference `@/domain/` and `@/infrastructure/` paths instead of `@/models/`, `@/contracts/`, or `@/data/`

#### Scenario: Frontend API client uses new import paths
- **WHEN** `src/ui/api/candidates.ts` is inspected
- **THEN** imports reference `@/domain/types/candidate` instead of `@/contracts/candidate`

#### Scenario: TypeScript compilation succeeds
- **WHEN** `npx tsc --noEmit` is run
- **THEN** zero type errors are reported

### Requirement: No behavioral changes
The restructuring SHALL NOT alter any runtime behavior. All API endpoints and frontend functionality MUST work identically before and after.

#### Scenario: App builds successfully
- **WHEN** `npm run build` is run
- **THEN** the build completes with zero errors

#### Scenario: All tooling checks pass
- **WHEN** `npm run lint`, `npm run format:check`, and `npm run typecheck` are run
- **THEN** all pass with zero errors
