import type { Metadata } from "next";
import { ContactDetailsInline } from "@/components/contact/ContactDetailsInline";
import { ConsultationForm } from "@/components/contact/ConsultationForm";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Tell House of Musa about your project and request a consultation.",
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();

  return (
    <section className="min-h-screen px-6 pb-24 pt-32 sm:px-12 lg:px-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Consultation</span>
          <h1 className="mt-4 font-display text-display-lg font-medium tracking-tight text-foreground">
            Tell us what you are building.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/60">
            Share the problem, timeline, and kind of system you need. The request lands in the admin dashboard as a
            contact lead.
          </p>
          <ContactDetailsInline contactDetails={settings.contactDetails} />
        </div>

        <div className="rounded-3xl border border-foreground/8 bg-surface p-5 shadow-soft sm:p-8">
          <ConsultationForm contactDetails={settings.contactDetails} />
        </div>
      </div>
    </section>
  );
}
