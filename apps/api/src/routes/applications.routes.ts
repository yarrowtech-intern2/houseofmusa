import { Router } from "express";
import { listApplications, submitApplication } from "../controllers/applicationController";
import { uploadApplicationFiles } from "../middleware/upload";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const applicationsRouter = Router();

applicationsRouter.post("/", writeRateLimiter, uploadApplicationFiles, asyncHandler(submitApplication));
applicationsRouter.get("/", requireAuth, asyncHandler(listApplications));
