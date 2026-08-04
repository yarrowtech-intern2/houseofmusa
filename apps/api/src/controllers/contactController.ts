import type { Request, Response } from "express";
import type { ContactInput } from "@houseofmusa/schemas";
import { Contact } from "../models/Contact";

export async function createContact(req: Request<unknown, unknown, ContactInput>, res: Response) {
  const contact = await Contact.create(req.body);
  res.status(201).json({ id: contact.id });
}

export async function listContacts(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);

  const [items, total] = await Promise.all([
    Contact.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Contact.countDocuments(),
  ]);

  res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
