import { requireSession } from "@/lib/session";
import { OnboardingView } from "@/modules/onboarding/ui/views/onboarding-view";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await requireSession();

  if (session.user.nicheTemplate) {
    redirect("/");
  }

  return <OnboardingView user={session.user} />;
}
