import type { Request, Response } from "express";
import { CareerRole } from "../models/CareerRole";
import { ApiError } from "../middleware/errorHandler";

export async function listCareerRoles(_req: Request, res: Response) {
  const roles = await CareerRole.find({ published: true }).sort({ createdAt: -1 });
  res.json({ items: roles });
}

export async function getCareerRoleBySlug(req: Request<{ slug: string }>, res: Response) {
  const role = await CareerRole.findOne({ slug: req.params.slug, published: true });
  if (!role) throw new ApiError(404, "Role not found");
  res.json({ item: role });
}
