import type { Request, Response } from "express";
import type { ProductInput, ProductQuery, ProductUpdateInput } from "@houseofmusa/schemas";
import { Product } from "../models/Product";
import { ApiError } from "../middleware/errorHandler";

export async function listProducts(req: Request, res: Response) {
  // req.query has already been parsed/coerced by validateQuery(productQuerySchema).
  const { page, pageSize, category, search } = req.query as unknown as ProductQuery;

  const filter: Record<string, unknown> = { published: true };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function getProductBySlug(req: Request<{ slug: string }>, res: Response) {
  const product = await Product.findOne({ slug: req.params.slug, published: true });
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ item: product });
}

export async function createProduct(req: Request<unknown, unknown, ProductInput>, res: Response) {
  const existing = await Product.findOne({ slug: req.body.slug });
  if (existing) throw new ApiError(409, "A product with this slug already exists");
  const product = await Product.create(req.body);
  res.status(201).json({ item: product });
}

export async function listProductsAdmin(req: Request, res: Response) {
  const { page, pageSize, category, search } = req.query as unknown as ProductQuery;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function getProductById(req: Request<{ id: string }>, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ item: product });
}

export async function updateProduct(req: Request<{ id: string }, unknown, ProductUpdateInput>, res: Response) {
  if (req.body.slug) {
    const existing = await Product.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
    if (existing) throw new ApiError(409, "A product with this slug already exists");
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ item: product });
}

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(204).send();
}
