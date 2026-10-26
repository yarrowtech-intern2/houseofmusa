import { notFound } from "next/navigation";
import { DataError, getContactById } from "@hausofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { ContactForm } from "@/components/contacts/ContactForm";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const contact = await getContactById(getServerDb(), params.id).catch((err) => {
    if (err instanceof DataError && err.status === 404) notFound();
    throw err;
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
      <ContactForm contact={contact} />
    </div>
  );
}
