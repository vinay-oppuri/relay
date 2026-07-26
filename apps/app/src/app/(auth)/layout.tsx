import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="block text-center text-xl font-semibold tracking-tight"
        >
          Relay
        </Link>
        {children}
      </section>
    </main>
  );
}
