"use client";

import { useEffect, useRef } from "react";

export interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * Tracks normalized (-1..1) pointer position for camera parallax, plus
 * device-orientation (gyroscope) on mobile where available. Returns a ref
 * (not state) so it can be read inside an R3F useFrame loop without
 * triggering React re-renders every mouse move.
 */
export function usePointerParallax() {
  const offset = useRef<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      offset.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      offset.current = {
        x: Math.max(-1, Math.min(1, event.gamma / 30)),
        y: Math.max(-1, Math.min(1, (event.beta - 45) / 30)),
      };
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return offset;
}
