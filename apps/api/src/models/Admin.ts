import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["super-admin", "editor", "recruiter"], default: "editor" },
  },
  { timestamps: true },
);

export const Admin = model("Admin", adminSchema);
