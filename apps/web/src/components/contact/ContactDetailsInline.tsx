"use client";

import { useEffect, useState } from "react";
import type { ContactDetails } from "@houseofmusa/types";
import { getPublicSettings } from "@houseofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";

export function ContactDetailsInline({ contactDetails }: { contactDetails?: ContactDetails }) {
  const [liveContactDetails, setLiveContactDetails] = useState(contactDetails);

  useEffect(() => {
    setLiveContactDetails(contactDetails);
  }, [contactDetails]);

  useEffect(() => {
    if (!CAN_USE_API) return;

    let cancelled = false;

    getPublicSettings(getDb())
      .then((settings) => {
        if (!cancelled && settings.contactDetails) setLiveContactDetails(settings.contactDetails);
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
