import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <SiteNav />
      {children}
      <SiteFooter />
    </SmoothScrollProvider>
  );
}
