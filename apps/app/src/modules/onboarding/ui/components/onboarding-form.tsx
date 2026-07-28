"use client";

import { authClient } from "@/lib/auth-client";
import { Button, cn } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const onboardingTemplates = [
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Candidate context",
    details:
      "Prioritize candidate context when summarizing threads or preparing for interviews.",
  },
  {
    id: "sales",
    title: "Sales / SDR",
    description: "Deal context",
    details:
      "Surface the account details that matter in deal threads and discovery calls.",
  },
  {
    id: "solo-founder",
    title: "Solo founder / Consultant",
    description: "Client context",
    details:
      "Retrieve useful context across customer, partner, and client conversations.",
  },
] as const;

type NicheTemplate = (typeof onboardingTemplates)[number]["id"];

export function OnboardingForm() {
  const router = useRouter();
  const [template, setTemplate] = useState<NicheTemplate>("solo-founder");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await authClient.updateUser({ nicheTemplate: template });

    if (result.error) {
      setError(result.error.message ?? "Could not save your template.");
      setPending(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <fieldset className="space-y-3" disabled={pending}>
        <legend className="sr-only">Choose your Relay template</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {onboardingTemplates.map((option) => (
            <label
              key={option.id}
              className={cn(
                "cursor-pointer rounded-xl border p-5 transition-colors",
                template === option.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "hover:border-foreground/20 hover:bg-muted/40",
              )}
            >
              <input
                className="sr-only"
                type="radio"
                name="nicheTemplate"
                value={option.id}
                checked={template === option.id}
                onChange={() => setTemplate(option.id)}
              />
              <span className="block font-semibold">{option.title}</span>
              <span className="mt-1 block text-xs font-medium text-primary">
                {option.description}
              </span>
              <span className="mt-4 block text-sm leading-6 text-muted-foreground">
                {option.details}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving template..." : "Save and continue"}
      </Button>
    </form>
  );
}
