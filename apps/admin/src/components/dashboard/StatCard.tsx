import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-foreground/8 bg-surface p-4 dark:border-white/10 dark:bg-[#111111]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/45 dark:text-white/45">{label}</p>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            {value}
          </div>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {detail && <p className="mt-3 text-xs text-foreground/50 dark:text-white/50">{detail}</p>}
    </div>
  );
}
