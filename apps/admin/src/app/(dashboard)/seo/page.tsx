import { listSettingsAdmin } from "@hausofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { SeoSettingsEditor } from "@/components/settings/SeoSettingsEditor";

export default async function SeoPage() {
  const { settings } = await listSettingsAdmin(getServerDb());

  if (!settings.seo) {
    throw new Error("SEO settings payload is incomplete");
  }

  return <SeoSettingsEditor seo={settings.seo} />;
}
