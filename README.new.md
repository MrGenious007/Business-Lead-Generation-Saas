# LeadPilot AI

LeadPilot AI is an AI-powered lead generation, CRM, marketing automation, and customer acquisition platform designed to help local businesses grow, generate leads, and increase revenue.

## Current status

The foundation is now implemented and the product is moving into deeper CRM and automation work.

### Completed

- Established a modular monorepo structure for the web app, admin app, API, and shared product packages.
- Implemented the initial CRM foundation for leads, companies, deals, tasks, notes, and activity tracking.
- Added a dashboard shell, reusable layout widgets, and a working CRM workspace experience.
- Added authentication scaffolding with protected routes and organization-aware app structure.

### Pending

- Full OAuth and social authentication.
- Production-grade database and access-control setup.
- AI reports, marketing automation, analytics dashboards, and assistant workflows.

## Architecture

The product is organized as a modular monorepo so key capabilities can be developed and deployed independently:

- apps/web: customer-facing Next.js application
- apps/admin: internal admin portal
- apps/api: API and edge function entry points
- packages/ui: shared UI components
- packages/crm: CRM domain logic
- packages/lead-discovery: lead discovery and enrichment
- packages/marketing: campaigns and messaging workflows
- packages/ai-engine: AI reports and recommendations
- packages/analytics: metrics, dashboards, and reporting
- packages/auth: authentication and access control
- packages/shared: shared utilities and types
- packages/database: schema and persistence helpers

## Getting started

1. Install pnpm if needed.
2. Run `pnpm install` from the repository root.
3. Start the web app with `pnpm dev`.
