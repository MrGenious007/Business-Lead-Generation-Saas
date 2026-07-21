import { redirect } from 'next/navigation';
import { requireAuthenticatedUser } from '@/lib/auth/server';
import { canAccess, type Permission } from '@/lib/rbac';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PermissionService } from '@/services/permission';
import { UserService } from '@/services/user';

export async function getServerOrganizationAccess() {
  const user = await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await UserService.ensureCurrentProfile(supabase, user);

  if (!profile) {
    return {
      ...PermissionService.getAccessContext(null, []),
    };
  }

  const { data: memberships } = await PermissionService.listOrganizationMemberships(supabase, profile.id);

  return PermissionService.getAccessContext(profile, memberships ?? []);
}

export async function requireOrganizationPermission(permission: Permission, redirectTo = '/organizations') {
  const access = await getServerOrganizationAccess();

  if (!access.activeMembership || !canAccess(access.activeMembership.role, permission)) {
    redirect(redirectTo);
  }

  return access;
}