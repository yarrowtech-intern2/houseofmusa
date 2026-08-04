export function SectionPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-foreground/15 text-center dark:border-white/15">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">{title}</h1>
      <p className="max-w-md text-sm text-foreground/50 dark:text-white/50">{description}</p>
    </div>
  );
}
