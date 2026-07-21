import { CompanyService } from '@/services/crm/company';
import { companyCreateSchema, companyUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../../lib/factory';
import type { Company, CompanyCreateInput, CompanyUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Company, CompanyCreateInput, CompanyUpdateInput>({
  service: CompanyService,
  createSchema: companyCreateSchema,
  updateSchema: companyUpdateSchema,
});

export const GET = routes.getById;
export const PATCH = routes.update;
export const DELETE = routes.delete;
