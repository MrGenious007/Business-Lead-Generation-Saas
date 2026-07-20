import type { OrganizationRole } from '@/types/organization';

export const rolePermissions: Record<OrganizationRole, string[]> = {
  owner: ['organization.read', 'organization.write', 'organization.delete', 'member.read', 'member.write', 'member.delete', 'invite.create'],
  admin: ['organization.read', 'organization.write', 'member.read', 'member.write', 'invite.create'],
  manager: ['organization.read', 'member.read', 'member.write'],
  member: ['organization.read'],
  viewer: ['organization.read'],
};

export function canAccess(role: OrganizationRole | undefined, permission: string) {
  if (!role) {
    return false;
  }

  return rolePermissions[role]?.includes(permission) ?? false;
}
