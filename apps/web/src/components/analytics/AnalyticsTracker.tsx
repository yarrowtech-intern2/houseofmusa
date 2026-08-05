"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { API_URL, CAN_USE_API } from "@/lib/api";

function eventTypeForPath(path: string) {
  if (path === "/gallery") return "gallery-visit";
  if (path.startsWith("/products/")) return "product-view";
  return "page-view";
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!CAN_USE_API) return;

    const body = JSON.stringify({
      type: eventTypeForPath(pathname),
      path: pathname,
      meta: {
        referrer: document.referrer || undefined,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      },
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(`${API_URL}/api/analytics`, blob);
      return;
    }

    fetch(`${API_URL}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
