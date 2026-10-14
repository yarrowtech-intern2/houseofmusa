"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactDetails, HomepageContent } from "@houseofmusa/types";
import { ArrivalSequence } from "@/components/loader/ArrivalSequence";
import { HeroOverlay } from "@/components/home/HeroOverlay";
import { StorySection } from "@/components/home/StorySection";
import { getPublicSettings } from "@houseofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";

const HeroCanvas = dynamic(() => import("@/three/scenes/HeroCanvas").then((m) => m.HeroCanvas), {
  ssr: false,
});

export function HomeExperience({
  hasModel,
  homepageContent,
  contactDetails,
}: {
  hasModel: boolean;
  homepageContent: HomepageContent;
  contactDetails: ContactDetails;
}) {
  const [ready, setReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [liveHomepageContent, setLiveHomepageContent] = useState(homepageContent);
  const [liveContactDetails, setLiveContactDetails] = useState(contactDetails);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const handleArrivalComplete = useCallback(() => setReady(true), []);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    if (!CAN_USE_API) return;
    let cancelled = false;

    getPublicSettings(getDb())
      .then((settings) => {
        if (cancelled) return;
        if (settings.homepageContent) setLiveHomepageContent(settings.homepageContent);
        if (settings.contactDetails) setLiveContactDetails(settings.contactDetails);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

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
        <HeroOverlay content={liveHomepageContent} contactDetails={liveContactDetails} />
      </div>

      <div ref={storyContainerRef} className="relative z-0">
        {liveHomepageContent.storySections.map((section, index) => (
          <StorySection key={`${section.eyebrow}-${index}`} {...section} />
        ))}
      </div>
    </main>
  );
}
