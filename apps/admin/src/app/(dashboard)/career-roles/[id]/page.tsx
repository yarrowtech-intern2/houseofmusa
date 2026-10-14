import { notFound } from "next/navigation";
import type { CareerRole } from "@houseofmusa/types";
import { DataError, getCareerRoleById } from "@houseofmusa/data";
import { getServerDb } from "@/lib/supabase/server";
import { CareerRoleForm } from "@/components/careerRoles/CareerRoleForm";

export default async function EditCareerRolePage({ params }: { params: { id: string } }) {
  let role: CareerRole;
  try {
    role = await getCareerRoleById(getServerDb(), params.id);
  } catch (err) {
    if (err instanceof DataError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
        Edit {role.title}
      </h1>
      <div className="mt-8">
        <CareerRoleForm role={role} />
      </div>
    </div>
  );
}
