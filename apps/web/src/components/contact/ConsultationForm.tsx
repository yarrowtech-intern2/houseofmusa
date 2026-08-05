"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import type { ContactDetails } from "@houseofmusa/types";
import { contactSchema, contactBudgetValues, projectTypeValues, type ContactInput } from "@houseofmusa/schemas";
import { Button, Input, Label, Textarea } from "@houseofmusa/ui";
import { API_URL, CAN_USE_API } from "@/lib/api";
import { BUDGET_LABELS, CONTACT_PROJECT_TYPE_LABELS } from "@/lib/contactLabels";

const selectClassName =
  "flex h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function ConsultationForm({
  contactDetails = { email: "hello@houseofmusa.com" },
  onClose,
}: {
  contactDetails?: ContactDetails;
  onClose?: () => void;
}) {
  const [liveContactDetails, setLiveContactDetails] = useState(contactDetails);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  useEffect(() => {
    setSubmitted(false);
    setServerError(null);
    reset();
  }, [reset]);

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

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Something went wrong - please try again.");
      }
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong - please try again.");
    }
  };

  if (!CAN_USE_API) {
    return (
      <div className="mt-6 flex flex-col gap-3 text-sm text-foreground/60">
        <p>Reach us directly:</p>
        <a href={`mailto:${liveContactDetails.email}`} className="font-medium text-secondary hover:text-primary">
          {liveContactDetails.email}
        </a>
        {liveContactDetails.phone && <span>{liveContactDetails.phone}</span>}
        {onClose && (
          <Button className="mt-5 w-full" variant="primary" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Request received</h2>
        <p className="max-w-sm text-sm text-foreground/60">
          Thanks for reaching out - we review every request personally and will follow up shortly.
        </p>
        {onClose && (
          <Button className="mt-2 w-full" variant="primary" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" {...register("name")} />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" {...register("email")} />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input id="contact-phone" type="tel" {...register("phone")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-company">Company (optional)</Label>
          <Input id="contact-company" {...register("company")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-budget">Budget</Label>
          <select id="contact-budget" defaultValue="" {...register("budget")} className={selectClassName}>
            <option value="" disabled>
              Select a range
            </option>
            {contactBudgetValues.map((value) => (
              <option key={value} value={value}>
                {BUDGET_LABELS[value]}
              </option>
            ))}
          </select>
          {errors.budget && <span className="text-xs text-red-500">{errors.budget.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-projectType">Project Type</Label>
          <select id="contact-projectType" defaultValue="" {...register("projectType")} className={selectClassName}>
            <option value="" disabled>
              Select a type
            </option>
            {projectTypeValues.map((value) => (
              <option key={value} value={value}>
                {CONTACT_PROJECT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
          {errors.projectType && <span className="text-xs text-red-500">{errors.projectType.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={4} {...register("message")} />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" variant="primary" className="mt-2 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Request"}
      </Button>
    </form>
  );
}
