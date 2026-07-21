'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useOrganizations } from '@/hooks/use-organizations';
import toast from 'react-hot-toast';
import { OrganizationService } from '@/services/organization';

export default function OrganizationSettingsPage() {
  const { activeOrganization, loading: contextLoading, error: contextError, settings } = useOrganizations();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    timezone: 'UTC',
    currency: 'USD',
    notificationEmail: '',
    allowInvites: true,
    autoAssignLeads: true,
    defaultLanguage: 'en',
  });

  useEffect(() => {
    if (!settings) {
      return;
    }

    setFormValues({
      timezone: settings.timezone ?? 'UTC',
      currency: settings.currency ?? 'USD',
      notificationEmail: settings.notification_email ?? '',
      allowInvites: settings.allow_invites,
      autoAssignLeads: settings.auto_assign_leads,
      defaultLanguage: settings.default_language ?? 'en',
    });
  }, [settings]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeOrganization) {
      toast.error('No active organization selected.');
      return;
    }

    setLoading(true);
    const { error } = await OrganizationService.upsertOrganizationSettings(activeOrganization.id, formValues);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Organization settings saved.');
  };

  if (contextLoading) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Loading organization settings…</div>;
  }

  if (contextError) {
    return <div className="min-h-screen bg-slate-950 p-10 text-white">Failed to load organization context: {contextError}</div>;
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur">
        <h1 className="text-3xl font-semibold">Organization settings</h1>
        <p className="mt-2 text-sm text-slate-400">{activeOrganization ? `Configure defaults for ${activeOrganization.name}.` : 'Select an active organization to manage tenant settings.'}</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Timezone
              <input value={formValues.timezone} onChange={(event) => setFormValues((current) => ({ ...current, timezone: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
            </label>
            <label className="block text-sm text-slate-300">
              Currency
              <input value={formValues.currency} onChange={(event) => setFormValues((current) => ({ ...current, currency: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Notification email
            <input value={formValues.notificationEmail} onChange={(event) => setFormValues((current) => ({ ...current, notificationEmail: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" checked={formValues.allowInvites} onChange={(event) => setFormValues((current) => ({ ...current, allowInvites: event.target.checked }))} />
              Allow member invites
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" checked={formValues.autoAssignLeads} onChange={(event) => setFormValues((current) => ({ ...current, autoAssignLeads: event.target.checked }))} />
              Auto-assign leads
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Default language
            <input value={formValues.defaultLanguage} onChange={(event) => setFormValues((current) => ({ ...current, defaultLanguage: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
          </label>
          <button type="submit" disabled={loading || !activeOrganization} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
            {loading ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}
