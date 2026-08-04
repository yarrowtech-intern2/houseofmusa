"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@houseofmusa/ui";
import { apiFetch } from "@/lib/api";
import type { AdminSession } from "@/lib/auth";

export function DashboardTopbar({ admin }: { admin: AdminSession }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between border-b border-foreground/8 bg-surface px-6 py-4 dark:border-white/10 dark:bg-[#111111]">
      <div className="text-sm text-foreground/50 dark:text-white/50">
        Signed in as <span className="font-medium text-foreground dark:text-white">{admin.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
