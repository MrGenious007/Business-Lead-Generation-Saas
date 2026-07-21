import type { OrganizationRole } from '@/types/organization';

export const permissions = [
  'dashboard.read',
  'organization.read',
  'organization.write',
  'organization.delete',
  'member.read',
  'member.write',
  'member.delete',
  'invite.create',
  'crm.read',
  'crm.write',
  'lead_discovery.read',
  'lead_discovery.write',
] as const;

export type Permission = (typeof permissions)[number];

export const publicRoutePrefixes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'] as const;
export const authenticatedRoutePrefixes = ['/dashboard', '/crm', '/leads', '/organizations'] as const;

export const routePermissions: Record<string, Permission> = {
  '/dashboard': 'dashboard.read',
  '/crm': 'crm.read',
  '/leads': 'lead_discovery.read',
  '/organizations': 'organization.read',
  '/organizations/members': 'member.read',
  '/organizations/settings': 'organization.write',
};

export const rolePermissions: Record<OrganizationRole, Permission[]> = {
  owner: permissions.slice(),
  admin: [
    'dashboard.read',
    'organization.read',
    'organization.write',
    'member.read',
    'member.write',
    'invite.create',
    'crm.read',
    'crm.write',
    'lead_discovery.read',
    'lead_discovery.write',
  ],
  manager: [
    'dashboard.read',
    'organization.read',
    'member.read',
    'member.write',
    'crm.read',
    'crm.write',
    'lead_discovery.read',
    'lead_discovery.write',
  ],
  member: [
    'dashboard.read',
    'organization.read',
    'crm.read',
    'crm.write',
    'lead_discovery.read',
    'lead_discovery.write',
  ],
  viewer: ['dashboard.read', 'organization.read', 'crm.read', 'lead_discovery.read'],
};

export function getPermissionsForRole(role: OrganizationRole | undefined) {
  return role ? rolePermissions[role] ?? [] : [];
}

export function canAccess(role: OrganizationRole | undefined, permission: Permission) {
  return getPermissionsForRole(role).includes(permission);
}

export function canAccessAny(role: OrganizationRole | undefined, requestedPermissions: Permission[]) {
  return requestedPermissions.some((permission) => canAccess(role, permission));
}

export function getRoutePermission(pathname: string) {
  return Object.entries(routePermissions)
    .sort((left, right) => right[0].length - left[0].length)
    .find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1] ?? null;
}

export function isPublicRoute(pathname: string) {
  return publicRoutePrefixes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }

    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function requiresAuthentication(pathname: string) {
  if (pathname.startsWith('/api/')) {
    return false;
  }

  return !isPublicRoute(pathname);
}
