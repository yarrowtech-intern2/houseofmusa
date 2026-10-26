import { FileText, FileCheck } from "lucide-react";
import { listApplications } from "@hausofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { ApplicationStatusSelect } from "@/components/applications/ApplicationStatusSelect";

// resumeUrl / coverLetterUrl are short-lived signed links to the private "applications" storage bucket.
export default async function ApplicationsAdminPage() {
  const data = await listApplications(getServerDb(), { pageSize: 50 });

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
          Job Applications
        </h1>
        <p className="mt-1 text-sm text-foreground/50 dark:text-white/50">{data.total} total</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/8 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-foreground/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Files</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/8 dark:divide-white/10">
            {data.items.map((application) => (
              <tr key={application._id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground dark:text-white">{application.fullName}</div>
                  <div className="text-xs text-foreground/40 dark:text-white/40">
                    {application.email} · {application.phone}
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">
                  {application.roleId?.title ?? "—"}
                </td>
                <td className="px-4 py-3 text-foreground/60 dark:text-white/60">
                  {application.experienceYears} yrs
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Resume
                    </a>
                    {application.coverLetterUrl && (
                      <a
                        href={application.coverLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        Cover
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ApplicationStatusSelect id={application._id} status={application.status} />
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-foreground/40 dark:text-white/40">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
