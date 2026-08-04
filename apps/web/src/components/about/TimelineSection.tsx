import { RevealText } from "@/components/motion/RevealText";

const MILESTONES = [
  { year: "2016", event: "Founded as a small custom software studio." },
  { year: "2018", event: "First enterprise ERP engagement." },
  { year: "2020", event: "Expanded into SaaS and cloud infrastructure." },
  { year: "2023", event: "AI-ready infrastructure practice launched." },
  { year: "Today", event: "A full-stack enterprise partner, headquartered in one digital building." },
];

export function TimelineSection() {
  return (
    <section className="px-6 py-24 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Timeline</span>
        <RevealText
          as="h2"
          text="How we got here."
          mode="word"
          trigger="scroll"
          className="mt-4 font-display text-display-md font-medium tracking-tight text-foreground"
        />

        <ol className="mt-14 flex flex-col">
          {MILESTONES.map((milestone, index) => (
            <li key={milestone.year} className="relative flex gap-6 pb-10 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex h-3 w-3 shrink-0 rounded-full bg-primary" />
                {index < MILESTONES.length - 1 && <span className="mt-1 w-px flex-1 bg-foreground/10" />}
              </div>
              <div className="-mt-1.5">
                <span className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/40">
                  {milestone.year}
                </span>
                <p className="mt-1 text-base text-foreground/70">{milestone.event}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
