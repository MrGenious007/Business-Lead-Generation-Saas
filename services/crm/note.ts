import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  CrmListOptions,
  NoteCreateInput,
  NoteFormValues,
  NoteItem,
  NoteUpdateInput,
  PaginatedResult,
} from '@/types/crm';
import { withOrganization } from './utils';
import {
  applyFilters,
  applySearch,
  applySort,
  buildEmptyPaginatedResult,
  buildListQueryOptions,
  buildPaginationMeta,
  normalizePagination,
} from './api-utils';

const defaultSupabase = createClient();

const TABLE = 'crm_notes' as const;
const SEARCH_FIELDS: Array<keyof NoteItem> = ['content'];

export const NoteService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as NoteItem[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as NoteItem | null, error: error?.message ?? null };
  },

  async getByEntity(entityType: NoteItem['entity_type'], entityId: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    return { data: data as NoteItem[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof NoteItem>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof NoteItem>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<NoteItem>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as NoteItem[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<NoteItem>,
      error: null,
    };
  },

  async create(payload: NoteCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as NoteItem | null, error: error?.message ?? null };
  },

  async createFromForm(payload: NoteFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        content: payload.content,
        entity_type: payload.entity_type,
        entity_id: payload.entity_id ?? null,
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: NoteCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as NoteItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as NoteItem[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: NoteUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as NoteItem | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: NoteUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as NoteItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as NoteItem[] | null) ?? [], error: error?.message ?? null };
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
