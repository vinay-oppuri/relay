import ThemeToggle from "@/components/theme-toggle";
import { SignOutButton } from "@/modules/auth/ui/components/sign-out-button";
import {
  AIPrompt,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@repo/ui";
import { Inbox, MessageSquare, Sparkles } from "lucide-react";

import type { AssistantOverview } from "../../server/get-assistant-overview";
import { GmailSyncButton } from "../components/gmail-sync-button";

const suggestions = [
  "What is important in my inbox today?",
  "Summarize my latest client thread.",
  "Which emails need a reply?",
];

type AssistantViewProps = AssistantOverview & {
  user: {
    email: string;
    name: string;
  };
};

export function AssistantView({
  aiReady,
  gmailReady,
  recentMail,
  user,
}: AssistantViewProps) {
  const assistantReady = gmailReady && aiReady && recentMail.length > 0;

  return (
    <SidebarProvider className="min-h-screen bg-background">
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <p className="text-lg font-semibold tracking-tight">Relay</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Assistant">
                    <MessageSquare aria-hidden="true" />
                    <span>Assistant</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Inbox">
                    <Inbox aria-hidden="true" />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="rounded-lg border bg-background p-3 text-xs leading-5 text-muted-foreground group-data-[collapsible=icon]:hidden">
            <p className="font-medium text-foreground">Your data, your key</p>
            Relay only sends or books after you explicitly confirm the action.
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger />
            <div className="min-w-0">
              <p className="font-semibold">Assistant</p>
              <p className="truncate text-xs text-muted-foreground">
                Ask about your mail and calendar
              </p>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-2">
            <span className="hidden max-w-52 truncate text-sm text-muted-foreground md:inline">
              {user.email}
            </span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <section className="min-w-0 flex-1 overflow-y-auto">
            <div className="flex min-h-full flex-col px-5 py-8 sm:px-8">
              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-6">
                <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Hi {user.name.split(" ")[0]}, what can I help you find?
                </h1>
                <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                  Relay answers from your synced mail, cites its sources, and
                  waits for your confirmation before sending or booking
                  anything.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="rounded-xl border bg-card p-4 text-left text-sm leading-6 text-muted-foreground"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto w-full max-w-3xl">
                <div className="mb-3 flex items-end justify-between gap-4">
                  {!assistantReady ? (
                    <p className="text-xs text-muted-foreground">
                      {!gmailReady
                        ? "Connect Gmail to start syncing your inbox."
                        : !aiReady
                          ? "Add an AI provider key to ask Relay questions."
                          : "Your first mail sync is still in progress."}
                    </p>
                  ) : (
                    <span />
                  )}
                  <GmailSyncButton connected={gmailReady} />
                </div>
                <AIPrompt
                  className="w-full py-0"
                  disabled={!assistantReady}
                  headerAction={assistantReady ? "Ready" : "Setup required"}
                  headerText="Relay assistant"
                  placeholder="Ask Relay about your inbox..."
                />
              </div>
            </div>
          </section>

          <aside
            aria-labelledby="recent-mail-heading"
            className="hidden w-80 shrink-0 flex-col border-l bg-muted/10 xl:flex 2xl:w-96"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
              <h2 id="recent-mail-heading" className="font-semibold">
                Recent mail
              </h2>
              <span className="text-xs text-muted-foreground">
                {recentMail.length} synced
              </span>
            </div>
            <div className="min-h-0 flex-1 divide-y overflow-y-auto">
              {recentMail.length ? (
                recentMail.map((mail) => (
                  <article className="min-w-0 space-y-2 p-5" key={mail.id}>
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        {mail.senderName ?? mail.senderEmail}
                      </p>
                      {mail.urgency && mail.urgency !== "normal" ? (
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                          {mail.urgency}
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-sm font-medium">
                      {mail.subject}
                    </p>
                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {mail.snippet ?? "No preview available"}
                    </p>
                    <time className="block text-[11px] text-muted-foreground">
                      {mail.receivedAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </article>
                ))
              ) : (
                <p className="p-5 text-sm leading-6 text-muted-foreground">
                  No mail has been synced yet. Connect Gmail during setup to
                  fill this inbox.
                </p>
              )}
            </div>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
