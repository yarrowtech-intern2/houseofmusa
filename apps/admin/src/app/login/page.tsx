"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@houseofmusa/schemas";
import { Button, Input, Label } from "@houseofmusa/ui";
import { getBrowserDb } from "@/lib/supabase/browser";
import { Logo } from "@/components/layout/Logo";

function getPublicHomeUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_WEB_URL?.trim().replace(/\/$/, "");
  if (configuredUrl) return configuredUrl;
  if (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return "/";
}

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      const db = getBrowserDb();
      const { data, error } = await db.auth.signInWithPassword(values);
      if (error || !data.user) {
        setServerError("Invalid email or password");
        return;
      }

      // Signing in only proves the account exists; admins also need an admin_profiles row.
      const { data: profile } = await db.from("admin_profiles").select("id").eq("id", data.user.id).maybeSingle();
      if (!profile) {
        await db.auth.signOut();
        setServerError("This account does not have admin access");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setServerError("Something went wrong");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-[#0d0d0d]">
      <Link
        href={getPublicHomeUrl()}
        className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-full border border-foreground/10 bg-surface px-4 text-sm font-medium text-foreground/70 shadow-soft transition-colors hover:text-primary dark:border-white/10 dark:bg-[#151515] dark:text-white/70 dark:hover:text-primary sm:left-6 sm:top-6"
      >
        <Home className="h-4 w-4" />
        Go Home
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-3xl border border-foreground/8 bg-surface p-8 shadow-soft-lg dark:border-white/10 dark:bg-[#151515]"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-7 w-auto" />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Admin Sign In
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
        </div>

        {serverError && <p className="mt-4 text-sm text-red-500">{serverError}</p>}

        <Button type="submit" className="mt-8 w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </main>
  );
}
