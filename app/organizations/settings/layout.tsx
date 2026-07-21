import type { ReactNode } from 'react';
import { requireOrganizationPermission } from '@/lib/rbac/server';

export default async function OrganizationSettingsLayout({ children }: { children: ReactNode }) {
  await requireOrganizationPermission('organization.write', '/organizations');
  return children;
}