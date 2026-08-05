import type { Request, Response } from "express";
import type { AnalyticsEventInput } from "@houseofmusa/schemas";
import { AnalyticsEvent } from "../models/Analytics";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function createAnalyticsEvent(req: Request<unknown, unknown, AnalyticsEventInput>, res: Response) {
  const event = await AnalyticsEvent.create(req.body);
  res.status(201).json({ id: event.id });
}

export async function getAnalyticsSummary(_req: Request, res: Response) {
  const since = daysAgo(13);

  const [totalEvents, byType, byPath, daily] = await Promise.all([
    AnalyticsEvent.countDocuments(),
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $match: { type: "page-view" } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    totalEvents,
    byType: byType.map((item) => ({ type: item._id, count: item.count })),
    topPaths: byPath.map((item) => ({ path: item._id, count: item.count })),
    daily: daily.map((item) => ({ date: item._id, count: item.count })),
  });
}
