import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const globalForDatabase = globalThis as typeof globalThis & {
  relayPool?: Pool;
};

export const pool =
  globalForDatabase.relayPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

globalForDatabase.relayPool = pool;

export const db = drizzle({ client: pool });

export * from "./schema";
export { schema };
