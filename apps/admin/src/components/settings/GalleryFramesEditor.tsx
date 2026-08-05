"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { GalleryFrameAssignment, GalleryFramesSetting, Product } from "@houseofmusa/types";
import { Button, Input, Label } from "@houseofmusa/ui";
import { ApiRequestError, apiFetch } from "@/lib/api";

const albumKeys = ["album1", "album2", "album3", "album4", "album5", "album6", "album7", "album8"] as const;

function normalizeFrames(setting: GalleryFramesSetting, products: Product[]): GalleryFrameAssignment[] {
  return albumKeys.map((albumKey, index) => {
    const existing = setting.frames.find((frame) => frame.albumKey === albumKey);
    return {
      albumKey,
      productSlug: existing?.productSlug || products[index % Math.max(products.length, 1)]?.slug || "",
      label: existing?.label ?? "",
      enabled: existing?.enabled ?? true,
    };
  });
}

export function GalleryFramesEditor({
  galleryFrames,
  products,
}: {
  galleryFrames: GalleryFramesSetting;
  products: Product[];
}) {
  const router = useRouter();
  const [frames, setFrames] = useState(() => normalizeFrames(galleryFrames, products));
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateFrame = (index: number, patch: Partial<GalleryFrameAssignment>) => {
    setFrames((current) => current.map((frame, i) => (i === index ? { ...frame, ...patch } : frame)));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await apiFetch("/api/settings/gallery-frames", {
        method: "PATCH",
        body: JSON.stringify({ value: { frames } }),
      });
      setMessage("Saved gallery frame assignments.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof ApiRequestError ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Gallery Frames
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
            Assign products to the album1-album8 anchors in the 3D gallery model.
          </p>
        </div>
        <Button onClick={save} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Frames"}
        </Button>
      </div>

      {message && <p className="mt-5 rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm text-foreground/60 dark:bg-white/[0.05] dark:text-white/65">{message}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {frames.map((frame, index) => (
          <div key={frame.albumKey} className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">{frame.albumKey}</h2>
              <label className="flex items-center gap-2 text-xs text-foreground/60 dark:text-white/60">
                <input
                  type="checkbox"
                  checked={frame.enabled}
                  onChange={(e) => updateFrame(index, { enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-foreground/20"
                />
                Enabled
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <Label>Product</Label>
              <select
                value={frame.productSlug}
                onChange={(e) => updateFrame(index, { productSlug: e.target.value })}
                className="h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/[0.08] dark:text-white"
              >
                <option value="">Unassigned</option>
                {products.map((product) => (
                  <option key={product._id} value={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <Label>Label Override</Label>
              <Input value={frame.label ?? ""} onChange={(e) => updateFrame(index, { label: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
