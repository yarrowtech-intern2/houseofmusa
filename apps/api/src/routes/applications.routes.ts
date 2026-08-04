import { Router } from "express";
import { applicationStatusSchema } from "@houseofmusa/schemas";
import { listApplications, submitApplication, updateApplicationStatus } from "../controllers/applicationController";
import { uploadApplicationFiles } from "../middleware/upload";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const applicationsRouter = Router();

applicationsRouter.post("/", writeRateLimiter, uploadApplicationFiles, asyncHandler(submitApplication));
applicationsRouter.get("/", requireAuth, asyncHandler(listApplications));
applicationsRouter.patch(
  "/:id/status",
  requireAuth,
  validateBody(applicationStatusSchema),
  asyncHandler(updateApplicationStatus),
);
