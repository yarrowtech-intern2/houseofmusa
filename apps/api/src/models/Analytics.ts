import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["page-view", "contact-submit", "application-submit", "product-view", "gallery-visit"],
    },
    path: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

analyticsSchema.index({ type: 1, createdAt: -1 });

export const AnalyticsEvent = model("AnalyticsEvent", analyticsSchema);
