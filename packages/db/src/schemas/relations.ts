import { defineRelationsPart } from "drizzle-orm";

import { accounts, sessions, users, verifications } from "./auth";

export const authRelations = defineRelationsPart(
  {
    users,
    sessions,
    accounts,
    verifications,
  },
  (relations) => ({
    users: {
      sessions: relations.many.sessions({
        from: relations.users.id,
        to: relations.sessions.userId,
      }),
      accounts: relations.many.accounts({
        from: relations.users.id,
        to: relations.accounts.userId,
      }),
    },
    sessions: {
      user: relations.one.users({
        from: relations.sessions.userId,
        to: relations.users.id,
      }),
    },
    accounts: {
      user: relations.one.users({
        from: relations.accounts.userId,
        to: relations.users.id,
      }),
    },
  }),
);
