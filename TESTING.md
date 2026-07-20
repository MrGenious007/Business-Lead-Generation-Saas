# Testing

## Overview

This document describes the current testing state and recommended test strategy for LeadPilot AI.

## Current Testing State

- The repository includes one Jest test file: `tests/organization.test.ts`.
- The current package dependencies contain `jest`, `ts-jest`, and `@types/jest`.
- There is no configured test runner script or workspace-level test setup beyond the root `package.json`.

## Existing Test Coverage

The existing test covers RBAC logic with these scenarios:

- `owner` can manage organization settings and invitations.
- `member` is restricted from write and invite permissions.
- Unknown roles return false.

## Recommended Testing Strategy

### Unit tests

- Test service modules in `services/`:
  - `auth.ts`
  - `organization.ts`
  - `crm.ts`
  - `notifications`
  - `lead-discovery` once implemented
- Test utility helpers:
  - `lib/rbac.ts`
  - `lib/validators/*.ts`
  - Supabase client wrappers
- Test React utility hooks once added.

### Integration tests

- Test authentication flows using Supabase test instances or mocks.
- Test organization and tenant scoping logic.
- Test API route behavior when server routes are implemented.

### End-to-end tests

- Use a browser automation framework such as Playwright or Cypress.
- Cover key user journeys:
  - Signup and login
  - Organization creation and member invites
  - Lead discovery and lead creation
  - CRM task creation and activity tracking

### Type safety and validation

- Use TypeScript `strict` mode to catch missing types and import errors.
- Prefer schema validation tests for `zod` validators.
- Add tests for edge cases around form validation.

## Recommended Tools

- `jest` / `ts-jest` for unit/integration tests
- `@testing-library/react` for React component testing
- `msw` for network request mocking
- `playwright` for end-to-end browser tests

## Test Command Suggestions

Add one or more of the following scripts to `package.json`:

- `test`: `pnpm jest`
- `test:watch`: `pnpm jest --watch`
- `test:unit`: `pnpm jest --runInBand`
- `test:e2e`: `pnpm playwright test`

## Next Steps

- Add a `jest.config.ts` or `jest.config.js` to the repository.
- Add test setup files for DOM and React testing.
- Expand the `tests/` directory with service and page tests.
- Introduce a CI pipeline that runs tests on each pull request.
