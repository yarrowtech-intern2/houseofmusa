import type { Request, Response } from "express";
import { AnalyticsEvent } from "../models/Analytics";
import { Application } from "../models/Application";
import { CareerRole } from "../models/CareerRole";
import { Contact } from "../models/Contact";
import { Product } from "../models/Product";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getDashboardSummary(_req: Request, res: Response) {
  const weekStart = daysAgo(6);

  const [
    totalProducts,
    publishedProducts,
    totalRoles,
    publishedRoles,
    totalContacts,
    newContacts,
    totalApplications,
    activeApplications,
    totalEvents,
    recentContacts,
    recentApplications,
    contactsByStatus,
    applicationsByStatus,
    eventsByDay,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ published: true }),
    CareerRole.countDocuments(),
    CareerRole.countDocuments({ published: true }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "new" }),
    Application.countDocuments(),
    Application.countDocuments({ status: { $in: ["new", "reviewing", "interviewing", "offered"] } }),
    AnalyticsEvent.countDocuments(),
    Contact.find().sort({ createdAt: -1 }).limit(5),
    Application.find().populate("roleId", "title department").sort({ createdAt: -1 }).limit(5),
    Contact.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Application.aggregate<{ _id: string; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $match: { createdAt: { $gte: weekStart } } },
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
    totals: {
      products: totalProducts,
      publishedProducts,
      careerRoles: totalRoles,
      publishedCareerRoles: publishedRoles,
      contacts: totalContacts,
      newContacts,
      applications: totalApplications,
      activeApplications,
      analyticsEvents: totalEvents,
    },
    recentContacts,
    recentApplications,
    contactsByStatus: contactsByStatus.map((item) => ({ status: item._id, count: item.count })),
    applicationsByStatus: applicationsByStatus.map((item) => ({ status: item._id, count: item.count })),
    eventsByDay: eventsByDay.map((item) => ({ date: item._id, count: item.count })),
  });
}
