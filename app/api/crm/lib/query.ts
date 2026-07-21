import type { CrmListOptions, SortDirection } from '@/types/crm';

const RESERVED_PARAMS = new Set([
  'page',
  'pageSize',
  'search',
  'sortBy',
  'sortDirection',
]);

function isValidColumnName(value: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
}

function parseNumber(value: string): number | undefined {
  if (value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseValue(raw: string): string | string[] | boolean | number {
  if (raw.includes(',')) {
    return raw.split(',').map((part) => part.trim()).filter(Boolean);
  }

  const lower = raw.toLowerCase();
  if (lower === 'true') return true;
  if (lower === 'false') return false;

  const numeric = parseNumber(raw);
  if (numeric !== undefined) return numeric;

  return raw;
}

export interface ParsedListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  filters: Record<string, string | string[] | boolean | number>;
}

export function parseListOptions(searchParams: URLSearchParams): ParsedListOptions {
  const page = parseNumber(searchParams.get('page') ?? '');
  const pageSize = parseNumber(searchParams.get('pageSize') ?? '');
  const search = searchParams.get('search') ?? undefined;
  const rawSortBy = searchParams.get('sortBy') ?? undefined;
  const sortBy = rawSortBy && isValidColumnName(rawSortBy) ? rawSortBy : undefined;
  const rawSortDirection = searchParams.get('sortDirection') ?? undefined;
  const sortDirection: SortDirection | undefined =
    rawSortDirection === 'asc' || rawSortDirection === 'desc' ? rawSortDirection : undefined;

  const filters: ParsedListOptions['filters'] = {};

  searchParams.forEach((value, key) => {
    if (RESERVED_PARAMS.has(key) || value === '') {
      return;
    }
    filters[key] = parseValue(value);
  });

  return {
    page,
    pageSize,
    search,
    sortBy,
    sortDirection,
    filters,
  };
}

export function toCrmListOptions<T extends string>(
  parsed: ParsedListOptions,
  searchFields?: T[],
): CrmListOptions<T> {
  return {
    search: parsed.search,
    searchFields,
    filters: parsed.filters,
    sortBy: parsed.sortBy as T | undefined,
    sortDirection: parsed.sortDirection,
    pagination: {
      page: parsed.page,
      pageSize: parsed.pageSize,
    },
  };
}
