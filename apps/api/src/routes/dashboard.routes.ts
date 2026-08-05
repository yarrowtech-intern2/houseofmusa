import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", requireAuth, asyncHandler(getDashboardSummary));
