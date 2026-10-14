import { listProductsAdmin, listSettingsAdmin } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { GalleryFramesEditor } from "@/components/settings/GalleryFramesEditor";

export default async function GalleryFramesPage() {
  const db = getServerDb();
  const [{ settings }, products] = await Promise.all([
    listSettingsAdmin(db),
    listProductsAdmin(db, { pageSize: 50 }),
  ]);

  if (!settings.galleryFrames) {
    throw new Error("Gallery frame settings payload is incomplete");
  }

  return <GalleryFramesEditor galleryFrames={settings.galleryFrames} products={products.items} />;
}
