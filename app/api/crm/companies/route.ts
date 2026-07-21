import { CompanyService } from '@/services/crm/company';
import { companyCreateSchema, companyUpdateSchema } from '@/lib/validators/crm';
import { createEntityRoutes } from '../lib/factory';
import type { Company, CompanyCreateInput, CompanyUpdateInput } from '@/types/crm';

const routes = createEntityRoutes<Company, CompanyCreateInput, CompanyUpdateInput>({
  service: CompanyService,
  createSchema: companyCreateSchema,
  updateSchema: companyUpdateSchema,
  searchFields: ['name', 'website', 'industry', 'phone', 'address'],
});

export const GET = routes.list;
export const POST = routes.create;
