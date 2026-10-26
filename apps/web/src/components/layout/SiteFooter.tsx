"use client";

import Link from "@/components/transitions/TransitionLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ContactDetails } from "@hausofmusa/types";
import { cn } from "@hausofmusa/ui";
import { getPublicSettings } from "@hausofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";

export function SiteFooter({ contactDetails }: { contactDetails?: ContactDetails }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [liveContactDetails, setLiveContactDetails] = useState(contactDetails);
  const email = liveContactDetails?.email ?? "hello@hausofmusa.com";

  useEffect(() => {
    if (!CAN_USE_API) return;
    let cancelled = false;

    getPublicSettings(getDb())
      .then((settings) => {
        if (!cancelled && settings.contactDetails) setLiveContactDetails(settings.contactDetails);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname === "/about2") return null;

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
            alt="Haus of Musa"
            className="h-7 w-auto sm:h-8"
          />
          <p className={cn("mt-3 max-w-xs text-sm", isHome ? "text-white/75" : "text-foreground/50")}>
            Enterprise ERP, SaaS, and AI-ready infrastructure - engineered from a single digital headquarters.
          </p>
          <div className={cn("mt-4 flex flex-col gap-1 text-sm", isHome ? "text-white/70" : "text-foreground/55")}>
            <a href={`mailto:${email}`} className="hover:text-primary">
              {email}
            </a>
            {liveContactDetails?.phone && <span>{liveContactDetails.phone}</span>}
            {liveContactDetails?.location && <span>{liveContactDetails.location}</span>}
          </div>
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
            <Link
              href="/contact"
              className={cn(isHome ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-foreground")}
            >
              Contact
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
        &copy; {new Date().getFullYear()} Haus of Musa. All rights reserved.
      </p>
    </footer>
  );
}
