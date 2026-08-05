import { cookies } from "next/headers";
import type { SiteSettings } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";
import { SeoSettingsEditor } from "@/components/settings/SeoSettingsEditor";

export default async function SeoPage() {
  const { settings } = await apiFetch<{ settings: SiteSettings }>("/api/settings/admin", {
    cookie: cookies().toString(),
  });

  if (!settings.seo) {
    throw new Error("SEO settings payload is incomplete");
  }

  return <SeoSettingsEditor seo={settings.seo} />;
}
