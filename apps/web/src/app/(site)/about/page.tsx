import type { Metadata } from "next";
import { RevealText } from "@/components/motion/RevealText";
import { ValuesSection } from "@/components/about/ValuesSection";
import { StatsSection } from "@/components/about/StatsSection";
import { TimelineSection } from "@/components/about/TimelineSection";
import { WhyChooseUsSection } from "@/components/about/WhyChooseUsSection";
import { LeadershipSection } from "@/components/about/LeadershipSection";

export const metadata: Metadata = {
  title: "About",
  description: "The story, mission, and people behind Haus of Musa.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-16 pt-40 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About</span>
          <RevealText
            as="h1"
            text="One team, engineering the systems ambitious companies run on."
            mode="word"
            trigger="immediate"
            className="mt-6 max-w-4xl font-display text-display-lg font-medium tracking-tight text-foreground"
          />
        </div>
      </section>

      <ValuesSection />
      <StatsSection />
      <TimelineSection />
      <WhyChooseUsSection />
      <LeadershipSection />
    </main>
  );
}
