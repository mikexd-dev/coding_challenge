## 1. Create Directory Structure

- [x] 1.1 Create `src/domain/models/` directory
- [x] 1.2 Create `src/domain/types/` directory
- [x] 1.3 Create `src/infrastructure/persistence/` directory
- [x] 1.4 Create `src/application/` directory with `.gitkeep`

## 2. Move Files

- [x] 2.1 Move `src/models/candidate.ts` → `src/domain/models/candidate.ts`
- [x] 2.2 Move `src/contracts/candidate.ts` → `src/domain/types/candidate.ts`
- [x] 2.3 Move `src/data/storage.ts` → `src/infrastructure/persistence/storage.ts`

## 3. Update Import Paths

- [x] 3.1 Update `src/domain/models/candidate.ts`: `@/contracts/` → `@/domain/types/`
- [x] 3.2 Update `src/infrastructure/persistence/storage.ts`: `@/models/` → `@/domain/models/`
- [x] 3.3 Update `src/app/api/candidates/route.ts`: `@/data/` → `@/infrastructure/persistence/`, `@/models/` → `@/domain/models/`, `@/contracts/` → `@/domain/types/`
- [x] 3.4 Update `src/app/api/candidates/[id]/decision/route.ts`: `@/data/` → `@/infrastructure/persistence/`, `@/contracts/` → `@/domain/types/`
- [x] 3.5 Update `src/app/live-session/page.tsx`: `@/contracts/` → `@/domain/types/`
- [x] 3.6 Update `src/ui/api/candidates.ts`: `@/contracts/` → `@/domain/types/`

## 4. Remove Old Directories

- [x] 4.1 Delete `src/models/` directory
- [x] 4.2 Delete `src/contracts/` directory
- [x] 4.3 Delete `src/data/` directory

## 5. Verify

- [x] 5.1 Run `npx tsc --noEmit` — zero errors
- [x] 5.2 Run `npm run lint` — zero errors
- [x] 5.3 Run `npm run format:check` — all files pass
- [x] 5.4 Run `npm run build` — builds successfully
