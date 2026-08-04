"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import type { RefObject } from "react";
import type { ParallaxOffset } from "@/hooks/usePointerParallax";

gsap.registerPlugin(ScrollTrigger);

export interface CameraWaypoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

/**
 * Intro (far, approaching) -> hero rest -> one waypoint per story section ->
 * future/close. Each position is `lookAt + 1.8 * (originalPosition - lookAt)`
 * off an earlier, tighter pass — pulling every waypoint back proportionally
 * (rather than hand-tuning each one) after the real house model came in
 * noticeably larger in-frame than the placeholder box these were first
 * tuned against.
 */
export const CAMERA_WAYPOINTS: CameraWaypoint[] = [
  { position: [0, 4.7, 46.8], lookAt: [0, 2, 0], fov: 32 }, // intro: far approach
  { position: [0, 2.36, 19.8], lookAt: [0, 2, 0], fov: 35 }, // hero rest
  { position: [-11.8, 2.92, 10.8], lookAt: [-1, 2.2, 0], fov: 38 }, // Innovation
  { position: [-6.4, 5.16, 6.7], lookAt: [-1, 3, -0.5], fov: 36 }, // Technology
  { position: [6.4, 4.04, 5.8], lookAt: [1, 2.6, -0.5], fov: 34 }, // Engineering
  { position: [11.4, 2.72, 9.5], lookAt: [1.5, 2, 0.5], fov: 38 }, // Trust
  { position: [5.4, 8.16, 12.6], lookAt: [0, 2.4, 0], fov: 40 }, // Quality
  { position: [-5.4, 8.68, 14.4], lookAt: [0, 2.2, 0], fov: 40 }, // Products
  { position: [0, 12.8, 25.2], lookAt: [0, 2, 0], fov: 44 }, // Future: pull back
];

interface FlatCameraState {
  x: number;
  y: number;
  z: number;
  lx: number;
  ly: number;
  lz: number;
  fov: number;
}

function toFlatState(waypoint: CameraWaypoint): FlatCameraState {
  return {
    x: waypoint.position[0],
    y: waypoint.position[1],
    z: waypoint.position[2],
    lx: waypoint.lookAt[0],
    ly: waypoint.lookAt[1],
    lz: waypoint.lookAt[2],
    fov: waypoint.fov,
  };
}

export function useCameraTimeline({
  ready,
  storyContainerRef,
  parallaxRef,
}: {
  ready: boolean;
  storyContainerRef: RefObject<HTMLElement>;
  parallaxRef: RefObject<ParallaxOffset>;
}) {
  const { camera } = useThree();
  const breathOffset = useRef(0);
  const lookAtTarget = useRef(new THREE.Vector3(...CAMERA_WAYPOINTS[1]!.lookAt));
  const currentLookAt = useRef(new THREE.Vector3(...CAMERA_WAYPOINTS[0]!.lookAt));

  useLayoutEffect(() => {
    if (!ready) return;

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const applyState = (state: FlatCameraState) => {
      perspectiveCamera.position.set(state.x, state.y, state.z);
      perspectiveCamera.fov = state.fov;
      perspectiveCamera.updateProjectionMatrix();
      currentLookAt.current.set(state.lx, state.ly, state.lz);
    };

    const state = toFlatState(CAMERA_WAYPOINTS[0]!);
    applyState(state);

    const ctx = gsap.context(() => {
      const rest = toFlatState(CAMERA_WAYPOINTS[1]!);

      // Cinematic approach: fly from the far waypoint to the hero-rest
      // waypoint once the arrival sequence hands off — not scroll-linked.
      // Scroll is locked by the caller until this resolves (see
      // ArrivalSequence), so it can't collide with the scroll-scrubbed
      // timeline below.
      gsap.to(state, {
        ...rest,
        duration: 3.2,
        ease: "power2.inOut",
        onUpdate: () => applyState(state),
      });

      // Scroll-driven journey through the remaining waypoints, one per
      // story section, chained after the intro so it never fights it.
      if (storyContainerRef.current) {
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: storyContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        for (let i = 2; i < CAMERA_WAYPOINTS.length; i += 1) {
          scrollTimeline.to(state, {
            ...toFlatState(CAMERA_WAYPOINTS[i]!),
            duration: 1,
            ease: "power1.inOut",
            onUpdate: () => applyState(state),
          });
        }
      }

      // Gentle idle "breathing" drift, layered additively in useFrame below.
      gsap.to(breathOffset, {
        current: 1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [ready, camera, storyContainerRef]);

  useFrame(() => {
    if (!ready) return;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const parallax = parallaxRef.current ?? { x: 0, y: 0 };

    // Mouse/gyro parallax and idle breathing are layered on top of the
    // GSAP-driven lookAt target rather than the position itself, so they
    // never fight the scroll/intro timelines.
    lookAtTarget.current.lerp(
      new THREE.Vector3(
        currentLookAt.current.x + parallax.x * 0.35,
        currentLookAt.current.y + parallax.y * -0.2 + breathOffset.current * 0.08,
        currentLookAt.current.z,
      ),
      0.06,
    );
    perspectiveCamera.lookAt(lookAtTarget.current);
  });
}
