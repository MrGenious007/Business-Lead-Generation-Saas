import { TaskService } from '@/services/crm/task';
import { taskCreateSchema, taskUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../lib/factory';
import type { TaskItem, TaskCreateInput, TaskUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<TaskItem, TaskCreateInput, TaskUpdateInput>({
  service: TaskService,
  createSchema: taskCreateSchema,
  updateSchema: taskUpdateSchema,
  searchFields: ['title', 'description'],
});

export const GET = routes.list;
export const POST = routes.create;
