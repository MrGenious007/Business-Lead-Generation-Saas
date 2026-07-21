import type { ReactNode } from 'react';
import { redirectIfAuthenticated } from '@/lib/auth/server';

export default async function LoginLayout({ children }: { children: ReactNode }) {
  await redirectIfAuthenticated('/dashboard');
  return children;
}