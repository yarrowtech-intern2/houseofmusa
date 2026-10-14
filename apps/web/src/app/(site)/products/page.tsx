import type { Metadata } from "next";
import type { PaginatedResult, Product } from "@houseofmusa/types";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { RevealText } from "@/components/motion/RevealText";
import { listProducts } from "@houseofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";
import { STATIC_PRODUCTS, toPaginatedResult } from "@/lib/staticContent";

export const metadata: Metadata = {
  title: "Products",
  description: "ERP, SaaS, and cloud infrastructure products built by House of Musa.",
};

export default async function ProductsPage() {
  const { items: products }: PaginatedResult<Product> = CAN_USE_API
    ? await listProducts(getDb(), { pageSize: 50 }).catch(() => toPaginatedResult(STATIC_PRODUCTS))
    : toPaginatedResult(STATIC_PRODUCTS);

  return (
    <section className="min-h-screen px-6 pb-24 pt-32 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Products</span>
        <RevealText
          as="h1"
          text="Eight products, one engineering standard."
          mode="word"
          trigger="immediate"
          className="mt-4 max-w-3xl font-display text-display-lg font-medium tracking-tight text-foreground"
        />
        <p className="mt-6 max-w-xl text-base text-foreground/60">
          ERP systems, SaaS platforms, AI infrastructure, and everything between - each built and maintained by the
          same team.
        </p>

        <div className="mt-16">
          <ProductsExplorer products={products} />
        </div>
      </div>
    </section>
  );
}
