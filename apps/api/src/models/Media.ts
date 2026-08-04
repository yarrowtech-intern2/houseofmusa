import { Schema, model } from "mongoose";

const mediaSchema = new Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    category: { type: String, enum: ["product", "gallery-frame", "homepage", "misc"], default: "misc" },
  },
  { timestamps: true },
);

export const Media = model("Media", mediaSchema);
