import type { Metadata } from "next";
import type { Product, PaginatedResult } from "@hausofmusa/types";
import { listProducts } from "@hausofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { STATIC_PRODUCTS, toPaginatedResult } from "@/lib/staticContent";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "3D Gallery",
  description: "Walk through a first-person art gallery showcasing every Haus of Musa product.",
};

// Standalone route (outside the (site) group) — the gallery is full-bleed
// and runs its own first-person camera, so it skips SiteNav/SiteFooter and
// the Lenis smooth-scroll provider entirely.
export default async function GalleryPage() {
  const [{ items: products }, settings] = await Promise.all([
    (CAN_USE_API
      ? listProducts(getDb(), { pageSize: 50 }).catch(() => toPaginatedResult(STATIC_PRODUCTS))
      : Promise.resolve(toPaginatedResult(STATIC_PRODUCTS))) as Promise<PaginatedResult<Product>>,
    getPublicSiteSettings(),
  ]);

  const assignedProducts =
    settings.galleryFrames?.frames
      .filter((frame) => frame.enabled)
      .map((frame) => products.find((product) => product.slug === frame.productSlug))
      .filter((product): product is Product => Boolean(product)) ?? [];

  return <GalleryExperience products={assignedProducts.length > 0 ? assignedProducts : products} />;
}
