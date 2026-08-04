"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@houseofmusa/ui";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer
      className={cn(
        "relative z-0 px-6 py-16 sm:px-12",
        isHome ? "bg-primary" : "border-t border-foreground/8 bg-surface",
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isHome ? "/logo/logo-white.png" : "/logo/logo-black.png"}
            alt="House of Musa"
            className="h-14 w-auto sm:h-16"
          />
          <p className={cn("mt-3 max-w-xs text-sm", isHome ? "text-white/75" : "text-foreground/50")}>
            Enterprise ERP, SaaS, and AI-ready infrastructure — engineered from a single digital headquarters.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-12">
          <div className="flex flex-col gap-3">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isHome ? "text-white/60" : "text-foreground/40",
              )}
            >
              Company
            </span>
            <Link
              href="/about"
              className={cn(isHome ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground")}
            >
              About
            </Link>
            <Link
              href="/careers"
              className={cn(isHome ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground")}
            >
              Careers
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isHome ? "text-white/60" : "text-foreground/40",
              )}
            >
              Work
            </span>
            <Link
              href="/products"
              className={cn(isHome ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground")}
            >
              Products
            </Link>
            <Link
              href="/gallery"
              className={cn(isHome ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground")}
            >
              3D Gallery
            </Link>
          </div>
        </div>
      </div>
      <p className={cn("mx-auto mt-16 max-w-5xl text-xs", isHome ? "text-white/50" : "text-foreground/40")}>
        © {new Date().getFullYear()} House of Musa. All rights reserved.
      </p>
    </footer>
  );
}
