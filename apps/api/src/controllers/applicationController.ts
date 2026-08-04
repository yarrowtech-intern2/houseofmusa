import type { Request, Response } from "express";
import { applicationSchema } from "@houseofmusa/schemas";
import { Application } from "../models/Application";
import { CareerRole } from "../models/CareerRole";
import { ApiError } from "../middleware/errorHandler";

interface UploadedFiles {
  resume?: Express.Multer.File[];
  coverLetter?: Express.Multer.File[];
}

function parseSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to comma-split
  }
  return raw
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export async function submitApplication(req: Request, res: Response) {
  const files = req.files as UploadedFiles | undefined;
  const resumeFile = files?.resume?.[0];
  if (!resumeFile) throw new ApiError(400, "A resume file is required");

  const parsedBody = applicationSchema.parse({
    ...req.body,
    skills: parseSkills(req.body.skills),
  });

  const role = await CareerRole.findById(parsedBody.roleId);
  if (!role) throw new ApiError(404, "Selected role no longer exists");

  const coverLetterFile = files?.coverLetter?.[0];

  const application = await Application.create({
    ...parsedBody,
    resumeUrl: `/uploads/applications/${resumeFile.filename}`,
    coverLetterUrl: coverLetterFile ? `/uploads/applications/${coverLetterFile.filename}` : undefined,
  });

  res.status(201).json({ id: application.id });
}

export async function listApplications(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Math.min(Number(req.query.pageSize ?? 20), 100);

  const [items, total] = await Promise.all([
    Application.find()
      .populate("roleId", "title department")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Application.countDocuments(),
  ]);

  res.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}
