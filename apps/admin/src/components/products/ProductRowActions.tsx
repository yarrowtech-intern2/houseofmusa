"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Product } from "@houseofmusa/types";
import { Button } from "@houseofmusa/ui";
import { apiFetch } from "@/lib/api";

export function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const togglePublished = async () => {
    setIsPending(true);
    try {
      await apiFetch(`/api/products/${product._id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !product.published }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setIsPending(true);
    try {
      await apiFetch(`/api/products/${product._id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button variant="ghost" size="sm" onClick={togglePublished} disabled={isPending}>
        {product.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/products/${product._id}`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}
