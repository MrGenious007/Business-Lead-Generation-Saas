'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { useOrganizations } from '@/hooks/use-organizations';
import { canAccess } from '@/lib/rbac';

export default function OrganizationsPage() {
  const { organizations, activeOrganization, activeMembership, loading, error, setCurrentOrganization } = useOrganizations();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Loading organizations…</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Failed to load organizations: {error}</div>;
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Organizations"
          description="Manage your tenant workspaces, access levels, and growth operations."
          actions={<div className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200">{canAccess(activeMembership?.role, 'organization.write') ? `${activeMembership?.role ?? 'member'} access` : 'Read only'}</div>}
        />

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Workspace</h2>
            <div className="mt-4 space-y-2">
              {organizations.map((organization) => (
                <button
                  key={organization.id}
                  onClick={() => void setCurrentOrganization(organization.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${activeOrganization?.id === organization.id ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-slate-950/60 text-slate-300'}`}
                >
                  <span className="block font-medium">{organization.name}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-slate-400">{activeOrganization?.id === organization.id ? 'Active workspace' : 'Switch workspace'}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            {activeOrganization ? (
              <>
                <h2 className="text-2xl font-semibold">{activeOrganization.name}</h2>
                <p className="mt-2 text-sm text-slate-400">Organization profile, membership role, and active workspace context are managed here.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Slug</p>
                    <p className="mt-1 font-medium">{activeOrganization.slug}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Industry</p>
                    <p className="mt-1 font-medium">{activeOrganization.industry ?? 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Active role</p>
                    <p className="mt-1 font-medium capitalize">{activeMembership?.role ?? 'member'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Workspace mode</p>
                    <p className="mt-1 font-medium">{activeMembership?.role === 'owner' ? 'Primary owner workspace' : 'Shared organization access'}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-slate-400">No organization selected.</p>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
