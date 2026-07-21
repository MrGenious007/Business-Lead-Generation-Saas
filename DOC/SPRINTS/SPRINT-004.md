WI-001: Repository & Workspace Cleanup
Remove unused placeholder packages and folders.
Consolidate the active application structure.
Fix path aliases.
Remove duplicate dependencies.
Standardize import conventions.

Deliverable: Clean, buildable project structure.

WI-002: Next.js Foundation
Fix next.config.ts.
Verify App Router configuration.
Fix invalid route file extensions.
Remove duplicate dashboard routes.
Verify middleware configuration.

Deliverable: Stable Next.js application.

WI-003: Authentication Foundation
Complete Supabase authentication.
Login.
Signup.
Forgot password.
Reset password.
Logout.
Session persistence.
Auth guards.

Deliverable: Production-ready authentication.

WI-004: Organization & Multi-Tenant Foundation
Organizations.
Profiles.
Organization memberships.
Organization settings.
Organization switching.
Active organization context.

Deliverable: Multi-tenant foundation.

WI-005: RBAC
Roles.
Permissions.
Policies.
Route protection.
Server-side authorization.
Permission helpers.

Deliverable: Working RBAC.

WI-006: Database Foundation

Implement all missing core tables:

organizations
profiles
organization_members
organization_settings

Add:

Foreign keys
Indexes
Audit fields
Soft delete
RLS policies

Deliverable: Stable database schema.

WI-007: Shared Types

Create strongly typed models for:

Auth
Organization
User
Membership
Common API responses

Remove any usage from foundation modules.

WI-008: Shared Services

Implement reusable services:

AuthService
OrganizationService
UserService
PermissionService

No duplicated Supabase calls.

WI-009: Route Protection

Protect:

Dashboard
CRM
Leads
Organizations
Settings
Future authenticated routes

Redirect unauthorized users appropriately.

WI-010: Documentation & Validation
Update PROJECT_STATUS.md.
Update CHANGELOG.md.
Update DATABASE_SCHEMA.md (if changed).
Update API_SPEC.md (if changed).
Ensure build, TypeScript, lint, and tests pass.