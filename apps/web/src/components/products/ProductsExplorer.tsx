"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product, ProjectType } from "@houseofmusa/types";
import { Input, cn } from "@houseofmusa/ui";
import { ProductCard } from "@/components/products/ProductCard";
import { listProducts } from "@houseofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/productCategories";

export function ProductsExplorer({ products }: { products: Product[] }) {
  const [liveProducts, setLiveProducts] = useState(products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProjectType | "all">("all");

  useEffect(() => {
    setLiveProducts(products);
  }, [products]);

  useEffect(() => {
    if (!CAN_USE_API) return;

    let cancelled = false;

    listProducts(getDb(), { pageSize: 50 })
      .then((data) => {
        if (!cancelled) setLiveProducts(data.items);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const present = new Set(liveProducts.map((p) => p.category));
    return (Object.keys(CATEGORY_LABELS) as ProjectType[]).filter((c) => present.has(c));
  }, [liveProducts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return liveProducts.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch =
        query === "" ||
        product.name.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query) ||
        product.techStack.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [liveProducts, search, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-11"
            aria-label="Search products"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
              category === "all" ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
                category === c ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10",
              )}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-24 text-center text-sm text-foreground/50">No products match that search.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
