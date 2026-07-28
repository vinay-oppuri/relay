# Relay — Product Requirements Document

*Working name: "Relay" (placeholder). An AI assistant for email and calendar — ask questions, get mail summarized, and get help scheduling meetings. Built on Gmail, Google Calendar, Calendly, and Slack via Corsair, with a bring-your-own-key AI model and RAG over mail history.*

**Version:** 0.2 (assistant-first pivot — replaces the workflow/automation-engine version)
**Status:** Draft
**Owner:** Vinay

---

## 1. Overview

Relay is a chat-first assistant that sits across a user's Gmail and Calendar (and optionally Calendly and Slack), and helps them stay on top of their inbox and scheduling *on demand* — not through pre-configured background automations. The user asks questions ("what's important in my inbox today?", "summarize my thread with X"), and Relay answers using RAG over their mail history. When a meeting request comes in, Relay checks availability and lets the user pick a time; when the user wants a reply drafted, Relay drafts it for review. Every send or booking action is a single, explicit confirm — there is no autonomous background workflow engine.

This is a deliberate pivot from an earlier version of this product that centered on a configurable Workflow engine and an Approval Queue. That model treated Relay as running automations *for* the user in the background. This version treats Relay as something the user actively works *with* — closer to a smart, connected chat assistant than a background agent.

**Reference point:** [Thread](https://thread.ishaandev.co.in/) — "the professional inbox for email and calendar: rank urgency, draft replies, and schedule invites" — is a close positioning match and a useful comparison while scoping features.

---

## 2. Problem Statement

People with a busy inbox and a full calendar lose time to three things, all of which are naturally suited to being *asked for* rather than run in the background:

1. **Not knowing what actually matters** — important mail sits mixed in with everything else; finding it means scanning or searching manually.
2. **Re-reading old threads to answer simple questions** — "what did we agree on with this client?" means digging back through a long thread instead of just asking.
3. **Manually checking calendars for meeting requests** — cross-referencing Calendar and Calendly by hand every time someone asks "are you free Thursday?"

Existing tools either fully automate this (background triage engines, auto-send drafts) or don't touch AI at all (plain scheduling links). Relay sits in between: AI-powered, but user-initiated and user-confirmed at every action.

---

## 3. Goals & Non-Goals

### Goals (v1)
- Let the user ask natural-language questions about their mail and get accurate, cited answers (RAG over mail history).
- Surface urgency/importance signals in the inbox without requiring the user to configure anything.
- Detect meeting requests and assist scheduling: check availability, present slots, let the user pick, then book.
- Draft replies on request, always reviewed and explicitly sent by the user — never auto-sent.
- BYOK for AI providers (OpenAI, Anthropic, Gemini), with a usage cap.
- User-scoped data model — no Organization/multi-tenant layer for v1 (per the earlier decision).

### Non-Goals (v1)
- No configurable Workflow engine — no user-built multi-step automations.
- No standing Approval Queue page — confirmation happens inline, at the point of the action (send a draft, book a slot), not in a separate review inbox.
- No autonomous sending or autonomous calendar booking without an explicit user action in the moment.
- No scheduled/proactive background messaging (e.g., no automatic Slack posts on a timer) — Slack, if included, is used only when the user asks for something to be posted or shared.
- No mobile app — web-first for v1.

---

## 4. Product Positioning

Relay is closest to **Thread** (rank urgency, draft replies, schedule invites, "your rules") rather than to background-automation tools like Zapier-style email bots. The distinguishing design choice: everything Relay does is either (a) answering a question the user asked, or (b) responding to something detected in new mail by *surfacing it and waiting for direction* — never acting without an explicit, in-the-moment confirmation.

---

## 5. Core Concepts

### 5.1 Chat-first interface
The primary screen is a chat/inbox hybrid, not a stats dashboard. The user can ask anything about their mail or calendar and get an answer, or act on a flagged item directly from the conversation.

### 5.2 RAG over mail
Incoming mail is chunked and embedded as it syncs. When the user asks a question, Relay embeds the question, retrieves the most relevant chunks (not the whole inbox), and answers from those — this is what makes "what did X say about the contract" fast and accurate instead of an expensive full-inbox dump to the model.

### 5.3 Urgency / importance signals
A lightweight classification pass runs on each new incoming email (not RAG — this is a direct "how urgent/important is this message" call), tagging it so the inbox view can surface what matters without the user configuring rules.

### 5.4 Assisted scheduling
When a new email looks like a meeting/call request (detected via the same lightweight classification pass), Relay checks Google Calendar + Calendly availability and presents candidate time slots. The user picks one; only then does Relay create the calendar event and send the invite.

### 5.5 Assisted reply drafting
On request ("draft a reply agreeing to Thursday at 2pm"), Relay generates a draft using RAG context from the thread. The draft is shown inline for the user to edit; sending is a single explicit action, never automatic.

---

## 6. Target Users & Niche Templates

Recruiters, salespeople, and consultants remain the primary audience, but the "template" concept is now lightweight: it only changes what counts as important context when answering questions or prepping for a meeting (e.g., candidate notes vs. deal notes vs. client notes) — it does not configure any automation, since there are none to configure.

| Template | Shapes... |
|---|---|
| Recruiter | What "important context" means when summarizing a candidate thread or prepping for an interview |
| Sales | What context is pulled for a deal/account thread |
| Solo founder / consultant | General client-context retrieval, no specialized fields |

---

## 7. Core User Flows

### 7.1 Onboarding
1. Sign up (in `apps/app`) → pick a template (shapes context defaults only) → connect Gmail + Google Calendar (Calendly and Slack optional).
2. Add an AI provider key (or use a small trial pool on Relay's own key).
3. Set a usage cap (daily/monthly AI calls, warn threshold).
4. Initial mail sync begins: ingest, chunk, embed recent mail for RAG.

### 7.2 Mail QnA / summarization
1. User asks a question in chat ("anything important today?", "summarize my thread with Acme").
2. Relay embeds the query, retrieves relevant chunks via pgvector similarity search, and answers — citing which email(s) it drew from.
3. No background process is needed beyond the ingestion pipeline that already ran at sync time.

### 7.3 Meeting scheduling
1. New mail arrives; the classification pass tags it as a meeting/call request (and gives it an urgency score).
2. It's surfaced in the inbox view (or the user notices it and asks Relay about it).
3. User asks Relay to find times, or clicks "find a time" on the flagged item.
4. Relay checks Google Calendar free/busy + Calendly, presents candidate slots.
5. User picks one → Relay creates the event, sends the invite. Single confirm, no separate queue.

### 7.4 Draft reply
1. User asks for a reply to a specific email/thread.
2. Relay drafts using RAG-retrieved thread context.
3. Draft shown inline; user edits if needed and clicks send. Nothing sends without this explicit click.

---

## 8. Feature Requirements

### P0 — MVP
- [ ] Gmail connector: sync mail, incremental ingestion (via Corsair)
- [ ] RAG pipeline: chunking + embeddings + pgvector storage and retrieval
- [ ] Chat interface: ask questions, get cited answers from mail history
- [ ] Urgency/importance classification on incoming mail (lightweight, per-message)
- [ ] Meeting-intent detection on incoming mail
- [ ] Google Calendar connector: read free/busy, create events + invites
- [ ] Assisted scheduling flow: detect → present slots → user picks → book
- [ ] Assisted draft-reply flow: request → draft → edit → explicit send
- [ ] BYOK AI key management (encrypted, per-user) + usage cap enforcement
- [ ] Audit log of every send/booking action, per user

### P1 — Near-term
- [ ] Calendly connector (custom Corsair plugin — not built into Corsair)
- [ ] Slack connector — used only on explicit user request (e.g., "post this summary to #hiring"), not on a schedule
- [ ] Cost/usage dashboard (AI calls made, rough token estimate)
- [ ] Data retention controls for cached/embedded mail content
- [ ] Per-thread "don't touch" opt-out (exclude specific threads from RAG indexing)

### P2 — Later
- [ ] Opt-in daily digest — computed on-demand when the user opens the app in the morning (pull-based, not a scheduled push job, to stay consistent with "no background automation")
- [ ] Multi-provider embedding model choice
- [ ] Organization/team support (deferred — same as prior decision)

---

## 9. System Architecture

Two apps in one Turborepo, per the earlier decision: `apps/web` (marketing, no auth/DB access) and `apps/app` (the full product — auth, chat, connectors, RAG, everything).

```
apps/app (Next.js, App Router)
 ├─ Chat UI (streaming, via Vercel AI SDK)
 ├─ Inbox/triage view (urgency-tagged mail list)
 ├─ tRPC routes ── Corsair (self-hosted: Gmail, GCal, Slack, Calendly-custom)
 │                        │
 │                        ▼
 │                Postgres + pgvector (Drizzle)
 │                — users, mail chunks + embeddings,
 │                  scheduling requests, drafts pending
 │                  confirmation, audit log
 │                        ▲
 │                        │
 └─ Trigger.dev v3 ───────┘
      — mail sync/ingestion polling
      — embedding generation on new mail
      — urgency + meeting-intent classification
      (fixed system behavior, not user-configurable workflows)
                        ▲
                        │
        User's own AI provider key (OpenAI / Anthropic / Gemini)
        — used for chat answers, drafts, classification, and embeddings
```

The background jobs here are intentionally narrow and fixed (sync, embed, classify) — there is no user-facing workflow builder driving them, which is the key architectural difference from the earlier version.

---

## 10. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Monorepo | Turborepo | Two apps (`web`, `app`) + shared packages |
| Marketing site | Next.js (`apps/web`) | Thin, no auth/DB, deployable independently |
| Product app | Next.js App Router (`apps/app`) | All auth, features, and API live here |
| API layer | tRPC | Zero-schema type sharing across the one product app |
| Client data layer | tRPC client + TanStack Query | Server-state caching, official pairing |
| Client UI state | React state by default; Zustand only for cross-cutting state (chat panel state, connection-status banners) | Avoid premature complexity |
| Database | Postgres + Drizzle + `pgvector` extension | Same DB handles relational data and embeddings — no separate vector DB service needed |
| Auth | Better Auth | User-scoped, no org/workspace layer |
| Integration layer | Corsair (self-hosted) | Gmail, GCal, Slack built-in; Calendly as a custom plugin |
| Background jobs | Trigger.dev v3 | Mail sync, embedding generation, urgency/intent classification — fixed jobs, not user-configurable |
| AI orchestration | Vercel AI SDK | Streaming chat, tool-calling for scheduling actions, BYOK-compatible |
| Embeddings | Same BYOK provider's embedding endpoint (e.g., OpenAI `text-embedding-3-small`, Gemini `embedding-001`) | No extra provider/cost surface beyond the key the user already supplied |
| RAG retrieval | Direct SQL via Drizzle + `pgvector` cosine similarity — no orchestration framework | A well-defined retrieval query doesn't need a heavy framework layer; keeps the RAG path simple, debuggable, and dependency-light |

**Explicitly rejected, still:** NestJS (fights tRPC's type-sharing model). A general-purpose RAG/agent framework (e.g., LangChain) is also unnecessary here — the retrieval query is a single well-defined SQL operation, and the tool-calling surface (check calendar, book event) is narrow enough that the Vercel AI SDK's native tool-calling covers it without extra orchestration overhead.

---

## 11. Data Model (high-level entities)

- **User** — sole tenant boundary; owns credentials, billing, AI key, template preference
- **Integration Connection** — per-user OAuth connection (Gmail, GCal, Slack, Calendly), managed via Corsair
- **Mail Item** — synced email/thread metadata
- **Mail Chunk** — chunked + embedded content of a Mail Item, used for RAG retrieval
- **Scheduling Request** — a detected meeting/call intent, candidate slots, and (once picked) the confirmed booking
- **Pending Action** — a draft (reply or invite) awaiting the user's explicit confirm/send — resolved inline in the chat UI, not a separate queue page
- **AI Key** — encrypted, per-user, provider + usage cap
- **Audit Log Entry** — every executed send/booking action, timestamp, triggering request

---

## 12. Integration Layer — Corsair Mapping

| Need | Corsair support |
|---|---|
| Gmail read + send | Built-in plugin |
| Google Calendar read/write | Built-in plugin |
| Slack post (on explicit user request only) | Built-in plugin |
| Calendly availability | Not built-in — custom plugin |
| Per-user credential isolation | Built-in (self-hosted, credentials stay in own DB) |

---

## 13. AI Layer (BYOK)

- User supplies their own API key (OpenAI, Anthropic, or Gemini) at onboarding — encrypted per-user.
- All chat answers, drafts, classification calls, and embeddings run against the user's own key.
- **Usage cap**: daily/monthly AI-call limit, hard-enforced, with a warning threshold.
- **Trial pool**: small number of free actions on Relay's own key before the user adds theirs.
- **Cost/usage dashboard** (P1): calls made, rough token estimate — a trust feature, not a billing feature.

---

## 14. Security, Privacy & Permissions

- No raw OAuth credential or AI key is ever exposed outside the decryption boundary at call time.
- Every send (email) or booking (calendar event) action requires an explicit, in-the-moment user confirmation — there is no path that sends or books without it.
- Full audit log of every executed action, per user.
- Configurable retention window for embedded/cached mail content (P1).
- Per-thread opt-out from RAG indexing (P1), for sensitive threads the user doesn't want embedded at all.

---

## 15. Non-Functional Requirements

- **Data isolation**: strict per-user isolation at the DB and Corsair-connection level.
- **RAG retrieval latency**: answers should return in a few seconds for typical mail volumes — keep retrieval to a single indexed similarity query, not multiple round trips.
- **Reliability**: sync/embedding/classification jobs retry on transient failure (Trigger.dev's built-in retry handling).
- **Auditability**: every send/booking action traceable to the user request that triggered it.

---

## 16. Pricing & Monetization

Same logic as before — AI inference cost sits on the user's own key, so pricing is based on usage of the product itself, not tokens:

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | Gmail + Calendar only, capped mail volume for RAG indexing, trial pool |
| Individual | ~$15–25/mo | Full connectors (+ Slack, + Calendly), unlimited mail indexing, usage dashboard |

(Team tier remains deferred until Organization support is reintroduced, per the earlier decision.)

---

## 17. Success Metrics

- **Activation**: % of signups that connect Gmail + Calendar and ask at least one question within the first session
- **Answer quality / trust**: % of RAG answers the user doesn't immediately re-ask or correct
- **Scheduling completion rate**: % of detected meeting requests that result in a booked event via the assisted flow
- **Draft usage**: % of requested drafts sent as-is vs. edited vs. discarded
- **Retention**: 30/60/90-day active usage

---

## 18. Rollout Plan

**Phase 0 — Internal dogfood**
Build P0 on your own Gmail + Calendar; validate RAG answer quality and the scheduling flow end to end.

**Phase 1 — Closed beta**
Single template (pick one), 5–10 real users; validate that urgency tagging and RAG answers are actually trustworthy before opening further.

**Phase 2 — Public launch**
All templates, free tier live, BYOK trial pool active.

**Phase 3 — P1 features**
Calendly plugin, Slack-on-request, usage dashboard, retention controls.

---

## 19. Risks & Open Questions

- **RAG answer quality risk**: bad retrieval (wrong chunks) produces a confidently wrong answer — worth deciding early whether answers show source citations by default so the user can verify.
- **Classification noise**: urgency/meeting-intent tagging will misfire sometimes — decide the failure mode (silently wrong tag vs. surfaced with a confidence indicator).
- **Embedding cost/volume**: embedding an entire mailbox at first sync could be a large one-time BYOK cost for the user — consider capping initial sync to recent mail (e.g., last 90 days) with older mail indexed on-demand.
- **Open question**: should Slack ever be proactive (e.g., a digest the user opted into), or strictly on-request only for v1? Leaning strictly on-request to stay consistent with the "no background automation" principle.

---

## 20. Out of Scope (v1)

- Configurable Workflow engine / automation builder
- Standing Approval Queue page (replaced by inline confirmation)
- Autonomous sending or booking without explicit user action
- Scheduled/proactive background messaging
- Mobile app
- Multi-tenant Organization / team support (deferred)