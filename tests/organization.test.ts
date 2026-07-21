import { canAccess, canAccessAny, getPermissionsForRole, getRoutePermission, isPublicRoute, requiresAuthentication } from '@/lib/rbac';

describe('RBAC permissions', () => {
  it('allows owners to manage organization settings', () => {
    expect(canAccess('owner', 'organization.write')).toBe(true);
    expect(canAccess('owner', 'invite.create')).toBe(true);
  });

  it('restricts members to read-only access', () => {
    expect(canAccess('member', 'organization.write')).toBe(false);
    expect(canAccess('member', 'invite.create')).toBe(false);
  });

  it('allows viewers to access read-only routes only', () => {
    expect(canAccess('viewer', 'dashboard.read')).toBe(true);
    expect(canAccess('viewer', 'crm.read')).toBe(true);
    expect(canAccess('viewer', 'crm.write')).toBe(false);
  });

  it('returns the configured permission for nested routes', () => {
    expect(getRoutePermission('/organizations/settings')).toBe('organization.write');
    expect(getRoutePermission('/organizations/members/invite')).toBe('member.read');
    expect(getRoutePermission('/unknown')).toBeNull();
  });

  it('supports aggregate permission checks', () => {
    expect(canAccessAny('admin', ['member.delete', 'member.write'])).toBe(true);
    expect(canAccessAny('viewer', ['member.write', 'organization.write'])).toBe(false);
    expect(getPermissionsForRole('manager')).toContain('crm.write');
  });

  it('returns false for unknown roles', () => {
    expect(canAccess(undefined, 'organization.read')).toBe(false);
  });

  it('classifies public routes correctly', () => {
    expect(isPublicRoute('/')).toBe(true);
    expect(isPublicRoute('/login')).toBe(true);
    expect(isPublicRoute('/reset-password/confirm')).toBe(true);
    expect(isPublicRoute('/dashboard')).toBe(false);
  });

  it('protects authenticated routes by default', () => {
    expect(requiresAuthentication('/dashboard')).toBe(true);
    expect(requiresAuthentication('/crm')).toBe(true);
    expect(requiresAuthentication('/organizations/settings')).toBe(true);
    expect(requiresAuthentication('/settings')).toBe(true);
    expect(requiresAuthentication('/future-private-route')).toBe(true);
    expect(requiresAuthentication('/login')).toBe(false);
    expect(requiresAuthentication('/api/auth/logout')).toBe(false);
  });
});
