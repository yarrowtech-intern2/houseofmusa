import type { Metadata } from "next";
import type { Product, PaginatedResult } from "@houseofmusa/types";
import { apiGet } from "@/lib/api";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { STATIC_PRODUCTS, toPaginatedResult } from "@/lib/staticContent";

export const metadata: Metadata = {
  title: "3D Gallery",
  description: "Walk through a first-person art gallery showcasing every House of Musa product.",
};

// Standalone route (outside the (site) group) — the gallery is full-bleed
// and runs its own first-person camera, so it skips SiteNav/SiteFooter and
// the Lenis smooth-scroll provider entirely.
export default async function GalleryPage() {
  const { items: products } = await apiGet<PaginatedResult<Product>>("/api/products?pageSize=50").catch(
    () => toPaginatedResult(STATIC_PRODUCTS),
  );

  return <GalleryExperience products={products} />;
}
