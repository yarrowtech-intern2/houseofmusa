import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { CareerRole } from "@houseofmusa/types";
import { RevealText } from "@/components/motion/RevealText";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/careerLabels";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getCareerRole(slug: string): Promise<CareerRole | null> {
  const res = await fetch(`${API_URL}/api/career-roles/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load role: ${res.status}`);
  const data = (await res.json()) as { item: CareerRole };
  return data.item;
}

// Static export needs every path known at build time — see docs/ARCHITECTURE.md#static-export.
export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/api/career-roles`);
  if (!res.ok) return [];
  const data = (await res.json()) as { items: CareerRole[] };
  return data.items.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const role = await getCareerRole(params.slug).catch(() => null);
  if (!role) return { title: "Open Role" };
  return { title: role.title, description: `${role.title} — ${role.department}, ${role.location}` };
}

export default async function CareerRoleDetailPage({ params }: { params: { slug: string } }) {
  const role = await getCareerRole(params.slug);
  if (!role) notFound();

  return (
    <article className="min-h-screen pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-12">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All roles
        </Link>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {role.department} · {role.location} · {EMPLOYMENT_TYPE_LABELS[role.employmentType]}
          </span>
          <RevealText
            as="h1"
            text={role.title}
            mode="word"
            trigger="immediate"
            className="mt-4 font-display text-display-lg font-semibold tracking-tight text-foreground"
          />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70">{role.description}</p>
        </div>

        {role.responsibilities.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Responsibilities
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {role.responsibilities.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-foreground/70">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {role.requirements.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Requirements
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {role.requirements.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-foreground/70">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Apply</h2>
          <p className="mt-2 text-sm text-foreground/50">Every application is reviewed personally.</p>
          <div className="mt-6">
            <ApplicationForm roleId={role._id} roleTitle={role.title} />
          </div>
        </div>
      </div>
    </article>
  );
}
