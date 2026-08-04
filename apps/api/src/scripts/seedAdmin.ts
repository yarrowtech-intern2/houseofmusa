import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db";
import { Admin } from "../models/Admin";
import mongoose from "mongoose";

/** Usage: pnpm --filter @houseofmusa/api seed:admin <email> <password> <name> */
async function main() {
  const [email, password, name = "Admin"] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: seed:admin <email> <password> [name]");
    process.exit(1);
  }

  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, name, passwordHash, role: "super-admin" },
    { upsert: true, new: true },
  );

  console.log(`[seed] admin ready: ${admin.email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
