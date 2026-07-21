import { LeadService } from '@/services/crm/lead';
import { leadCreateSchema, leadUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../lib/factory';
import type { Lead, LeadCreateInput, LeadUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Lead, LeadCreateInput, LeadUpdateInput>({
  service: LeadService,
  createSchema: leadCreateSchema,
  updateSchema: leadUpdateSchema,
  searchFields: ['full_name', 'email', 'phone', 'company_name', 'notes'],
});

export const GET = routes.list;
export const POST = routes.create;
