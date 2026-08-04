import type { Metadata } from "next";
import Link from "next/link";
import type { CareerRole } from "@houseofmusa/types";
import { apiGet } from "@/lib/api";
import { RevealText } from "@/components/motion/RevealText";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/careerLabels";
import { STATIC_CAREER_ROLES } from "@/lib/staticContent";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at House of Musa.",
};

export default async function CareersPage() {
  const { items: roles } = await apiGet<{ items: CareerRole[] }>("/api/career-roles").catch(
    () => ({ items: STATIC_CAREER_ROLES }),
  );

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
          We&rsquo;re a small team doing enterprise-grade work — no ticket queues, no bait-and-switch to junior
          staff after the pitch.
        </p>

        <div className="mt-16 divide-y divide-foreground/8 border-y border-foreground/8">
          {roles.length === 0 ? (
            <p className="py-10 text-sm text-foreground/50">
              No open roles right now — check back soon, or visit the admin dashboard to publish some.
            </p>
          ) : (
            roles.map((role) => (
              <Link
                key={role.slug}
                href={`/careers/${role.slug}`}
                className="group flex flex-col gap-1 py-6 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {role.title}
                  </h2>
                  <p className="mt-1 text-sm text-foreground/50">
                    {role.department} · {role.location}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-foreground/60">
                  {EMPLOYMENT_TYPE_LABELS[role.employmentType]}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
