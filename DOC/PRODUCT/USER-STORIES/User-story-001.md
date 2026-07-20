# User Story 001

## Title
Lead discovery for marketing managers in Delhi

## As a
Marketing Manager

## I want to
search for local businesses in Delhi by keyword, industry, and radius, import them into my organization, and export the results.

## So that
I can build a targeted outreach list and manage leads for my organization without exposing other tenants' data.

## Acceptance Criteria

- The user can access the lead discovery page only when authenticated.
- The user can enter a keyword, industry, city, state, country, and radius.
- The lead discovery search returns business results scoped to Delhi.
- The user can navigate through paginated search results.
- The user can import discovered businesses into their current organization.
- Duplicate businesses are detected and not imported twice.
- The user can export search results in CSV or JSON format.
- The user only sees and imports businesses belonging to their current organization.
- The system blocks access for unauthenticated users and users outside the organization.

## Notes

This story is part of the Lead Discovery feature and should be implemented after the authentication and organization foundation are stable. The search service must run server-side and enforce tenant isolation.
