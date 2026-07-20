# Deployment

## Overview

This document captures the current deployment assumptions and recommended deployment strategy for LeadPilot AI.

## Current Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL backend, auth, storage)
- OpenAI
- Resend
- WhatsApp Cloud API
- Google Places API
- pnpm workspaces

## Repository Structure

The root repository contains:
- `app/` for the main Next.js application
- `lib/` shared utilities and Supabase wrappers
- `components/` UI components
- `services/` business logic and Supabase service wrappers
- `supabase/` migrations and seed scripts
- `types/` shared type definitions
- `tests/` unit tests
- workspace folders for `apps/*` and `packages/*` that are currently placeholders

## Build and Run

### Local development

1. Run `pnpm install` at the root.
2. Set required environment variables for Supabase and third-party services.
3. Start the app with `pnpm dev`.

### Production build

1. Run `pnpm build` from the repository root.
2. Use `pnpm --filter web build` if targeting the `web` workspace.
3. Deploy the built app to a supported Next.js host.

## Environment Variables

The project currently references:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `WHATSAPP_API_KEY`
- `GOOGLE_PLACES_API_KEY`

## Recommended Deployment Targets

### Frontend

- Vercel: ideal for Next.js applications and server-side routes.
- Alternatively, Netlify or Cloudflare Pages with proper Supabase support.

### Database and Auth

- Supabase-hosted PostgreSQL and Auth.
- Alternatively, self-hosted Supabase or PostgreSQL plus a compatible auth layer.

### Secrets

- Store keys and secrets in the deployment platform's environment variable store.
- Keep all provider keys server-only.
- Do not expose private keys in client-side code.

## Migrations and Seed

- Apply migrations from `supabase/migrations` during deployment.
- Seed example data with `supabase/seed` if needed for staging or local testing.
- The current seed script expects a `businesses` table that is not yet defined.

## Recommended Production Configuration

- Enable Supabase RLS policies before releasing.
- Use strict CORS rules and only allow trusted hostnames.
- Configure backups for the PostgreSQL database.
- Add monitoring and logging for authentication and payment issues.

## Deployment Gaps

### Current gaps in the repository

- `next.config.ts` is currently used as a NextAuth configuration placeholder and is not a proper Next.js config file.
- `/api` route files are missing, meaning server-side endpoints are not implemented.
- There is no real `apps/web` application if the project relies on the root `app/` directory.
- Workspaces under `apps/*` and `packages/*` are not fully wired into the application path.

## Recommended Deployment Checklist

- [ ] Stabilize the root application and remove unused placeholder workspaces.
- [ ] Implement server-side API routes or Next.js server actions for auth and domain logic.
- [ ] Configure environment variables for Supabase and third-party services.
- [ ] Add production-ready Supabase migrations and seed data.
- [ ] Verify build with `pnpm build` and run smoke tests.
- [ ] Deploy to Vercel or a compatible host.
