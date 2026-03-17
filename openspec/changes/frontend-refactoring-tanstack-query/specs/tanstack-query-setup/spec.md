## ADDED Requirements

### Requirement: QueryClientProvider wraps the application
The application SHALL provide a `QueryClientProvider` at the root layout level via a `Providers` client component in `src/app/providers.tsx`.

#### Scenario: Provider is available to all pages
- **WHEN** any page component renders
- **THEN** it has access to the QueryClient context for queries and mutations

#### Scenario: Provider is a client component
- **WHEN** the root layout renders
- **THEN** `layout.tsx` remains a server component and delegates client-side providers to `providers.tsx`

### Requirement: QueryClient default configuration
The QueryClient SHALL be configured with `staleTime: 30000` for queries and `retry: 1` for queries, `retry: 0` for mutations.

#### Scenario: Queries use 30s stale time
- **WHEN** a query is fetched and the component remounts within 30 seconds
- **THEN** the cached data is returned without a new network request

#### Scenario: Failed queries retry once
- **WHEN** a query fails on the first attempt
- **THEN** the query is retried once before reporting failure

#### Scenario: Failed mutations do not retry
- **WHEN** a mutation fails
- **THEN** the error is reported immediately without retry

### Requirement: React Query Devtools in development
The application SHALL include `ReactQueryDevtools` from `@tanstack/react-query-devtools` that renders only in development mode.

#### Scenario: Devtools visible in development
- **WHEN** the application runs in development mode
- **THEN** the React Query Devtools panel is accessible (initially closed)

#### Scenario: Devtools excluded in production
- **WHEN** the application is built for production
- **THEN** the devtools component is tree-shaken and not included in the bundle

### Requirement: Candidates query key convention
All candidate-related queries SHALL use the query key `['candidates']`.

#### Scenario: Fetching candidates uses standard key
- **WHEN** `useCandidates` fetches the candidate list
- **THEN** it uses `queryKey: ['candidates']` with `getAllCandidates` as the query function
