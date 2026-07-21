const schedule = [
  { id: 'calendar-1', day: 'Mon', item: 'Pipeline review' },
  { id: 'calendar-2', day: 'Tue', item: 'Client onboarding' },
  { id: 'calendar-3', day: 'Thu', item: 'Growth experiment sync' },
  { id: 'calendar-4', day: 'Fri', item: 'Revenue forecast update' },
];

export function CalendarCard() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {schedule.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{entry.day}</p>
          <p className="mt-2 font-medium text-white">{entry.item}</p>
        </div>
      ))}
    </div>
  );
}
