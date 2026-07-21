import { ContactService } from '@/services/crm/contact';
import { contactCreateSchema, contactUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Contact, ContactCreateInput, ContactUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Contact, ContactCreateInput, ContactUpdateInput>({
  service: ContactService,
  createSchema: contactCreateSchema,
  updateSchema: contactUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
