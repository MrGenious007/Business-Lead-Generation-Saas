# Roadmap

## Current Position

LeadPilot AI is at an early foundation stage. The repository contains a mixture of working UI scaffolding, placeholder workspaces, and incomplete backend/DB integration. The project is best approached by stabilizing the foundation before expanding feature breadth.

## Phase 1: Production Foundation

1. Authentication
   - Complete signup, login, logout, password reset
   - Align with Supabase auth and profile tables
   - Implement secure server-side auth flows

2. Organization
   - Build organization creation and tenant context
   - Implement organization settings and membership
   - Replace hard-coded org IDs with real organization selection

3. Roles and Permissions
   - Standardize RBAC model and role names
   - Enforce permissions in API routes and UI
   - Add membership table and role inheritance

4. Database
   - Expand migrations to support organizations, CRM, and lead discovery
   - Add audit and tenant fields
   - Enable Supabase RLS for tenant isolation

5. RLS
   - Define policies for all tenant-bound tables
   - Ensure only authorized members can read/write data

6. Audit Logs
   - Log critical changes to org membership, permissions, and CRM operations
   - Surface audit history in admin views

7. Settings
   - Implement organization settings UX and persistence
   - Add environment-aware defaults for timezone, currency, notifications

8. Notifications
   - Define notification logs
   - Add the foundational notification dispatch service

9. Theme
   - Add dark/light mode support
   - Polish responsive UI and navigation

## Phase 2: Lead Discovery

1. Google Places API
   - Add secure search proxy and business ingestion
   - Store discovered businesses in a proper `businesses` table

2. Google Maps and Business Profile
   - Add business detail pages and map visualizations
   - Map searches to Google Business Profile data

3. Business Import
   - Add CSV import and bulk lead ingest

4. Duplicate Detection
   - Detect duplicates by `place_id`, company name, website, or email

5. Refresh Strategy
   - Add refresh/update flows for stale business data

6. Business Search
   - Add keyword, industry, geography, and saved result search

7. Lead Enrichment
   - Build enrichment data pipeline for discovered leads

8. Geo Search / Radius Search
   - Add radius-based searches and nearby opportunity discovery

## Phase 3: CRM

1. Companies, Contacts, Leads
   - Add full CRUD workflows for CRM entities
   - Connect lead discovery to CRM lead creation

2. Deals and Pipelines
   - Add pipeline stages, deal cards, and forecasting

3. Activities, Calls, Meetings, Tasks
   - Track interactions, appointments, and task workflows

4. Notes, Documents, Attachments
   - Capture contextual notes and supporting files

5. Timeline
   - Build timeline views for lead and customer histories

6. Tags, Custom Fields
   - Add metadata extensibility for CRM records

7. Automation
   - Trigger workflows based on CRM events

## Phase 4: Business Intelligence

1. Website Analysis
   - Add site audits and health checks

2. SEO Audit
   - Build SEO scoring and recommendations

3. Page Speed, Accessibility
   - Add performance and accessibility reports

4. Competitor Analysis
   - Add competitor and market intelligence

5. Reviews and Social Monitoring
   - Track Google Reviews and social sentiment

6. Scorecards
   - Business Health, Marketing, Trust, Growth, Opportunity

7. PDF Reporting
   - Export reports to PDF and shareable formats

## Phase 5: Marketing Automation

1. Email, WhatsApp, SMS campaigns
2. Ads workflows
3. Landing pages
4. Referral campaigns
5. Workflow builder
6. A/B testing
7. Campaign analytics

## Phase 6: Analytics

1. Revenue, funnel, ROI
2. LTV and CAC
3. Conversion rate tracking
4. Forecasting and custom reports
5. Export to PDF/Excel/CSV

## Phase 7: AI

1. Business consultant assistant
2. Marketing, SEO, sales assistants
3. Campaign and content generation
4. AI chat and recommendations
5. Predictive analytics

## Phase 8: Enterprise

1. White-label support
2. API marketplace
3. Plugin system
4. Mobile app and client portals
5. Billing and subscriptions
6. Usage tracking

## Immediate Next Milestones

- Stabilize auth, organization, RBAC, and DB schema.
- Create the missing `types/*` modules and fix broken imports.
- Implement actual API routes or server actions for auth and organization operations.
- Add the `businesses` table and lead discovery backend.
- Create a consistent route structure and remove unused placeholder workspace files.

## Progress Tracking

The current repository is roughly 25% complete. The most valuable next step is to close foundation gaps before expanding feature work.
