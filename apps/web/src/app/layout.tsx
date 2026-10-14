import type { Metadata } from "next";
import { Onest } from "next/font/google";
import localFont from "next/font/local";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { getPublicSiteSettings } from "@/lib/siteSettings";
import "./globals.css";
import "@/components/about/about3-hero.css";

const inertia = localFont({
  src: "../../public/font/Inertia.woff2",
  variable: "--font-inertia",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: "variable",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const seo = settings.seo;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: seo?.defaultTitle ?? "House of Musa - Engineering Tomorrow",
      template: "%s | House of Musa",
    },
    description:
      seo?.defaultDescription ??
      "House of Musa builds enterprise ERP systems, SaaS products, AI-ready infrastructure, and digital transformation solutions for ambitious companies.",
    openGraph: seo?.ogImage ? { images: [seo.ogImage] } : undefined,
    icons: { icon: "/favicon.png" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inertia.variable} ${onest.variable}`}>
      <body className="font-sans antialiased">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
