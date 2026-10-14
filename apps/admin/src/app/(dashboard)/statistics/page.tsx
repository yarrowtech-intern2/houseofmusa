import { BriefcaseBusiness, CheckCircle2, ClipboardList, MailCheck } from "lucide-react";
import { getDashboardSummary } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { CONTACT_STATUS_LABELS } from "@/lib/contactLabels";
import { StatCard } from "@/components/dashboard/StatCard";
import { Panel } from "@/components/dashboard/Panel";
import { BarList } from "@/components/dashboard/BarList";

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  interviewing: "Interviewing",
  offered: "Offered",
  rejected: "Rejected",
  hired: "Hired",
};

export default async function StatisticsPage() {
  const summary = await getDashboardSummary(getServerDb());
  const contactConversion =
    summary.totals.contacts === 0
      ? 0
      : Math.round(
          ((summary.contactsByStatus.find((item) => item.status === "qualified")?.count ?? 0) /
            summary.totals.contacts) *
            100,
        );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
          Statistics
        </h1>
        <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
          Operational health across sales, hiring, and content.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Qualified Rate" value={`${contactConversion}%`} detail="Qualified contacts / total" icon={MailCheck} />
        <StatCard label="Active Hiring" value={summary.totals.activeApplications} icon={ClipboardList} />
        <StatCard label="Published Products" value={summary.totals.publishedProducts} icon={CheckCircle2} />
        <StatCard label="Published Roles" value={summary.totals.publishedCareerRoles} icon={BriefcaseBusiness} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Contact Pipeline">
          <BarList
            items={summary.contactsByStatus.map((item) => ({ key: item.status, value: item.count }))}
            getLabel={(key) => CONTACT_STATUS_LABELS[key as keyof typeof CONTACT_STATUS_LABELS] ?? key}
          />
        </Panel>
        <Panel title="Application Pipeline">
          <BarList
            items={summary.applicationsByStatus.map((item) => ({ key: item.status, value: item.count }))}
            getLabel={(key) => APPLICATION_STATUS_LABELS[key] ?? key}
          />
        </Panel>
      </div>
    </div>
  );
}
