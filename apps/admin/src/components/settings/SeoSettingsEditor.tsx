"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import type { SeoRouteSetting, SeoSettings } from "@hausofmusa/types";
import { Button, Input, Label, Textarea } from "@hausofmusa/ui";
import { DataError, updateSetting } from "@hausofmusa/data";
import { getBrowserDb } from "@/lib/supabase/browser";

const emptyRoute: SeoRouteSetting = { path: "/", title: "", description: "", ogImage: "" };

export function SeoSettingsEditor({ seo }: { seo: SeoSettings }) {
  const router = useRouter();
  const [value, setValue] = useState(seo);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const updateRoute = (index: number, patch: Partial<SeoRouteSetting>) => {
    setValue((current) => ({
      ...current,
      routes: current.routes.map((route, i) => (i === index ? { ...route, ...patch } : route)),
    }));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateSetting(getBrowserDb(), "seo", value);
      setMessage("Saved SEO settings.");
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
            SEO Settings
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">
            Manage default metadata and per-route search snippets.
          </p>
        </div>
        <Button onClick={save} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save SEO"}
        </Button>
      </div>

      {message && <p className="rounded-xl bg-foreground/[0.04] px-4 py-3 text-sm text-foreground/60 dark:bg-white/[0.05] dark:text-white/65">{message}</p>}

      <section className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">Defaults</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Default Title">
            <Input value={value.defaultTitle} onChange={(e) => setValue({ ...value, defaultTitle: e.target.value })} />
          </Field>
          <Field label="Default OpenGraph Image">
            <Input value={value.ogImage ?? ""} onChange={(e) => setValue({ ...value, ogImage: e.target.value })} />
          </Field>
          <Field label="Default Description" className="lg:col-span-2">
            <Textarea
              value={value.defaultDescription}
              rows={3}
              onChange={(e) => setValue({ ...value, defaultDescription: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/8 p-4 dark:border-white/10 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-foreground dark:text-white">Routes</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValue({ ...value, routes: [...value.routes, emptyRoute] })}
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {value.routes.map((route, index) => (
            <div key={index} className="rounded-xl border border-foreground/8 p-3 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">Route {index + 1}</span>
                <button
                  type="button"
                  onClick={() => setValue({ ...value, routes: value.routes.filter((_, i) => i !== index) })}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"
                  aria-label={`Remove route ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Path">
                  <Input value={route.path} onChange={(e) => updateRoute(index, { path: e.target.value })} />
                </Field>
                <Field label="Title">
                  <Input value={route.title} onChange={(e) => updateRoute(index, { title: e.target.value })} />
                </Field>
              </div>
              <Field label="Description" className="mt-3">
                <Textarea
                  value={route.description}
                  rows={3}
                  onChange={(e) => updateRoute(index, { description: e.target.value })}
                />
              </Field>
              <Field label="OpenGraph Image" className="mt-3">
                <Input value={route.ogImage ?? ""} onChange={(e) => updateRoute(index, { ogImage: e.target.value })} />
              </Field>
            </div>
          ))}
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
