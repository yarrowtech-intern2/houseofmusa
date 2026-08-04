"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RevealText } from "@/components/motion/RevealText";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  { title: "Senior engineers only", body: "No bait-and-switch to junior staff after the pitch — the team you meet is the team that ships." },
  { title: "Direct communication", body: "You talk to the people building your system, not a rotating cast of account managers." },
  { title: "Built for a decade", body: "Architecture decisions are made for where your business is headed, not just the next demo." },
  { title: "One team, start to finish", body: "Strategy, design, engineering, and deployment — the same team owns it end to end." },
];

export function WhyChooseUsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!containerRef.current || reducedMotion) return;
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll("[data-reveal-card]");
      if (!cards) return;
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="px-6 py-24 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Why House of Musa</span>
        <RevealText
          as="h2"
          text="Why teams choose to stay."
          mode="word"
          trigger="scroll"
          className="mt-4 font-display text-display-md font-medium tracking-tight text-foreground"
        />

        <div ref={containerRef} className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              data-reveal-card
              className="rounded-3xl border border-foreground/8 bg-white p-8 shadow-soft"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
