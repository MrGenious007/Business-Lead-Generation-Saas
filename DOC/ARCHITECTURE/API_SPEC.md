# API Specification

## Overview

LeadPilot AI currently exposes a small route-layer API and a larger typed service layer. The production foundation relies on shared services for auth, user/profile, organization context, permissions, CRM access, and lead discovery integration.

## Route-layer API

### Authentication

#### Logout

- Method: `POST`
- Path: `/api/auth/logout`
- Behavior:
  - invalidates the current Supabase session on the server
  - redirects to `/login` with HTTP 303
- Implementation: `app/api/auth/logout/route.ts`

## Authentication Service Surface

Implemented in `services/auth.ts` and related helpers.

- `signInWithPassword(payload)`
  - signs in an existing user
  - returns typed auth/session result data
- `signUpWithPassword(payload)`
  - creates the auth user
  - bootstraps tenant foundation for the user flow
- `resetPasswordForEmail(email)`
  - sends a password recovery email
- `updatePassword(password)`
  - updates the active authenticated user's password
- `recoverSessionFromUrl()`
  - recovers a session from recovery or email confirmation callback data
- `signOut()`
  - signs the current browser session out
- `getCurrentSession()`
  - returns current session data
- `getAuthenticatedUser(client?)`
  - resolves the current typed auth user from a Supabase client

## User and Permission Service Surface

### `services/user.ts`

- `getAuthenticatedUser(client?)`
- `getCurrentSession(client?)`
- `ensureCurrentProfile(client, user)`
- `getProfileById(client, profileId)`
- `updateActiveOrganization(client, profileId, organizationId)`

### `services/permission.ts`

- `listOrganizationMemberships(client, profileId)`
- `getActiveMembership(profile, memberships)`
- `getAccessContext(profile, memberships)`
- `hasPermission(role, permission)`

## Organization Service Surface

Implemented in `services/organization.ts`.

- `getOrganizationContext()`
- `getOrganizations()`
- `getOrganizationById(id)`
- `createOrganization(payload)`
- `updateOrganization(id, payload)`
- `deleteOrganization(id)`
- `getOrganizationSettings(organizationId)`
- `upsertOrganizationSettings(organizationId, payload)`
- `getOrganizationMembers(organizationId)`
- `inviteOrganizationMember(organizationId, email, role)`
- `updateOrganizationMember(id, role)`
- `deleteOrganizationMember(id)`
- `switchActiveOrganization(organizationId)`

## CRM Service Surface

Implemented in `services/crm.ts`.

- `getLeads()`
- `createLead(payload)`
- `updateLead(id, payload)`
- `getCompanies()`
- `createCompany(payload)`
- `getContacts()`
- `getDeals()`
- `createDeal(payload)`
- `getPipelines()`
- `getTasks()`
- `createTask(payload)`
- `createNote(payload)`
- `getActivityTimeline()`

## Lead Discovery Service Surface

Implemented in `services/lead-discovery/google-places.ts`.

- `searchBusinesses(payload)`
- `saveBusiness(payload)`
- `getSearchHistory()`

## Route Protection Contract

### Public routes

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

### Authenticated routes

All non-public app routes require authentication by default via middleware classification.

Current authenticated areas include:

- `/dashboard`
- `/crm`
- `/leads`
- `/organizations`
- nested organization settings and members routes
- future application routes unless explicitly marked public

### Redirect behavior

- unauthenticated access to authenticated routes redirects to `/login?redirectTo=<pathname>`
- authenticated users visiting auth entry pages are redirected to `/dashboard`
- authenticated users without required tenant permission are redirected to `/organizations`

## Notes

- No new route-layer API endpoints were introduced in WI-009.
- This document was updated because the repository now has a real logout route and a defined route-protection contract, which the earlier version did not describe accurately.
- Path: `/api/lead-discovery/search`
- Request:
  - `keyword`, `industry`, `city`, `state`, `country`, `radius`, `page`, `pageSize`
- Response:
  - `results` array of business profiles
  - `searchHistory` array
  - `error` string|null

### Save discovered business

- Method: `POST`
- Path: `/api/lead-discovery/businesses`
- Request:
  - Business profile payload
- Response:
  - `business` object
  - `error` string|null

### Search history

- Method: `GET`
- Path: `/api/lead-discovery/history`
- Response:
  - `history` array
  - `error` string|null

## Notifications API

### Send notification

- Method: `POST`
- Path: `/api/notifications/send`
- Request:
  - `type` (`email`, `sms`, `whatsapp`)
  - `recipient`
  - `message`
- Response:
  - `status` string
  - `error` string|null
- Current implementation: `sendNotification(notification)` in `services/notifications`

## Analytics / Reporting API

### Analytics data

- Method: `GET`
- Path: `/api/analytics`
- Response:
  - analytics metrics payload
  - `error` string|null

### Reports

- Method: `GET /api/reports`
  - Returns reports list.

- Method: `POST /api/reports`
  - Creates or generates a report.
  - Request payload may include report type, date range, and filters.

## Authentication and Authorization

All API endpoints should require a valid authenticated session and enforce tenant scoping. Current code uses browser-side Supabase client operations with no server-side guard.

## Error Handling

Standardize the API response envelope:

- `success`: boolean
- `data`: object | null
- `error`: string | null
- `validationErrors`: object | null

## Notes

The current repository has partial application flow and scaffolding. Implementing a robust API layer is a priority before expanding CRM, lead discovery, and automation capabilities.
