import { DealService } from '@/services/crm/deal';
import { dealCreateSchema, dealUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Deal, DealCreateInput, DealUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Deal, DealCreateInput, DealUpdateInput>({
  service: DealService,
  createSchema: dealCreateSchema,
  updateSchema: dealUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
