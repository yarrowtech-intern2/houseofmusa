"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PaginatedResult, Product } from "@houseofmusa/types";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { GalleryUI } from "./GalleryUI";
import { API_URL, CAN_USE_API } from "@/lib/api";
import type { MoveInput, LookDelta } from "@/three/gallery/FirstPersonRig";

const GalleryScene = dynamic(() => import("@/three/gallery/GalleryScene").then((m) => m.GalleryScene), {
  ssr: false,
});

type PublicSettingsResponse = {
  settings?: { galleryFrames?: { frames?: Array<{ enabled: boolean; productSlug: string }> } };
} | null;

function productForFrame(products: Product[], index: number): Product | null {
  if (products.length === 0) return null;
  return products[index % products.length] ?? null;
}

export function GalleryExperience({ products }: { products: Product[] }) {
  const isTouchDevice = useIsTouchDevice();
  const moveInputRef = useRef<MoveInput>({ x: 0, y: 0 });
  const lookDeltaRef = useRef<LookDelta>({ dx: 0, dy: 0 });

  const [isLocked, setIsLocked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [nearbyFrameIndex, setNearbyFrameIndex] = useState<number | null>(null);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [effectiveProducts, setEffectiveProducts] = useState(products);

  useEffect(() => {
    setEffectiveProducts(products);
  }, [products]);

  useEffect(() => {
    if (!CAN_USE_API) return;
    let cancelled = false;

    Promise.all([
      fetch(`${API_URL}/api/products?pageSize=50`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
          return res.json() as Promise<PaginatedResult<Product>>;
        })
        .then((data) => data.items),
      fetch(`${API_URL}/api/settings/public`, { cache: "no-store" })
        .then((res) => (res.ok ? (res.json() as Promise<PublicSettingsResponse>) : null))
        .catch(() => null),
    ])
      .then(([liveProducts, data]) => {
        if (cancelled) return;

        const sourceProducts = liveProducts.length > 0 ? liveProducts : products;
        const assigned =
          data?.settings?.galleryFrames?.frames
            ?.filter((frame) => frame.enabled)
            .map((frame) => sourceProducts.find((product) => product.slug === frame.productSlug))
            .filter((product): product is Product => Boolean(product)) ?? [];

        setEffectiveProducts(assigned.length > 0 ? assigned : sourceProducts);
      })
      .catch(() => {
        if (!cancelled) {
          setEffectiveProducts(products);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [products]);

  const handleInteract = useCallback(() => {
    if (nearbyFrameIndex === null || activeFrameIndex !== null) return;
    setShowInstructions(false);
    setActiveFrameIndex(nearbyFrameIndex);
  }, [nearbyFrameIndex, activeFrameIndex]);

  const handleClose = useCallback(() => {
    if (activeFrameIndex === null) return;
    setIsReturning(true);
    setActiveFrameIndex(null);
  }, [activeFrameIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyE") handleInteract();
      if (e.code === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInteract, handleClose]);

  const activeProduct = activeFrameIndex !== null ? productForFrame(effectiveProducts, activeFrameIndex) : null;
  const nearbyProduct = nearbyFrameIndex !== null ? productForFrame(effectiveProducts, nearbyFrameIndex) : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0d0d0d]">
      <GalleryScene
        products={effectiveProducts}
        isTouchDevice={isTouchDevice}
        activeFrameIndex={activeFrameIndex}
        isReturning={isReturning}
        moveInputRef={moveInputRef}
        lookDeltaRef={lookDeltaRef}
        onLockChange={setIsLocked}
        onNearbyFrameChange={setNearbyFrameIndex}
        onReturnComplete={() => setIsReturning(false)}
      />
      <GalleryUI
        isTouchDevice={isTouchDevice}
        isLocked={isLocked}
        showInstructions={showInstructions}
        nearbyProduct={activeProduct ? null : nearbyProduct}
        activeProduct={activeProduct}
        moveInputRef={moveInputRef}
        lookDeltaRef={lookDeltaRef}
        onInteract={handleInteract}
        onClose={handleClose}
        onShowInstructions={() => setShowInstructions(true)}
        onHideInstructions={() => setShowInstructions(false)}
      />
    </div>
  );
}
