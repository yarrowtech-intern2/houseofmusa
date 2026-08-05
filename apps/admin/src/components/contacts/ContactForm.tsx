"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { contactAdminUpdateSchema, contactBudgetValues, contactStatusValues, projectTypeValues } from "@houseofmusa/schemas";
import type { Contact } from "@houseofmusa/types";
import { Button, Input, Label, Textarea } from "@houseofmusa/ui";
import { ApiRequestError, apiFetch } from "@/lib/api";
import {
  CONTACT_BUDGET_LABELS,
  CONTACT_PROJECT_TYPE_LABELS,
  CONTACT_STATUS_LABELS,
} from "@/lib/contactLabels";

type ContactFormValues = z.infer<typeof contactAdminUpdateSchema>;

const selectClassName =
  "h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/5 dark:text-white";

export function ContactForm({ contact }: { contact: Contact }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactAdminUpdateSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone ?? "",
      company: contact.company ?? "",
      budget: contact.budget,
      projectType: contact.projectType,
      message: contact.message,
      status: contact.status,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      await apiFetch(`/api/contacts/${contact._id}`, { method: "PATCH", body: JSON.stringify(values) });
      router.push("/contacts");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof ApiRequestError ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="budget">Budget</Label>
          <select id="budget" {...register("budget")} className={selectClassName}>
            {contactBudgetValues.map((value) => (
              <option key={value} value={value}>
                {CONTACT_BUDGET_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projectType">Project Type</Label>
          <select id="projectType" {...register("projectType")} className={selectClassName}>
            {projectTypeValues.map((value) => (
              <option key={value} value={value}>
                {CONTACT_PROJECT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" {...register("status")} className={selectClassName}>
            {contactStatusValues.map((value) => (
              <option key={value} value={value}>
                {CONTACT_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={6} {...register("message")} />
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      {serverError && <p className="mt-4 text-sm text-red-500">{serverError}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : "Save Contact"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/contacts")} className="w-full sm:w-auto">
          Cancel
        </Button>
      </div>
    </form>
  );
}
