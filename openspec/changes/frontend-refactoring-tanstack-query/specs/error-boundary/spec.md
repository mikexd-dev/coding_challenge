## ADDED Requirements

### Requirement: Error boundary wraps live session content
The `LiveSessionContent` component SHALL be wrapped in an `ErrorBoundary` from `react-error-boundary`.

#### Scenario: Unhandled error shows fallback
- **WHEN** an unhandled JavaScript error occurs inside `LiveSessionContent`
- **THEN** the error boundary catches it
- **AND** a fallback UI is displayed instead of a blank/crashed page

### Requirement: Fallback UI with reset capability
The error boundary fallback SHALL display the error message and a "Try again" button that resets the boundary and re-fetches data.

#### Scenario: User clicks Try again
- **WHEN** the user clicks the "Try again" button in the error fallback
- **THEN** the error boundary resets
- **AND** all TanStack Query caches are invalidated
- **AND** the component re-renders and attempts to fetch data again

### Requirement: Error fallback displays error details
The fallback UI SHALL display a user-friendly error message derived from the caught error.

#### Scenario: Error message shown
- **WHEN** an error is caught by the boundary
- **THEN** the fallback displays "Something went wrong" heading
- **AND** the error's message text is shown below
