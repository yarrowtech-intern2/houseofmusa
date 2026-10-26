"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Product } from "@hausofmusa/types";
import { Button } from "@hausofmusa/ui";
import { deleteProduct, updateProduct } from "@hausofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";

export function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const togglePublished = async () => {
    setIsPending(true);
    try {
      await updateProduct(getBrowserDb(), product._id, { published: !product.published });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setIsPending(true);
    try {
      await deleteProduct(getBrowserDb(), product._id);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePublished}
        disabled={isPending}
        aria-label={product.published ? "Unpublish product" : "Publish product"}
        title={product.published ? "Unpublish" : "Publish"}
        className="h-9 w-9 rounded-full bg-foreground/5 p-0 text-foreground/70 hover:text-primary dark:bg-white/10 dark:text-white/70 dark:hover:text-primary"
      >
        {product.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-9 w-9 rounded-full bg-primary/10 p-0 text-primary hover:bg-primary/20 hover:text-primary"
      >
        <Link href={`/products/${product._id}`} aria-label={`Edit ${product.name}`} title="Edit">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={`Delete ${product.name}`}
        title="Delete"
        className="h-9 w-9 rounded-full bg-red-500/10 p-0 text-red-500 hover:bg-red-500/20 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
