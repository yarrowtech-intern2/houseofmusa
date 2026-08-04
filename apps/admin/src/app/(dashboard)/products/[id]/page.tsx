import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Product } from "@houseofmusa/types";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { ProductForm } from "@/components/products/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product: Product;
  try {
    const data = await apiFetch<{ item: Product }>(`/api/products/admin/${params.id}`, {
      cookie: cookies().toString(),
    });
    product = data.item;
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
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
