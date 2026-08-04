import { Router } from "express";
import { getCareerRoleBySlug, listCareerRoles } from "../controllers/careerRoleController";
import { asyncHandler } from "../utils/asyncHandler";

export const careerRolesRouter = Router();

careerRolesRouter.get("/", asyncHandler(listCareerRoles));
careerRolesRouter.get("/:slug", asyncHandler(getCareerRoleBySlug));
