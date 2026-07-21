import { TaskService } from '@/services/crm/task';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { TaskItem, TaskCreateInput, TaskUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<TaskItem, TaskCreateInput, TaskUpdateInput>({
  service: TaskService,
  createSchema: taskCreateSchema,
  updateSchema: taskUpdateSchema,
});

export const POST = routes.bulkCreate;
export const PATCH = routes.bulkUpdate;
export const DELETE = routes.bulkDelete;
