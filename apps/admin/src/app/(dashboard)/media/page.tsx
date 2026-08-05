import { cookies } from "next/headers";
import type { Media } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";
import { MediaManager } from "@/components/media/MediaManager";

export default async function MediaPage() {
  const { items } = await apiFetch<{ items: Media[] }>("/api/media", { cookie: cookies().toString() });
  return <MediaManager items={items} />;
}
