"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button, Input, Label, Textarea } from "@houseofmusa/ui";
import { API_URL, CAN_USE_API } from "@/lib/api";

const applicationFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(5, "Enter a valid phone number").max(30),
  linkedinUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  expectedSalary: z.string().trim().max(60).optional().or(z.literal("")),
  experienceYears: z.coerce.number().min(0, "Must be 0 or more").max(60),
  skills: z.string().trim().min(1, "List at least one skill, comma-separated"),
  availability: z.string().trim().min(2, "Let us know your availability").max(120),
  resume: z
    .custom<FileList>()
    .refine((files) => files instanceof FileList && files.length === 1, "A resume file is required"),
  coverLetter: z.custom<FileList>().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export function ApplicationForm({ roleId, roleTitle }: { roleId: string; roleTitle: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({ resolver: zodResolver(applicationFormSchema) });

  const onSubmit = async (values: ApplicationFormValues) => {
    setServerError(null);
    if (!CAN_USE_API) {
      setServerError("Application submissions are unavailable until the API is connected.");
      return;
    }

    const resumeFile = values.resume[0];
    if (!resumeFile) {
      setServerError("A resume file is required.");
      return;
    }

    const formData = new FormData();
    formData.append("roleId", roleId);
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("linkedinUrl", values.linkedinUrl ?? "");
    formData.append("githubUrl", values.githubUrl ?? "");
    formData.append("portfolioUrl", values.portfolioUrl ?? "");
    formData.append("expectedSalary", values.expectedSalary ?? "");
    formData.append("experienceYears", String(values.experienceYears));
    formData.append("skills", values.skills);
    formData.append("availability", values.availability);
    formData.append("resume", resumeFile);
    if (values.coverLetter?.[0]) formData.append("coverLetter", values.coverLetter[0]);

    try {
      const res = await fetch(`${API_URL}/api/applications`, { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Something went wrong — please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-foreground/8 bg-surface px-8 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" strokeWidth={1.5} />
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">Application received</h3>
        <p className="max-w-sm text-sm text-foreground/60">
          Thanks for applying to {roleTitle}. We review every application personally — we&rsquo;ll be in touch
          if it&rsquo;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-foreground/8 bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="experienceYears">Years of experience</Label>
          <Input id="experienceYears" type="number" min={0} step={1} {...register("experienceYears")} />
          {errors.experienceYears && (
            <span className="text-xs text-red-500">{errors.experienceYears.message}</span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input id="linkedinUrl" placeholder="https://" {...register("linkedinUrl")} />
          {errors.linkedinUrl && <span className="text-xs text-red-500">{errors.linkedinUrl.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input id="githubUrl" placeholder="https://" {...register("githubUrl")} />
          {errors.githubUrl && <span className="text-xs text-red-500">{errors.githubUrl.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="portfolioUrl">Portfolio</Label>
          <Input id="portfolioUrl" placeholder="https://" {...register("portfolioUrl")} />
          {errors.portfolioUrl && <span className="text-xs text-red-500">{errors.portfolioUrl.message}</span>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expectedSalary">Expected salary (optional)</Label>
          <Input id="expectedSalary" {...register("expectedSalary")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="availability">Availability</Label>
          <Input id="availability" placeholder="e.g. 2 weeks notice" {...register("availability")} />
          {errors.availability && <span className="text-xs text-red-500">{errors.availability.message}</span>}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea id="skills" rows={2} placeholder="TypeScript, React, Node.js" {...register("skills")} />
        {errors.skills && <span className="text-xs text-red-500">{errors.skills.message}</span>}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="resume">Resume (PDF or Word)</Label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            {...register("resume")}
            className="text-sm text-foreground/70 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-medium file:text-white"
          />
          {errors.resume && <span className="text-xs text-red-500">{errors.resume.message as string}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="coverLetter">Cover letter (optional)</Label>
          <input
            id="coverLetter"
            type="file"
            accept=".pdf,.doc,.docx"
            {...register("coverLetter")}
            className="text-sm text-foreground/70 file:mr-4 file:rounded-full file:border-0 file:bg-foreground/10 file:px-4 file:py-2 file:text-xs file:font-medium file:text-foreground"
          />
        </div>
      </div>

      {!CAN_USE_API && (
        <p className="mt-5 text-sm text-foreground/50">
          Application submissions are unavailable until the API is connected.
        </p>
      )}
      {serverError && <p className="mt-5 text-sm text-red-500">{serverError}</p>}

      <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto" disabled={isSubmitting || !CAN_USE_API}>
        {isSubmitting ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
