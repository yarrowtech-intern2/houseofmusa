"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { ArrivalSequence } from "@/components/loader/ArrivalSequence";
import { HeroOverlay } from "@/components/home/HeroOverlay";
import { StorySection, type StorySectionData } from "@/components/home/StorySection";
import { ContactModal } from "@/components/contact/ContactModal";

const HeroCanvas = dynamic(() => import("@/three/scenes/HeroCanvas").then((m) => m.HeroCanvas), {
  ssr: false,
});

const STORY_SECTIONS: StorySectionData[] = [
  {
    eyebrow: "Innovation",
    title: "Every wing of this building solves a different problem.",
    body: "From ERP cores to AI-ready infrastructure, our teams are organized the way our headquarters is built — purpose-designed spaces, not one-size-fits-all software.",
  },
  {
    eyebrow: "Technology",
    title: "Modern stacks, chosen for longevity.",
    body: "Next.js, cloud-native services, and typed foundations throughout — built so what we ship today still makes sense to maintain in five years.",
  },
  {
    eyebrow: "Engineering",
    title: "Discipline is the product.",
    body: "Code review, testing, and observability aren't afterthoughts. They're why enterprise clients trust us with systems that can't go down.",
  },
  {
    eyebrow: "Trust",
    title: "Partnerships measured in years, not tickets.",
    body: "We embed with your team through digital transformation, not just deliver and disappear. Long-term relationships are how enterprise software should work.",
  },
  {
    eyebrow: "Quality",
    title: "Reviewed at every level, shipped without compromise.",
    body: "Design, architecture, and code all pass through the same bar — the one you'd expect from the systems running your business.",
  },
  {
    eyebrow: "Products",
    title: "Walk through what we've built.",
    body: "Eight flagship products spanning ERP, SaaS, and cloud infrastructure — each with a real case study behind it.",
    href: "/products",
    linkLabel: "Explore the products",
  },
  {
    eyebrow: "Future",
    title: "Built for what enterprise software becomes next.",
    body: "AI-ready by default, cloud-native from day one — infrastructure designed for where your business is headed, not just where it is today.",
  },
];

export function HomeExperience({ hasModel }: { hasModel: boolean }) {
  const [ready, setReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const handleArrivalComplete = useCallback(() => setReady(true), []);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <main className="relative">
      <ArrivalSequence sceneReady={sceneReady} onComplete={handleArrivalComplete} />

      <div className="fixed inset-0 -z-10">
        <HeroCanvas
          hasModel={hasModel}
          ready={ready}
          onSceneReady={handleSceneReady}
          storyContainerRef={storyContainerRef}
        />
      </div>

      <div className="relative z-0 flex min-h-screen items-end">
        <HeroOverlay onBookConsultation={() => setContactOpen(true)} />
      </div>

      <div ref={storyContainerRef} className="relative z-0">
        {STORY_SECTIONS.map((section) => (
          <StorySection key={section.eyebrow} {...section} />
        ))}
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </main>
  );
}
