# Sprint 003: Lead Discovery Foundation & CRM Integration

Sprint duration: 2 weeks (adjust per team calendar)

## Sprint Objective

Implement the lead discovery backend and initial CRM integration so authenticated organization users can search, import, and manage discovered businesses in their tenant workspace. This sprint builds on the authentication and organization foundation established in Sprint 002.

## Business Value

- Enables marketing teams to discover local prospects and import them into the CRM.
- Provides the first end-to-end lead ingestion flow connecting discovery to CRM.
- Validates the tenant-scoped data model and import/duplicate detection pipelines.

## Scope

In-scope:
- `businesses` and `lead_search_history` migrations
- Server-side Google Places wrapper service (server-side only, keep API keys secret) — initial implementation must be modular and provider-agnostic; include a mocked provider for offline/local testing
- `POST /api/lead-discovery/search`, `POST /api/lead-discovery/businesses`, `GET /api/lead-discovery/history`
- Duplicate detection by `place_id`, website, and normalized name+address
- Import into `crm_companies` / `businesses` with organization scoping
- Pagination and export (CSV) support for search results
- UI: lead discovery page wired to server endpoints (search, import, export)
- Tests for duplicate detection and import logic
- Documentation updates

Out-of-scope:
- Full Google Business Profile sync
- Mass-import/ETL pipelines
- AI enrichment services

## Success Criteria

- Authenticated org users can run searches and see paginated results
- Search runs server-side and does not expose API keys to the browser
- Import operation persists business records scoped to organization
- Duplicate detection prevents duplicate imports
- Export produces valid CSV with key fields
- Unit and integration tests for duplicate detection and import
- Documentation updated: API_SPEC.md, DATABASE_SCHEMA.md, FEATURES.md, PROJECT_STATUS.md, CHANGELOG.md

## Deliverables

- `supabase/migrations` updated with `businesses` and `lead_search_history` tables
- `services/lead-discovery/google-places.ts` server-side wrapper with provider abstraction and mocked provider implementation
- API routes under `app/api/lead-discovery/*`
- UI page `app/leads/page.tsx` wired to the new endpoints
- Duplicate detection and import service in `services/lead-discovery.ts`
- CSV export endpoint or client-side exporter that requests server-side data
- Tests and documentation

## Risks & Mitigations

- Risk: API quota or billing for Google Places. Mitigation: implement mock provider and rate-limit; require env var to enable production provider.
- Risk: Duplicate detection complexity. Mitigation: implement conservative matching rules and flag possible duplicates for manual review.
- Risk: Data model mismatches with CRM tables. Mitigation: coordinate with Sprint 002 schema changes and keep imports additive.

## Implementation Tasks (ordered)

1. Review Sprint 002 outcomes and ensure organization scoping works.
2. Add migrations for `businesses` and `lead_search_history`.
3. Implement server-side provider abstraction in `services/lead-discovery/providers` with a `mock` provider and `google-places` provider skeleton.
4. Implement `POST /api/lead-discovery/search` that accepts filters, delegates to provider, normalizes results, and returns paginated results (and optionally persists search history).
5. Implement `POST /api/lead-discovery/businesses` to import a selected business: run duplicate detection, insert or update business and optionally create `crm_company` record.
6. Add CSV export route `GET /api/lead-discovery/export?queryId=...` or `GET /api/lead-discovery?export=csv&filters=...`.
7. Wire `app/leads/page.tsx` to the server endpoints with loading/error states and pagination.
8. Add duplicate detection utilities and unit tests.
9. Add integration tests for search → import flow using mocked provider.
10. Run lint, typecheck, and build; fix issues.
11. Update documentation and changelog.

## Estimated Effort

- Engineering (2 devs): 2 weeks (depends on provider complexity)
- QA & Documentation: concurrent across sprint

---

This sprint should only start after Sprint 002 is complete and approved. Please review before implementation.