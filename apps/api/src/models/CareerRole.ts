import { Schema, model } from "mongoose";

const careerRoleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
    },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CareerRole = model("CareerRole", careerRoleSchema);
