import { CareerRoleForm } from "@/components/careerRoles/CareerRoleForm";

export default function NewCareerRolePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground dark:text-white">
        New Career Role
      </h1>
      <div className="mt-8">
        <CareerRoleForm />
      </div>
    </div>
  );
}
