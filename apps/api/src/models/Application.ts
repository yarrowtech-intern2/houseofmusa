import { Schema, model, Types } from "mongoose";

const applicationSchema = new Schema(
  {
    roleId: { type: Types.ObjectId, ref: "CareerRole", required: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true },
    coverLetterUrl: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    expectedSalary: { type: String },
    experienceYears: { type: Number, required: true, min: 0 },
    skills: { type: [String], default: [] },
    availability: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewing", "interviewing", "offered", "rejected", "hired"],
      default: "new",
    },
  },
  { timestamps: true },
);

export const Application = model("Application", applicationSchema);
