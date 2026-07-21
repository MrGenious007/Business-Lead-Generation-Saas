import { ActivityList } from '@/components/layout/activity-list';
import { CalendarCard } from '@/components/layout/calendar-card';
import { ChartCard } from '@/components/layout/chart-card';
import { KpiCard } from '@/components/layout/kpi-card';
import { PageHeader } from '@/components/layout/page-header';
import { TasksPanel } from '@/components/layout/tasks-panel';
import { WidgetCard } from '@/components/layout/widget-card';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Growth dashboard"
          description="Monitor pipeline health, team activity, and revenue momentum from one workspace."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard title="Qualified leads" value="2,184" change="▲ 14.2% this week" trend="up" />
          <KpiCard title="Revenue" value="$84.2K" change="▲ 8.4% forecast" trend="up" />
          <KpiCard title="Open tasks" value="37" change="▼ 3 pending review" trend="down" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <WidgetCard title="Performance overview" subtitle="Weekly growth against target" action={<span className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-200">Live</span>}>
            <ChartCard />
          </WidgetCard>

          <WidgetCard title="Recent activity" subtitle="What your team is working on">
            <ActivityList />
          </WidgetCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <WidgetCard title="Upcoming tasks" subtitle="Priority work for the next 48 hours">
            <TasksPanel />
          </WidgetCard>

          <WidgetCard title="Calendar" subtitle="Scheduled initiatives and reviews">
            <CalendarCard />
          </WidgetCard>
        </div>
      </div>
    </DashboardShell>
  );
}
