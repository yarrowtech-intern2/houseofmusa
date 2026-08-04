import { RevealText } from "@/components/motion/RevealText";

export function PageComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pt-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
      <RevealText
        as="h1"
        text={title}
        mode="word"
        trigger="immediate"
        className="max-w-3xl font-display text-display-lg font-semibold tracking-tight text-foreground"
      />
      <p className="max-w-xl text-base text-foreground/60">{description}</p>
    </section>
  );
}
