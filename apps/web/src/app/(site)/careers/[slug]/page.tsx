import type { Metadata } from "next";
import type { CareerRole } from "@houseofmusa/types";
import { PageComingSoon } from "@/components/layout/PageComingSoon";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Static export needs every path known at build time. The page itself is
// still a placeholder (docs/ROADMAP.md phase 4), but wiring this up now
// means it needs no changes when the real role-detail build lands — just
// real roles in the API for it to pick up on the next rebuild.
export async function generateStaticParams() {
  const res = await fetch(`${API_URL}/api/career-roles`);
  if (!res.ok) return [];
  const data = (await res.json()) as { items: CareerRole[] };
  return data.items.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: params.slug.replace(/-/g, " ") };
}

// Full role detail + application form build is docs/ROADMAP.md phase 4.
export default function CareerRoleDetailPage({ params }: { params: { slug: string } }) {
  return (
    <PageComingSoon
      eyebrow="Open Role"
      title={params.slug.replace(/-/g, " ")}
      description="Full role details and the application form are arriving in the next build phase."
    />
  );
}
