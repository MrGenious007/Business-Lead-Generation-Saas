const tasks = [
  { id: 'task-1', title: 'Follow up with inbound SQLs', owner: 'Sales', priority: 'High' },
  { id: 'task-2', title: 'Refresh healthcare prospect list', owner: 'Growth', priority: 'Medium' },
  { id: 'task-3', title: 'Review Q3 nurture automation', owner: 'Marketing', priority: 'Low' },
];

export function TasksPanel() {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-white">{task.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{task.owner}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{task.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
