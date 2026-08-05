import fs from "node:fs";
import path from "node:path";
import { HomeExperience } from "@/components/home/HomeExperience";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const hasModel = fs.existsSync(path.join(process.cwd(), "public/models/house.glb"));
  const settings = await getPublicSiteSettings();

  if (!settings.homepageContent || !settings.contactDetails) {
    throw new Error("Public settings fallback failed");
  }

  return (
    <>
      {hasModel && <link rel="preload" href="/models/house.glb" as="fetch" crossOrigin="anonymous" />}
      <HomeExperience
        hasModel={hasModel}
        homepageContent={settings.homepageContent}
        contactDetails={settings.contactDetails}
      />
    </>
  );
}
