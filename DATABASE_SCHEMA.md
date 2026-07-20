# Database Schema

## Overview

This project currently uses Supabase as the backend database platform. The repository includes a small set of SQL migration files in `supabase/migrations` and a seed script in `supabase/seed`.

The current codebase also references a broader set of tables through service modules and UI components. Many of those referenced tables are not yet reflected in the existing migration scripts.

## Existing Migration Tables

The current SQL migration file defines these tables:

- `users`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `password_hash VARCHAR(255) NOT NULL`
  - `role VARCHAR(50) NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `companies`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `name VARCHAR(255) NOT NULL`
  - `address TEXT`
  - `phone VARCHAR(50)`
  - `website VARCHAR(255)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `leads`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id UUID REFERENCES users(id) ON DELETE CASCADE`
  - `company_id UUID REFERENCES companies(id) ON DELETE SET NULL`
  - `status VARCHAR(50) NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `campaigns`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `name VARCHAR(255) NOT NULL`
  - `start_date TIMESTAMP WITH TIME ZONE`
  - `end_date TIMESTAMP WITH TIME ZONE`
  - `budget DECIMAL(10, 2)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `analytics`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE`
  - `impressions INT`
  - `clicks INT`
  - `conversions INT`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `reports`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `user_id UUID REFERENCES users(id) ON DELETE CASCADE`
  - `report_type VARCHAR(50) NOT NULL`
  - `content JSONB`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

## Seed Data

The seed script in `supabase/seed` inserts example businesses with attributes such as name, category, phone, website, email, address, latitude, longitude, rating, reviews, opening_hours, and social_media_links. This seed script expects a `businesses` table that is not present in the current migration file.

## Referenced But Missing Tables

Service and UI code currently expect a number of tables that do not exist in the migration file:

- `organizations`
- `organization_settings`
- `organization_members`
- `organization_invitations`
- `profiles`
- `crm_leads`
- `crm_companies`
- `crm_contacts`
- `crm_deals`
- `crm_pipelines`
- `crm_tasks`
- `crm_notes`
- `crm_activity`
- `businesses`
- `notifications`

## Recommended Schema Expansion

### Auth & Tenant Foundation

- `profiles`
  - `id UUID PRIMARY KEY REFERENCES auth.users(id)`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `full_name VARCHAR(255)`
  - `role VARCHAR(50)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `organizations`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `name VARCHAR(255) NOT NULL`
  - `slug VARCHAR(255) UNIQUE NOT NULL`
  - `industry VARCHAR(100)`
  - `website VARCHAR(255)`
  - `phone VARCHAR(50)`
  - `address TEXT`
  - `owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `created_by UUID REFERENCES profiles(id)`
  - `updated_by UUID REFERENCES profiles(id)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `deleted_at TIMESTAMP WITH TIME ZONE`

- `organization_members`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE`
  - `role VARCHAR(50) NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `organization_settings`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `timezone VARCHAR(100)`
  - `currency VARCHAR(10)`
  - `notification_email VARCHAR(255)`
  - `allow_invites BOOLEAN DEFAULT TRUE`
  - `auto_assign_leads BOOLEAN DEFAULT FALSE`
  - `default_language VARCHAR(10) DEFAULT 'en'`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### CRM Domain

- `crm_leads`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL`
  - `contact_id UUID REFERENCES crm_contacts(id) ON DELETE SET NULL`
  - `owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `full_name VARCHAR(255)`
  - `email VARCHAR(255)`
  - `phone VARCHAR(50)`
  - `status VARCHAR(50)`
  - `source VARCHAR(100)`
  - `notes TEXT`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_companies`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `name VARCHAR(255)`
  - `website VARCHAR(255)`
  - `industry VARCHAR(100)`
  - `address TEXT`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_contacts`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL`
  - `full_name VARCHAR(255)`
  - `email VARCHAR(255)`
  - `phone VARCHAR(50)`
  - `job_title VARCHAR(100)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_deals`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `company_id UUID REFERENCES crm_companies(id) ON DELETE SET NULL`
  - `lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL`
  - `owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `title VARCHAR(255)`
  - `amount DECIMAL(12, 2)`
  - `stage VARCHAR(50)`
  - `status VARCHAR(50)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_pipelines`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `name VARCHAR(255)`
  - `stages JSONB`
 - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_tasks`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `title VARCHAR(255)`
  - `due_date DATE`
  - `priority VARCHAR(50)`
  - `status VARCHAR(50)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_notes`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `entity_type VARCHAR(50)`
  - `entity_id UUID`
  - `content TEXT`
  - `created_by UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `crm_activity`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  - `action VARCHAR(255)`
  - `details TEXT`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

### Lead Discovery and Business Data

- `businesses`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE`
  - `business_name VARCHAR(255)`
  - `category VARCHAR(255)`
  - `phone VARCHAR(50)`
  - `website VARCHAR(255)`
  - `email VARCHAR(255)`
  - `address TEXT`
  - `latitude NUMERIC`
  - `longitude NUMERIC`
  - `rating NUMERIC(3, 2)`
  - `reviews INT`
  - `opening_hours TEXT`
  - `social_media_links JSONB`
  - `source VARCHAR(100)`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`
  - `updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

- `notifications`
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `organization_id UUID REFERENCES organizations(id)`
  - `type VARCHAR(50)`
  - `recipient VARCHAR(255)`
  - `message TEXT`
  - `status VARCHAR(50)`
  - `error TEXT`
  - `created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`

## Row-Level Security and Audit Fields

The product roadmap requires tenant isolation and role enforcement. Recommended RLS patterns:

- Attach `organization_id` to all tenant-bound tables.
- Implement policies so users only read/write rows for organizations where they are members.
- Add audit fields such as `created_by`, `updated_by`, and `deleted_by` where appropriate.
- Use soft deletes for historical integrity or explicit delete confirmation.

## Notes

The current repository is a scaffold. A production-ready schema should consolidate the auth model with Supabase auth, clearly separate `auth.users` from profile metadata, and define all referenced domain tables in migrations.
