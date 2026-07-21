import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  ActivityActionType,
  ActivityCreateInput,
  ActivityItem,
  ActivityUpdateInput,
  CrmListOptions,
  PaginatedResult,
} from '@/types/crm';
import { withOrganization } from './utils';
import {
  applyFilters,
  applySort,
  buildEmptyPaginatedResult,
  buildListQueryOptions,
  buildPaginationMeta,
  normalizePagination,
} from './api-utils';

const defaultSupabase = createClient();

const TABLE = 'crm_activity' as const;

export const ActivityService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as ActivityItem[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as ActivityItem | null, error: error?.message ?? null };
  },

  async getByEntity(entityType: ActivityItem['entity_type'], entityId: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    return { data: data as ActivityItem[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof ActivityItem>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof ActivityItem>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<ActivityItem>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as ActivityItem[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<ActivityItem>,
      error: null,
    };
  },

  async create(payload: ActivityCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as ActivityItem | null, error: error?.message ?? null };
  },

  async log(
    entityType: ActivityItem['entity_type'],
    entityId: string,
    action: string,
    details: string | null = null,
    actionType: ActivityActionType = 'system',
    client: AppSupabaseClient = defaultSupabase,
  ) {
    const insertPayload = await withOrganization(
      {
        entity_type: entityType,
        entity_id: entityId,
        action,
        details: details ?? null,
        action_type: actionType,
        actor_id: null,
        metadata: {},
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: ActivityCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as ActivityItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as ActivityItem[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: ActivityUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as ActivityItem | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: ActivityUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as ActivityItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as ActivityItem[] | null) ?? [], error: error?.message ?? null };
  },

  async delete(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { error } = await client.from(TABLE).delete().eq('id', id);
    return { error: error?.message ?? null };
  },

  async deleteMany(ids: string[], client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { error: null };
    }
    const { error } = await client.from(TABLE).delete().in('id', ids);
    return { error: error?.message ?? null };
  },
};
