export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-foreground/8 bg-surface p-4 dark:border-white/10 dark:bg-[#111111]">
      <div className="mb-4">
        <h2 className="font-display text-base font-semibold tracking-tight text-foreground dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-xs text-foreground/50 dark:text-white/50">{description}</p>}
      </div>
      {children}
    </section>
  );
}
