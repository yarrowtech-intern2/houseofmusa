"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applicationStatusValues } from "@houseofmusa/schemas";
import type { ApplicationStatus } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  interviewing: "Interviewing",
  offered: "Offered",
  rejected: "Rejected",
  hired: "Hired",
};

export function ApplicationStatusSelect({ id, status }: { id: string; status: ApplicationStatus }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsPending(true);
    try {
      await apiFetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: e.target.value }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-full border border-foreground/12 bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/5 dark:text-white"
    >
      {applicationStatusValues.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
