import { Router } from "express";
import { analyticsEventSchema } from "@houseofmusa/schemas";
import { createAnalyticsEvent, getAnalyticsSummary } from "../controllers/analyticsController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const analyticsRouter = Router();

analyticsRouter.post("/", writeRateLimiter, validateBody(analyticsEventSchema), asyncHandler(createAnalyticsEvent));
analyticsRouter.get("/summary", requireAuth, asyncHandler(getAnalyticsSummary));
