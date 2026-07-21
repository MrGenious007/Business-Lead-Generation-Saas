import type { ReactNode } from 'react';
import { requireOrganizationPermission } from '@/lib/rbac/server';

export default async function LeadsLayout({ children }: { children: ReactNode }) {
  await requireOrganizationPermission('lead_discovery.read', '/organizations');
  return children;
}