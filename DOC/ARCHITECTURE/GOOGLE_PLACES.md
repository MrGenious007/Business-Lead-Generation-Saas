# Google Places Integration

## Overview

LeadPilot AI intends to use Google Places as the core lead discovery engine for finding local businesses that match a target industry, keyword, and geography.

The current repository references search and save workflows in `app/leads/page.tsx`, but the actual imported service module path `@/services/lead-discovery/google-places` does not exist.

## Current Behavior (Planned)

The lead discovery page is designed to:

- Collect search inputs: keyword, industry, city, state, country, radius
- Execute a search request to Google Places
- Persist the discovered business data to Supabase
- Show recent search history and search results

## Planned Data Flow

1. User submits a search query.
2. A backend service calls Google Places API with the requested filters.
3. Results are normalized into the application business schema.
4. The top match can be saved into the local database.
5. Search history is logged for later review.

## Key Integration Points

### Google Places API

- Use `places` search endpoints to find local businesses.
- Support keyword, category/industry, geographic location, and radius filters.
- Use a server-side API proxy to keep API keys secret.

### Business data model

Key fields to capture from Google Places:

- `business_name`
- `category`
- `address`
- `phone`
- `website`
- `email`
- `latitude`
- `longitude`
- `rating`
- `reviews`
- `opening_hours`
- `social_media_links`
- `place_id`
- `source`
- `updated_at`

### Search history model

Capture search queries and filters for reuse:

- `keyword`
- `industry`
- `city`
- `state`
- `country`
- `radius`
- `created_at`

## Deduplication Strategy

Because businesses can appear across searches, the app should deduplicate saved data by a strong identifier such as `place_id` or `website`.

- Before insert, check whether a business with the same `place_id` already exists.
- If the business exists, update the existing record instead of creating a duplicate.
- Store a normalized company record for use in CRM workflows.

## Refresh Strategy

- Implement a refresh or enrichment path to update stale business data periodically.
- Keep a `last_refreshed_at` field on the business record.
- Use background jobs or scheduled re-runs for high-value leads.

## Security and Compliance

- Store Google API keys in environment variables only.
- Never expose private keys client-side.
- Include rate limit handling and graceful failure states.

## Recommended API surface

- `POST /api/lead-discovery/search`
  - Query payload: keyword, industry, city, state, country, radius, page, pageSize.
  - Response: business search results.

- `POST /api/lead-discovery/businesses`
  - Request: normalized business profile.
  - Response: saved business record.

- `GET /api/lead-discovery/history`
  - Response: recent search history.

## Next Steps

- Add `services/lead-discovery/google-places.ts` with a server-side wrapper around Google Places.
- Create a `businesses` table in migrations to match the seed script.
- Implement a server action or API route to persist search history and save businesses.
- Wire the `app/leads` page to the backend service instead of calling a non-existent module path.
