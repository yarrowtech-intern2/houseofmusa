"use client";

import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";

/**
 * Front-to-back color stack. The front layer (orange) is what sits visible at
 * rest, matching the brand surface everything else is designed against; the
 * layers behind it only show as each one peels away in sequence.
 */
const CURTAIN_LAYER_COLORS = ["bg-primary", "bg-[#111111]", "bg-white"] as const;

export type CurtainLayerRefs = (HTMLDivElement | null)[];

/**
 * Renders the stacked color panels for a multilayer curtain reveal. Exposes
 * the panel elements via `ref` so a parent can drive a single GSAP timeline
 * (staggering the clip-path across panels) alongside its own content tweens.
 */
export const CurtainLayers = forwardRef<
  CurtainLayerRefs,
  { className?: string; children?: ReactNode; revealed?: boolean }
>(function CurtainLayers({ className, children, revealed = false }, ref) {
  const layerEls = useRef<CurtainLayerRefs>([]);
  const restingClip = revealed ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)";

  useImperativeHandle(ref, () => layerEls.current, []);

  return (
    <div className={className}>
      {CURTAIN_LAYER_COLORS.map((colorClass, index) => (
        <div
          key={colorClass}
          ref={(el) => {
            layerEls.current[index] = el;
          }}
          className={`absolute inset-0 ${colorClass} overflow-hidden`}
          style={{ clipPath: restingClip, zIndex: CURTAIN_LAYER_COLORS.length - index }}
        >
          {index === 0 ? children : null}
        </div>
      ))}
    </div>
  );
});
