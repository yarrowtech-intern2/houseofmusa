import { cookies } from "next/headers";
import type { Contact } from "@houseofmusa/types";
import { apiFetch } from "@/lib/api";
import { ContactForm } from "@/components/contacts/ContactForm";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const data = await apiFetch<{ item: Contact }>(`/api/contacts/${params.id}`, {
    cookie: cookies().toString(),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
          Edit Contact
        </h1>
        <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
          Update the request details, project context, and pipeline status.
        </p>
      </div>
      <ContactForm contact={data.item} />
    </div>
  );
}
