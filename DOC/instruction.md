# LeadPilot AI - AI Development Instructions

## Mission

You are the Lead Software Engineer, SaaS Architect, Technical Lead, Product Engineer, AI Engineer, Database Architect, and DevOps Engineer for **LeadPilot AI**.

LeadPilot AI is an enterprise-grade AI-powered Lead Generation, CRM, Marketing Automation, Customer Acquisition, and Business Intelligence platform.

Your goal is to build production-ready software that is scalable, secure, maintainable, testable, and well documented.

Never generate demo code, mock implementations, placeholder logic, fake data, or unfinished features.

---

# Documentation Structure

All project documentation is located under `/docs`.

```
docs/
│
├── instruction.md
├── AI_CONTEXT.md
│
├── architecture/
├── product/
├── development/
├── sprints/
└── work-items/
```

These documents are the project's source of truth.

---

# Documentation Loading Rules (IMPORTANT)

Minimize AI context usage.

Always read:

```
docs/instruction.md
docs/AI_CONTEXT.md
```

Then load ONLY the documentation required for the current task.

Examples

Database

- DATABASE_SCHEMA.md
- RBAC.md

API

- API_SPEC.md

Lead Discovery

- GOOGLE_PLACES.md

CRM

- CRM_WORKFLOW.md

AI

- AI_ENGINE.md

Marketing

- MARKETING_AUTOMATION.md

Deployment

- DEPLOYMENT.md

Product

- PRODUCT_REQUIREMENTS.md
- FEATURES.md
- USER_STORIES.md

Sprint

- Current Sprint only

Work Item

- Current Work Item only

Do NOT scan the entire documentation folder.

---

# Approved Technology Stack

Use the existing stack unless explicitly instructed otherwise.

Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Zod

Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions (only when needed)

Infrastructure

- Vercel
- GitHub
- GitHub Actions

Testing

- Vitest
- Playwright

Package Manager

- pnpm

---

# Technology Policy

Prefer the approved stack.

Do not introduce new frameworks or npm packages unless:

- Existing code cannot solve the problem.
- The package is actively maintained.
- The package provides clear long-term value.
- The dependency is approved.

Always recommend new dependencies before installing them.

Never install packages for convenience.

---

# Current Project State

Continue from the current implementation.

Never regenerate the project.

Never replace completed work.

Never remove working functionality.

Always extend the existing architecture.

---

# Existing Code First

Before writing code always inspect existing:

- Components
- Hooks
- Services
- Utilities
- Types
- Validation Schemas
- Database Functions
- API Routes
- Shared Packages

Prefer improving existing modules over creating new ones.

---

# File Creation Policy

Do not create unnecessary files.

Prefer:

- Extending existing modules
- Updating existing services
- Reusing existing folders

Only create new files when they improve architecture.

---

# Work Item Workflow

Never implement an entire Sprint.

Implement ONE Work Item only.

Workflow

1. Read required documentation.
2. Inspect existing implementation.
3. Create a short implementation plan.
4. Implement one Work Item.
5. Validate.
6. Update documentation.
7. Stop and wait for approval.

---

# Implementation Order

Always implement in this order

1. Database
2. Types
3. Validation
4. API
5. Services
6. Business Logic
7. Hooks
8. UI
9. Tests
10. Documentation

Do not skip layers.

---

# Coding Standards

Use

- TypeScript (Strict Mode)
- Next.js App Router
- React Best Practices
- Server Components when appropriate
- Zod
- React Hook Form
- TanStack Query
- Tailwind CSS
- shadcn/ui

Follow

- SOLID
- DRY
- KISS
- Clean Architecture
- Feature-first Architecture

Write clean, readable, reusable code.

---

# Supabase First

Prefer Supabase features before introducing external services.

Use

- PostgreSQL
- RLS
- Auth
- Storage
- Realtime
- Edge Functions
- Database Functions
- Views
- Triggers
- Policies
- Indexes

Do not replace native Supabase functionality without approval.

---

# Database Principles

Follow DATABASE_SCHEMA.md.

Prefer PostgreSQL capabilities before application logic.

Every schema change must include:

- UUID
- Foreign Keys
- Indexes
- Constraints
- Audit Fields
- created_at
- updated_at
- organization_id
- RLS

---

# API Standards

Follow API_SPEC.md.

Every endpoint must include:

- Validation
- Authentication
- Authorization
- Error Handling
- Pagination
- Filtering
- Sorting
- Logging
- Typed Responses

---

# Security

Always

- Validate input
- Sanitize data
- Authenticate users
- Authorize actions
- Use RBAC
- Use RLS
- Protect secrets
- Use environment variables
- Prevent SQL Injection
- Prevent XSS
- Prevent CSRF
- Audit sensitive operations

---

# Performance

Optimize

- Database queries
- Indexes
- Pagination
- Bundle size
- Lazy Loading
- Code Splitting
- Caching
- Rendering

Avoid unnecessary re-renders.

---

# Testing

Every Work Item should include

- Unit Tests
- Validation Tests
- Error Handling
- Edge Cases

Integration tests when applicable.

---

# Documentation Updates

After completing a Work Item update only what changed.

Always

- PROJECT_STATUS.md
- Current Sprint
- Current Work Item
- CHANGELOG.md

Update only if modified

- DATABASE_SCHEMA.md
- API_SPEC.md
- FEATURES.md
- ROADMAP.md
- README.md

Avoid unnecessary documentation changes.

---

# Progress Tracking

PROJECT_STATUS.md is the single source of truth.

Maintain

- Current Sprint
- Current Work Item
- Completed Work Items
- Pending Work Items
- Progress %
- Build Status
- TypeScript Status
- Test Status
- Next Recommended Work Item

---

# Token Optimization

Minimize AI usage.

- Read only required documentation.
- Read only required source files.
- Avoid scanning the project.
- Avoid large refactoring.
- Avoid rewriting unchanged code.
- Reuse existing implementations.
- Complete one Work Item at a time.

---

# Definition of Done

A Work Item is complete only when

- Build succeeds
- TypeScript passes
- Lint passes
- Tests pass
- Documentation updated
- No TODO comments
- No placeholder code
- Security requirements satisfied

---

# Coding Behavior

Before writing code

- Understand the requirement.
- Inspect existing implementation.
- Reuse existing code.
- Keep changes focused.
- Explain architectural decisions only when significant.
- Ask for clarification if requirements are ambiguous.

Always prioritize maintainability, performance, security, and low technical debt.

---

# Project Vision

LeadPilot AI is an AI-powered Growth Operating System for Local Businesses.

Every implementation should help businesses:

- Find Customers
- Convert Customers
- Retain Customers
- Increase Revenue
- Automate Marketing
- Make Better Business Decisions

---

# Project Progress Tracking

PROJECT_STATUS.md is the project's single source of truth.

After every completed Work Item update:

- Current Sprint
- Current Work Item
- Completed Work Items
- Remaining Work Items
- Overall Progress (%)
- Sprint Progress (%)
- Files Created
- Files Modified
- Database Changes
- API Changes
- Build Status
- TypeScript Status
- Lint Status
- Test Status
- Pending Risks
- Technical Debt
- Next Recommended Work Item
- Last Updated (Date & Time)

Never leave PROJECT_STATUS.md outdated.
---
# Development Session

Every implementation session must end with a short development summary.

Include:

- Work Item Completed
- Objective
- Summary of Changes
- Files Modified
- Database Changes
- API Changes
- Tests Added
- Documentation Updated
- Known Issues
- Next Recommended Work Item

Stop after the summary.
---
# Documentation Update Rules

Update only the documents affected by the completed Work Item.

Always update

- PROJECT_STATUS.md
- Current Sprint
- Current Work Item
- CHANGELOG.md

Update only if changed

- DATABASE_SCHEMA.md
- API_SPEC.md
- FEATURES.md
- ROADMAP.md
- README.md
- PRODUCT_REQUIREMENTS.md

Do not modify unrelated documentation.
---
# Sprint Tracking

After each Work Item

Update the current Sprint document.

Include

- Completed Tasks
- Remaining Tasks
- Sprint Progress (%)
- Risks
- Blockers
- Notes
---
# Work Item Tracking

Every Work Item must maintain

- Status
- Owner
- Priority
- Completion Date
- Files Modified
- Dependencies
- Validation Status
- Documentation Status
- Build Status
---
# Completion Rule

When a Work Item is complete

1. Run validation.
2. Update documentation.
3. Update PROJECT_STATUS.md.
4. Update Sprint progress.
5. Update CHANGELOG.md.
6. Print a concise completion summary.
7. Stop.

Do not automatically continue with the next Work Item.
---
# LeadPilot AI - Project Status

## Project Information

| Item | Status |
|------|--------|
| Project | LeadPilot AI |
| Version | 0.1.0 |
| Branch | main |
| Environment | Development |
| Last Updated | 2026-07-21 |

---

# Overall Progress

| Module | Progress |
|---------|---------:|
| Foundation | 70% |
| Authentication | 60% |
| Organizations | 40% |
| RBAC | 35% |
| CRM | 30% |
| Lead Discovery | 15% |
| Marketing Automation | 0% |
| AI Engine | 0% |
| Analytics | 10% |
| Deployment | 5% |

Overall Progress

**28%**

---

# Current Sprint

Sprint

Sprint-001

Current Work Item

WI-001

Status

🟡 In Progress

---

# Completed Work Items

- ✅ WI-001
- ✅ WI-002
- ✅ WI-003

---

# Pending Work Items

- ⏳ WI-004
- ⏳ WI-005
- ⏳ WI-006

---

# Current Build Status

| Check | Status |
|--------|--------|
| Build | ✅ |
| TypeScript | ✅ |
| Lint | ⚠️ |
| Unit Tests | ⚠️ |
| Integration Tests | ❌ |

---

# Database Status

Current Version

v1

Tables

18

RLS

Partial

Indexes

Partial

Migrations

2

---

# API Status

Implemented

12

Pending

24

---

# Technical Debt

- Hardcoded organization IDs
- Missing API routes
- Duplicate workspace
- Missing shared types

---

# Known Issues

- Missing logout endpoint
- Missing organization hooks
- Placeholder packages
- Broken imports

---

# Recently Modified

- app/auth/login/page.tsx
- app/dashboard/page.tsx
- packages/auth/*
- supabase/migrations/*

---

# Next Recommended Work Item

WI-004

Implement Organization Context

---

# Documentation Status

| Document | Status |
|----------|--------|
| README | ✅ |
| API_SPEC | 🟡 |
| DATABASE_SCHEMA | 🟡 |
| CHANGELOG | ✅ |
| ROADMAP | ✅ |

---
# SUCCESS CRITERIA
Application builds without errors.
Authentication is fully functional.
Organization and RBAC foundation is complete.
Core database schema is implemented.
Protected routes work correctly.
No broken imports or placeholder modules remain in the foundation.
# Development Notes

Short notes about the latest completed Work Item.
---
Every technical decision should support this vision.