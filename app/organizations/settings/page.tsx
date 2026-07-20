'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { upsertOrganizationSettings } from '@/services/organization';

export default function OrganizationSettingsPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      timezone: String(formData.get('timezone') || 'UTC'),
      currency: String(formData.get('currency') || 'USD'),
      notificationEmail: String(formData.get('notificationEmail') || ''),
      allowInvites: formData.get('allowInvites') === 'on',
      autoAssignLeads: formData.get('autoAssignLeads') === 'on',
      defaultLanguage: String(formData.get('defaultLanguage') || 'en'),
    };

    const { error } = await upsertOrganizationSettings('00000000-0000-0000-0000-000000000000', payload);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Organization settings saved.');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Organization settings</h1>
        <p className="mt-2 text-sm text-slate-400">Configure defaults for notifications, lead assignment, and locale behavior.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Timezone
              <input name="timezone" defaultValue="UTC" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
            </label>
            <label className="block text-sm text-slate-300">
              Currency
              <input name="currency" defaultValue="USD" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Notification email
            <input name="notificationEmail" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" name="allowInvites" defaultChecked />
              Allow member invites
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" name="autoAssignLeads" defaultChecked />
              Auto-assign leads
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            Default language
            <input name="defaultLanguage" defaultValue="en" className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
          </label>
          <button type="submit" disabled={loading} className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70">
            {loading ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
