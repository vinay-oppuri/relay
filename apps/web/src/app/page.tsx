const features = [
  {
    marker: "01",
    title: "Understand your inbox",
    description:
      "Ask what matters, summarize long threads, and verify every answer through mail citations.",
  },
  {
    marker: "02",
    title: "Schedule with context",
    description:
      "Find available times from meeting requests and confirm before Relay books anything.",
  },
  {
    marker: "03",
    title: "Reply with confidence",
    description:
      "Draft replies from the full conversation, edit them inline, and send only when you choose.",
  },
] as const;

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <p className="text-lg font-semibold tracking-tight">Relay</p>
        <a
          className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          href={`${appUrl}/login`}
        >
          Sign in
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium text-primary">
            Your inbox, ready to answer
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            Work with your email, not around it.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Relay connects Gmail and Google Calendar to answer questions,
            surface important mail, draft replies, and help schedule meetings.
            Every external action waits for your confirmation.
          </p>
          <a
            className="mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
            href={`${appUrl}/login`}
          >
            Open Relay
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
          {features.map(({ description, marker, title }) => (
            <article className="bg-background p-7" key={title}>
              <p className="text-xs font-semibold text-primary">{marker}</p>
              <h2 className="mt-5 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
