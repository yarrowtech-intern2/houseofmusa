import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    budget: {
      type: String,
      required: true,
      enum: ["under-10k", "10k-50k", "50k-150k", "150k-plus", "not-sure"],
    },
    projectType: {
      type: String,
      required: true,
      enum: [
        "erp",
        "saas",
        "enterprise-software",
        "custom-software",
        "ai-infrastructure",
        "digital-transformation",
        "cloud-solutions",
        "web-mobile",
        "other",
      ],
    },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "qualified", "closed"], default: "new" },
  },
  { timestamps: true },
);

export const Contact = model("Contact", contactSchema);
