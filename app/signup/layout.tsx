import type { ReactNode } from 'react';
import { redirectIfAuthenticated } from '@/lib/auth/server';

export default async function SignupLayout({ children }: { children: ReactNode }) {
  await redirectIfAuthenticated('/dashboard');
  return children;
}