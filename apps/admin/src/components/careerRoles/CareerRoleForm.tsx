"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employmentTypeValues } from "@hausofmusa/schemas";
import type { CareerRole } from "@hausofmusa/types";
import { Button, Input, Label, Textarea } from "@hausofmusa/ui";
import { DataError, createCareerRole, updateCareerRole } from "@hausofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";

// Mirrors @hausofmusa/schemas' careerRoleSchema but keeps responsibilities/
// requirements as newline-separated text for plain textareas — split into
// arrays only when building the API payload.
const careerRoleFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase kebab-case only (e.g. senior-fullstack-engineer)"),
  title: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  employmentType: z.enum(employmentTypeValues),
  description: z.string().trim().min(10).max(4000),
  responsibilities: z.string().trim().optional().or(z.literal("")),
  requirements: z.string().trim().optional().or(z.literal("")),
  published: z.boolean(),
});

type CareerRoleFormValues = z.infer<typeof careerRoleFormSchema>;

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function CareerRoleForm({ role }: { role?: CareerRole }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditing = Boolean(role);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CareerRoleFormValues>({
    resolver: zodResolver(careerRoleFormSchema),
    defaultValues: role
      ? {
          slug: role.slug,
          title: role.title,
          department: role.department,
          location: role.location,
          employmentType: role.employmentType,
          description: role.description,
          responsibilities: role.responsibilities.join("\n"),
          requirements: role.requirements.join("\n"),
          published: role.published,
        }
      : { published: true, responsibilities: "", requirements: "" },
  });

  const onSubmit = async (values: CareerRoleFormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      responsibilities: toLines(values.responsibilities ?? ""),
      requirements: toLines(values.requirements ?? ""),
    };

    try {
      if (isEditing && role) {
        await updateCareerRole(getBrowserDb(), role._id, payload);
      } else {
        await createCareerRole(getBrowserDb(), payload);
      }
      router.push("/career-roles");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof DataError ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <span className="text-xs text-red-500">{errors.slug.message}</span>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="department">Department</Label>
          <Input id="department" {...register("department")} />
          {errors.department && <span className="text-xs text-red-500">{errors.department.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && <span className="text-xs text-red-500">{errors.location.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employmentType">Employment Type</Label>
          <select
            id="employmentType"
            {...register("employmentType")}
            className="h-12 w-full rounded-xl border border-foreground/12 bg-white/70 px-4 text-sm text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-white/15 dark:bg-white/5 dark:text-white"
          >
            {employmentTypeValues.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
          <Textarea id="responsibilities" rows={4} {...register("responsibilities")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="requirements">Requirements (one per line)</Label>
          <Textarea id="requirements" rows={4} {...register("requirements")} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground/70 dark:text-white/70">
          <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-foreground/20" />
          Published
        </label>
      </div>

      {serverError && <p className="mt-4 text-sm text-red-500">{serverError}</p>}

      <div className="mt-8 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Role"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/career-roles")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
