import { cookies } from "next/headers";
import type { PaginatedResult, Product, SiteSettings } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";
import { GalleryFramesEditor } from "@/components/settings/GalleryFramesEditor";

export default async function GalleryFramesPage() {
  const cookie = cookies().toString();
  const [{ settings }, products] = await Promise.all([
    apiFetch<{ settings: SiteSettings }>("/api/settings/admin", { cookie }),
    apiFetch<PaginatedResult<Product>>("/api/products/admin?pageSize=50", { cookie }),
  ]);

  if (!settings.galleryFrames) {
    throw new Error("Gallery frame settings payload is incomplete");
  }

  return <GalleryFramesEditor galleryFrames={settings.galleryFrames} products={products.items} />;
}
