import { Router } from "express";
import { createMedia, deleteMedia, listMedia, uploadMedia } from "../controllers/mediaController";
import { requireAuth } from "../middleware/auth";
import { uploadMediaFile } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

export const mediaRouter = Router();

mediaRouter.get("/", requireAuth, asyncHandler(listMedia));
mediaRouter.post("/", requireAuth, asyncHandler(createMedia));
mediaRouter.post("/upload", requireAuth, uploadMediaFile, asyncHandler(uploadMedia));
mediaRouter.delete("/:id", requireAuth, asyncHandler(deleteMedia));
