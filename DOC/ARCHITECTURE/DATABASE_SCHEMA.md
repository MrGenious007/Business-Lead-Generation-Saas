# Database Schema

## Overview

LeadPilot AI uses Supabase Postgres with migration-driven schema management under `supabase/migrations`. The current foundation is centered on authentication-linked profiles, multi-tenant organizations, organization memberships and settings, invitation records, and a tenant-scoped CRM schema.

## Migration Inventory

- `007_create_profiles_organizations.sql`
  - Creates `profiles`, `organizations`, `organization_members`, `organization_settings`, `crm_companies`, and `crm_leads`.
- `008_multi_tenant_foundation.sql`
  - Adds `profiles.active_organization_id`, `organizations.description`, membership/settings uniqueness constraints, `organization_invitations`, and supporting indexes.
- `009_rbac_policies.sql`
  - Enables RLS for tenant tables and adds membership and role helper functions plus first-pass policies.
- `010_database_foundation.sql`
  - Adds audit columns, soft-delete support, stricter constraints, filtered indexes, update triggers, active-row-aware RLS, and same-organization profile visibility.
- `011_crm_database_foundation.sql`
  - Completes the CRM schema with contacts, deals, pipelines, pipeline stages, tasks, notes, activity, tags, custom fields, tag assignments, custom field values, and active-row-aware RLS across CRM tables.

## Core Tables

### `profiles`

- Primary key: `id UUID`
- Foreign key: `id -> auth.users(id)`
- Key columns:
  - `email`
  - `full_name`
  - `role`
  - `active_organization_id -> organizations(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> auth.users(id)`

### `organizations`

- Primary key: `id UUID`
- Key columns:
  - `name`
  - `slug`
  - `industry`
  - `website`
  - `phone`
  - `address`
  - `description`
  - `owner_id -> profiles(id)`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_members`

- Primary key: `id UUID`
- Unique constraint: `(organization_id, profile_id)`
- Key columns:
  - `organization_id -> organizations(id)`
  - `profile_id -> profiles(id)`
  - `role` with allowed values `owner`, `admin`, `manager`, `member`, `viewer`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_settings`

- Primary key: `id UUID`
- Unique constraint: `organization_id`
- Key columns:
  - `organization_id -> organizations(id)`
  - `timezone`
  - `currency`
  - `notification_email`
  - `allow_invites`
  - `auto_assign_leads`
  - `default_language`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `organization_invitations`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `email`
  - `role`
  - `status`
  - `accepted_at`
  - `created_at`
  - `updated_at`

## CRM Tables

### `crm_companies`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `name`
  - `website`
  - `industry`
  - `phone`
  - `address`
  - `status`
  - `description`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_leads`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `company_id -> crm_companies(id)`
  - `contact_id -> crm_contacts(id)`
  - `owner_id -> profiles(id)`
  - `full_name`
  - `email`
  - `phone`
  - `company_name`
  - `status`
  - `source`
  - `notes`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_contacts`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `company_id -> crm_companies(id)`
  - `owner_id -> profiles(id)`
  - `full_name`
  - `email`
  - `phone`
  - `title`
  - `status`
  - `linkedin_url`
  - `notes`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_pipelines`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `name`
  - `description`
  - `is_default`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_pipeline_stages`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `pipeline_id -> crm_pipelines(id)`
  - `name`
  - `position`
  - `probability`
  - `color`
  - `is_closed_won`
  - `is_closed_lost`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_deals`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `pipeline_id -> crm_pipelines(id)`
  - `stage_id -> crm_pipeline_stages(id)`
  - `company_id -> crm_companies(id)`
  - `contact_id -> crm_contacts(id)`
  - `lead_id -> crm_leads(id)`
  - `owner_id -> profiles(id)`
  - `title`
  - `amount`
  - `stage`
  - `status`
  - `expected_close_date`
  - `closed_at`
  - `notes`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_tasks`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `owner_id -> profiles(id)`
  - `related_lead_id -> crm_leads(id)`
  - `related_deal_id -> crm_deals(id)`
  - `related_company_id -> crm_companies(id)`
  - `related_contact_id -> crm_contacts(id)`
  - `title`
  - `description`
  - `due_date`
  - `priority`
  - `status`
  - `completed_at`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_notes`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `entity_type`
  - `entity_id`
  - `content`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_activity`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `actor_id -> profiles(id)`
  - `entity_type`
  - `entity_id`
  - `action`
  - `action_type`
  - `details`
  - `metadata`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_tags`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `name`
  - `color`
  - `description`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_tag_assignments`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `tag_id -> crm_tags(id)`
  - `entity_type`
  - `entity_id`
  - `created_by -> profiles(id)`
  - `created_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_custom_fields`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `entity_type`
  - `name`
  - `slug`
  - `field_type`
  - `options`
  - `is_required`
  - `is_active`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

### `crm_custom_field_values`

- Primary key: `id UUID`
- Key columns:
  - `organization_id -> organizations(id)`
  - `custom_field_id -> crm_custom_fields(id)`
  - `entity_type`
  - `entity_id`
  - `value_text`
  - `value_number`
  - `value_boolean`
  - `value_date`
  - `value_json`
  - `created_by -> profiles(id)`
  - `updated_by -> profiles(id)`
  - `created_at`
  - `updated_at`
  - `deleted_at`
  - `deleted_by -> profiles(id)`

## Indexes and Constraints

Notable indexes and constraints currently include:

- `organization_members_organization_profile_key`
- `organization_settings_organization_id_key`
- `profiles_active_organization_id_idx`
- `organization_members_profile_id_idx`
- `organization_invitations_organization_id_idx`
- `crm_pipelines_unique_default_per_org`
- filtered active-row indexes for organizations, memberships, settings, profiles, and CRM entity lookups

## Triggers and Helper Functions

### Triggers

- `set_profiles_updated_at`
- `set_organizations_updated_at`
- `set_organization_members_updated_at`
- `set_organization_settings_updated_at`
- `set_crm_companies_updated_at`
- `set_crm_leads_updated_at`
- `set_crm_contacts_updated_at`
- `set_crm_pipelines_updated_at`
- `set_crm_pipeline_stages_updated_at`
- `set_crm_deals_updated_at`
- `set_crm_tasks_updated_at`
- `set_crm_notes_updated_at`
- `set_crm_activity_updated_at`
- `set_crm_tags_updated_at`
- `set_crm_custom_fields_updated_at`
- `set_crm_custom_field_values_updated_at`

All use `public.set_updated_at_timestamp()` to maintain `updated_at` automatically.

### Security Helper Functions

- `public.is_organization_member(target_organization_id UUID)`
- `public.has_organization_role(target_organization_id UUID, allowed_roles TEXT[])`
- `public.shares_organization_with_profile(target_profile_id UUID)`

## Row-Level Security

RLS is enabled for:

- `profiles`
- `organizations`
- `organization_members`
- `organization_settings`
- `organization_invitations`
- `crm_companies`
- `crm_leads`
- `crm_contacts`
- `crm_deals`
- `crm_pipelines`
- `crm_pipeline_stages`
- `crm_tasks`
- `crm_notes`
- `crm_activity`
- `crm_tags`
- `crm_tag_assignments`
- `crm_custom_fields`
- `crm_custom_field_values`

The policy model enforces:

- users can create and update their own profile rows
- users can read their own profile and same-organization member profiles
- organization rows are tenant-scoped to active members
- organization writes are restricted by role
- membership and settings writes are restricted by role
- CRM read access is tenant-scoped to organization members
- CRM records use audit fields, update triggers, and soft delete columns for lifecycle tracking
- pipeline, tag, and custom-field configuration writes are restricted to owner, admin, and manager roles
- company, contact, lead, deal, task, note, activity, tag assignment, and custom-field value writes are restricted to owner, admin, manager, and member roles

## Notes

- WI-201 adds the missing CRM schema and RLS coverage through `011_crm_database_foundation.sql`.
- Analytics and notification tables referenced by long-term product plans are still outside the current migration set.
