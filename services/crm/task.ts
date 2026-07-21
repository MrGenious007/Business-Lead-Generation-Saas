import { createClient } from '@/lib/supabase/client';
import type { AppSupabaseClient } from '@/services/user';
import type {
  CrmListOptions,
  PaginatedResult,
  TaskCreateInput,
  TaskFormValues,
  TaskItem,
  TaskUpdateInput,
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

const TABLE = 'crm_tasks' as const;
const SEARCH_FIELDS: Array<keyof TaskItem> = ['title', 'description'];

export const TaskService = {
  async getAll(client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .order('due_date', { ascending: true });
    return { data: data as TaskItem[] | null, error: error?.message ?? null };
  },

  async getById(id: string, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).single();
    return { data: data as TaskItem | null, error: error?.message ?? null };
  },

  async getByStatus(status: TaskItem['status'], client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .eq('status', status)
      .order('due_date', { ascending: true });
    return { data: data as TaskItem[] | null, error: error?.message ?? null };
  },

  async getUpcoming(limit = 10, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .select('*')
      .gte('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })
      .limit(limit);
    return { data: data as TaskItem[] | null, error: error?.message ?? null };
  },

  async list(options?: CrmListOptions<keyof TaskItem>, client: AppSupabaseClient = defaultSupabase) {
    const opts = buildListQueryOptions<keyof TaskItem>(options);
    const { page, pageSize, from, to } = normalizePagination(opts.pagination);

    let builder = client.from(TABLE).select('*', { count: 'exact' });
    builder = applySearch(builder as never, opts.search, opts.searchFields ?? SEARCH_FIELDS);
    builder = applyFilters(builder as never, opts.filters);
    builder = applySort(builder as never, opts.sortBy, opts.sortDirection, 'due_date', 'asc');

    const { data, error, count } = await builder.range(from, to);
    if (error || !data) {
      return { data: buildEmptyPaginatedResult<TaskItem>(page, pageSize), error: error?.message ?? null };
    }

    return {
      data: {
        data: data as TaskItem[],
        meta: buildPaginationMeta(count ?? 0, page, pageSize),
      } as PaginatedResult<TaskItem>,
      error: null,
    };
  },

  async create(payload: TaskCreateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client.from(TABLE).insert(payload).select().single();
    return { data: data as TaskItem | null, error: error?.message ?? null };
  },

  async createFromForm(payload: TaskFormValues, client: AppSupabaseClient = defaultSupabase) {
    const insertPayload = await withOrganization(
      {
        title: payload.title,
        description: payload.description ?? null,
        due_date: payload.due_date ?? null,
        priority: payload.priority ?? 'medium',
        status: payload.status ?? 'todo',
        related_lead_id: payload.related_lead_id ?? null,
        related_deal_id: payload.related_deal_id ?? null,
        related_company_id: payload.related_company_id ?? null,
        related_contact_id: payload.related_contact_id ?? null,
        owner_id: null,
        completed_at: null,
      },
      client,
    );
    if (!insertPayload) {
      return { data: null, error: 'No active organization selected.' };
    }
    return this.create(insertPayload, client);
  },

  async createMany(payloads: TaskCreateInput[], client: AppSupabaseClient = defaultSupabase) {
    if (payloads.length === 0) {
      return { data: [] as TaskItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).insert(payloads).select();
    return { data: (data as TaskItem[] | null) ?? [], error: error?.message ?? null };
  },

  async update(id: string, payload: TaskUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    const { data, error } = await client
      .from(TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    return { data: data as TaskItem | null, error: error?.message ?? null };
  },

  async updateMany(ids: string[], payload: TaskUpdateInput, client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as TaskItem[], error: null };
    }
    const { data, error } = await client.from(TABLE).update(payload).in('id', ids).select();
    return { data: (data as TaskItem[] | null) ?? [], error: error?.message ?? null };
  },

  async complete(id: string, client: AppSupabaseClient = defaultSupabase) {
    return this.update(id, { status: 'done', completed_at: new Date().toISOString() }, client);
  },

  async completeMany(ids: string[], client: AppSupabaseClient = defaultSupabase) {
    if (ids.length === 0) {
      return { data: [] as TaskItem[], error: null };
    }
    return this.updateMany(ids, { status: 'done', completed_at: new Date().toISOString() }, client);
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
