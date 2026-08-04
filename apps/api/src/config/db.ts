import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
  console.log(`[db] connected to ${new URL(env.MONGODB_URI).pathname.replace("/", "") || "database"}`);
}
