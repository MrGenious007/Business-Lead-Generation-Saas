# LeadPilot AI — API Architecture

This document describes the REST API architecture, conventions, and implementation patterns used across LeadPilot AI.

## Design Goals

- **Consistency**: All endpoints follow the same request/response shapes.
- **Security**: Every endpoint authenticates the caller and authorizes the action.
- **Organization Scoping**: CRM data is isolated by organization.
- **Flexibility**: List endpoints support pagination, filtering, sorting, and search.
- **Efficiency**: Bulk endpoints reduce round-trips for mass operations.

## Base URL

All API routes are served under `/api` using Next.js App Router route handlers.

```
/api/auth/*              # Authentication
/api/crm/*               # CRM resources
```

## Authentication

API routes create a server-side Supabase client from request cookies using `lib/supabase/server.ts`. The `UserService.getAuthenticatedUser` helper extracts the current user and validates the session.

Unauthenticated requests receive:

```json
{ "error": "Authentication required." }
```

with HTTP status `401`.

## Authorization

RBAC is enforced via `lib/rbac.ts`. CRM endpoints require:

- Read operations: `crm.read`
- Write operations: `crm.write`

Insufficient permissions return:

```json
{ "error": "Forbidden." }
```

with HTTP status `403`.

## Organization Context

After authentication, API handlers resolve the user's active organization via `services/crm/utils.ts#getActiveOrganizationId`. All CRM queries include `organization_id` filters; mutations inject the organization id into payloads.

If no active organization is selected, the API returns:

```json
{ "error": "No active organization selected." }
```

with HTTP status `400`.

## Resource Naming

Resources are plural nouns:

```
/api/crm/leads
/api/crm/companies
/api/crm/contacts
/api/crm/deals
/api/crm/tasks
/api/crm/notes
/api/crm/activities
```

## Standard Endpoints

### List Records

```
GET /api/crm/{entity}?page=1&pageSize=25&search=acme&sortBy=created_at&sortDirection=desc&status=new
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Items per page (default: 25, max: 250) |
| `search` | string | Free-text search term |
| `sortBy` | string | Column to sort by |
| `sortDirection` | `asc` \| `desc` | Sort direction |
| `*` | string \| string[] | Any other parameter is treated as an equality filter; comma-separated values become an `IN` filter |

#### Response

```json
{
  "data": [ /* records */ ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 100,
    "totalPages": 4
  }
}
```

### Create Record

```
POST /api/crm/{entity}
```

#### Request Body

Validated by the entity's Zod create schema. `organization_id` is injected server-side.

```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "status": "new"
}
```

#### Response

```json
{
  "id": "...",
  "organization_id": "...",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "status": "new",
  "created_at": "...",
  "updated_at": "..."
}
```

HTTP status `201`.

### Get Record

```
GET /api/crm/{entity}/{id}
```

#### Response

The requested record or `404 Not Found` if it does not exist or belongs to another organization.

### Update Record

```
PATCH /api/crm/{entity}/{id}
```

#### Request Body

Validated by the entity's Zod update schema (partial).

```json
{
  "status": "contacted"
}
```

#### Response

The updated record or `404 Not Found` if not accessible.

### Delete Record

```
DELETE /api/crm/{entity}/{id}
```

#### Response

`204 No Content` on success; `404 Not Found` if not accessible.

## Bulk Endpoints

Bulk operations are available at `/api/crm/{entity}/bulk`.

### Bulk Create

```
POST /api/crm/{entity}/bulk
```

#### Request Body

An array of records validated by the create schema.

```json
[
  { "full_name": "Alice", "email": "alice@example.com" },
  { "full_name": "Bob", "email": "bob@example.com" }
]
```

#### Response

Array of created records with HTTP status `201`.

### Bulk Update

```
PATCH /api/crm/{entity}/bulk
```

#### Request Body

An object containing `ids` and the fields to update.

```json
{
  "ids": ["id-1", "id-2"],
  "status": "qualified"
}
```

#### Response

Array of updated records. Returns `403 Forbidden` if any id does not belong to the current organization.

### Bulk Delete

```
DELETE /api/crm/{entity}/bulk
```

#### Request Body

An array of ids.

```json
["id-1", "id-2"]
```

#### Response

`204 No Content` on success. Returns `403 Forbidden` if any id does not belong to the current organization.

## Error Responses

All errors use a consistent JSON shape:

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request / validation error |
| `401` | Authentication required |
| `403` | Forbidden |
| `404` | Resource not found |
| `500` | Internal server error / database error |

## Implementation Layers

```
Route Handler (app/api/crm/*/route.ts)
        │
        ▼
Entity Route Factory (app/api/crm/lib/factory.ts)
        │
        ▼
Auth Helpers (app/api/crm/lib/auth.ts)
Query Parser (app/api/crm/lib/query.ts)
Response Helpers (app/api/crm/lib/response.ts)
        │
        ▼
Domain Service (services/crm/*.ts)
        │
        ▼
Supabase Client (lib/supabase/server.ts)
```

## Code Patterns

### Adding a New Entity

1. Define the TypeScript type in `types/crm.ts`.
2. Add Zod create/update schemas in `lib/validators/crm.ts`.
3. Implement the service in `services/crm/{entity}.ts` with `list`, `create`, `createMany`, `getById`, `update`, `updateMany`, `delete`, and `deleteMany` methods.
4. Register the service in `services/crm/index.ts`.
5. Create route files:
   - `app/api/crm/{entity}/route.ts`
   - `app/api/crm/{entity}/[id]/route.ts`
   - `app/api/crm/{entity}/bulk/route.ts`
6. Wire the service and schemas through `createEntityRoutes`.
7. Add tests and update API documentation.
