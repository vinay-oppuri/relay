import { requireSession } from "@/lib/session";
import { getAssistantOverview } from "@/modules/assistant/server/get-assistant-overview";
import { AssistantView } from "@/modules/assistant/ui/views/assistant-view";
import { redirect } from "next/navigation";

export default async function AssistantPage() {
  const session = await requireSession();

  if (!session.user.nicheTemplate) {
    redirect("/onboarding");
  }

  const overview = await getAssistantOverview(session.user.id);

  return <AssistantView {...overview} user={session.user} />;
}
