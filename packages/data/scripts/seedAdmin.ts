import { getAdminClient } from "./lib";

/** Usage: pnpm --filter @hausofmusa/data seed:admin <email> <password> [name] */
async function main() {
  const [email, password, name = "Admin"] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: seed:admin <email> <password> [name]");
    process.exit(1);
  }

  const db = getAdminClient();

  let userId: string | undefined;
  const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.data.user) {
    userId = created.data.user.id;
  } else {
    // Already registered: look the user up and reset their password so the script stays re-runnable.
    const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (!existing) throw created.error ?? new Error("Could not create or find the user");
    const updated = await db.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
    if (updated.error) throw updated.error;
    userId = existing.id;
  }

  const { error } = await db
    .from("admin_profiles")
    .upsert({ id: userId, name, role: "super-admin" }, { onConflict: "id" });
  if (error) throw error;

  console.log(`[seed] admin ready: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
