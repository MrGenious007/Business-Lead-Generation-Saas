# Sprint 002: Authentication, Organization & RBAC Foundation

Sprint duration: 2 weeks (adjust per team calendar)

## Sprint Objective

Finish the production-ready authentication and organization foundation so the app enforces tenant isolation and RBAC at the server level. This sprint takes the stabilized scaffold and converts auth, org, and membership flows into secure, tested, and documented platform primitives.

## Business Value

- Enables safe multi-tenant onboarding and organization operations.
- Removes security risk from UI-only checks by applying server-side enforcement.
- Lays the groundwork for CRM, lead discovery, and automation features that require tenant-scoped data.

## Scope

In-scope:
- Production-grade signup, signin, logout, password reset flows (server-side)
- Profiles table and mapping to Supabase auth users
- Organizations, organization_settings, organization_members schema and migrations
- Organization creation and selection workflows
- Invite member flow (create invitations record + email stub)
- RBAC helper extended and server-side enforcement
- Middleware and protected layouts for workspace routes
- Tests for auth, org, and RBAC logic
- Documentation updates

Out-of-scope:
- Google Places / Lead discovery
- AI features
- Marketing automation
- Analytics beyond basic session metrics

## Success Criteria (must all pass)

- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm build` passes
- Auth pages (signup/signin/forgot/reset/logout) work end-to-end in local dev
- Authenticated users can create an organization and become owner
- Organization list loads for authenticated users and is organization-scoped
- Member invite flow creates invitations and prevents invites if `allow_invites` is false
- Protected routes redirect unauthenticated users to /login
- RBAC helper enforces owner/admin/manager/member/viewer roles server-side
- Migrations for profiles, organizations, organization_members, organization_settings added and applied
- Documentation updated: PROJECT_STATUS.md, API_SPEC.md, DATABASE_SCHEMA.md, CHANGELOG.md

## Deliverables

- New/updated migration files under `supabase/migrations`
- `services/auth.ts` and `services/organization.ts` fully implemented server-side
- Server API routes or server actions under `app/api/auth/*` and `app/api/organizations/*`
- `lib/supabase/server.ts` verified/updated for server usage
- `lib/rbac.ts` extended and unit-tested
- `middleware.ts` updated to protect tenant routes
- Tests under `tests/` covering RBAC and org flows
- Documentation files updated

## Risks & Mitigations

- Risk: Supabase auth integration differences between local/dev/staging. Mitigation: use `@supabase/ssr` server client and document env variables; run manual smoke tests.
- Risk: Long migration changes could break existing seed. Mitigation: write additive migrations and keep seed optional; run locally before pushing.
- Risk: Hidden broken imports may require extra work. Mitigation: run incremental typecheck and fix imports early.

## Implementation Tasks (ordered)

1. Review SPRINT-002-PLAN.md and instruction.md; confirm environment variables for Supabase.
2. Add migrations for `profiles`, `organizations`, `organization_members`, `organization_settings` (additive SQL files).
3. Update `supabase/seed` to optionally create an admin test user and a sample organization (guarded by env var).
4. Verify and adjust `lib/supabase/client.ts` and `lib/supabase/server.ts` to the correct SDK usage.
5. Implement server API endpoints:
   - `POST /api/auth/signup`
   - `POST /api/auth/signin`
   - `POST /api/auth/logout`
   - `POST /api/auth/password-reset`
   - `GET /api/auth/session`
6. Implement organization endpoints and service logic:
   - `GET /api/organizations`
   - `POST /api/organizations`
   - `GET /api/organizations/:id`
   - `POST /api/organizations/:id/members/invite`
7. Add RBAC checks in services and server routes using `lib/rbac.ts`.
8. Update `middleware.ts` and protected layouts to enforce session check and org membership.
9. Update UI pages to consume the server endpoints (signup/login/org pages) — maintain existing UI but wire to server APIs.
10. Add unit tests for `lib/rbac.ts`, `services/organization.ts`, and auth flow mocks.
11. Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`; fix issues.
12. Update documentation and changelog.

## Estimated Effort

- Engineering (2 devs): 2 weeks
- QA & Documentation: concurrent across sprint

---

Please review this Sprint 002 plan. Do not start implementation until approved.