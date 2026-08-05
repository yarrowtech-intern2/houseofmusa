import { cookies } from "next/headers";
import type { SiteSettings } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";
import { HomepageContentEditor } from "@/components/settings/HomepageContentEditor";

export default async function HomepageContentPage() {
  const { settings } = await apiFetch<{ settings: SiteSettings }>("/api/settings/admin", {
    cookie: cookies().toString(),
  });

  if (!settings.homepageContent || !settings.contactDetails) {
    throw new Error("Settings payload is incomplete");
  }

  return <HomepageContentEditor homepageContent={settings.homepageContent} contactDetails={settings.contactDetails} />;
}
