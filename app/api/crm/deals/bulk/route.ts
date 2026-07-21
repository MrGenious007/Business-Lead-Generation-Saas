import { DealService } from '@/services/crm/deal';
import { dealCreateSchema, dealUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Deal, DealCreateInput, DealUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Deal, DealCreateInput, DealUpdateInput>({
  service: DealService,
  createSchema: dealCreateSchema,
  updateSchema: dealUpdateSchema,
});

export const POST = routes.bulkCreate;
export const PATCH = routes.bulkUpdate;
export const DELETE = routes.bulkDelete;
