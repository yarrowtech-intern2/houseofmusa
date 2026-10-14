import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@houseofmusa/ui";
import { listProductsAdmin } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { ProductRowActions } from "@/components/products/ProductRowActions";

export default async function ProductsAdminPage() {
  const data = await listProductsAdmin(getServerDb(), { pageSize: 50 });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">{data.total} total</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/8 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8 dark:divide-white/10">
            {data.items.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground dark:text-white">{product.name}</div>
                  <div className="text-xs text-foreground/40 dark:text-white/40">{product.slug}</div>
                </td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{product.category}</td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{product.order}</td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{product.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.published
                        ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        : "rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/50 dark:bg-white/10 dark:text-white/50"
                    }
                  >
                    {product.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions product={product} />
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-foreground/40 dark:text-white/40">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
