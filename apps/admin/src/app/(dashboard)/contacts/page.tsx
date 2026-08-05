import { cookies } from "next/headers";
import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Contact, PaginatedResult } from "@houseofmusa/types";
import { Button } from "@houseofmusa/ui";
import { apiFetch } from "@/lib/api";
import {
  CONTACT_BUDGET_LABELS,
  CONTACT_PROJECT_TYPE_LABELS,
  CONTACT_STATUS_LABELS,
} from "@/lib/contactLabels";
import { ContactStatusSelect } from "@/components/contacts/ContactStatusSelect";
import { ContactsExportButton } from "@/components/contacts/ContactsExportButton";

const statuses = ["", "new", "contacted", "qualified", "closed"] as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function queryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string; status?: string };
}) {
  const page = Number(searchParams?.page ?? 1);
  const search = searchParams?.search?.trim() ?? "";
  const status = searchParams?.status ?? "";
  const data = await apiFetch<PaginatedResult<Contact>>(
    `/api/contacts${queryString({ page, pageSize: 50, search, status })}`,
    { cookie: cookies().toString() },
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">{data.total} requests</p>
        </div>
        <ContactsExportButton contacts={data.items} />
      </div>

      <form className="grid grid-cols-1 gap-3 rounded-xl border border-foreground/8 bg-surface p-3 dark:border-white/10 dark:bg-[#111111] sm:grid-cols-[1fr_12rem_auto]">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search name, email, company"
          className="h-10 rounded-lg border border-foreground/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-[#161616] dark:text-white"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-lg border border-foreground/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-[#161616] dark:text-white"
        >
          {statuses.map((value) => (
            <option key={value || "all"} value={value}>
              {value ? CONTACT_STATUS_LABELS[value] : "All statuses"}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" className="h-10">
          Filter
        </Button>
      </form>

      <div className="space-y-3 md:hidden">
        {data.items.map((contact) => (
          <article key={contact._id} className="rounded-xl border border-foreground/8 bg-surface p-4 dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-foreground dark:text-white">{contact.name}</h2>
                <p className="truncate text-xs text-foreground/45 dark:text-white/45">{contact.email}</p>
              </div>
              <ContactStatusSelect id={contact._id} status={contact.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/55 dark:text-white/55">
              <span>{CONTACT_BUDGET_LABELS[contact.budget]}</span>
              <span>{CONTACT_PROJECT_TYPE_LABELS[contact.projectType]}</span>
              <span className="col-span-2 truncate">{contact.company || contact.phone || "No company"}</span>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/65 dark:text-white/65">{contact.message}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-foreground/40 dark:text-white/40">{formatDate(contact.createdAt)}</p>
              <Link
                href={`/contacts/${contact._id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground/8 px-3 py-1.5 text-xs font-medium text-foreground/70 dark:bg-white/10 dark:text-white/70"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-foreground/8 bg-surface dark:border-white/10 dark:bg-[#111111] md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8 dark:divide-white/10">
            {data.items.map((contact) => (
              <tr key={contact._id}>
                <td className="px-4 py-3">
                  <Link href={`/contacts/${contact._id}`} className="font-medium text-foreground hover:text-primary dark:text-white">
                    {contact.name}
                  </Link>
                  <div className="text-xs text-foreground/40 dark:text-white/40">{contact.email}</div>
                  <div className="text-xs text-foreground/40 dark:text-white/40">{contact.company || contact.phone}</div>
                </td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">
                  <div>{CONTACT_PROJECT_TYPE_LABELS[contact.projectType]}</div>
                  <div className="text-xs text-foreground/40 dark:text-white/40">
                    {CONTACT_BUDGET_LABELS[contact.budget]}
                  </div>
                </td>
                <td className="max-w-md px-4 py-3 text-foreground/60 dark:text-white/60">
                  <p className="line-clamp-2">{contact.message}</p>
                </td>
                <td className="px-4 py-3 text-foreground/50 dark:text-white/50">{formatDate(contact.createdAt)}</td>
                <td className="px-4 py-3">
                  <ContactStatusSelect id={contact._id} status={contact.status} />
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-foreground/40 dark:text-white/40">
                  No contacts match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
