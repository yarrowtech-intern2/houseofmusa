"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@houseofmusa/ui";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
];

export function SiteNav() {
  // Story sections carry a dark scrim behind their text; once scrolled past
  // the hero, the black logo loses contrast against it, so crossfade to the
  // white variant rather than picking one fixed color for the whole page.
  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsOverDark(window.scrollY > window.innerHeight * 0.6);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 pt-6 sm:px-10">
      <Link
        href="/"
        aria-label="House of Musa"
        className="relative drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo-black.png"
          alt="House of Musa"
          className={cn("h-20 w-auto transition-opacity duration-500 sm:h-24", isOverDark && "opacity-0")}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo-white.png"
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-20 w-auto transition-opacity duration-500 sm:h-24",
            isOverDark ? "opacity-100" : "opacity-0",
          )}
        />
      </Link>
      <nav className="hidden items-center gap-8 rounded-full bg-primary/10 px-8 py-3 shadow-soft backdrop-blur-xl sm:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
