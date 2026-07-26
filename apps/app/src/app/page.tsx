import { Button } from "@repo/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <section className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Your meeting copilot
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Walk into every conversation prepared.
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Relay connects your tools, prepares concise meeting briefs, and
            helps you follow up while the context is still fresh.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button render={<Link href="/signup" />}>Get started</Button>
          <Button variant="outline" render={<Link href="/login" />}>
            Sign in
          </Button>
        </div>
      </section>
    </main>
  );
}
