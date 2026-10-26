"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@hausofmusa/ui";
import { getBrowserDb } from "@/lib/supabase/browser";
import type { AdminSession } from "@/lib/auth";
import { Logo } from "./Logo";

export function DashboardTopbar({ admin }: { admin: AdminSession }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const displayEmail = admin.email.endsWith("@example.com") ? "admin@hausofmusa.com" : admin.email;

  const handleLogout = async () => {
    await getBrowserDb().auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-foreground/8 bg-surface/95 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/95 sm:px-5 lg:px-6">
      <div className="min-w-0">
        <div className="block h-5 w-20 lg:hidden">
          <Logo className="h-full w-full object-contain object-left" />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-display text-base font-semibold tracking-tight text-foreground dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-foreground/45 dark:text-white/45">Content and operations control</p>
        </div>
        <div className="truncate text-sm font-semibold text-foreground dark:text-white sm:hidden">
          Admin Dashboard
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <div className="hidden max-w-[16rem] items-center gap-2 rounded-full border border-foreground/8 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04] md:flex">
          <UserCircle2 className="h-4 w-4 text-primary" />
          <span className="truncate text-xs font-medium text-foreground/70 dark:text-white/70">{displayEmail}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Logout">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
