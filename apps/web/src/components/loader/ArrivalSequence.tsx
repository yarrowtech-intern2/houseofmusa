"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "hom:arrival-played";

/**
 * Near-black loader: ambient particles fade in, logo settles, headline
 * reveals word-by-word, then the whole overlay dissolves and hands off to
 * the hero (camera intro begins on `onComplete`). Locks page scroll for its
 * duration so it can never race the camera's scroll-scrubbed timeline.
 * Plays a short version on repeat visits within the same session.
 */
export function ArrivalSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const canvas = particlesRef.current;
    let rafId = 0;

    if (canvas && !reducedMotion) {
      const ctx = canvas.getContext("2d");
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      const particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        speed: Math.random() * 0.15 + 0.03,
      }));

      const draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 227, 194, 0.5)";
        for (const p of particles) {
          p.y -= p.speed;
          if (p.y < 0) p.y = canvas.height;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        rafId = requestAnimationFrame(draw);
      };
      draw();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
      };
    }
  }, [reducedMotion]);

  useEffect(() => {
    const alreadyPlayed = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = "";
      setVisible(false);
      onComplete();
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });

    if (alreadyPlayed) {
      // Short handoff for returning visitors within the same session.
      tl.to(overlayRef.current, { opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.15 });
      return () => {
        tl.kill();
      };
    }

    tl.set([logoRef.current, line1Ref.current, line2Ref.current], { opacity: 0 })
      .to(logoRef.current, { opacity: 1, duration: 1, ease: "power2.out" }, 0.6)
      .fromTo(
        line1Ref.current?.querySelectorAll("span") ?? [],
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power4.out" },
        1.5,
      )
      .fromTo(
        line2Ref.current?.querySelectorAll("span") ?? [],
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power4.out" },
        2.1,
      )
      .to({}, { duration: 1 }) // hold
      .to(overlayRef.current, { opacity: 0, duration: 0.9, ease: "power2.inOut" });

    return () => {
      tl.kill();
    };
  }, [reducedMotion, onComplete]);

  if (!visible) return null;

  const words1 = "Engineering Tomorrow.".split(" ");
  const words2 = "One Digital Experience at a Time.".split(" ");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
    >
      <canvas ref={particlesRef} className="pointer-events-none absolute inset-0 opacity-70" />
      <div ref={logoRef} className="relative mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-white.png" alt="House of Musa" className="h-8 w-auto" />
      </div>
      <div className="relative px-6 text-center">
        <div ref={line1Ref} className="font-display text-display-lg font-semibold tracking-tight">
          {words1.map((word, i) => (
            <span key={i} className="reveal-word mr-[0.2em]">
              <span>{word}</span>
            </span>
          ))}
        </div>
        <div ref={line2Ref} className="font-display text-display-md font-medium tracking-tight text-white/70">
          {words2.map((word, i) => (
            <span key={i} className="reveal-word mr-[0.2em]">
              <span>{word}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
