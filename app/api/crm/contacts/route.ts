import { ContactService } from '@/services/crm/contact';
import { contactCreateSchema, contactUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../lib/factory';
import type { Contact, ContactCreateInput, ContactUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Contact, ContactCreateInput, ContactUpdateInput>({
  service: ContactService,
  createSchema: contactCreateSchema,
  updateSchema: contactUpdateSchema,
  searchFields: ['full_name', 'email', 'phone', 'title', 'notes'],
});

export const GET = routes.list;
export const POST = routes.create;
