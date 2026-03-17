## Context

The app uses a synchronous in-memory `Map<string, Candidate>` in `storage.ts` for all persistence. Data is lost on restart. The `Candidate` model validates `reason` during `shortlist()`/`reject()` but discards it — only `status` is stored. The system needs durable persistence via Neon Postgres while keeping zero-config in-memory mode for local dev and CI.

## Goals / Non-Goals

**Goals:**
- Introduce `CandidateRepository` interface (domain port) with async contract
- Implement `InMemoryCandidateRepository` and `NeonCandidateRepository` (infrastructure adapters)
- Store `reason` and `decisionDate` on the domain model and expose in API responses
- Use Drizzle ORM for type-safe Postgres access via `@neondatabase/serverless`
- Auto-select repository based on `DATABASE_URL` env var presence

**Non-Goals:**
- Connection pooling or Neon branching — single HTTP-based connection is sufficient for this scale
- Migrations in CI/CD — manual `db:push` for now
- Replacing the standalone `canTransition()` function — frontend imports it directly without a `Candidate` instance
- Application service layer — routes continue to call repository directly via storage shim

## Decisions

### 1. Storage shim pattern
**Decision**: Rewrite `storage.ts` as a thin async shim that delegates to `getRepository()`.
**Rationale**: Preserves existing import paths in routes and tests. Minimizes diff. Can be removed later when routes import the repository directly.
**Alternative considered**: Have routes import `getRepository()` directly — rejected because it changes every import site and test file unnecessarily.

### 2. Async-everywhere contract
**Decision**: All `CandidateRepository` methods return `Promise<T>`, including in-memory implementation.
**Rationale**: Uniform interface. In-memory wrapping in Promise has negligible overhead. Avoids conditional `await` logic.

### 3. Lazy `require()` for Neon import in factory
**Decision**: Use `require()` in `repository-factory.ts` when `DATABASE_URL` is set.
**Rationale**: Avoids loading `@neondatabase/serverless` and `drizzle-orm` when running in-memory mode. Keeps test runs fast with no external deps loaded.

### 4. Upsert in `save()`
**Decision**: Single `save()` method uses `INSERT ... ON CONFLICT DO UPDATE`.
**Rationale**: Simplifies the interface — no need for separate `create()` and `update()` methods. The candidate ID is always known before save.

### 5. `canTransitionTo()` as complement, not replacement
**Decision**: Add instance method `canTransitionTo(target)` that delegates to standalone `canTransition(this._status)`. Keep standalone function.
**Rationale**: Frontend imports `canTransition()` with no `Candidate` instance available. Instance method is used internally in `shortlist()`/`reject()`.

## Risks / Trade-offs

- **[Risk] `require()` in factory bypasses tree-shaking** → Acceptable since Neon deps are only loaded when `DATABASE_URL` is set; in-memory mode (dev/test) stays lean.
- **[Risk] No connection pooling** → Neon's HTTP driver is stateless; suitable for serverless. Revisit if request volume grows.
- **[Risk] `max(id)` for ID generation is not concurrent-safe** → Same limitation as current in-memory implementation. Acceptable for interview challenge scope.
- **[Trade-off] Storage shim adds indirection** → Minimal overhead, easy to remove later. Worth it for zero-diff on import paths.
