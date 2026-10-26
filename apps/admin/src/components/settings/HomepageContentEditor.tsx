"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import type { ContactDetails, HomepageContent, StorySectionContent } from "@hausofmusa/types";
import { Button, Input, Label, Textarea } from "@hausofmusa/ui";
import { DataError, updateSetting } from "@hausofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";

const emptyStory: StorySectionContent = { eyebrow: "", title: "", body: "", href: "", linkLabel: "" };

export function HomepageContentEditor({
  homepageContent,
  contactDetails,
}: {
  homepageContent: HomepageContent;
  contactDetails: ContactDetails;
}) {
  const router = useRouter();
  const [homepage, setHomepage] = useState(homepageContent);
  const [contact, setContact] = useState(contactDetails);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateStory = (index: number, patch: Partial<StorySectionContent>) => {
    setHomepage((current) => ({
      ...current,
      storySections: current.storySections.map((section, i) => (i === index ? { ...section, ...patch } : section)),
    }));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await Promise.all([
        updateSetting(getBrowserDb(), "homepage-content", homepage),
        updateSetting(getBrowserDb(), "contact-details", contact),
      ]);
      setMessage("Saved homepage and contact details.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof DataError ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Homepage Content
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
            Edit public homepage copy, CTAs, story sections, and contact details.
          </p>
        </div>
        <Button onClick={save} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {message && <p className="rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm text-foreground/60 dark:bg-white/[0.05] dark:text-white/65">{message}</p>}

      <section className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">Hero</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Headline">
            <Input value={homepage.heroTitle} onChange={(e) => setHomepage({ ...homepage, heroTitle: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <Input
              value={homepage.heroSubtitle}
              onChange={(e) => setHomepage({ ...homepage, heroSubtitle: e.target.value })}
            />
          </Field>
          <Field label="Primary CTA">
            <Input
              value={homepage.primaryCtaLabel}
              onChange={(e) => setHomepage({ ...homepage, primaryCtaLabel: e.target.value })}
            />
          </Field>
          <Field label="Secondary CTA">
            <Input
              value={homepage.secondaryCtaLabel}
              onChange={(e) => setHomepage({ ...homepage, secondaryCtaLabel: e.target.value })}
            />
          </Field>
          <Field label="Secondary CTA Link">
            <Input
              value={homepage.secondaryCtaHref}
              onChange={(e) => setHomepage({ ...homepage, secondaryCtaHref: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">Story Sections</h2>
            <p className="mt-1 text-xs text-foreground/45 dark:text-white/45">Rendered in order on the home page.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHomepage({ ...homepage, storySections: [...homepage.storySections, emptyStory] })}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {homepage.storySections.map((section, index) => (
            <div key={index} className="rounded-xl border border-foreground/8 p-3 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">Section {index + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setHomepage({
                      ...homepage,
                      storySections: homepage.storySections.filter((_, i) => i !== index),
                    })
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
                  aria-label={`Remove section ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Eyebrow">
                  <Input value={section.eyebrow} onChange={(e) => updateStory(index, { eyebrow: e.target.value })} />
                </Field>
                <Field label="Title">
                  <Input value={section.title} onChange={(e) => updateStory(index, { title: e.target.value })} />
                </Field>
              </div>
              <Field label="Body" className="mt-3">
                <Textarea value={section.body} rows={3} onChange={(e) => updateStory(index, { body: e.target.value })} />
              </Field>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Link">
                  <Input value={section.href ?? ""} onChange={(e) => updateStory(index, { href: e.target.value })} />
                </Field>
                <Field label="Link Label">
                  <Input
                    value={section.linkLabel ?? ""}
                    onChange={(e) => updateStory(index, { linkLabel: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">Contact Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Email">
            <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={contact.phone ?? ""} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input
              value={contact.location ?? ""}
              onChange={(e) => setContact({ ...contact, location: e.target.value })}
            />
          </Field>
          <Field label="Address">
            <Input value={contact.address ?? ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
          </Field>
          <Field label="WhatsApp URL">
            <Input
              value={contact.whatsappUrl ?? ""}
              onChange={(e) => setContact({ ...contact, whatsappUrl: e.target.value })}
            />
          </Field>
          <Field label="Calendly URL">
            <Input
              value={contact.calendlyUrl ?? ""}
              onChange={(e) => setContact({ ...contact, calendlyUrl: e.target.value })}
            />
          </Field>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
