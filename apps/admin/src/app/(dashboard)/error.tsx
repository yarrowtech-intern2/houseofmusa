"use client";

import { ApiUnavailable } from "@/components/layout/ApiUnavailable";

export default function DashboardError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  if (error.message.includes("Unable to reach the API server")) {
    return <ApiUnavailable message={error.message} />;
  }

  return <ApiUnavailable message="The admin dashboard could not load. Check the API server and try again." />;
}
