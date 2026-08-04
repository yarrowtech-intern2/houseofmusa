import { Router } from "express";
import { loginSchema } from "@houseofmusa/schemas";
import { login, logout, me } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const authRouter = Router();

authRouter.post("/login", writeRateLimiter, validateBody(loginSchema), asyncHandler(login));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/me", requireAuth, asyncHandler(me));
