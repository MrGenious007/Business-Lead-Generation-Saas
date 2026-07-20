# API Specification

## Overview

This document describes the current API service design and the planned API contract for LeadPilot AI. The repository today contains service-level operations rather than a fully implemented `/api` route layer.

Existing service modules reference these domain operations:
- `services/auth.ts`
- `services/organization.ts`
- `services/crm.ts`
- `services/lead-discovery` (planned)
- `services/notifications` (logging/dispatch)

The API spec below combines the current service surface with the intended backend endpoints for a production-ready app.

## Authentication

### Sign in

- Method: `POST`
- Path: `/api/auth/signin`
- Request:
  - `email` (string)
  - `password` (string)
- Response:
  - `user` object
  - `session` metadata
  - `error` string|null
- Current implementation: `signInWithPassword(payload)` in `services/auth.ts`

### Sign up

- Method: `POST`
- Path: `/api/auth/signup`
- Request:
  - `fullName` (string)
  - `organizationName` (string)
  - `email` (string)
  - `password` (string)
- Response:
  - `user` object
  - `organization` object
  - `error` string|null
- Current implementation: `signUpWithPassword(payload)` in `services/auth.ts`
- Side effects: create an organization record and upsert a `profiles` row.

### Password reset request

- Method: `POST`
- Path: `/api/auth/password-reset`
- Request:
  - `email` (string)
- Response:
  - `success` boolean
  - `error` string|null
- Current implementation: `resetPasswordForEmail(email)` in `services/auth.ts`

### Password update

- Method: `POST`
- Path: `/api/auth/password-update`
- Request:
  - `password` (string)
  - `token` (string) optional depending on flow
- Response:
  - `success` boolean
  - `error` string|null
- Current implementation: `updatePassword(password)` in `services/auth.ts`

### Logout

- Method: `GET` or `POST`
- Path: `/api/auth/logout`
- Response:
  - `success` boolean
  - `error` string|null
- Current implementation: page/UI references this endpoint, but the route is not yet implemented.

## Organization API

### List organizations

- Method: `GET`
- Path: `/api/organizations`
- Response:
  - `organizations` array
  - `error` string|null
- Current implementation: `getOrganizations()` in `services/organization.ts`

### Get organization by ID

- Method: `GET`
- Path: `/api/organizations/{organizationId}`
- Response:
  - `organization` object
  - `error` string|null
- Current implementation: `getOrganizationById(id)` in `services/organization.ts`

### Create organization

- Method: `POST`
- Path: `/api/organizations`
- Request:
  - `name`, `slug`, `industry`, `website`, `phone`, `address`, `description`
- Response:
  - `organization` object
  - `error` string|null
- Current implementation: `createOrganization(payload)` in `services/organization.ts`

### Update organization

- Method: `PATCH`
- Path: `/api/organizations/{organizationId}`
- Request:
  - Partial organization fields
- Response:
  - `organization` object
  - `error` string|null
- Current implementation: `updateOrganization(id, payload)` in `services/organization.ts`

### Delete organization

- Method: `DELETE`
- Path: `/api/organizations/{organizationId}`
- Response:
  - `success` boolean
  - `error` string|null
- Current implementation: `deleteOrganization(id)` in `services/organization.ts`

### Organization settings

- Method: `GET`
- Path: `/api/organizations/{organizationId}/settings`
- Response:
  - `settings` object
  - `error` string|null
- Current implementation: `getOrganizationSettings(organizationId)` in `services/organization.ts`

- Method: `POST`
- Path: `/api/organizations/{organizationId}/settings`
- Request:
  - `timezone`, `currency`, `notificationEmail`, `allowInvites`, `autoAssignLeads`, `defaultLanguage`
- Response:
  - `settings` object
  - `error` string|null
- Current implementation: `upsertOrganizationSettings(organizationId, payload)` in `services/organization.ts`

### Organization members and invitations

- Method: `GET`
- Path: `/api/organizations/{organizationId}/members`
- Response:
  - `members` array
  - `error` string|null
- Current implementation: `getOrganizationMembers(organizationId)` in `services/organization.ts`

- Method: `POST`
- Path: `/api/organizations/{organizationId}/members/invite`
- Request:
  - `email` (string)
  - `role` (string)
- Response:
  - `invitation` object
  - `error` string|null
- Current implementation: `inviteOrganizationMember(organizationId, email, role)` in `services/organization.ts`

- Method: `PATCH`
- Path: `/api/organizations/members/{memberId}`
- Request:
  - `role` (string)
- Response:
  - `member` object
  - `error` string|null
- Current implementation: `updateOrganizationMember(id, role)` in `services/organization.ts`

- Method: `DELETE`
- Path: `/api/organizations/members/{memberId}`
- Response:
  - `success` boolean
  - `error` string|null
- Current implementation: `deleteOrganizationMember(id)` in `services/organization.ts`

## CRM API

### Leads

- `GET /api/crm/leads`
  - Returns list of leads.
  - Current implementation: `getLeads()` in `services/crm.ts`

- `POST /api/crm/leads`
  - Creates a lead.
  - Request payload: lead fields.
  - Current implementation: `createLead(payload)` in `services/crm.ts`

- `PATCH /api/crm/leads/{leadId}`
  - Updates a lead.
  - Current implementation: `updateLead(id, payload)` in `services/crm.ts`

### Companies

- `GET /api/crm/companies`
  - Returns list of companies.
  - Current implementation: `getCompanies()` in `services/crm.ts`

- `POST /api/crm/companies`
  - Creates a company.
  - Current implementation: `createCompany(payload)` in `services/crm.ts`

### Contacts

- `GET /api/crm/contacts`
  - Returns list of contacts.
  - Current implementation: `getContacts()` in `services/crm.ts`

### Deals

- `GET /api/crm/deals`
  - Returns list of deals.
  - Current implementation: `getDeals()` in `services/crm.ts`

- `POST /api/crm/deals`
  - Creates a deal.
  - Current implementation: `createDeal(payload)` in `services/crm.ts`

### Pipelines

- `GET /api/crm/pipelines`
  - Returns list of pipeline definitions.
  - Current implementation: `getPipelines()` in `services/crm.ts`

### Tasks

- `GET /api/crm/tasks`
  - Returns tasks.
  - Current implementation: `getTasks()` in `services/crm.ts`

- `POST /api/crm/tasks`
  - Creates a task.
  - Current implementation: `createTask(payload)` in `services/crm.ts`

### Notes

- `POST /api/crm/notes`
  - Creates a note.
  - Current implementation: `createNote(payload)` in `services/crm.ts`

### Activity

- `GET /api/crm/activity`
  - Returns activity timeline entries.
  - Current implementation: `getActivityTimeline()` in `services/crm.ts`

## Lead Discovery API

The application references a lead discovery workflow and Google Places integration, but the actual API surface is not yet implemented.

### Search businesses

- Method: `POST`
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
