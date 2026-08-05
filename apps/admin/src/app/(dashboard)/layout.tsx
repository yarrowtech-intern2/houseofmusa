import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getServerSession();
  if (!admin) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background dark:bg-[#0d0d0d]">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar admin={admin} />
        <main className="flex-1 px-4 py-4 pb-24 sm:px-5 lg:px-6 lg:py-6 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}
