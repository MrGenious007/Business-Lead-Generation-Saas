'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PageHeader } from '@/components/layout/page-header';
import { WidgetCard } from '@/components/layout/widget-card';
import { CompanyForm, DealForm, LeadForm, NoteForm, TaskForm } from '@/components/crm/crm-forms';
import { getCompanies, getContacts, getDeals, getLeads, getTasks, getActivityTimeline } from '@/services/crm';
import type { ActivityItem, Company, Contact, Deal, Lead, TaskItem } from '@/types/crm';

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  async function load() {
    const [leadResult, companyResult, contactResult, dealResult, taskResult, activityResult] = await Promise.all([
      getLeads(),
      getCompanies(),
      getContacts(),
      getDeals(),
      getTasks(),
      getActivityTimeline(),
    ]);

    setLeads(leadResult.data ?? []);
    setCompanies(companyResult.data ?? []);
    setContacts(contactResult.data ?? []);
    setDeals(dealResult.data ?? []);
    setTasks(taskResult.data ?? []);
    setActivity(activityResult.data ?? []);
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader title="CRM workspace" description="Manage leads, companies, contacts, deals, tasks, notes, and activity in one place." />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <WidgetCard title="Leads" subtitle="Active prospects">
            <p className="text-3xl font-semibold text-white">{leads.length}</p>
          </WidgetCard>
          <WidgetCard title="Companies" subtitle="Organizations tracked">
            <p className="text-3xl font-semibold text-white">{companies.length}</p>
          </WidgetCard>
          <WidgetCard title="Deals" subtitle="Open opportunities">
            <p className="text-3xl font-semibold text-white">{deals.length}</p>
          </WidgetCard>
          <WidgetCard title="Tasks" subtitle="Pending follow-up">
            <p className="text-3xl font-semibold text-white">{tasks.length}</p>
          </WidgetCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <WidgetCard title="Recent activity timeline" subtitle="Latest CRM changes">
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                  <p className="text-sm font-medium text-white">{item.action}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.details || 'No additional details'}</p>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Upcoming tasks" subtitle="Work queued for the next few days">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{task.due_date || 'No due date'}</p>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <WidgetCard title="Create lead" subtitle="Capture incoming prospects">
            <LeadForm onCreated={() => setRefreshKey((k) => k + 1)} />
          </WidgetCard>
          <WidgetCard title="Create company" subtitle="Track your key accounts">
            <CompanyForm onCreated={() => setRefreshKey((k) => k + 1)} />
          </WidgetCard>
          <WidgetCard title="Create deal" subtitle="Move opportunities forward">
            <DealForm onCreated={() => setRefreshKey((k) => k + 1)} />
          </WidgetCard>
          <WidgetCard title="Create task" subtitle="Keep follow-up organized">
            <TaskForm onCreated={() => setRefreshKey((k) => k + 1)} />
          </WidgetCard>
          <div className="lg:col-span-2">
            <WidgetCard title="Add note" subtitle="Log context for a lead or account">
              <NoteForm onCreated={() => setRefreshKey((k) => k + 1)} />
            </WidgetCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
