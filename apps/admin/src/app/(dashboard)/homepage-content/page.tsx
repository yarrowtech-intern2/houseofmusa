import { listSettingsAdmin } from "@hausofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { HomepageContentEditor } from "@/components/settings/HomepageContentEditor";

export default async function HomepageContentPage() {
  const { settings } = await listSettingsAdmin(getServerDb());

  if (!settings.homepageContent || !settings.contactDetails) {
    throw new Error("Settings payload is incomplete");
  }

  return <HomepageContentEditor homepageContent={settings.homepageContent} contactDetails={settings.contactDetails} />;
}
