"use client";

import { createContext, useEffect, useRef, useState, type ReactNode } from "react";
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
 * Call with an internal pathname to cover the screen, navigate, then reveal
 * the destination once it has rendered. `TransitionLink` is the normal way
 * to reach this -- next/link's own onClick already calls preventDefault()
 * internally, so a global document-level click listener always sees
 * `event.defaultPrevented === true` and never gets a chance to run. Routing
 * the request explicitly through context sidesteps that race entirely.
 */
export const RouteTransitionContext = createContext<(href: string) => void>(() => {});

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
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

  const requestTransition = (href: string) => {
    if (reducedMotion || pendingHrefRef.current) {
      if (!pendingHrefRef.current) router.push(href);
      return;
    }

    const layers = curtainRef.current.filter((el): el is HTMLDivElement => el !== null);
    pendingHrefRef.current = href;
    setActive(true);

    gsap.to(layers, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: COVER_DURATION,
      stagger: COVER_STAGGER,
      ease: "power3.inOut",
      onComplete: () => {
        router.push(href);
        fallbackTimerRef.current = window.setTimeout(reveal, FALLBACK_MS);
      },
    });
  };

  useEffect(() => {
    if (!pendingHrefRef.current) return;
    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <RouteTransitionContext.Provider value={requestTransition}>
      {!reducedMotion && (
        <div className={active ? "fixed inset-0 z-[90]" : "pointer-events-none fixed inset-0 z-[90]"} aria-hidden>
          <CurtainLayers ref={curtainRef} className="absolute inset-0" revealed />
        </div>
      )}
      {children}
    </RouteTransitionContext.Provider>
  );
}
