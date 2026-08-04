import { Router } from "express";
import { contactSchema } from "@houseofmusa/schemas";
import { createContact, listContacts } from "../controllers/contactController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const contactsRouter = Router();

contactsRouter.post("/", writeRateLimiter, validateBody(contactSchema), asyncHandler(createContact));
contactsRouter.get("/", requireAuth, asyncHandler(listContacts));
