import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSiteSettings();

  return (
    <SmoothScrollProvider>
      <SiteNav />
      {children}
      <SiteFooter contactDetails={settings.contactDetails} />
    </SmoothScrollProvider>
  );
}
