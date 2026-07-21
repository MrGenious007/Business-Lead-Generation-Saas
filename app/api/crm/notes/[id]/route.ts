import { NoteService } from '@/services/crm/note';
import { noteCreateSchema, noteUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { NoteItem, NoteCreateInput, NoteUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<NoteItem, NoteCreateInput, NoteUpdateInput>({
  service: NoteService,
  createSchema: noteCreateSchema,
  updateSchema: noteUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
