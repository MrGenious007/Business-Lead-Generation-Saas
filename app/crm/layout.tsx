import type { ReactNode } from 'react';
import { requireOrganizationPermission } from '@/lib/rbac/server';

export default async function CRMLayout({ children }: { children: ReactNode }) {
  await requireOrganizationPermission('crm.read', '/organizations');
  return children;
}