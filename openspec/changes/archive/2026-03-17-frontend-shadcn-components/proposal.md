## Why

The frontend is a single monolithic page component (`live-session/page.tsx`, ~352 lines) with all UI logic, inline styles, and no reusable components. This makes it hard to maintain, test individual pieces, or extend with new features. Adopting shadcn/ui + Tailwind CSS provides a consistent design system, accessibility out of the box, and a component library that scales as the app grows (e.g., when adding real database storage and async operations).

## What Changes

- **Install Tailwind CSS v4** and configure it for the Next.js project
- **Install shadcn/ui** and initialize with a theme (Card, Button, Input, Select, Badge, Skeleton components)
- **Extract reusable components** from the monolithic page:
  - `CandidateCard` — displays candidate name + status badge, handles selection
  - `CandidateBoard` — grid of CandidateCard components with empty state
  - `CreateCandidateForm` — name input + submit with validation errors
  - `UpdateStatusForm` — decision select + reason textarea + submit with validation
  - `StatusBadge` — color-coded badge per candidate status (NEW/SHORTLISTED/REJECTED)
  - `BusinessRules` — display panel for decision rules
- **Add loading/skeleton states** for async operations (future-proofing for DB storage)
- **Remove all inline styles** in favor of Tailwind utility classes and shadcn components
- **BREAKING**: The `live-session/page.tsx` will be fully restructured into composed components

## Capabilities

### New Capabilities
- `component-library`: Reusable UI components (CandidateCard, CandidateBoard, CreateCandidateForm, UpdateStatusForm, StatusBadge, BusinessRules) built on shadcn/ui primitives
- `design-system`: Tailwind CSS + shadcn/ui setup with consistent theming, loading states, and accessible defaults

### Modified Capabilities
- `frontend-validation`: Validation error display moves from inline styles to shadcn form patterns with proper ARIA attributes

## Impact

- **Dependencies**: New packages — `tailwindcss`, `@tailwindcss/postcss`, shadcn/ui components (`card`, `button`, `input`, `select`, `badge`, `skeleton`)
- **Files changed**: `live-session/page.tsx` fully refactored; new component files under `src/ui/components/`
- **Styling**: All inline `style={{}}` objects replaced with Tailwind classes
- **Tests**: Existing tests may need selector updates due to changed DOM structure
- **No API changes**: Backend contract remains identical
