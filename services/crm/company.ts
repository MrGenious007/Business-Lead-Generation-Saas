import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  Company,
  CompanyCreateInput,
  CompanyFormValues,
  CompanyUpdateInput,
  CrmListOptions,
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

const TABLE = 'crm_companies' as const;
const SEARCH_FIELDS: Array<keyof Company> = ['name', 'website', 'industry', 'phone', 'address'];

export const CompanyService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Company[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as Company | null, error: error?.message ?? null };
  },

  async search(query: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });
    return { data: data as Company[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof Company>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof Company>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<Company>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as Company[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<Company>,
      error: null,
    };
  },

  async create(payload: CompanyCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as Company | null, error: error?.message ?? null };
  },

  async createFromForm(payload: CompanyFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        name: payload.name,
        website: payload.website ?? null,
        industry: payload.industry ?? null,
        phone: payload.phone ?? null,
        address: payload.address ?? null,
        description: payload.description ?? null,
        status: payload.status ?? 'active',
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: CompanyCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as Company[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as Company[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: CompanyUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Company | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: CompanyUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as Company[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as Company[] | null) ?? [], error: error?.message ?? null };
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
