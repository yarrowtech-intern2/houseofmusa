import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

// One typeface for the whole site — weight utility classes (font-normal /
// font-medium / font-semibold) do the differentiation, not separate fonts.
const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "House of Musa — Engineering Tomorrow",
    template: "%s · House of Musa",
  },
  description:
    "House of Musa builds enterprise ERP systems, SaaS products, AI-ready infrastructure, and digital transformation solutions for ambitious companies.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
