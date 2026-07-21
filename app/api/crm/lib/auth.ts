import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canAccess } from '@/lib/rbac';
import { UserService } from '@/services/user';
import type { Permission } from '@/lib/rbac';
import type { OrganizationRole } from '@/types/organization';

export interface CrmApiContext {
  userId: string;
  role: OrganizationRole | undefined;
}

export async function requireAuth(): Promise<CrmApiContext> {
  const supabase = await createServerSupabaseClient();
  const { data: user, error } = await UserService.getAuthenticatedUser(supabase);

  if (error || !user) {
    throw new CrmApiError('Authentication required.', 401);
  }

  return {
    userId: user.id,
    role: (user.user_metadata.role as OrganizationRole) ?? undefined,
  };
}

export function requirePermission(ctx: CrmApiContext, permission: Permission) {
  if (!canAccess(ctx.role, permission)) {
    throw new CrmApiError('Forbidden.', 403);
  }
}

export class CrmApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'CrmApiError';
  }
}
