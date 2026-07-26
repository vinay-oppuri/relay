import { requireSession } from "@/lib/session";
import { SignOutButton } from "@/modules/auth/ui/components/sign-out-button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireSession();

  if (!session.user.nicheTemplate) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div>
            <p className="font-semibold">Relay</p>
            <p className="text-xs capitalize text-muted-foreground">
              {session.user.nicheTemplate.replace("-", " ")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="space-y-4 rounded-xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Relay ready
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome, {session.user.name}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Your personal Relay dashboard is ready. The typed dashboard API and
            application navigation arrive in Phase 3.
          </p>
        </section>
      </main>
    </div>
  );
}
