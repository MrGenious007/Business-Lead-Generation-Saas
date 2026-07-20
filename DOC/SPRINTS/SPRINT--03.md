# Sprint 002 - Production Database & Multi-Tenant Foundation

**Sprint ID:** SPRINT-002

**Priority:** Critical

**Estimated Duration:** 5–7 Days

**Status:** Planned

---

# Sprint Goal

Build the production-ready backend foundation for LeadPilot AI by implementing the complete multi-tenant database, authentication integration, role-based access control (RBAC), Row Level Security (RLS), audit logging, and database migrations.

This sprint must establish a scalable and secure foundation for all future modules.

No CRM or business features should be implemented in this sprint.

---

# Business Value

This sprint enables:

- Secure multi-tenant SaaS architecture
- Organization isolation
- Enterprise security
- Production database
- Future CRM modules
- Future AI modules
- Future marketing modules

Without this sprint the application cannot safely scale to multiple customers.

---

# Scope

## Included

- Production Database
- Organizations
- Users
- Memberships
- Roles
- Permissions
- RBAC
- Supabase Auth Integration
- Row Level Security
- Audit Logging
- Database Migrations
- Seed Data
- Environment Configuration
- Repository Layer
- Database Services
- Validation
- Unit Tests

## Excluded

- CRM
- Lead Discovery
- Google Places
- AI
- Marketing
- Analytics
- Billing

---

# Work Items

## WI-001

### Organizations

Create

- organizations table

Fields

- id
- name
- slug
- logo_url
- timezone
- currency
- industry
- status
- created_at
- updated_at
- deleted_at

Acceptance Criteria

- CRUD
- Validation
- Soft Delete
- UUID Primary Key

---

## WI-002

### Users

Extend Supabase Auth

Profile Table

Fields

- id
- organization_id
- full_name
- email
- phone
- avatar_url
- status
- created_at
- updated_at

Acceptance Criteria

- Linked to organization
- Linked to auth.users

---

## WI-003

### Memberships

Create

organization_members

Fields

- user_id
- organization_id
- role_id
- status

Support

- Multiple Organizations
- Invitation Ready

---

## WI-004

### Roles

Create

roles

Seed

- Owner
- Admin
- Manager
- Sales
- Marketing
- Viewer

---

## WI-005

### Permissions

Create

permissions

role_permissions

Support

- CRUD permissions
- Module permissions
- Feature permissions

---

## WI-006

### Audit Logs

Create

audit_logs

Track

- Login
- Create
- Update
- Delete
- Export
- Import

---

## WI-007

### Row Level Security

Enable RLS on every business table.

Policies

- Organization Isolation
- Owner Access
- Admin Access
- Read Rules
- Write Rules

---

## WI-008

### Database Migrations

Create

Supabase SQL migrations

Requirements

- Idempotent
- Rollback Safe
- Indexed
- Foreign Keys
- Constraints

---

## WI-009

### Seed Data

Seed

Organization

Admin User

Roles

Permissions

Demo Organization

---

## WI-010

### Environment

Create

.env.example

Document

- Supabase URL
- Anon Key
- Service Role Key
- OpenAI Key
- Google Places API Key
- Resend Key
- Razorpay Keys

---

# Technical Requirements

Use

- PostgreSQL
- Supabase
- UUID
- Foreign Keys
- Indexes
- Transactions
- RLS
- Zod
- TypeScript Strict Mode

---

# Security

Must include

- JWT Validation
- Organization Isolation
- RBAC
- RLS
- Secure Environment Variables
- SQL Injection Protection
- Input Validation
- Audit Logging

---

# Folder Changes

Expected folders

packages/

database/

auth/

shared/

apps/api/

apps/web/

---

# Files Expected

Database

- schema.sql
- migrations/*
- seed.sql

API

- organization.service.ts
- role.service.ts
- permission.service.ts

Validation

- organization.schema.ts
- role.schema.ts

Types

- organization.ts
- role.ts
- permission.ts

---

# Testing

Must include

- Migration Tests
- Repository Tests
- Validation Tests
- Permission Tests
- Organization Isolation Tests

---

# Documentation Updates

Update

- PROJECT_STATUS.md
- DATABASE_SCHEMA.md
- API_SPEC.md
- CHANGELOG.md

---

# Definition of Done

Sprint is complete only when

- All migrations execute successfully
- Database builds successfully
- RLS enabled
- Organizations implemented
- Roles implemented
- Permissions implemented
- Audit Logs implemented
- Seed Data available
- Tests passing
- Documentation updated
- No TODO comments
- No placeholder code

---

# Deliverables

Production-ready SaaS foundation including

- Multi-Tenant Database
- Authentication Integration
- Organization Management
- RBAC
- Permissions
- RLS
- Audit Logging
- Database Migrations

This foundation will be used by Sprint 003 (Lead Discovery Engine) and all future modules.