"use client";

import { useRouter } from "next/navigation";
import type { Contact } from "@hausofmusa/types";
import { updateContactStatus } from "@hausofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";
import { CONTACT_STATUS_LABELS } from "@/lib/contactLabels";

const statusOptions = Object.entries(CONTACT_STATUS_LABELS) as [Contact["status"], string][];

export function ContactStatusSelect({ id, status }: { id: string; status: Contact["status"] }) {
  const router = useRouter();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await updateContactStatus(getBrowserDb(), id, event.target.value as Contact["status"]);
    router.refresh();
  };

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      className="h-9 rounded-full border border-foreground/10 bg-white px-3 text-xs font-medium text-foreground shadow-sm dark:border-white/10 dark:bg-[#161616] dark:text-white"
    >
      {statusOptions.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
