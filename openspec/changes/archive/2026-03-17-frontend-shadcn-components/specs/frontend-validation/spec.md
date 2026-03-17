## MODIFIED Requirements

### Requirement: Client-side name validation
The create candidate form SHALL show an inline error using shadcn form patterns with `aria-invalid` and `aria-describedby` attributes, and disable the submit button when the name is empty or whitespace-only.

#### Scenario: Empty name shows error
- **WHEN** the user clears the name input and blurs or attempts to submit
- **THEN** an inline error message is displayed below the input
- **AND** the input has `aria-invalid="true"`
- **AND** the error message is linked via `aria-describedby`
- **AND** the Create button is disabled

#### Scenario: Valid name enables submit
- **WHEN** the user enters a non-empty name
- **THEN** no error message is shown
- **AND** the input does not have `aria-invalid`
- **AND** the Create button is enabled

### Requirement: Client-side reason validation
The decision form SHALL show an inline error using shadcn form patterns with `aria-invalid` and `aria-describedby` attributes, and disable the submit button when the reason is shorter than `MIN_REASON_LENGTH` characters.

#### Scenario: Short reason shows error
- **WHEN** the user enters a reason shorter than 10 characters
- **THEN** an inline error message is displayed below the textarea
- **AND** the textarea has `aria-invalid="true"`
- **AND** the error message is linked via `aria-describedby`
- **AND** the Submit Decision button is disabled

#### Scenario: Valid reason enables submit
- **WHEN** the user enters a reason of 10 or more characters
- **THEN** no error message is shown
- **AND** the textarea does not have `aria-invalid`
- **AND** the Submit Decision button is enabled

### Requirement: API errors displayed to user
The page SHALL display error messages returned by the API using a styled alert component with destructive variant instead of inline-styled divs.

#### Scenario: Validation error from API
- **WHEN** the API returns a 400 with an error message
- **THEN** the error message is displayed in a styled error banner with proper color and icon

#### Scenario: Transition error from API
- **WHEN** the API returns a 409 with an error message
- **THEN** the error message is displayed in a styled error banner with proper color and icon
