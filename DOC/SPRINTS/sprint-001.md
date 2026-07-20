# Sprint 001: Stabilize the Foundation

## Sprint Goal

Transform the existing repository into a stable, compile-ready foundation for LeadPilot AI. This sprint is about fixing the scaffold, not adding new product features.

## Read Before Starting

- `PROJECT_STATUS.md`
- `README.md`
- `instruction.md`
- `architecture.md`
- `TODO.md`

## Sprint Scope

Do NOT implement any new business features.

Do NOT implement:
- Google Places
- AI
- Marketing automation
- Analytics
- New CRM features beyond stabilization

The only allowed work is foundation stabilization:
- build and compile fixes
- type fixes
- route correctness
- auth and route protection
- dependency and package cleanup
- DB/migration alignment

## Priority Order

1. Fix every compilation error.
2. Fix missing imports.
3. Fix missing TypeScript types.
4. Fix broken package references.
5. Fix route structure.
   - Use App Router best practices.
   - Remove duplicate routes.
   - Remove invalid or stale folders.
6. Fix authentication.
   - Protect every private route.
   - Secure dashboard, CRM, organizations, leads, settings, analytics, reports.
7. Fix organization middleware.
8. Implement proper RBAC enforcement.
9. Complete Supabase integration.
10. Fix migrations.
11. Fix database schema.
12. Fix RLS.
13. Fix dependency issues.
14. Fix package versions.
15. Fix build warnings.
16. Run lint.
17. Run type check.
18. Run production build.
19. Fix every issue until:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`

All three commands must pass successfully before the sprint is complete.

## Stabilization Checklist

- [ ] Ensure the root application compiles cleanly.
- [ ] Remove or fix broken references to placeholder workspace packages.
- [ ] Create or repair missing type modules referenced by the app.
- [ ] Implement missing API routes required by the existing UI.
- [ ] Add a real logout flow and remove dead `/api/auth/logout` references if not supported.
- [ ] Correct `next.config.ts` and any `next-auth` assumptions.
- [ ] Consolidate route structure and eliminate duplicate `app/(dashboard)` / `app/dashboard` inconsistencies.
- [ ] Enforce authentication across all tenant workspace pages.
- [ ] Ensure middleware uses the correct auth cookie/session handling.
- [ ] Align Supabase migration scripts with actual tables used by the app.
- [ ] Fix the seed script or schema so seeded tables exist.
- [ ] Remove or flag unused placeholder directories in `apps/*`, `packages/*`, and `features/*`.
- [ ] Harden imports and remove `any` usages where they block type checking.
- [ ] Confirm `pnpm install` finishes without workspace resolution errors.

## Deliverables

- A stable, compilable codebase.
- A corrected route layout using Next.js App Router best practices.
- Authenticated protection for private routes.
- Working Supabase integration for the core auth and organization flow.
- Updated documentation files:
  - `PROJECT_STATUS.md`
  - `README.md`
  - `CHANGELOG.md`

## Success Criteria

Sprint 001 is complete when all of the following are true:

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm build` passes.
- No new business features have been added.
- Foundation documentation is updated.

## Post-Sprint Process

When the sprint is complete:
- Update `PROJECT_STATUS.md` with the new status.
- Update `README.md` to reflect reality.
- Update `CHANGELOG.md` with sprint changes.
- Stop and wait for approval before proceeding to the next task.
