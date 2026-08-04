import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { CareerRole } from "@houseofmusa/types";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { CareerRoleForm } from "@/components/careerRoles/CareerRoleForm";

export default async function EditCareerRolePage({ params }: { params: { id: string } }) {
  let role: CareerRole;
  try {
    const data = await apiFetch<{ item: CareerRole }>(`/api/career-roles/admin/${params.id}`, {
      cookie: cookies().toString(),
    });
    role = data.item;
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound();
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
