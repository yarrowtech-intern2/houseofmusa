import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { getPublicSettings, getSetting, listSettingsAdmin, updateSetting } from "../controllers/settingsController";

export const settingsRouter = Router();

settingsRouter.get("/public", asyncHandler(getPublicSettings));
settingsRouter.get("/admin", requireAuth, asyncHandler(listSettingsAdmin));
settingsRouter.get("/:key", asyncHandler(getSetting));
settingsRouter.patch("/:key", requireAuth, asyncHandler(updateSetting));
