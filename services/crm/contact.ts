import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  Contact,
  ContactCreateInput,
  ContactFormValues,
  ContactUpdateInput,
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

const TABLE = 'crm_contacts' as const;
const SEARCH_FIELDS: Array<keyof Contact> = ['full_name', 'email', 'phone', 'title', 'notes'];

export const ContactService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Contact[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as Contact | null, error: error?.message ?? null };
  },

  async getByCompany(companyId: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('company_id', companyId)
      .order('full_name', { ascending: true });
    return { data: data as Contact[] | null, error: error?.message ?? null };
  },

  async search(query: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('full_name', { ascending: true });
    return { data: data as Contact[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof Contact>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof Contact>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'created_at', 'desc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<Contact>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as Contact[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<Contact>,
      error: null,
    };
  },

  async create(payload: ContactCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as Contact | null, error: error?.message ?? null };
  },

  async createFromForm(payload: ContactFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        full_name: payload.full_name,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        title: payload.title ?? null,
        company_id: payload.company_id ?? null,
        status: payload.status ?? 'active',
        linkedin_url: payload.linkedin_url ?? null,
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

  async createMany(payloads: ContactCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as Contact[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as Contact[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: ContactUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Contact | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: ContactUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as Contact[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as Contact[] | null) ?? [], error: error?.message ?? null };
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
