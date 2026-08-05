import type { Request, Response } from "express";
import type { ContactAdminUpdateInput, ContactInput, ContactStatusInput } from "@houseofmusa/schemas";
import { Contact } from "../models/Contact";
import { AnalyticsEvent } from "../models/Analytics";
import { ApiError } from "../middleware/errorHandler";

export async function createContact(req: Request<unknown, unknown, ContactInput>, res: Response) {
  const contact = await Contact.create(req.body);
  await AnalyticsEvent.create({
    type: "contact-submit",
    path: "/contact",
    meta: { contactId: contact.id, budget: contact.budget, projectType: contact.projectType },
  }).catch(() => undefined);
  res.status(201).json({ id: contact.id });
}

export async function listContacts(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);
  const status = typeof req.query.status === "string" ? req.query.status : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Contact.countDocuments(filter),
  ]);

  res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function getContactById(req: Request<{ id: string }>, res: Response) {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, "Contact not found");
  res.json({ item: contact });
}

export async function updateContactStatus(req: Request<{ id: string }, unknown, ContactStatusInput>, res: Response) {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!contact) throw new ApiError(404, "Contact not found");
  res.json({ item: contact });
}

export async function updateContact(req: Request<{ id: string }, unknown, ContactAdminUpdateInput>, res: Response) {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!contact) throw new ApiError(404, "Contact not found");
  res.json({ item: contact });
}
