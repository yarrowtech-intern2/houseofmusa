import type { Request, Response } from "express";
import { settingsUpdateSchema, settingKeyValues } from "@houseofmusa/schemas";
import type { SiteSettings } from "@houseofmusa/types";
import { Setting } from "../models/Setting";
import { ApiError } from "../middleware/errorHandler";
import { defaultSettings, type SettingKey } from "../lib/defaultSettings";

function isSettingKey(key: string): key is SettingKey {
  return (settingKeyValues as readonly string[]).includes(key);
}

function toPublicPayload(items: Array<{ key: string; value?: unknown }>): SiteSettings {
  const byKey = new Map(items.map((item) => [item.key, item.value]));
  return {
    homepageContent: (byKey.get("homepage-content") ?? defaultSettings["homepage-content"]) as SiteSettings["homepageContent"],
    contactDetails: (byKey.get("contact-details") ?? defaultSettings["contact-details"]) as SiteSettings["contactDetails"],
    galleryFrames: (byKey.get("gallery-frames") ?? defaultSettings["gallery-frames"]) as SiteSettings["galleryFrames"],
    seo: (byKey.get("seo") ?? defaultSettings.seo) as SiteSettings["seo"],
  };
}

export async function getPublicSettings(_req: Request, res: Response) {
  const items = await Setting.find({ key: { $in: settingKeyValues } }).lean();
  res.json({ settings: toPublicPayload(items) });
}

export async function listSettingsAdmin(_req: Request, res: Response) {
  const items = await Setting.find({ key: { $in: settingKeyValues } }).lean();
  res.json({ settings: toPublicPayload(items), items });
}

export async function getSetting(req: Request<{ key: string }>, res: Response) {
  const key = req.params.key;
  if (!isSettingKey(key)) throw new ApiError(404, "Setting not found");

  const item = await Setting.findOne({ key });
  res.json({ item: item ?? { key, value: defaultSettings[key] } });
}

export async function updateSetting(req: Request<{ key: string }, unknown, { value?: unknown }>, res: Response) {
  const key = req.params.key;
  if (!isSettingKey(key)) throw new ApiError(404, "Setting not found");

  const parsed = settingsUpdateSchema.parse({ key, value: req.body.value ?? req.body });
  const item = await Setting.findOneAndUpdate(
    { key },
    { key, value: parsed.value },
    { upsert: true, new: true, runValidators: true },
  );

  res.json({ item });
}
