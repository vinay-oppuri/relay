# Relay

Relay is a chat-first assistant for Gmail and Google Calendar. Users can ask
questions about their mail, review cited answers, draft replies, and explicitly
confirm email or calendar actions.

## Repository

- `apps/web` — public marketing site; no authentication or database access.
- `apps/app` — authenticated product, API routes, onboarding, and assistant UI.
- `packages/ui` — shared shadcn components and global styles.
- `packages/db` — Drizzle schemas and PostgreSQL migrations.
- `packages/ai` — provider-neutral AI helpers using per-user API keys.
- `packages/corsair` — server-side Gmail and Google Calendar integration.

## Local development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `packages/db/.env` and `apps/app/.env.example` to
   `apps/app/.env`, then replace every placeholder.

3. Apply database migrations:

   ```bash
   pnpm --filter @repo/db db:migrate
   ```

4. Start either application:

   ```bash
   pnpm dev:web
   pnpm dev:app
   ```

## Checks

```bash
pnpm check-types
pnpm lint
pnpm test
pnpm build
```

Product requirements and phase boundaries are documented in [PRD.md](PRD.md).
