import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
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
      ],
    },
    techStack: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    caseStudyUrl: { type: String },
    liveDemoUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", tagline: "text", description: "text" });

export const Product = model("Product", productSchema);
