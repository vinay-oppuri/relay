"use client";

import { safeNextPath } from "@/lib/auth-path";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const destination = safeNextPath(searchParams.get("next"));

  async function continueWithGoogle() {
    setError(null);
    setPending(true);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: destination,
      errorCallbackURL: "/login",
    });

    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed.");
      setPending(false);
    }
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const normalizedEmail = email.trim().toLowerCase();

    const result = await authClient.emailOtp.sendVerificationOtp({
      email: normalizedEmail,
      type: "sign-in",
    });

    if (result.error) {
      setError(result.error.message ?? "Could not send a sign-in code.");
      setPending(false);
      return;
    }

    setEmail(normalizedEmail);
    setOtpSent(true);
    setPending(false);
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const otp = String(formData.get("otp") ?? "").trim();
    const localPart = email.split("@")[0] ?? "";
    // ponytail: This placeholder avoids a separate profile step; replace it
    // with an editable display name when user profiles are introduced.
    const name = localPart.replace(/[._-]+/g, " ").trim() || "Relay user";
    const result = await authClient.signIn.emailOtp({
      email,
      otp,
      name,
    });

    if (result.error) {
      setError(result.error.message ?? "That code is invalid or expired.");
      setPending(false);
      return;
    }

    router.replace(destination);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={continueWithGoogle}
      >
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      {otpSent ? (
        <form className="space-y-4" onSubmit={verifyCode}>
          <div className="space-y-1">
            <p className="text-sm font-medium">Enter your sign-in code</p>
            <p className="text-sm text-muted-foreground">
              We sent a six-digit code to {email}.
            </p>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            One-time code
            <input
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              autoFocus
              required
              className="h-10 w-full rounded-lg border bg-background px-3 text-center font-mono text-lg tracking-[0.4em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          {error ? <AuthError message={error} /> : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Verifying..." : "Verify code"}
          </Button>
          <button
            type="button"
            className="w-full text-sm text-muted-foreground underline"
            disabled={pending}
            onClick={() => {
              setOtpSent(false);
              setError(null);
            }}
          >
            Use a different email
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={requestCode}>
          <label className="block space-y-2 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
              className="h-10 w-full rounded-lg border bg-background px-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          {error ? <AuthError message={error} /> : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending code..." : "Continue with email"}
          </Button>
        </form>
      )}
    </div>
  );
}

function AuthError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
