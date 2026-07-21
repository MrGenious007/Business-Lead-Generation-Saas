'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrganizations } from '@/hooks/use-organizations';
import { canAccess } from '@/lib/rbac';
import toast from 'react-hot-toast';
import { OrganizationService } from '@/services/organization';
import type { OrganizationMemberDetails, OrganizationRole } from '@/types/organization';

export default function OrganizationMembersPage() {
  const { activeMembership, activeOrganization, loading: contextLoading, error: contextError } = useOrganizations();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<OrganizationMemberDetails[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const canInviteMembers = canAccess(activeMembership?.role, 'invite.create');

  useEffect(() => {
    const loadMembers = async () => {
      if (!activeOrganization) {
        setMembers([]);
        setMembersLoading(false);
        return;
      }

      setMembersLoading(true);
      const { data, error } = await OrganizationService.getOrganizationMembers(activeOrganization.id);

      if (error) {
        toast.error(error);
        setMembers([]);
        setMembersLoading(false);
        return;
      }

      setMembers(data ?? []);
      setMembersLoading(false);
    };

    void loadMembers();
  }, [activeOrganization]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeOrganization) {
      toast.error('No active organization selected.');
      return;
    }

    if (!canInviteMembers) {
      toast.error('You do not have permission to invite members.');
      return;
    }

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '');
    const role = String(formData.get('role') || 'member');

    const { error } = await OrganizationService.inviteOrganizationMember(activeOrganization.id, email, role as OrganizationRole);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Invitation sent.');
    event.currentTarget.reset();
  };

  if (contextLoading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Loading organization members…</div>;
  }

  if (contextError) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Failed to load organization context: {contextError}</div>;
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
          <h1 className="text-3xl font-semibold">Team members</h1>
          <p className="mt-2 text-sm text-slate-400">
            {activeOrganization ? `Invite your team to ${activeOrganization.name} and assign roles with clear permissions.` : 'Select an active organization to manage memberships.'}
          </p>
          {canInviteMembers ? (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                <label className="block text-sm text-slate-300">
                  Email address
                  <input name="email" type="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
                </label>
                <label className="block text-sm text-slate-300">
                  Role
                  <select name="role" defaultValue="member" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </label>
              </div>
              <button type="submit" disabled={loading || !activeOrganization} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
                {loading ? 'Sending…' : 'Invite team member'}
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-300">
              Your current role can review membership details, but only organization owners and admins can send invitations.
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold">Current members</h2>
          <div className="mt-6 space-y-3">
            {membersLoading ? (
              <p className="text-sm text-slate-400">Loading members…</p>
            ) : members.length === 0 ? (
              <p className="text-sm text-slate-400">No members found for the active organization.</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-white">{member.profile?.full_name || member.profile?.email || 'Unknown member'}</p>
                      <p className="mt-1 text-sm text-slate-400">{member.profile?.email || 'Email unavailable'}</p>
                    </div>
                    <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
