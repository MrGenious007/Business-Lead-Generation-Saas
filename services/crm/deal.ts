import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  CrmListOptions,
  Deal,
  DealCreateInput,
  DealFormValues,
  DealUpdateInput,
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

const TABLE = 'crm_deals' as const;
const SEARCH_FIELDS: Array<keyof Deal> = ['title', 'notes'];

export const DealService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Deal[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as Deal | null, error: error?.message ?? null };
  },

  async getByStage(stage: Deal['stage'], client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('stage', stage)
      .order('created_at', { ascending: false });
    return { data: data as Deal[] | null, error: error?.message ?? null };
  },

  async getByCompany(companyId: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    return { data: data as Deal[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof Deal>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof Deal>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<Deal>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as Deal[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<Deal>,
      error: null,
    };
  },

  async create(payload: DealCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as Deal | null, error: error?.message ?? null };
  },

  async createFromForm(payload: DealFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        title: payload.title,
        amount: payload.amount ?? null,
        stage: payload.stage ?? 'lead',
        status: payload.status ?? 'open',
        company_id: payload.company_id ?? null,
        contact_id: payload.contact_id ?? null,
        lead_id: payload.lead_id ?? null,
        pipeline_id: payload.pipeline_id ?? null,
        stage_id: payload.stage_id ?? null,
        expected_close_date: payload.expected_close_date ?? null,
        closed_at: null,
        notes: payload.notes ?? null,
        owner_id: null,
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: DealCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as Deal[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as Deal[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: DealUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Deal | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: DealUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as Deal[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as Deal[] | null) ?? [], error: error?.message ?? null };
  },

  async updateStatus(id: string, status: Deal['status'], client: AppSupabaseClient = defaultSupabase) {
    const closedAt = status === 'won' || status === 'lost' ? new Date().toISOString() : null;
    return this.update(id, { status, closed_at: closedAt }, client);
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
