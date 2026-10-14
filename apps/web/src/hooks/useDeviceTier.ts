"use client";

import { useEffect, useState } from "react";
import { FunctionCallNode } from "three/webgpu";

export type DeviceTier = "low" | "mid" | "high";

/**
 * Rough, cheap heuristic (not a benchmark) used to gate 3D scene quality:
 * particle counts, postprocessing, shadow map size, and DPR cap. Errs
 * conservative — a wrongly-downgraded high-end phone costs nothing visually
 * important, a wrongly-upgraded low-end phone costs dropped frames.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("mid");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let renderer = "";
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") ??
        canvas.getContext("webgl")) as WebGLRenderingContext | null;
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      if (gl && debugInfo) {
        renderer = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).toLowerCase();
      }
    } catch {
      // WebGL probing is best-effort only.
    }

    const looksLowEnd = /mali|adreno 3|adreno 4|powervr sgx/.test(renderer);

    if (cores <= 4 && (isCoarsePointer || memory <= 4) || looksLowEnd) {
      setTier("low");
    } else if (cores >= 8 && memory >= 8 && !isCoarsePointer) {
      setTier("high");
    } else {
      setTier("mid");
    }
  }, []);

  return tier;
}
