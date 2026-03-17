## Context

The `live-session/page.tsx` is a ~352-line monolithic component with all UI rendering, state management, API calls, and inline styles in one file. There are no reusable components, no CSS framework, and no design system. The project uses Next.js 16 with React 19 and TypeScript. An existing domain layer (`src/domain/`) provides shared validation and types. The UI API layer (`src/ui/api/`) handles fetch calls.

## Goals / Non-Goals

**Goals:**
- Extract 6 reusable components from the monolithic page
- Install and configure Tailwind CSS v4 + shadcn/ui as the design system
- Use shadcn primitives (Card, Button, Input, Select, Badge, Skeleton) as building blocks
- Add loading/skeleton states to prepare for async DB operations
- Maintain all existing functionality and validation behavior
- Improve accessibility with proper ARIA attributes via shadcn defaults

**Non-Goals:**
- State management library (Zustand, Redux) — current `useState` is sufficient
- Form library (React Hook Form) — manual validation is fine for 2 forms
- Server components or SSR changes — page stays `'use client'`
- Backend API changes — contract is unchanged
- Routing changes — URL-based candidate selection stays the same
- Dark mode — single theme for now

## Decisions

### 1. Component file structure: flat under `src/ui/components/`

Place all components in `src/ui/components/` without nesting subdirectories.

**Why over nested folders**: With only 6 components, nesting adds navigation overhead with no organizational benefit. If the component count grows past ~15, introduce grouping then.

```
src/ui/components/
├── candidate-card.tsx
├── candidate-board.tsx
├── create-candidate-form.tsx
├── update-status-form.tsx
├── status-badge.tsx
└── business-rules.tsx
```

### 2. Tailwind CSS v4 with `@tailwindcss/postcss`

Use Tailwind v4 (CSS-first config) since the project is on Next.js 16 which supports it natively.

**Why v4 over v3**: Next.js 16 + React 19 aligns with Tailwind v4's CSS-first approach. No `tailwind.config.js` needed — configuration lives in the CSS file via `@theme`.

### 3. shadcn/ui with New York style, neutral color scheme

Initialize shadcn with `new-york` style variant and `neutral` base color.

**Why New York over Default**: Cleaner, more professional look that suits a management tool. Neutral palette avoids opinionated colors and lets status colors (blue/green/red) stand out.

**Components to install**: `card`, `button`, `input`, `select`, `badge`, `skeleton`, `textarea`, `label`

### 4. StatusBadge wraps shadcn Badge with variant mapping

Map `CandidateStatus` to shadcn Badge variants using Tailwind classes:
- `NEW` → `default` variant (blue tones)
- `SHORTLISTED` → `secondary` variant with green Tailwind classes
- `REJECTED` → `destructive` variant (red tones)

**Why over custom component**: Leverages shadcn's accessible Badge with minimal customization. Status-to-color mapping is a single lookup object.

### 5. Loading states via shadcn Skeleton

Add a `loading` boolean state in the page. While loading:
- `CandidateBoard` renders skeleton cards (3 placeholder cards)
- Forms are disabled
- Skeleton replaces text content

**Why Skeleton over spinner**: Skeleton preserves layout during load, preventing content shift. Better UX for card-grid layouts where users expect spatial stability.

### 6. Page remains the state owner

The `live-session/page.tsx` keeps all state (`useState`) and event handlers. Components receive data and callbacks via props.

**Why over lifting state into components**: Single source of truth for related state (candidates list, selection, errors). Components stay pure/presentational, making them easier to test and reuse. If complexity grows, a state management library can be introduced later without changing component interfaces.

### 7. shadcn components live in `src/components/ui/`

Let shadcn's CLI install its primitives to `src/components/ui/` (its default). Custom application components go in `src/ui/components/`.

**Why separate paths**: Keeps generated shadcn code separate from hand-written application components. shadcn components can be regenerated/updated independently. The `src/ui/components/` path aligns with the existing `src/ui/api/` convention.

## Risks / Trade-offs

- **Test selector breakage** → Existing tests use DOM queries that will change. Mitigation: update tests to use role-based queries (`getByRole`, `getByText`) which are more resilient to markup changes.
- **Tailwind v4 is relatively new** → Fewer community examples. Mitigation: shadcn/ui officially supports v4, and the project uses only standard utilities.
- **Two component directories** (`src/components/ui/` for shadcn, `src/ui/components/` for app) → Could confuse contributors. Mitigation: document the convention; shadcn's path is its standard default.
- **Loading state adds complexity for currently-sync operations** → Slight over-engineering for current in-memory storage. Mitigation: minimal code (one boolean + Skeleton component), and it's needed as soon as real DB is introduced.
