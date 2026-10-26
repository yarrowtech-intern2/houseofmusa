"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CurtainLayers, type CurtainLayerRefs } from "./CurtainLayers";

const COVER_DURATION = 0.5;
const COVER_STAGGER = 0.09;
const REVEAL_DURATION = 1.1;
const REVEAL_STAGGER = 0.22;
const FALLBACK_MS = 6000;

/**
 * Mounted once in the root layout so it survives every navigation. Covering
 * is triggered the instant a link is pressed -- before Next has even started
 * fetching the destination -- so clicks get immediate visual feedback instead
 * of a dead pause. Reveal plays once the new route has actually rendered
 * (detected via the pathname change), so the "page is ready" moment and the
 * "curtain lifts" moment always line up.
 */
export function RouteTransitionProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const curtainRef = useRef<CurtainLayerRefs>([]);
  const pendingHrefRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  const reveal = () => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    pendingHrefRef.current = null;
    const layers = curtainRef.current.filter((el): el is HTMLDivElement => el !== null);
    gsap.to(layers, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: REVEAL_DURATION,
      stagger: REVEAL_STAGGER,
      ease: "power3.inOut",
      onComplete: () => setActive(false),
    });
  };

  useEffect(() => {
    if (reducedMotion) return;

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && (url.hash || url.search === window.location.search)) return;

      event.preventDefault();
      const layers = curtainRef.current.filter((el): el is HTMLDivElement => el !== null);
      pendingHrefRef.current = url.pathname + url.search;
      setActive(true);

      gsap.to(layers, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: COVER_DURATION,
        stagger: COVER_STAGGER,
        ease: "power3.inOut",
        onComplete: () => {
          const href = pendingHrefRef.current;
          if (!href) return;
          router.push(href);
          fallbackTimerRef.current = window.setTimeout(reveal, FALLBACK_MS);
        },
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, router]);

  useEffect(() => {
    if (!pendingHrefRef.current) return;
    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (reducedMotion) return null;

  return (
    <div className={active ? "fixed inset-0 z-[90]" : "pointer-events-none fixed inset-0 z-[90]"} aria-hidden>
      <CurtainLayers ref={curtainRef} className="absolute inset-0" revealed />
    </div>
  );
}
