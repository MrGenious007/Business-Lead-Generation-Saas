'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { useOrganizations } from '@/hooks/use-organizations';
import { canAccess } from '@/lib/rbac';
import type { Organization } from '@/types/organization';

export default function OrganizationsPage() {
  const { organizations, loading, error } = useOrganizations();
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrganization) {
      setSelectedOrganization(organizations[0]);
    }
  }, [organizations, selectedOrganization]);

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
          actions={<div className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200">{canAccess('owner', 'organization.write') ? 'Owner access' : 'Read only'}</div>}
        />

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Workspace</h2>
            <div className="mt-4 space-y-2">
              {organizations.map((organization) => (
                <button
                  key={organization.id}
                  onClick={() => setSelectedOrganization(organization)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${selectedOrganization?.id === organization.id ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-slate-950/60 text-slate-300'}`}
                >
                  {organization.name}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
            {selectedOrganization ? (
              <>
                <h2 className="text-2xl font-semibold">{selectedOrganization.name}</h2>
                <p className="mt-2 text-sm text-slate-400">Organization profile and team access are managed here.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Slug</p>
                    <p className="mt-1 font-medium">{selectedOrganization.slug}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-400">Industry</p>
                    <p className="mt-1 font-medium">{selectedOrganization.industry ?? 'Not set'}</p>
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
