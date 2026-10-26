import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CareerRole } from "@hausofmusa/types";
import { CareerDetailClient } from "@/components/careers/CareerDetailClient";
import { getCareerRoleBySlug } from "@hausofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";
import { STATIC_CAREER_ROLES } from "@/lib/staticContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_CAREER_ROLES.map((role) => ({ slug: role.slug }));
}

async function getCareerRole(slug: string): Promise<CareerRole | null> {
  const staticRole = STATIC_CAREER_ROLES.find((role) => role.slug === slug) ?? null;

  if (!CAN_USE_API) return staticRole;

  try {
    return await getCareerRoleBySlug(getDb(), slug);
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
