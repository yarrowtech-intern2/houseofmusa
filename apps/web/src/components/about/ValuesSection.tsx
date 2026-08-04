import { Target, Compass, ShieldCheck, Users, Sparkles, GraduationCap } from "lucide-react";
import { RevealText } from "@/components/motion/RevealText";

const VALUES = [
  { icon: ShieldCheck, label: "Craftsmanship", body: "Every line of code is written to be maintained, not just shipped." },
  { icon: Users, label: "Transparency", body: "Direct access to the engineers on your project — no relay through account managers." },
  { icon: Sparkles, label: "Long-term Partnership", body: "We measure success in years of uptime, not a single successful launch." },
  { icon: GraduationCap, label: "Continuous Learning", body: "The stack you get today is chosen to still make sense in five years." },
];

export function ValuesSection() {
  return (
    <section className="px-6 py-24 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="rounded-3xl border border-foreground/8 bg-surface p-10 shadow-soft">
            <Target className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">Mission</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/60">
              Build enterprise software that the people using it actually want to open every day — not
              software they&rsquo;re forced to tolerate.
            </p>
          </div>
          <div className="rounded-3xl border border-foreground/8 bg-surface p-10 shadow-soft">
            <Compass className="h-8 w-8 text-secondary" strokeWidth={1.5} />
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">Vision</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/60">
              A future where AI-ready infrastructure and enterprise-grade engineering are the standard for
              every growing business, not a luxury reserved for the largest ones.
            </p>
          </div>
        </div>

        <RevealText
          as="h3"
          text="What we hold ourselves to."
          mode="word"
          trigger="scroll"
          className="mt-20 font-display text-display-md font-medium tracking-tight text-foreground"
        />

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, label, body }) => (
            <div key={label}>
              <Icon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
              <h4 className="mt-4 font-display text-base font-semibold text-foreground">{label}</h4>
              <p className="mt-2 text-sm leading-relaxed text-foreground/55">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
