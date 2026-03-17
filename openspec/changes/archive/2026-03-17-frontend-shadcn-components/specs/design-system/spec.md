## ADDED Requirements

### Requirement: Tailwind CSS v4 configured
The project SHALL have Tailwind CSS v4 installed and configured with PostCSS for Next.js.

#### Scenario: Tailwind classes render correctly
- **WHEN** a component uses Tailwind utility classes (e.g., `p-4`, `text-blue-600`)
- **THEN** the corresponding CSS is applied in the browser

#### Scenario: Global CSS imports Tailwind
- **WHEN** the application loads
- **THEN** the global CSS file includes Tailwind via `@import "tailwindcss"`

### Requirement: shadcn/ui initialized
The project SHALL have shadcn/ui initialized with the New York style variant and neutral color scheme, with components installed in `src/components/ui/`.

#### Scenario: shadcn components are importable
- **WHEN** a component imports from `@/components/ui/button`
- **THEN** the import resolves to a working shadcn Button component

#### Scenario: Required shadcn components installed
- **WHEN** the design system is set up
- **THEN** the following shadcn components are available: Card, Button, Input, Select, Badge, Skeleton, Textarea, Label

### Requirement: No inline styles
All UI components SHALL use Tailwind utility classes and shadcn components instead of inline `style={{}}` objects.

#### Scenario: Page renders without inline styles
- **WHEN** the live-session page is rendered
- **THEN** no elements use the `style` attribute for layout, color, or spacing

### Requirement: Loading skeleton states
The system SHALL provide skeleton loading states for async operations using shadcn's Skeleton component.

#### Scenario: Initial page load shows skeletons
- **WHEN** the page is fetching candidates
- **THEN** the candidate board area displays skeleton placeholder cards

#### Scenario: Skeletons replaced by content
- **WHEN** the candidate data finishes loading
- **THEN** skeleton placeholders are replaced with actual CandidateCard components

### Requirement: Accessible form controls
All form inputs SHALL use shadcn components with proper label associations and ARIA attributes.

#### Scenario: Inputs have associated labels
- **WHEN** a form input is rendered
- **THEN** it has an associated `<label>` element via shadcn's Label component

#### Scenario: Error states are announced
- **WHEN** a validation error is displayed on an input
- **THEN** the input has `aria-invalid="true"` and the error message is associated via `aria-describedby`
