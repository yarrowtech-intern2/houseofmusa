import { notFound } from "next/navigation";
import type { Product } from "@houseofmusa/types";
import { DataError, getProductById } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { ProductForm } from "@/components/products/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product: Product;
  try {
    product = await getProductById(getServerDb(), params.id);
  } catch (err) {
    if (err instanceof DataError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
        Edit {product.name}
      </h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
