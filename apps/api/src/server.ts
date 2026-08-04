import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function main() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[api] failed to start:", err);
  process.exit(1);
});
