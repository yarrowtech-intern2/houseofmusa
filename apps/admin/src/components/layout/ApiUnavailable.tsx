import { AlertTriangle } from "lucide-react";
import { Logo } from "./Logo";

export function ApiUnavailable({ message }: { message?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-[#0d0d0d]">
      <section className="w-full max-w-md rounded-lg border border-red-500/20 bg-surface p-6 shadow-soft-lg dark:border-red-400/20 dark:bg-[#151515]">
        <Logo className="h-7 w-auto" />
        <div className="mt-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground dark:text-white">
              Supabase not configured
            </h1>
            <p className="mt-2 text-sm leading-6 text-foreground/60 dark:text-white/60">
              {message ?? "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the admin app."}
            </p>
            <p className="mt-4 rounded-md bg-foreground/5 px-3 py-2 font-mono text-xs text-foreground/60 dark:bg-white/5 dark:text-white/60">
              apps/admin/.env.local
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
