import { parseListOptions, toCrmListOptions } from '@/app/api/crm/lib/query';

describe('parseListOptions', () => {
  it('parses pagination params', () => {
    const params = new URLSearchParams('page=2&pageSize=50');
    const result = parseListOptions(params);

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(50);
  });

  it('parses search and sort params', () => {
    const params = new URLSearchParams('search=acme&sortBy=created_at&sortDirection=asc');
    const result = parseListOptions(params);

    expect(result.search).toBe('acme');
    expect(result.sortBy).toBe('created_at');
    expect(result.sortDirection).toBe('asc');
  });

  it('rejects invalid sort directions', () => {
    const params = new URLSearchParams('sortDirection=invalid');
    const result = parseListOptions(params);

    expect(result.sortDirection).toBeUndefined();
  });

  it('rejects invalid sortBy column names', () => {
    const params = new URLSearchParams('sortBy=created_at;drop table users');
    const result = parseListOptions(params);

    expect(result.sortBy).toBeUndefined();
  });

  it('treats unknown params as filters', () => {
    const params = new URLSearchParams('status=new&source=website');
    const result = parseListOptions(params);

    expect(result.filters).toEqual({
      status: 'new',
      source: 'website',
    });
  });

  it('parses comma-separated filters as arrays', () => {
    const params = new URLSearchParams('status=new,contacted,qualified');
    const result = parseListOptions(params);

    expect(result.filters.status).toEqual(['new', 'contacted', 'qualified']);
  });

  it('parses boolean filters', () => {
    const params = new URLSearchParams('is_default=true');
    const result = parseListOptions(params);

    expect(result.filters.is_default).toBe(true);
  });

  it('parses numeric filters', () => {
    const params = new URLSearchParams('probability=50');
    const result = parseListOptions(params);

    expect(result.filters.probability).toBe(50);
  });

  it('ignores empty filter values', () => {
    const params = new URLSearchParams('status=&source=website');
    const result = parseListOptions(params);

    expect(result.filters).toEqual({ source: 'website' });
  });
});

describe('toCrmListOptions', () => {
  it('converts parsed options with search fields', () => {
    const parsed = parseListOptions(new URLSearchParams('search=acme&page=2&sortBy=name&sortDirection=asc'));
    const options = toCrmListOptions(parsed, ['name', 'email']);

    expect(options.search).toBe('acme');
    expect(options.searchFields).toEqual(['name', 'email']);
    expect(options.pagination).toEqual({ page: 2, pageSize: undefined });
    expect(options.sortBy).toBe('name');
    expect(options.sortDirection).toBe('asc');
  });
});
