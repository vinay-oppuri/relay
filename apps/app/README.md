# Relay application

The authenticated Relay product application is a Next.js App Router project.
Authentication is handled by Better Auth with Google OAuth, passwordless email
OTP sessions, and user-scoped data.

## Local setup

From the repository root:

1. Copy `apps/app/.env.example` to `apps/app/.env.local` and replace the
   development values.
2. Create the PostgreSQL database named in `DATABASE_URL`.
3. Apply the generated Drizzle migrations:

   ```bash
   pnpm --filter @repo/db db:migrate
   ```

4. Start the product application:

   ```bash
   pnpm dev:app
   ```

The application runs at `http://localhost:3000` by default.

## Authentication flow

- `/login` signs in existing users or creates an account on first use through
  Google OAuth or a one-time email code.
- `/onboarding` selects the user's niche template.
- `/` is the product dashboard and requires a valid session plus a selected
  niche template.
- `/api/auth/[...all]` exposes the Better Auth route handler.

Set `BETTER_AUTH_URL` to the application origin in every environment and use a
unique, randomly generated `BETTER_AUTH_SECRET` of at least 32 characters.

Configure the Google OAuth client's authorized redirect URI as
`{BETTER_AUTH_URL}/api/auth/callback/google`. OTP delivery uses Resend through
the native HTTP API and requires `RESEND_API_KEY` plus a verified
`AUTH_EMAIL_FROM` sender.
