import type { ReactNode } from 'react';
import { requireOrganizationPermission } from '@/lib/rbac/server';

export default async function OrganizationMembersLayout({ children }: { children: ReactNode }) {
  await requireOrganizationPermission('member.read', '/organizations');
  return children;
}