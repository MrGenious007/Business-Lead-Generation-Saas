import { createEntityRoutes } from '@/app/api/crm/lib/factory';
import { z } from 'zod';

const mockSupabase = { from: jest.fn() } as unknown as import('@/services/user').AppSupabaseClient;

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => Promise.resolve(mockSupabase)),
}));

jest.mock('@/app/api/crm/lib/auth', () => ({
  requireAuth: jest.fn(() => Promise.resolve({ userId: 'user-1', role: 'admin' })),
  requirePermission: jest.fn(),
  CrmApiError: class extends Error {
    constructor(message: string, public statusCode: number) {
      super(message);
    }
  },
}));

jest.mock('@/services/crm/utils', () => ({
  getActiveOrganizationId: jest.fn(() => Promise.resolve('org-1')),
}));

interface TestEntity {
  id: string;
  organization_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

const createSchema = z.object({
  name: z.string().min(1),
  organization_id: z.string().uuid().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
});

describe('createEntityRoutes', () => {
  const mockService = {
    list: jest.fn(() => Promise.resolve({ data: { data: [], meta: { page: 1, pageSize: 25, total: 0, totalPages: 1 } }, error: null })),
    create: jest.fn(() => Promise.resolve({ data: { id: '1', organization_id: 'org-1', name: 'Test' } as unknown as TestEntity, error: null })),
    createMany: jest.fn(() => Promise.resolve({ data: [] as TestEntity[], error: null })),
    getById: jest.fn(() => Promise.resolve({ data: null as TestEntity | null, error: null })),
    update: jest.fn(() => Promise.resolve({ data: null as TestEntity | null, error: null })),
    updateMany: jest.fn(() => Promise.resolve({ data: [] as TestEntity[], error: null })),
    delete: jest.fn(() => Promise.resolve({ error: null })),
    deleteMany: jest.fn(() => Promise.resolve({ error: null })),
  };

  const routes = createEntityRoutes<TestEntity, { name: string; organization_id?: string }, { name?: string }>({
    service: mockService as never,
    createSchema,
    updateSchema,
    searchFields: ['name'],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('returns paginated results', async () => {
      const request = new Request('http://localhost/api/crm/tests?page=1&pageSize=10');
      const response = await routes.list(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data).toEqual([]);
      expect(json.meta.pageSize).toBe(25);
      expect(mockService.list).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: { organization_id: 'org-1' },
        }),
        mockSupabase,
      );
    });
  });

  describe('create', () => {
    it('creates a record with organization_id injected', async () => {
      const request = new Request('http://localhost/api/crm/tests', {
        method: 'POST',
        body: JSON.stringify({ name: 'New' }),
      });
      const response = await routes.create(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.name).toBe('Test');
      expect(mockService.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New', organization_id: 'org-1' }),
        mockSupabase,
      );
    });

    it('returns 400 for invalid payload', async () => {
      const request = new Request('http://localhost/api/crm/tests', {
        method: 'POST',
        body: JSON.stringify({ name: '' }),
      });
      const response = await routes.create(request);

      expect(response.status).toBe(400);
    });
  });

  describe('bulkDelete', () => {
    it('returns 204 on successful bulk delete', async () => {
      mockService.list.mockResolvedValueOnce({
        data: { data: [{ id: '1' }, { id: '2' }] as TestEntity[], meta: { page: 1, pageSize: 25, total: 2, totalPages: 1 } },
        error: null,
      });

      const request = new Request('http://localhost/api/crm/tests/bulk', {
        method: 'DELETE',
        body: JSON.stringify(['1', '2']),
      });
      const response = await routes.bulkDelete(request);

      expect(response.status).toBe(204);
      expect(mockService.deleteMany).toHaveBeenCalledWith(['1', '2'], mockSupabase);
    });
  });
});