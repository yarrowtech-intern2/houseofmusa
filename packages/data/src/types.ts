import type { Application, Contact } from "@houseofmusa/types";

export type ApplicationWithRole = Omit<Application, "roleId"> & {
  roleId: { _id: string; title: string; department: string } | null;
};

export interface DashboardSummary {
  totals: {
    products: number;
    publishedProducts: number;
    careerRoles: number;
    publishedCareerRoles: number;
    contacts: number;
    newContacts: number;
    applications: number;
    activeApplications: number;
    analyticsEvents: number;
  };
  recentContacts: Contact[];
  recentApplications: ApplicationWithRole[];
  contactsByStatus: { status: Contact["status"]; count: number }[];
  applicationsByStatus: { status: Application["status"]; count: number }[];
  eventsByDay: { date: string; count: number }[];
}

export interface AnalyticsSummary {
  totalEvents: number;
  byType: { type: string; count: number }[];
  topPaths: { path: string; count: number }[];
  daily: { date: string; count: number }[];
}
