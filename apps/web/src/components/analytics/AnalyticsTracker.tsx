"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@houseofmusa/data";
import { CAN_USE_API, getDb } from "@/lib/api";

function eventTypeForPath(path: string) {
  if (path === "/gallery") return "gallery-visit";
  if (path.startsWith("/products/")) return "product-view";
  return "page-view";
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!CAN_USE_API) return;

    trackEvent(getDb(), {
      type: eventTypeForPath(pathname),
      path: pathname,
      meta: {
        referrer: document.referrer || undefined,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
