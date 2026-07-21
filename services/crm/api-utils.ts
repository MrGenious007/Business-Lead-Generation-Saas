import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CrmListOptions,
  PaginatedResult,
  PaginationMeta,
  SortDirection,
} from '@/types/crm';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 250;

export function normalizePagination(pagination?: { page?: number; pageSize?: number }) {
  const page = Math.max(1, pagination?.page ?? DEFAULT_PAGE);
  const pageSize = Math.min(Math.max(1, pagination?.pageSize ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  return { page, pageSize, from: (page - 1) * pageSize, to: page * pageSize - 1 };
}

type QueryBuilder = ReturnType<ReturnType<SupabaseClient['from']>['select']>;

export function applySearch(
  builder: QueryBuilder,
  search: string | undefined,
  searchFields: string[] | undefined,
): QueryBuilder {
  if (!search || !searchFields || searchFields.length === 0) {
    return builder;
  }
  const term = search.trim();
  if (!term) {
    return builder;
  }
  const pattern = `%${term}%`;
  const conditions = searchFields.map((field) => `${field}.ilike.${pattern}`).join(',');
  return builder.or(conditions);
}

export function applyFilters(
  builder: QueryBuilder,
  filters: Record<string, string | string[] | boolean | number | null | undefined> | undefined,
): QueryBuilder {
  if (!filters) {
    return builder;
  }

  return Object.entries(filters).reduce<QueryBuilder>((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') {
      return acc;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return acc;
      return acc.in(key, value);
    }
    if (typeof value === 'boolean') {
      return acc.eq(key, value);
    }
    if (typeof value === 'number') {
      return acc.eq(key, value);
    }
    return acc.eq(key, value);
  }, builder);
}

export function applySort(
  builder: QueryBuilder,
  sortBy: string | undefined,
  sortDirection: SortDirection | undefined,
  defaultSortBy: string,
  defaultSortDirection: SortDirection = 'desc',
): QueryBuilder {
  const direction = sortDirection ?? defaultSortDirection;
  const column = sortBy ?? defaultSortBy;
  return builder.order(column, { ascending: direction === 'asc' });
}

export function buildPaginationMeta(total: number, page: number, pageSize: number): PaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function buildEmptyPaginatedResult<T>(page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE): PaginatedResult<T> {
  return {
    data: [],
    meta: buildPaginationMeta(0, page, pageSize),
  };
}

export function buildListQueryOptions<T extends string = string>(
  overrides?: Partial<CrmListOptions<T>>,
): Omit<CrmListOptions<T>, 'filters'> & { filters: NonNullable<CrmListOptions<T>['filters']> } {
  return {
    search: overrides?.search ?? undefined,
    searchFields: overrides?.searchFields ?? [],
    filters: overrides?.filters ?? {},
    sortBy: overrides?.sortBy ?? undefined,
    sortDirection: overrides?.sortDirection ?? 'desc',
    pagination: overrides?.pagination ?? {},
  };
}
