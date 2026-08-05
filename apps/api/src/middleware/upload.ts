import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env";

const uploadRoot = path.join(process.cwd(), env.UPLOAD_DIR, "applications");
fs.mkdirSync(uploadRoot, { recursive: true });
const mediaUploadRoot = path.join(process.cwd(), env.UPLOAD_DIR, "media");
fs.mkdirSync(mediaUploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const uploadApplicationFiles = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("Only PDF or Word documents are accepted"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "coverLetter", maxCount: 1 },
]);

const mediaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, mediaUploadRoot),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const ALLOWED_MEDIA_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
  "application/json",
]);

export const uploadMediaFile = multer({
  storage: mediaStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtension = [".glb", ".gltf", ".lottie"].includes(extension);
    if (!ALLOWED_MEDIA_MIME_TYPES.has(file.mimetype) && !allowedExtension) {
      cb(new Error("Only images, GLB/GLTF models, or Lottie files are accepted"));
      return;
    }
    cb(null, true);
  },
}).single("file");
