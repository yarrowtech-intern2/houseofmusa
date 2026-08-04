import { ProductForm } from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
        New Product
      </h1>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
