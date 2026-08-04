import { Router } from "express";
import { careerRoleSchema, careerRoleUpdateSchema } from "@houseofmusa/schemas";
import {
  createCareerRole,
  deleteCareerRole,
  getCareerRoleById,
  getCareerRoleBySlug,
  listCareerRoles,
  listCareerRolesAdmin,
  updateCareerRole,
} from "../controllers/careerRoleController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const careerRolesRouter = Router();

careerRolesRouter.get("/", asyncHandler(listCareerRoles));
// Must come before "/:slug" — otherwise "admin" is matched as a slug value.
careerRolesRouter.get("/admin", requireAuth, asyncHandler(listCareerRolesAdmin));
careerRolesRouter.get("/admin/:id", requireAuth, asyncHandler(getCareerRoleById));
careerRolesRouter.get("/:slug", asyncHandler(getCareerRoleBySlug));
careerRolesRouter.post("/", requireAuth, validateBody(careerRoleSchema), asyncHandler(createCareerRole));
careerRolesRouter.patch("/:id", requireAuth, validateBody(careerRoleUpdateSchema), asyncHandler(updateCareerRole));
careerRolesRouter.delete("/:id", requireAuth, asyncHandler(deleteCareerRole));
