import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AuthService } from '@/services/auth';
import type { AuthUser } from '@/types/user';

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await AuthService.getAuthenticatedUser(supabase);
  return data;
}

export async function requireAuthenticatedUser(redirectTo?: string): Promise<AuthUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    const suffix = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : '';
    redirect(`/login${suffix}`);
  }

  return user;
}

export async function redirectIfAuthenticated(pathname = '/dashboard') {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect(pathname);
  }
}