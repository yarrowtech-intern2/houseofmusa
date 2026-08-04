import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const onest = Onest({ subsets: ["latin"], variable: "--font-onest", weight: "variable" });

export const metadata: Metadata = {
  title: { default: "Admin · House of Musa", template: "%s · Admin" },
  description: "House of Musa content and operations dashboard.",
  icons: { icon: "/favicon.png" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
