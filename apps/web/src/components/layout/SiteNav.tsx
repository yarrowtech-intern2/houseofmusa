"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@houseofmusa/ui";

const NAV_LINKS: Array<{ href: string; label: string; iconSrc: string }> = [
  { href: "/about", label: "About", iconSrc: "/icons/about.webp" },
  { href: "/products", label: "Products", iconSrc: "/icons/products.webp" },
  { href: "/gallery", label: "Gallery", iconSrc: "/icons/gallery.webp" },
  { href: "/careers", label: "Careers", iconSrc: "/icons/career.webp" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoOverDark, setLogoOverDark] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const updateLogoTone = () => {
      setLogoOverDark(pathname === "/" && window.scrollY > window.innerHeight * 0.72);
    };

    updateLogoTone();
    window.addEventListener("scroll", updateLogoTone, { passive: true });
    window.addEventListener("resize", updateLogoTone);
    return () => {
      window.removeEventListener("scroll", updateLogoTone);
      window.removeEventListener("resize", updateLogoTone);
    };
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 pt-2 sm:px-10 sm:pt-4 lg:px-14">
      <Link
        href="/"
        aria-label="House of Musa home"
        className="relative block h-20 w-56 drop-shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:h-24 sm:w-72 lg:h-28 lg:w-80"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo-black.png"
          alt="House of Musa"
          className={cn("h-full w-full object-contain object-left transition-opacity duration-300", logoOverDark && "opacity-0")}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/logo-white.png"
          alt=""
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-left opacity-0 transition-opacity duration-300",
            logoOverDark && "opacity-100",
          )}
        />
      </Link>

      <nav aria-label="Primary navigation" className="hidden items-center gap-2 sm:mt-6 sm:flex lg:mt-8">
        <NavIconLink href="/" label="Home" iconSrc="/icons/home.webp" active={isActive("/")} />
        <div className="flex h-12 items-center gap-3 rounded-full bg-black px-4 shadow-[0_12px_32px_rgba(0,0,0,0.22)] lg:gap-4 lg:px-5">
          {NAV_LINKS.map((link) => (
            <NavIconLink key={link.href} {...link} active={isActive(link.href)} inPill />
          ))}
        </div>
      </nav>

      <nav aria-label="Primary navigation" className="relative mt-5 flex items-center gap-2 sm:hidden">
        <NavIconLink
          href="/"
          label="Home"
          iconSrc="/icons/home.webp"
          active={isActive("/")}
          onNavigate={() => setMobileOpen(false)}
        />
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-primary shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-transform duration-300 active:scale-95"
        >
          {mobileOpen ? <X className="h-6 w-6" strokeWidth={2.8} /> : <Menu className="h-6 w-6" strokeWidth={2.8} />}
        </button>

        <div
          className={cn(
            "absolute right-0 top-[calc(100%+0.75rem)] w-56 origin-top-right rounded-[24px] bg-black p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-all duration-300",
            mobileOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          {NAV_LINKS.map(({ href, label, iconSrc }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08] hover:text-primary",
                isActive(href) && "bg-white/10 text-primary",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconSrc} alt="" aria-hidden className="h-6 w-6 object-contain" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function NavIconLink({
  href,
  label,
  iconSrc,
  active,
  inPill = false,
  onNavigate,
}: {
  href: string;
  label: string;
  iconSrc: string;
  active: boolean;
  inPill?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center justify-center rounded-full bg-black text-primary transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 active:scale-95",
        active && "text-primary",
        inPill ? "h-10 w-10" : "h-12 w-12",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc}
        alt=""
        aria-hidden
        className={cn(
          "object-contain transition-transform duration-300 group-hover:scale-105",
          inPill ? "h-6 w-6" : "h-6 w-6",
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute top-[calc(100%+8px)] hidden translate-y-1 rounded-full bg-black px-3 py-1 text-xs font-medium text-primary opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-all duration-200 sm:block",
          "group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
