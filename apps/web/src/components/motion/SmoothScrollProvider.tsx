"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion || pathname === "/about2") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname, reducedMotion]);

  useEffect(() => {
    // The (site) layout — and this Lenis instance — persists across
    // client-side navigations (Next App Router keeps shared layouts
    // mounted). Lenis measures scrollable height once at init; without an
    // explicit resize on route change, navigating from a tall page (home)
    // to a short one (e.g. a route shell) leaves it using the old, taller
    // limit, so short pages' footers can end up effectively unreachable.
    const raf = requestAnimationFrame(() => lenisRef.current?.resize());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
