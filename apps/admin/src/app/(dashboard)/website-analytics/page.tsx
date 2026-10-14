import { Activity, GalleryHorizontal, MousePointerClick, Package, Route } from "lucide-react";
import { getAnalyticsSummary, type AnalyticsSummary } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { Panel } from "@/components/dashboard/Panel";
import { BarList } from "@/components/dashboard/BarList";

const EVENT_LABELS: Record<string, string> = {
  "page-view": "Page views",
  "contact-submit": "Contact submits",
  "application-submit": "Application submits",
  "product-view": "Product views",
  "gallery-visit": "Gallery visits",
};

function eventCount(summary: AnalyticsSummary, type: string) {
  return summary.byType.find((item) => item.type === type)?.count ?? 0;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export default async function WebsiteAnalyticsPage() {
  const summary = await getAnalyticsSummary(getServerDb());

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
          Website Analytics
        </h1>
        <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
          Best-effort first-party events from the public website.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Events" value={summary.totalEvents} icon={Activity} />
        <StatCard label="Page Views" value={eventCount(summary, "page-view")} icon={Route} />
        <StatCard label="Product Views" value={eventCount(summary, "product-view")} icon={Package} />
        <StatCard label="Gallery Visits" value={eventCount(summary, "gallery-visit")} icon={GalleryHorizontal} />
        <StatCard label="Conversions" value={eventCount(summary, "contact-submit")} icon={MousePointerClick} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Events By Type">
          <BarList
            items={summary.byType.map((item) => ({ key: item.type, value: item.count }))}
            getLabel={(key) => EVENT_LABELS[key] ?? key}
          />
        </Panel>
        <Panel title="Top Pages">
          <BarList items={summary.topPaths.map((item) => ({ key: item.path, value: item.count }))} />
        </Panel>
      </div>

      <Panel title="Recent Activity">
        <BarList items={summary.daily.map((item) => ({ key: formatDate(item.date), value: item.count }))} />
      </Panel>
    </div>
  );
}
