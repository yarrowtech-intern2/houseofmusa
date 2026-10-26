"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CurtainLayers, type CurtainLayerRefs } from "@/components/transitions/CurtainLayers";

const SESSION_KEY = "hom:arrival-played";
const WAIT_MESSAGES = [
  "Preparing the entrance",
  "Loading the headquarters",
  "Polishing the details",
  "A few seconds more",
  "Setting the scene",
];
const ALMOST_THERE = "Almost there";

/**
 * Progress-aware cinematic curtain for the home hero. It stays mounted until
 * the async 3D model subtree has resolved, then lifts out of the viewport and
 * hands off to the camera intro.
 */
export function ArrivalSequence({ sceneReady, onComplete }: { sceneReady: boolean; onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [copyIndex, setCopyIndex] = useState(0);
  const [visualProgress, setVisualProgress] = useState(8);
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<CurtainLayerRefs>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(false);
  const previousOverflowRef = useRef<string>();
  const reducedMotion = useReducedMotion();
  const { progress, total } = useProgress();

  useEffect(() => {
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflowRef.current ?? "";
    };
  }, []);

  useEffect(() => {
    if (visualProgress >= 90 || sceneReady) return;
    const intervalId = window.setInterval(() => {
      setCopyIndex((index) => (index + 1 + Math.floor(Math.random() * (WAIT_MESSAGES.length - 1))) % WAIT_MESSAGES.length);
    }, 1600);

    return () => window.clearInterval(intervalId);
  }, [sceneReady, visualProgress]);

  useEffect(() => {
    const assetProgress = total > 0 ? progress : 12;
    const target = sceneReady ? 100 : Math.min(98, Math.max(assetProgress, 12));
    setVisualProgress(target);
  }, [progress, sceneReady, total]);

  useEffect(() => {
    if (!visible || reducedMotion || sessionStorage.getItem(SESSION_KEY) === "1") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 18, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.15 },
      );
    }, overlayRef);

    return () => ctx.revert();
  }, [reducedMotion, visible]);

  useEffect(() => {
    if (!sceneReady || completeRef.current) return;

    completeRef.current = true;
    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      document.body.style.overflow = previousOverflowRef.current ?? "";
      setVisible(false);
      onComplete();
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    const layers = curtainRef.current.filter((el): el is HTMLDivElement => el !== null);
    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" }, onComplete: finish });

    tl.to(contentRef.current, { y: alreadyPlayed ? -16 : -44, autoAlpha: 0, duration: alreadyPlayed ? 0.4 : 0.75 })
      .to(
        overlayRef.current,
        { yPercent: -4, duration: alreadyPlayed ? 0.6 : 1.1 },
        alreadyPlayed ? 0.05 : 0.18,
      )
      .to(
        layers,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: alreadyPlayed ? 0.6 : 1.1,
          stagger: alreadyPlayed ? 0.12 : 0.22,
        },
        alreadyPlayed ? 0.05 : 0.18,
      );

    return () => {
      tl.kill();
    };
  }, [onComplete, reducedMotion, sceneReady]);

  if (!visible) return null;

  const roundedProgress = Math.round(visualProgress);
  const statusCopy = roundedProgress >= 90 || sceneReady ? ALMOST_THERE : WAIT_MESSAGES[copyIndex]!;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex min-h-dvh flex-col items-center justify-center overflow-hidden text-primary-foreground"
    >
      <CurtainLayers ref={curtainRef} className="absolute inset-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden text-center font-display text-[18vw] font-semibold leading-none text-black/[0.055] sm:text-[15vw]">
          HAUSOFMUSA
        </div>
      </CurtainLayers>

      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-[min(34rem,calc(100vw-2rem))] flex-col items-center px-4 text-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/logo-black.png" alt="Haus of Musa" className="h-auto w-[min(9rem,34vw)]" />

        <div className="relative mt-10 grid size-40 place-items-center sm:size-48" aria-hidden="true">
          <DotLottieReact
            src="/loader/loader2.lottie"
            autoplay
            loop
            className="absolute inset-0 size-full"
          />
        </div>

        <div className="mt-2 font-display text-2xl font-semibold tabular-nums text-primary-foreground sm:text-3xl">
          {roundedProgress}
        </div>

        <div className="mt-7 min-h-12">
          <p className="font-display text-xl font-semibold leading-tight sm:text-2xl">{statusCopy}</p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-black/55 sm:text-[0.8rem]">
            Wait a few seconds
          </p>
        </div>
      </div>
    </div>
  );
}
