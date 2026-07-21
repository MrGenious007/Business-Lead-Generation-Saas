import { ActivityService } from '@/services/crm/activity';
import { activityCreateSchema, activityUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { ActivityItem, ActivityCreateInput, ActivityUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<ActivityItem, ActivityCreateInput, ActivityUpdateInput>({
  service: ActivityService,
  createSchema: activityCreateSchema,
  updateSchema: activityUpdateSchema,
});

export const POST = routes.bulkCreate;
export const PATCH = routes.bulkUpdate;
export const DELETE = routes.bulkDelete;
