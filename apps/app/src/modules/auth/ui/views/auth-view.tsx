import { AuthForm } from "@/modules/auth/ui/components/auth-form";

export function AuthView() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-sm space-y-6">
        <p className="text-center text-xl font-semibold tracking-tight">
          Relay
        </p>

        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <header className="mb-6 space-y-2">
            <h1 className="text-2xl font-semibold">Sign in to Relay</h1>
            <p className="text-sm text-muted-foreground">
              Use a one-time code or your Google account.
            </p>
          </header>

          <AuthForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? Signing in creates your account automatically.
          </p>
        </div>
      </section>
    </main>
  );
}
