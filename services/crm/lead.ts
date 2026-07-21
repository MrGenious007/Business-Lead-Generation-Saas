import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  CrmListOptions,
  Lead,
  LeadCreateInput,
  LeadFormValues,
  LeadUpdateInput,
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

const TABLE = 'crm_leads' as const;
const SEARCH_FIELDS: Array<keyof Lead> = ['full_name', 'email', 'phone', 'company_name', 'notes'];

export const LeadService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Lead[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as Lead | null, error: error?.message ?? null };
  },

  async getByStatus(status: Lead['status'], client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    return { data: data as Lead[] | null, error: error?.message ?? null };
  },

  async search(query: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    return { data: data as Lead[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof Lead>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof Lead>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<Lead>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as Lead[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<Lead>,
      error: null,
    };
  },

  async create(payload: LeadCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as Lead | null, error: error?.message ?? null };
  },

  async createFromForm(payload: LeadFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        full_name: payload.full_name,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        company_name: payload.company_name ?? null,
        notes: payload.notes ?? null,
        status: payload.status ?? 'new',
        source: payload.source ?? null,
        company_id: null,
        owner_id: null,
        contact_id: null,
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: LeadCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as Lead[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as Lead[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: LeadUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Lead | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: LeadUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as Lead[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as Lead[] | null) ?? [], error: error?.message ?? null };
  },

  async convertToDeal(id: string, client: AppSupabaseClient = defaultSupabase) {
    return this.update(id, { status: 'qualified' }, client);
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
