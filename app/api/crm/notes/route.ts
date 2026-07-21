import { NoteService } from '@/services/crm/note';
import { noteCreateSchema, noteUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../lib/factory';
import type { NoteItem, NoteCreateInput, NoteUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<NoteItem, NoteCreateInput, NoteUpdateInput>({
  service: NoteService,
  createSchema: noteCreateSchema,
  updateSchema: noteUpdateSchema,
  searchFields: ['content'],
});

export const GET = routes.list;
export const POST = routes.create;
