import type { Metadata } from "next";
import type { CareerRole } from "@houseofmusa/types";
import { CareersListClient } from "@/components/careers/CareersListClient";
import { RevealText } from "@/components/motion/RevealText";
import { apiGet } from "@/lib/api";
import { STATIC_CAREER_ROLES } from "@/lib/staticContent";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at House of Musa.",
};

export default async function CareersPage() {
  const { items: roles } = await apiGet<{ items: CareerRole[] }>("/api/career-roles").catch(() => ({
    items: STATIC_CAREER_ROLES,
  }));

  return (
    <section className="min-h-screen px-6 pb-24 pt-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Careers</span>
        <RevealText
          as="h1"
          text="Join the team building it."
          mode="word"
          trigger="immediate"
          className="mt-4 font-display text-display-lg font-medium tracking-tight text-foreground"
        />
        <p className="mt-6 max-w-xl text-base text-foreground/60">
          We are a small team doing enterprise-grade work - no ticket queues, no bait-and-switch to junior staff after
          the pitch.
        </p>

        <CareersListClient roles={roles} />
      </div>
    </section>
  );
}
