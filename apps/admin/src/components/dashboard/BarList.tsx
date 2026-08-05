export function BarList({
  items,
  getLabel,
}: {
  items: { key: string; value: number }[];
  getLabel?: (key: string) => string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.key}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="truncate font-medium text-foreground/65 dark:text-white/65">
              {getLabel ? getLabel(item.key) : item.key}
            </span>
            <span className="tabular-nums text-foreground/45 dark:text-white/45">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/8 dark:bg-white/10">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-foreground/45 dark:text-white/45">No data yet.</p>}
    </div>
  );
}
