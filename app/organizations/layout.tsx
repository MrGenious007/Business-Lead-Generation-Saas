import type { ReactNode } from 'react';
import { requireAuthenticatedUser } from '@/lib/auth/server';

export default async function OrganizationsLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedUser('/organizations');
  return children;
}