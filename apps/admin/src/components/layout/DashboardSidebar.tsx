"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Mail,
  FileText,
  Package,
  Frame,
  Home,
  ImageIcon,
  TrendingUp,
  Search,
  Globe,
} from "lucide-react";
import { cn } from "@houseofmusa/ui";
import { Logo } from "./Logo";

const NAV_SECTIONS = [
  { href: "/", label: "Analytics", icon: BarChart3 },
  { href: "/contacts", label: "Contacts", icon: Mail },
  { href: "/applications", label: "Job Applications", icon: FileText },
  { href: "/products", label: "Products", icon: Package },
  { href: "/gallery-frames", label: "Gallery Frames", icon: Frame },
  { href: "/homepage-content", label: "Homepage Content", icon: Home },
  { href: "/media", label: "Media", icon: ImageIcon },
  { href: "/statistics", label: "Statistics", icon: TrendingUp },
  { href: "/seo", label: "SEO", icon: Search },
  { href: "/website-analytics", label: "Website Analytics", icon: Globe },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-foreground/8 bg-surface px-4 py-6 dark:border-white/10 dark:bg-[#111111] lg:flex">
      <div className="mb-8 px-2">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_SECTIONS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
