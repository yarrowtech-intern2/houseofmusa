import type { Request, Response } from "express";
import type { CareerRoleInput, CareerRoleUpdateInput } from "@houseofmusa/schemas";
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

export async function listCareerRolesAdmin(_req: Request, res: Response) {
  const roles = await CareerRole.find().sort({ createdAt: -1 });
  res.json({ items: roles });
}

export async function getCareerRoleById(req: Request<{ id: string }>, res: Response) {
  const role = await CareerRole.findById(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  res.json({ item: role });
}

export async function createCareerRole(req: Request<unknown, unknown, CareerRoleInput>, res: Response) {
  const existing = await CareerRole.findOne({ slug: req.body.slug });
  if (existing) throw new ApiError(409, "A role with this slug already exists");
  const role = await CareerRole.create(req.body);
  res.status(201).json({ item: role });
}

export async function updateCareerRole(req: Request<{ id: string }, unknown, CareerRoleUpdateInput>, res: Response) {
  if (req.body.slug) {
    const existing = await CareerRole.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
    if (existing) throw new ApiError(409, "A role with this slug already exists");
  }
  const role = await CareerRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) throw new ApiError(404, "Role not found");
  res.json({ item: role });
}

export async function deleteCareerRole(req: Request<{ id: string }>, res: Response) {
  const role = await CareerRole.findByIdAndDelete(req.params.id);
  if (!role) throw new ApiError(404, "Role not found");
  res.status(204).send();
}
