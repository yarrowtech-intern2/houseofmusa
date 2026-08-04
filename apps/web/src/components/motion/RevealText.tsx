"use client";

import { createElement, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** "word" for headline-scale reveals, "char" for shorter emphasis copy. */
  mode?: "word" | "char";
  /** Play once on mount (hero) vs. on scroll into view (story sections). */
  trigger?: "immediate" | "scroll";
  delay?: number;
}

/**
 * Splits text into masked word/char spans and staggers them in. Avoids the
 * paid GSAP SplitText plugin by doing the split ourselves — swap in
 * SplitText here if the project has a Club GSAP license.
 *
 * Renders via createElement (rather than JSX with a dynamic tag) because
 * once @react-three/fiber is imported anywhere in the app, it augments the
 * global JSX.IntrinsicElements namespace with hundreds of Three.js tags —
 * a JSX `<Tag>` with `Tag: keyof JSX.IntrinsicElements` then forces TS to
 * union-check against all of them, which blows up type-checking.
 */
export function RevealText({
  text,
  as = "h2",
  className,
  mode = "word",
  trigger = "scroll",
  delay = 0,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const units = mode === "word" ? text.split(" ") : text.split("");

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>("[data-reveal-unit] > span");

    if (reducedMotion) {
      gsap.set(spans, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        spans,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: mode === "word" ? 0.9 : 0.5,
          ease: "power4.out",
          stagger: mode === "word" ? 0.08 : 0.02,
          delay,
        },
      );

      if (trigger === "scroll") {
        tween.pause();
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 80%",
          onEnter: () => tween.play(),
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, trigger, mode, delay]);

  return createElement(
    as,
    { ref: containerRef, className },
    units.map((unit, index) =>
      createElement(
        "span",
        {
          key: index,
          "data-reveal-unit": true,
          className: mode === "word" ? "reveal-word mr-[0.25em]" : "reveal-word",
        },
        createElement("span", null, unit === " " ? " " : unit),
      ),
    ),
  );
}
