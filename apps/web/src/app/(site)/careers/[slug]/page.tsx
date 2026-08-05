import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CareerRole } from "@houseofmusa/types";
import { CareerDetailClient } from "@/components/careers/CareerDetailClient";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { STATIC_CAREER_ROLES } from "@/lib/staticContent";

export const dynamic = "force-dynamic";

async function getCareerRole(slug: string): Promise<CareerRole | null> {
  const staticRole = STATIC_CAREER_ROLES.find((role) => role.slug === slug) ?? null;

  if (!CAN_USE_API) return staticRole;

  try {
    const res = await fetch(`${API_URL}/api/career-roles/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to load role: ${res.status}`);
    const data = (await res.json()) as { item: CareerRole };
    return data.item;
  } catch {
    return staticRole;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const role = await getCareerRole(params.slug).catch(() => null);
  if (!role) return { title: "Open Role" };
  return { title: role.title, description: `${role.title} - ${role.department}, ${role.location}` };
}

export default async function CareerRoleDetailPage({ params }: { params: { slug: string } }) {
  const role = await getCareerRole(params.slug);
  if (!role) notFound();

  return <CareerDetailClient initialRole={role} />;
}
