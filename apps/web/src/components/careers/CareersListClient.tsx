"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CareerRole } from "@houseofmusa/types";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/careerLabels";

export function CareersListClient({ roles }: { roles: CareerRole[] }) {
  const [liveRoles, setLiveRoles] = useState(roles);

  useEffect(() => {
    setLiveRoles(roles);
  }, [roles]);

  useEffect(() => {
    if (!CAN_USE_API) return;

    let cancelled = false;

    fetch(`${API_URL}/api/career-roles`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load career roles: ${res.status}`);
        return res.json() as Promise<{ items: CareerRole[] }>;
      })
      .then((data) => {
        if (!cancelled) setLiveRoles(data.items);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-16 divide-y divide-foreground/8 border-y border-foreground/8">
      {liveRoles.length === 0 ? (
        <p className="py-10 text-sm text-foreground/50">
          No open roles right now - check back soon, or visit the admin dashboard to publish some.
        </p>
      ) : (
        liveRoles.map((role) => (
          <Link
            key={role.slug}
            href={`/careers/${role.slug}`}
            className="group flex flex-col gap-1 py-6 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {role.title}
              </h2>
              <p className="mt-1 text-sm text-foreground/50">
                {role.department} - {role.location}
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-foreground/60">
              {EMPLOYMENT_TYPE_LABELS[role.employmentType]}
            </span>
          </Link>
        ))
      )}
    </div>
  );
}
