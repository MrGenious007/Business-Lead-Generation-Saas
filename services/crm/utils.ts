import { createClient } from '@/lib/supabase/client';
import { UserService } from '@/services/user';
import type { AppSupabaseClient } from '@/services/user';

const defaultSupabase = createClient();

export async function getActiveOrganizationId(client: AppSupabaseClient = defaultSupabase): Promise<string | null> {
  const { data: user } = await UserService.getAuthenticatedUser(client);
  if (!user) {
    return null;
  }

  const { data: profile } = await UserService.ensureCurrentProfile(client, user);
  return profile?.active_organization_id ?? null;
}

export async function withOrganization<T extends Record<string, unknown>>(
  payload: T,
  client: AppSupabaseClient = defaultSupabase,
): Promise<(T & { organization_id: string }) | null> {
  const organizationId = await getActiveOrganizationId(client);
  if (!organizationId) {
    return null;
  }
  return { ...payload, organization_id: organizationId };
}
