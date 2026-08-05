"use client";

import { useEffect, useState } from "react";
import type { ContactDetails } from "@houseofmusa/types";
import { API_URL, CAN_USE_API } from "@/lib/api";

export function ContactDetailsInline({ contactDetails }: { contactDetails?: ContactDetails }) {
  const [liveContactDetails, setLiveContactDetails] = useState(contactDetails);

  useEffect(() => {
    setLiveContactDetails(contactDetails);
  }, [contactDetails]);

  useEffect(() => {
    if (!CAN_USE_API) return;

    let cancelled = false;

    fetch(`${API_URL}/api/settings/public`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { settings?: { contactDetails?: ContactDetails } } | null) => {
        if (!cancelled && data?.settings?.contactDetails) setLiveContactDetails(data.settings.contactDetails);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!liveContactDetails?.email) return null;

  return (
    <div className="mt-6 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
      <a href={`mailto:${liveContactDetails.email}`} className="font-semibold text-primary">
        {liveContactDetails.email}
      </a>
      {liveContactDetails.phone && <span className="text-foreground/50">{liveContactDetails.phone}</span>}
    </div>
  );
}
