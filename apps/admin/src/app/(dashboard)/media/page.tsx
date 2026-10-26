import { listMedia } from "@hausofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { MediaManager } from "@/components/media/MediaManager";

export default async function MediaPage() {
  const items = await listMedia(getServerDb());
  return <MediaManager items={items} />;
}
