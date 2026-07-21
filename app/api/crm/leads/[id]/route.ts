import { LeadService } from '@/services/crm/lead';
import { leadCreateSchema, leadUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Lead, LeadCreateInput, LeadUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Lead, LeadCreateInput, LeadUpdateInput>({
  service: LeadService,
  createSchema: leadCreateSchema,
  updateSchema: leadUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
