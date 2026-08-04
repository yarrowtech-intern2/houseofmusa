"use client";

import Link from "next/link";
import { Button } from "@houseofmusa/ui";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function HeroOverlay({ onBookConsultation }: { onBookConsultation: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-8 px-6 pb-20 text-center sm:pb-28">
      {/* Scrim so the headline stays readable regardless of what part of the
          3D scene (bright snow, dark trees, sky) sits behind it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[75vh] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <RevealText
        as="h1"
        text="Engineering Tomorrow."
        mode="word"
        trigger="immediate"
        delay={0.2}
        className="font-display text-display-xl font-medium tracking-tight text-white"
      />
      <p className="pointer-events-none max-w-xl text-balance font-sans text-base text-white/80 sm:text-lg">
        Enterprise ERP, SaaS, and AI-ready infrastructure — engineered from a single digital headquarters.
      </p>
      <div className="pointer-events-auto flex flex-col items-center gap-4 sm:flex-row">
        <MagneticButton>
          <Button size="lg" variant="primary" onClick={onBookConsultation}>
            Book Consultation
          </Button>
        </MagneticButton>
        <MagneticButton>
          <Button size="lg" variant="glass" asChild>
            <Link href="/products">View Products</Link>
          </Button>
        </MagneticButton>
      </div>
    </div>
  );
}
