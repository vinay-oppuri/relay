import { github } from "@corsair-dev/github";
import { pool } from "@repo/db";
import { createCorsair } from "corsair";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function createRelayCorsair() {
  return createCorsair({
    database: pool,
    kek: requiredEnv("CORSAIR_KEK"),
    hub: {
      projectApiKey: requiredEnv("CORSAIR_DEV_API_KEY"),
      signingSecret: requiredEnv("CORSAIR_DEV_SIGNING_SECRET"),
    },
    plugins: [github({ authType: "managed" })],
  });
}

export type RelayCorsair = ReturnType<typeof createRelayCorsair>;

let corsairInstance: RelayCorsair | undefined;

export function getCorsair() {
  corsairInstance ??= createRelayCorsair();
  return corsairInstance;
}
