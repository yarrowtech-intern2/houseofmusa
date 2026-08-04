import { CountUp } from "@/components/motion/CountUp";

const STATS = [
  { to: 8, suffix: "+", label: "Years in business" },
  { to: 8, suffix: "", label: "Products shipped" },
  { to: 40, suffix: "+", label: "Engineers on staff" },
  { to: 98, suffix: "%", label: "Client retention" },
];

export function StatsSection() {
  return (
    <section className="border-y border-foreground/8 bg-surface px-6 py-20 sm:px-12 lg:px-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <CountUp
              to={stat.to}
              suffix={stat.suffix}
              className="font-display text-display-md font-semibold tracking-tight text-primary"
            />
            <p className="mt-2 text-sm text-foreground/55">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
