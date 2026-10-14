import Link from "next/link";
import { Activity, Briefcase, FileText, Mail, Package } from "lucide-react";
import { Button } from "@houseofmusa/ui";
import { getDashboardSummary } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { CONTACT_STATUS_LABELS } from "@/lib/contactLabels";
import { StatCard } from "@/components/dashboard/StatCard";
import { Panel } from "@/components/dashboard/Panel";
import { BarList } from "@/components/dashboard/BarList";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export default async function AnalyticsPage() {
  const summary = await getDashboardSummary(getServerDb());

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
            Live operations snapshot from contacts, hiring, products, and analytics.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
          <Link href="/contacts">Review contacts</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Contacts" value={summary.totals.contacts} detail={`${summary.totals.newContacts} new`} icon={Mail} />
        <StatCard
          label="Applications"
          value={summary.totals.applications}
          detail={`${summary.totals.activeApplications} active`}
          icon={FileText}
        />
        <StatCard
          label="Products"
          value={summary.totals.products}
          detail={`${summary.totals.publishedProducts} published`}
          icon={Package}
        />
        <StatCard
          label="Career Roles"
          value={summary.totals.careerRoles}
          detail={`${summary.totals.publishedCareerRoles} published`}
          icon={Briefcase}
        />
        <StatCard label="Events" value={summary.totals.analyticsEvents} detail="Tracked interactions" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Recent Contacts" description="Newest consultation requests.">
          <div className="space-y-3">
            {summary.recentContacts.map((contact) => (
              <Link
                key={contact._id}
                href="/contacts"
                className="block rounded-lg border border-foreground/8 p-3 transition-colors hover:bg-foreground/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground dark:text-white">{contact.name}</p>
                    <p className="truncate text-xs text-foreground/45 dark:text-white/45">
                      {contact.company || contact.email}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {CONTACT_STATUS_LABELS[contact.status]}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-foreground/55 dark:text-white/55">
                  {contact.message}
                </p>
              </Link>
            ))}
            {summary.recentContacts.length === 0 && (
              <p className="text-sm text-foreground/45 dark:text-white/45">No contacts yet.</p>
            )}
          </div>
        </Panel>

        <Panel title="Analytics Events" description="Last tracked days.">
          <BarList items={summary.eventsByDay.map((item) => ({ key: formatDate(item.date), value: item.count }))} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Contact Pipeline">
          <BarList
            items={summary.contactsByStatus.map((item) => ({ key: item.status, value: item.count }))}
            getLabel={(key) => CONTACT_STATUS_LABELS[key as keyof typeof CONTACT_STATUS_LABELS] ?? key}
          />
        </Panel>
        <Panel title="Recent Applications">
          <div className="space-y-3">
            {summary.recentApplications.map((application) => (
              <div key={application._id} className="rounded-lg border border-foreground/8 p-3 dark:border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground dark:text-white">{application.fullName}</p>
                    <p className="truncate text-xs text-foreground/45 dark:text-white/45">
                      {application.roleId?.title ?? "Unknown role"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-foreground/8 px-2 py-1 text-xs font-medium text-foreground/55 dark:bg-white/10 dark:text-white/55">
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
            {summary.recentApplications.length === 0 && (
              <p className="text-sm text-foreground/45 dark:text-white/45">No applications yet.</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
