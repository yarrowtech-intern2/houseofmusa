import { Router } from "express";
import { contactAdminUpdateSchema, contactSchema, contactStatusSchema } from "@houseofmusa/schemas";
import {
  createContact,
  getContactById,
  listContacts,
  updateContact,
  updateContactStatus,
} from "../controllers/contactController";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { writeRateLimiter } from "../middleware/rateLimit";
import { asyncHandler } from "../utils/asyncHandler";

export const contactsRouter = Router();

contactsRouter.post("/", writeRateLimiter, validateBody(contactSchema), asyncHandler(createContact));
contactsRouter.get("/", requireAuth, asyncHandler(listContacts));
contactsRouter.patch("/:id/status", requireAuth, validateBody(contactStatusSchema), asyncHandler(updateContactStatus));
contactsRouter.get("/:id", requireAuth, asyncHandler(getContactById));
contactsRouter.patch("/:id", requireAuth, validateBody(contactAdminUpdateSchema), asyncHandler(updateContact));
