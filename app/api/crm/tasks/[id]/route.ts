import { TaskService } from '@/services/crm/task';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { TaskItem, TaskCreateInput, TaskUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<TaskItem, TaskCreateInput, TaskUpdateInput>({
  service: TaskService,
  createSchema: taskCreateSchema,
  updateSchema: taskUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
