export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
