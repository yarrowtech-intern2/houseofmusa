"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxLayer({
  children,
  className,
  speed = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  /** Positive drifts slower than scroll, negative drifts faster/opposite. */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!ref.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [speed, reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
