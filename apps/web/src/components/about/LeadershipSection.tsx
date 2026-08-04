import { RevealText } from "@/components/motion/RevealText";

// Roles only, no names — bios are added via the admin dashboard once
// written, rather than filled in here with placeholder people.
const ROLES = ["Founder & CEO", "Head of Engineering", "Head of Design", "Head of Client Success"];

export function LeadershipSection() {
  return (
    <section className="px-6 py-24 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Leadership</span>
        <RevealText
          as="h2"
          text="The team behind the headquarters."
          mode="word"
          trigger="scroll"
          className="mt-4 font-display text-display-md font-medium tracking-tight text-foreground"
        />
        <p className="mt-4 max-w-xl text-sm text-foreground/50">Full bios are on their way.</p>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {ROLES.map((role) => (
            <div key={role} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
              <span className="mt-4 text-sm font-medium text-foreground/70">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
