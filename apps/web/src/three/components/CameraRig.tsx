"use client";

import type { RefObject } from "react";
import { useCameraTimeline } from "@/three/hooks/useCameraTimeline";
import type { ParallaxOffset } from "@/hooks/usePointerParallax";

export function CameraRig({
  ready,
  storyContainerRef,
  parallaxRef,
}: {
  ready: boolean;
  storyContainerRef: RefObject<HTMLElement>;
  parallaxRef: RefObject<ParallaxOffset>;
}) {
  useCameraTimeline({ ready, storyContainerRef, parallaxRef });
  return null;
}
