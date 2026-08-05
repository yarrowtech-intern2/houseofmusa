import fs from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import { mediaCreateSchema } from "@houseofmusa/schemas";
import { Media } from "../models/Media";
import { ApiError } from "../middleware/errorHandler";
import { env } from "../config/env";

export async function listMedia(req: Request, res: Response) {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const filter = category ? { category } : {};
  const items = await Media.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
}

export async function createMedia(req: Request, res: Response) {
  const payload = mediaCreateSchema.parse(req.body);
  const item = await Media.create(payload);
  res.status(201).json({ item });
}

export async function uploadMedia(req: Request, res: Response) {
  const file = req.file;
  if (!file) throw new ApiError(400, "File is required");

  const category = typeof req.body.category === "string" ? req.body.category : "misc";
  const payload = mediaCreateSchema.parse({
    filename: file.filename,
    url: `/uploads/media/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size,
    category,
  });
  const item = await Media.create(payload);
  res.status(201).json({ item });
}

export async function deleteMedia(req: Request<{ id: string }>, res: Response) {
  const item = await Media.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Media not found");

  if (item.url.startsWith("/uploads/media/")) {
    const filename = path.basename(item.url);
    const absolutePath = path.join(process.cwd(), env.UPLOAD_DIR, "media", filename);
    await fs.rm(absolutePath, { force: true }).catch(() => undefined);
  }

  res.status(204).send();
}
