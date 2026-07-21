import { z, type ZodSchema, type ZodError } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getActiveOrganizationId } from '@/services/crm/utils';
import { requireAuth, requirePermission } from './auth';
import { parseListOptions } from './query';
import { badRequest, forbidden, handleApiError, noContent, notFound, ok } from './response';
import type { AppSupabaseClient } from '@/services/user';
import type { CrmBaseEntity, CrmListOptions, PaginatedResult } from '@/types/crm';

type EntityKey<T> = keyof T & string;

type EntityService<T extends CrmBaseEntity, CreateInput, UpdateInput> = {
  list: (
    options?: CrmListOptions<EntityKey<T>>,
    client?: AppSupabaseClient,
  ) => Promise<{ data: PaginatedResult<T> | null; error: string | null }>;
  create: (payload: CreateInput, client?: AppSupabaseClient) => Promise<{ data: T | null; error: string | null }>;
  createMany: (
    payloads: CreateInput[],
    client?: AppSupabaseClient,
  ) => Promise<{ data: T[] | null; error: string | null }>;
  getById: (id: string, client?: AppSupabaseClient) => Promise<{ data: T | null; error: string | null }>;
  update: (id: string, payload: UpdateInput, client?: AppSupabaseClient) => Promise<{ data: T | null; error: string | null }>;
  updateMany: (
    ids: string[],
    payload: UpdateInput,
    client?: AppSupabaseClient,
  ) => Promise<{ data: T[] | null; error: string | null }>;
  delete: (id: string, client?: AppSupabaseClient) => Promise<{ error: string | null }>;
  deleteMany: (ids: string[], client?: AppSupabaseClient) => Promise<{ error: string | null }>;
};

interface EntityRouteConfig<T extends CrmBaseEntity, CreateInput, UpdateInput> {
  service: EntityService<T, CreateInput, UpdateInput>;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  searchFields?: Array<EntityKey<T>>;
}

function formatZodError(error: ZodError): string {
  return error.issues.map((issue) => issue.message).join('; ');
}

async function getOrgContext() {
  const supabase = await createServerSupabaseClient();
  const organizationId = await getActiveOrganizationId(supabase);
  if (!organizationId) {
    throw new CrmApiError('No active organization selected.', 400);
  }
  return { supabase, organizationId };
}

function ensureOwnOrganization<T extends CrmBaseEntity>(
  record: T | null,
  organizationId: string,
): record is T {
  return !!record && record.organization_id === organizationId;
}

export function createEntityRoutes<T extends CrmBaseEntity, CreateInput, UpdateInput>(
  config: EntityRouteConfig<T, CreateInput, UpdateInput>,
) {
  return {
    async list(request: NextRequest) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.read');

        const { supabase, organizationId } = await getOrgContext();
        const parsed = parseListOptions(new URL(request.url).searchParams);

        const options: CrmListOptions<EntityKey<T>> = {
          search: parsed.search,
          searchFields: config.searchFields,
          filters: { ...parsed.filters, organization_id: organizationId },
          sortBy: parsed.sortBy as EntityKey<T> | undefined,
          sortDirection: parsed.sortDirection,
          pagination: { page: parsed.page, pageSize: parsed.pageSize },
        };

        const result = await config.service.list(options, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return ok(result.data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async create(request: NextRequest) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { supabase, organizationId } = await getOrgContext();
        const body = await request.json();
        const parsed = config.createSchema.safeParse(body);

        if (!parsed.success) {
          return badRequest(formatZodError(parsed.error));
        }

        const payload = { ...(parsed.data as Record<string, unknown>), organization_id: organizationId } as unknown as CreateInput;
        const result = await config.service.create(payload, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return ok(result.data, 201);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async getById(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.read');

        const { id } = await params;
        const { supabase, organizationId } = await getOrgContext();
        const result = await config.service.getById(id, supabase);

        if (result.error || !ensureOwnOrganization(result.data, organizationId)) {
          return notFound();
        }

        return ok(result.data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async update(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { id } = await params;
        const { supabase, organizationId } = await getOrgContext();
        const existing = await config.service.getById(id, supabase);

        if (existing.error || !ensureOwnOrganization(existing.data, organizationId)) {
          return notFound();
        }

        const body = await request.json();
        const parsed = config.updateSchema.safeParse(body);

        if (!parsed.success) {
          return badRequest(formatZodError(parsed.error));
        }

        const result = await config.service.update(id, parsed.data as unknown as UpdateInput, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return ok(result.data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async delete(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { id } = await params;
        const { supabase, organizationId } = await getOrgContext();
        const existing = await config.service.getById(id, supabase);

        if (existing.error || !ensureOwnOrganization(existing.data, organizationId)) {
          return notFound();
        }

        const result = await config.service.delete(id, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return noContent();
      } catch (error) {
        return handleApiError(error);
      }
    },

    async bulkCreate(request: NextRequest) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { supabase, organizationId } = await getOrgContext();
        const body = await request.json();

        if (!Array.isArray(body)) {
          return badRequest('Expected an array of records.');
        }

        const parsed = body.map((item) => config.createSchema.safeParse(item));
        const firstError = parsed.find((p) => !p.success)?.error;
        if (firstError) {
          return badRequest(formatZodError(firstError));
        }

        const payloads = parsed
          .filter((p) => p.success)
          .map((p) =>
            Object.assign(
              {},
              (p as { success: true; data: unknown }).data as Record<string, unknown>,
              { organization_id: organizationId },
            ) as unknown as CreateInput,
          );

        const result = await config.service.createMany(payloads, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return ok(result.data, 201);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async bulkUpdate(request: NextRequest) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { supabase, organizationId } = await getOrgContext();
        const body = await request.json();

        const bulkUpdateSchema = z.intersection(
          config.updateSchema,
          z.object({ ids: z.array(z.string().uuid()) }),
        );

        const parsedPayload = bulkUpdateSchema.safeParse(body);
        if (!parsedPayload.success) {
          return badRequest(formatZodError(parsedPayload.error));
        }

        const parsedData = parsedPayload.data as { ids: string[] } & Record<string, unknown>;
        const { ids, ...updatePayload } = parsedData;
        if (ids.length === 0) {
          return badRequest('"ids" must not be empty.');
        }

        const existing = await config.service.list(
          { filters: { organization_id: organizationId, id: ids } },
          supabase,
        );

        if (existing.error || !existing.data) {
          return NextResponse.json({ error: existing.error ?? 'Failed to verify records.' }, { status: 500 });
        }

        if (existing.data.data.length !== ids.length) {
          return forbidden('One or more records do not belong to your organization.');
        }

        const result = await config.service.updateMany(ids, updatePayload as UpdateInput, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return ok(result.data);
      } catch (error) {
        return handleApiError(error);
      }
    },

    async bulkDelete(request: NextRequest) {
      try {
        const ctx = await requireAuth();
        requirePermission(ctx, 'crm.write');

        const { supabase, organizationId } = await getOrgContext();
        const body = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
          return badRequest('Expected a non-empty array of ids.');
        }

        const ids: string[] = body;
        const existing = await config.service.list(
          { filters: { organization_id: organizationId, id: ids } },
          supabase,
        );

        if (existing.error || !existing.data) {
          return NextResponse.json({ error: existing.error ?? 'Failed to verify records.' }, { status: 500 });
        }

        if (existing.data.data.length !== ids.length) {
          return forbidden('One or more records do not belong to your organization.');
        }

        const result = await config.service.deleteMany(ids, supabase);

        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return noContent();
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
}
