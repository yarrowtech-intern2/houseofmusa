"use client";

import Link from "next/link";
import type { HomepageContent } from "@houseofmusa/types";
import { Button } from "@houseofmusa/ui";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function HeroOverlay({
  content,
  onBookConsultation,
}: {
  content: HomepageContent;
  onBookConsultation: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-8 px-6 pb-20 text-center sm:pb-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75vh] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <RevealText
        as="h1"
        text={content.heroTitle}
        mode="word"
        trigger="immediate"
        delay={0.2}
        className="font-hero-azonix text-display-xl font-medium tracking-tight text-white"
      />
      <p className="pointer-events-none max-w-xl text-balance font-sans text-base text-white/80 sm:text-lg">
        {content.heroSubtitle}
      </p>
      <div className="pointer-events-auto flex w-full max-w-56 flex-col items-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
        <MagneticButton className="w-full sm:w-auto">
          <Button size="lg" variant="primary" className="w-full sm:w-auto" onClick={onBookConsultation}>
            {content.primaryCtaLabel}
          </Button>
        </MagneticButton>
        <MagneticButton className="w-full sm:w-auto">
          <Button size="lg" variant="glass" className="w-full sm:w-auto" asChild>
            <Link href={content.secondaryCtaHref}>{content.secondaryCtaLabel}</Link>
          </Button>
        </MagneticButton>
      </div>
    </div>
  );
}
