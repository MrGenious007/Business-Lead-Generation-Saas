const activities = [
  {
    id: 'activity-1',
    title: 'New enterprise lead captured',
    detail: 'Acme Dental Group was added from lead discovery.',
    time: '5 min ago',
  },
  {
    id: 'activity-2',
    title: 'Proposal shared with client',
    detail: 'Revenue expansion proposal sent to Northwind Health.',
    time: '42 min ago',
  },
  {
    id: 'activity-3',
    title: 'Campaign performance updated',
    detail: 'Q3 outbound sequence reached a 19% reply rate.',
    time: '1 hr ago',
  },
];

export function ActivityList() {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <article key={activity.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-white">{activity.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{activity.detail}</p>
            </div>
            <span className="text-xs text-slate-500">{activity.time}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
