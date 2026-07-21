import { CompanyService } from '@/services/crm/company';
import { companyCreateSchema, companyUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Company, CompanyCreateInput, CompanyUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Company, CompanyCreateInput, CompanyUpdateInput>({
  service: CompanyService,
  createSchema: companyCreateSchema,
  updateSchema: companyUpdateSchema,
});

export const POST = routes.bulkCreate;
export const PATCH = routes.bulkUpdate;
export const DELETE = routes.bulkDelete;
