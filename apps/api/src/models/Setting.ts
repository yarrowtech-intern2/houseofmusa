import { Schema, model } from "mongoose";

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Setting = model("Setting", settingSchema);
