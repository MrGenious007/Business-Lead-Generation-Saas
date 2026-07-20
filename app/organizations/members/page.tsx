'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { inviteOrganizationMember } from '@/services/organization';

export default function OrganizationMembersPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '');
    const role = String(formData.get('role') || 'member');

    const { error } = await inviteOrganizationMember('00000000-0000-0000-0000-000000000000', email, role as 'member');
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Invitation sent.');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Team members</h1>
        <p className="mt-2 text-sm text-slate-400">Invite your team and assign roles with clear permissions.</p>
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
          <button type="submit" disabled={loading} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
            {loading ? 'Sending…' : 'Invite team member'}
          </button>
        </form>
      </div>
    </div>
  );
}
