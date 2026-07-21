import { NoteService } from '@/services/crm/note';
import { noteCreateSchema, noteUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { NoteItem, NoteCreateInput, NoteUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<NoteItem, NoteCreateInput, NoteUpdateInput>({
  service: NoteService,
  createSchema: noteCreateSchema,
  updateSchema: noteUpdateSchema,
});

export const POST = routes.bulkCreate;
export const PATCH = routes.bulkUpdate;
export const DELETE = routes.bulkDelete;
