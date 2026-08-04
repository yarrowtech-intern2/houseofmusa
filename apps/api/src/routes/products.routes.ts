import { Router } from "express";
import { productSchema, productUpdateSchema, productQuerySchema } from "@houseofmusa/schemas";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  listProducts,
  listProductsAdmin,
  updateProduct,
} from "../controllers/productController";
import { validateBody, validateQuery } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const productsRouter = Router();

productsRouter.get("/", validateQuery(productQuerySchema), asyncHandler(listProducts));
// Must come before "/:slug" — otherwise "admin" is matched as a slug value.
productsRouter.get("/admin", requireAuth, validateQuery(productQuerySchema), asyncHandler(listProductsAdmin));
productsRouter.get("/admin/:id", requireAuth, asyncHandler(getProductById));
productsRouter.get("/:slug", asyncHandler(getProductBySlug));
productsRouter.post("/", requireAuth, validateBody(productSchema), asyncHandler(createProduct));
productsRouter.patch("/:id", requireAuth, validateBody(productUpdateSchema), asyncHandler(updateProduct));
productsRouter.delete("/:id", requireAuth, asyncHandler(deleteProduct));
