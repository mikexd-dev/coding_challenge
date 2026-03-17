## Dev Logs

1. Analyze the codebase, a very minimal nextjs app with a single page for candidate management.

### PR feat/codebase-setup

- Found a high severity vulnerability in the codebase, it is a security risk and should be fixed immediately. Updated the nextjs version to the latest version not affected by the vulnerability, along with some syntax changes.
  ![alt text](assets/image.png)
- I will implement the tooling setup first, it should be the foundation of any project, to aid developers to collaborate better by having a consistent code style and linting rules.
- I will also implement a light weight version of the hexagonal architecture, this is the foundation of the application and should be implemented before any other feature. This is to ensure that the application is scalable and maintainable. And separation of businese logic from the application layer which will also make it easier for me to test later on.
- I will implement the business rules and validations, this is the core of the application and should be implemented before any other feature.
- I will implement the frontend, this is the user interface of the application and should be implemented before any other feature.
- I will implement the tests, this is the foundation of the application and should be implemented before any other feature.

### PR feat/TDD-setup

- I will create the vitest and playwright setup, this is the foundation of the application and should be implemented before any other feature. I want to use vitest for unit testing and playwright for end-to-end testing. I will also implement a simple CI/CD pipeline using GitHub Actions to run the tests on every push to the main branch. Purpose of the test now is to see what functions are already working properly, and whats the gap in the current implementation.
  ![alt text](assets/test_image.png)

### PR fix/business-rules-gap

- The Candidate domain model is anemic — just a data bag with `public status` that anyone can mutate directly. Business logic lives in route handlers and there is zero validation. 10 TDD tests are intentionally failing (`.fails()`) to document exactly what is missing.
- I will create a domain error hierarchy (`DomainError` → `ValidationError`, `InvalidTransitionError`, `CandidateNotFoundError`) so route handlers can map errors to HTTP codes mechanically instead of parsing strings.
- I will rewrite the Candidate model to be a rich domain model — `public status` becomes `private _status` with a getter, and add `shortlist(reason)` and `reject(reason)` methods that enforce transition guards (only `NEW` can transition) and reason validation (>= 10 chars).
- I will update the route handlers to delegate to the domain methods instead of mutating status directly, and add try/catch error mapping (`ValidationError → 400`, `InvalidTransitionError → 409`, `CandidateNotFoundError → 404`).
- I will remove all `.fails()` markers and `as any` casts from the test files. All 28 tests pass, zero typecheck errors, zero lint errors.
