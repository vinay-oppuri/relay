import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";
import { pool } from "@repo/db";
import { createCorsair, setupCorsair } from "corsair";

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
    plugins: [gmail(), googlecalendar()],
    multiTenancy: true,
  });
}

export type RelayCorsair = ReturnType<typeof createRelayCorsair>;

let corsairInstance: RelayCorsair | undefined;
let corsairCredentialsPromise: Promise<void> | undefined;

export function getCorsair() {
  corsairInstance ??= createRelayCorsair();
  return corsairInstance;
}

export function ensureCorsairIntegrationCredentials() {
  corsairCredentialsPromise ??= (async () => {
    const corsair = getCorsair();
    const clientId =
      process.env.CORSAIR_GOOGLE_CLIENT_ID ?? requiredEnv("GOOGLE_CLIENT_ID");
    const clientSecret =
      process.env.CORSAIR_GOOGLE_CLIENT_SECRET ??
      requiredEnv("GOOGLE_CLIENT_SECRET");

    await setupCorsair(corsair, { silent: true });

    const [storedClientId, storedClientSecret] = await Promise.all([
      corsair.keys.gmail.get_client_id(),
      corsair.keys.gmail.get_client_secret(),
    ]);

    if (storedClientId !== clientId) {
      await corsair.keys.gmail.set_client_id(clientId);
    }

    if (storedClientSecret !== clientSecret) {
      await corsair.keys.gmail.set_client_secret(clientSecret);
    }
  })();

  return corsairCredentialsPromise;
}
