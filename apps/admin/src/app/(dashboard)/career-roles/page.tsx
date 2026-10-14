import Link from "next/link";
import { Plus } from "lucide-react";
import type { CareerRole } from "@houseofmusa/types";
import { Button } from "@houseofmusa/ui";
import { listCareerRolesAdmin } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { CareerRoleRowActions } from "@/components/careerRoles/CareerRoleRowActions";

export default async function CareerRolesAdminPage() {
  const data: { items: CareerRole[] } = { items: await listCareerRolesAdmin(getServerDb()) };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
            Career Roles
          </h1>
          <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">{data.items.length} total</p>
        </div>
        <Button asChild>
          <Link href="/career-roles/new">
            <Plus className="h-4 w-4" />
            New Role
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/8 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8 dark:divide-white/10">
            {data.items.map((role) => (
              <tr key={role._id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground dark:text-white">{role.title}</div>
                  <div className="text-xs text-foreground/40 dark:text-white/40">{role.slug}</div>
                </td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{role.department}</td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{role.location}</td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">{role.employmentType}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      role.published
                        ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        : "rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground/50 dark:bg-white/10 dark:text-white/50"
                    }
                  >
                    {role.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CareerRoleRowActions role={role} />
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-foreground/40 dark:text-white/40">
                  No roles yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
