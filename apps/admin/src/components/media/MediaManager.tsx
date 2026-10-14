"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import type { Media } from "@houseofmusa/types";
import { mediaCategoryValues } from "@houseofmusa/schemas";
import { Button, Label } from "@houseofmusa/ui";
import { deleteMedia, uploadMedia } from "@houseofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaManager({ items }: { items: Media[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<(typeof mediaCategoryValues)[number]>("misc");
  const [message, setMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setMessage("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      await uploadMedia(getBrowserDb(), file, category);
      if (fileRef.current) fileRef.current.value = "";
      setMessage("Uploaded media asset.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (item: Media) => {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    await deleteMedia(getBrowserDb(), item._id);
    router.refresh();
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
          Media Library
        </h1>
        <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
          Upload and manage images, models, and animation assets used by the site.
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="media-file">File</Label>
            <input
              ref={fileRef}
              id="media-file"
              type="file"
              className="h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 py-2 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white dark:border-white/15 dark:bg-white/[0.08] dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="media-category">Category</Label>
            <select
              id="media-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/[0.08] dark:text-white"
            >
              {mediaCategoryValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={upload} disabled={isUploading}>
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {message && <p className="mt-4 text-sm text-foreground/60 dark:text-white/60">{message}</p>}
      </section>

      <div className="mt-6 overflow-hidden rounded-2xl border border-foreground/8 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Size</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8 dark:divide-white/10">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="min-w-0 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground dark:text-white">{item.filename}</div>
                      <div className="truncate text-xs text-foreground/45 dark:text-white/45">{item.url}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-foreground/60 dark:text-white/60 md:table-cell">{item.category}</td>
                <td className="hidden px-4 py-3 text-foreground/60 dark:text-white/60 lg:table-cell">
                  {formatSize(item.size)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(item)}
                      aria-label={`Delete ${item.filename}`}
                      className="h-9 w-9 rounded-full bg-red-500/10 p-0 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-foreground/40 dark:text-white/40">
                  No media uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
