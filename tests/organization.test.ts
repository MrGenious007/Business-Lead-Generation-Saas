import { canAccess } from '@/lib/rbac';

describe('RBAC permissions', () => {
  it('allows owners to manage organization settings', () => {
    expect(canAccess('owner', 'organization.write')).toBe(true);
    expect(canAccess('owner', 'invite.create')).toBe(true);
  });

  it('restricts members to read-only access', () => {
    expect(canAccess('member', 'organization.write')).toBe(false);
    expect(canAccess('member', 'invite.create')).toBe(false);
  });

  it('returns false for unknown roles', () => {
    expect(canAccess(undefined, 'organization.read')).toBe(false);
  });
});
