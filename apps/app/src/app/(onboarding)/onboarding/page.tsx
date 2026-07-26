import { OnboardingForm } from "@/modules/onboarding/onboarding-form";
import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await requireSession();

  if (session.user.nicheTemplate) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-muted/20 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <p className="text-lg font-semibold tracking-tight">Relay</p>
          <p className="text-sm text-muted-foreground">
            Signed in as {session.user.email}
          </p>
        </header>

        <div className="grid overflow-hidden rounded-2xl border bg-background shadow-sm lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mb-9 max-w-2xl space-y-3">
              <p className="text-sm font-medium text-primary">
                Personal setup · Step 1 of 4
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                What should Relay optimize for?
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Welcome, {session.user.name}. Choose a starting template for
                your meeting prep, scheduling defaults, and Slack summaries. You
                can change these defaults later.
              </p>
            </div>

            <OnboardingForm />
          </section>

          <aside className="border-t bg-muted/30 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-sm font-semibold">Your Relay setup</p>
            <ol className="mt-6 space-y-5">
              {[
                ["1", "Choose a template", "In progress"],
                ["2", "Connect your tools", "Gmail, Calendar, and Slack"],
                ["3", "Add an AI provider", "Bring your own API key"],
                ["4", "Set your limits", "Usage cap and approvals"],
              ].map(([number, title, description], index) => (
                <li className="flex gap-3" key={number}>
                  <span
                    className={
                      index === 0
                        ? "flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                        : "flex size-7 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground"
                    }
                  >
                    {number}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-xl border bg-background p-4">
              <p className="text-sm font-medium">You stay in control</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Relay will never send an email or create an invite without your
                approval.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
