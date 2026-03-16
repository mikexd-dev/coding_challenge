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
