import { createClient } from '@/lib/supabase/client';
import type { AuthCredentials, SignupPayload } from '@/types/auth';

const supabase = createClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function signInWithPassword(payload: AuthCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  return { data, error: error?.message };
}

export async function signUpWithPassword(payload: SignupPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName ?? '',
        organization_name: payload.organizationName ?? '',
      },
    },
  });

  if (!error && data.user) {
    await createOrganizationForUser(data.user.id, payload.organizationName ?? payload.fullName ?? 'My Organization');
  }

  return { data, error: error?.message };
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { error: error?.message };
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data, error: error?.message };
}

export async function recoverSessionFromUrl() {
  if (typeof window === 'undefined') {
    return { error: null };
  }

  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return { error: null };
  }

  const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  return { error: error?.message };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message };
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function createOrganizationForUser(userId: string, organizationName: string) {
  const organizationSlug = slugify(organizationName || 'my-organization');
  const client = createClient();

  await client.from('organizations').insert({
    name: organizationName,
    slug: organizationSlug,
    owner_id: userId,
    created_by: userId,
    updated_by: userId,
  });

  await client.from('profiles').upsert({
    id: userId,
    email: (await client.auth.getUser()).data.user?.email ?? '',
    full_name: (await client.auth.getUser()).data.user?.user_metadata?.full_name ?? '',
    role: 'company_owner',
  });
}
