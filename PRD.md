# Relay — Product Requirements Document

*Working name: "Relay" (placeholder — swap for whatever you brand it). AI-powered scheduling and meeting-operations agent built on Gmail, Google Calendar, Calendly, and Slack, using Corsair as the integration layer and a bring-your-own-key AI model.*

**Version:** 0.1 (MVP scope)
**Status:** Draft
**Owner:** Vinay

---

## 1. Overview

Relay is an AI agent that sits across a user's Gmail, Calendar, Calendly, and Slack, and handles the repetitive mechanics of scheduling and meeting operations: reading scheduling requests, proposing times, creating calendar events, sending invites, pulling context before a meeting, and posting recaps afterward — all gated behind an approval step so nothing goes out under the user's name without their sign-off.

Rather than shipping one fixed workflow, Relay ships **one automation engine with configurable niche templates** (recruiter/interview scheduling, sales/SDR meeting coordination, solo founder/consultant chief-of-staff) so the same core product can be positioned and onboarded differently per audience without maintaining three separate codebases.

The product is BYOK (bring your own AI key) — users supply their own OpenAI/Anthropic/Gemini API key, so Relay's own infrastructure cost is hosting + integrations only, not inference. This lets pricing be based purely on automation usage (seats, workflows run, integrations connected) rather than AI token consumption.

---

## 2. Problem Statement

People whose job involves a high volume of external meetings — recruiters running interview loops, sales reps booking and prepping calls, consultants managing client meetings — lose real time to three recurring tasks:

1. **Scheduling back-and-forth** — finding a time that works across email, calendar, and booking links.
2. **Manual invite creation** — once a time is agreed, someone still has to build the calendar event and send it.
3. **Context assembly** — pulling together what's relevant before a meeting (past threads, notes, candidate/deal history) and making sure the right teammates know it's happening.

Existing scheduling tools (Calendly itself, Reclaim, etc.) solve *slot-finding* but stop there — they don't touch the inbox, don't loop in a team channel, and don't prep context. Doing all of this with a general-purpose AI assistant means re-building OAuth, token refresh, and multi-tenant credential handling from scratch, which is exactly the "80% fast, 20% compounds into a maintenance burden" problem Corsair is built to remove.

---

## 3. Goals & Non-Goals

### Goals (v1)
- Automate scheduling coordination across Gmail + Google Calendar + Calendly, with Slack as the notification/recap surface.
- Every outbound action (email send, invite creation) requires explicit user approval before it executes.
- Support BYOK for AI providers (OpenAI, Anthropic, Gemini) with a per-user usage cap.
- Ship as one configurable engine with selectable niche templates, not three separate products.
- User-scoped data isolation from day one (each user's own credentials and data kept separate); no multi-tenant Organization layer for v1 — add it later only if team features are built.

### Non-Goals (v1)
- Full CRM or ATS replacement — Relay assists scheduling/prep, it does not replace HubSpot, Greenhouse, etc.
- Fully autonomous sending with no human approval (explicitly out of scope — approval-gating is a core trust feature, not a toggle to remove).
- Building or hosting the AI model — Relay never touches inference cost or model hosting.
- Mobile app — web-first for v1.
- Support for every possible integration — Gmail, GCal, Calendly, Slack only for v1; Notion/HubSpot/Linear etc. are v2+ candidates via Corsair's existing plugins.

---

## 4. Target Users & Niche Templates

Since the engine is general, onboarding asks the user to pick a template, which pre-configures the automation defaults, Slack message formatting, and prep-context sources. All three share the same underlying data model and workflow engine.

| Template | Primary user | What "prep context" pulls from | What gets posted to Slack |
|---|---|---|---|
| **Recruiter / Interview Scheduling** | In-house recruiter, agency recruiter | Candidate resume/notes, past email thread, interview stage | Candidate summary + interviewer panel before each interview |
| **Sales / SDR Meeting Coordination** | AE, SDR, founder-led sales | CRM notes (if connected later), past email thread, deal stage | Account summary + attendees before the call |
| **Solo Founder / Consultant Chief-of-Staff** | Solo operator, consultant | Past email thread, client notes | Daily digest of upcoming meetings + prep bullets |

MVP ships with all three templates available at signup; template choice only changes copy/defaults, not the underlying engine.

---

## 5. Core User Flows

### 5.1 Onboarding
1. Sign up → select niche template → connect Gmail, Google Calendar, Slack (Calendly optional).
2. Set AI provider + paste API key (or use limited trial pool on Relay's own key).
3. Set usage cap (max AI actions/day) and approval preferences.
4. Land on dashboard with an empty approval queue and a "how it works" walkthrough.

### 5.2 Scheduling flow
1. Incoming Gmail message requesting a meeting is detected (via Corsair Gmail plugin + webhook/poll).
2. Agent checks GCal free/busy + Calendly availability, drafts a reply proposing times.
3. Draft appears in the **Approval Queue** — user approves, edits, or rejects.
4. On approval, reply is sent via Gmail; once the other party confirms a time, agent creates the GCal event and sends the invite (also gated through approval on first-time senders, auto-approved after user opts in per-contact or globally).

### 5.3 Meeting prep flow
1. X hours before a scheduled meeting (configurable), agent assembles context (thread history, notes, template-specific sources).
2. Posts a prep summary to the designated Slack channel/DM.
3. After the meeting, posts a recap/action-items message (manually triggered or based on a follow-up email being drafted).

### 5.4 Approval queue
- Central inbox-style view of every pending agent action (email replies, invites, Slack posts marked as sensitive).
- Approve / edit-then-approve / reject, with a visible diff of exactly what will be sent.

---

## 6. Feature Requirements

Prioritized P0 (MVP-blocking), P1 (near-term follow-up), P2 (nice to have / v2).

### P0 — MVP
- [ ] Gmail integration: read incoming threads, draft replies (via Corsair plugin)
- [ ] Google Calendar integration: read free/busy, create events + invites
- [ ] Slack integration: post prep summaries and recaps to a channel/DM
- [ ] Approval queue UI — approve/edit/reject any outbound action
- [ ] BYOK key management — store encrypted per-tenant key (OpenAI/Anthropic/Gemini)
- [ ] Usage cap setting + enforcement (hard stop at configured daily/monthly AI call limit)
- [ ] Auth (Better Auth), user-scoped — no org/workspace model for MVP
- [ ] Niche template selection at onboarding (copy/defaults only, shared engine)
- [ ] Audit log — every action taken, timestamp, triggering AI call, integration used

### P1 — Near-term
- [ ] Calendly integration (custom Corsair plugin — not in Corsair's default plugin set)
- [ ] Cost/usage dashboard (calls made, rough token estimate) even though billing is on the user's own key
- [ ] Team-level shared API key option (admin-set key for the whole workspace, alongside per-user keys) — **requires reintroducing an Organization entity; deferred until team features are prioritized**
- [ ] Prebuilt playbook templates per niche (interview-scheduling script, sales-call script, weekly digest script)
- [ ] Dry-run mode — show what the agent *would* send/schedule before any integration is connected live
- [ ] Data retention controls — configurable cache lifespan for email/calendar data

### P2 — Later
- [ ] Granola plugin integration — pull auto-generated meeting notes directly into the Slack recap
- [ ] CRM/ATS read integrations (HubSpot, Airtable) for richer prep context
- [ ] Per-contact auto-approval rules (trusted senders skip the queue)
- [ ] Multi-language support
- [ ] Native mobile approval flow (push notification → approve from lock screen)

---

## 7. System Architecture

Single deployable Next.js application for MVP (no separate backend service) — see stack rationale below for why this beats splitting frontend/backend prematurely.

```
┌─────────────────────────────────────────────┐
│               Next.js (App Router)            │
│  ┌───────────────┐      ┌──────────────────┐ │
│  │  React UI      │◄────►│  tRPC routes      │ │
│  │  (TanStack     │      │  (route handlers) │ │
│  │   Query,       │      └────────┬─────────┘ │
│  │   Zustand for  │               │           │
│  │   approval     │               ▼           │
│  │   queue/wizard)│      ┌──────────────────┐ │
│  └───────────────┘      │  Corsair (self-   │ │
│                          │  hosted): OAuth,  │ │
│                          │  plugin calls,     │ │
│                          │  permission gate   │ │
│                          └────────┬─────────┘ │
└───────────────────────────────────┼───────────┘
                                    ▼
                    ┌───────────────────────────┐
                    │ Postgres (Drizzle ORM)     │
                    │ — users, credentials (via  │
                    │   Corsair), workflows,     │
                    │   approval queue, audit log│
                    └───────────────────────────┘
                                    ▲
                    ┌───────────────┴───────────┐
                    │ Trigger.dev v3             │
                    │ — polling, webhook intake, │
                    │   scheduled prep jobs,     │
                    │   retries                  │
                    └────────────────────────────┘
                                    ▲
                    ┌───────────────┴───────────┐
                    │ User's own AI provider key │
                    │ (OpenAI / Anthropic /       │
                    │  Gemini) — called directly, │
                    │  never proxied through a    │
                    │  shared Relay key           │
                    └────────────────────────────┘
```

Split a standalone worker service out later only if polling/webhook load needs to scale independently of the web app — at that point, use Fastify or Hono (both host tRPC natively), not NestJS.

---

## 8. Tech Stack (decided)

| Layer | Choice | Why |
|---|---|---|
| Monorepo | Turborepo | Shared types across app + worker if split later |
| Frontend + API | Next.js (App Router) | tRPC routes as route handlers, one deployable app for MVP |
| API layer | tRPC | Zero-schema type sharing; matches the rest of the TypeScript-first stack (Corsair, Trigger.dev) |
| Client data layer | tRPC client + TanStack Query | Officially recommended pairing; handles all server-state caching |
| Client UI state | React state by default; Zustand only for cross-cutting state (approval queue selection, automation-builder wizard, global connection-status UI) | Avoids premature complexity; added only where prop-drilling actually hurts |
| Database | Postgres + Drizzle | Type-safe schema, works cleanly with Corsair's own data model |
| Auth | Better Auth | User-scoped auth for MVP — no org/workspace layer; add multi-tenant org support later only if team features are built |
| Integration layer | Corsair (self-hosted) | Removes OAuth/token-refresh/webhook maintenance burden; credentials stay in own DB |
| Background jobs | Trigger.dev v3 | Polling, webhook processing, scheduled prep-message jobs, retry logic |
| AI orchestration | Vercel AI SDK (or LangGraph if a workflow needs genuine multi-step tool-calling loops) | BYOK-compatible, provider-agnostic |

**Explicitly rejected:** NestJS for the backend — its module/decorator model fights tRPC's "router is the type source" design; there's no well-maintained adapter, and this project has no team-scale or REST/GraphQL-surface reason to justify the ceremony.

---

## 9. Data Model (high-level entities)

- **User** — the sole tenant boundary for v1; owns credentials and billing, may hold a personal AI key
- **Integration Connection** — per-user OAuth connection (Gmail, GCal, Slack, Calendly), managed via Corsair
- **AI Key** — encrypted, per-user, provider + usage cap (team-key option deferred until Organization is reintroduced)
- **Workflow / Playbook** — the configured automation (niche template + customizations)
- **Pending Action** — an item awaiting approval (draft email, proposed invite, Slack post), with status (pending/approved/edited/rejected)
- **Meeting** — scheduled event tracked by Relay, linked to thread history and prep context
- **Audit Log Entry** — immutable record of every executed action: what, when, which integration, which AI call triggered it

---

## 10. Integration Layer — Corsair Mapping

| Need | Corsair support |
|---|---|
| Gmail read/draft/send | Built-in plugin |
| Google Calendar read/write | Built-in plugin |
| Slack post | Built-in plugin |
| Calendly availability | **Not built-in** — scaffold a custom plugin (Corsair supports one-command plugin scaffolding since it's open-source TypeScript) |
| Sensitive-action approval | Built-in permission mode per integration — maps directly onto the Approval Queue feature |
| Per-user credential isolation | Built-in (self-hosted, credentials never leave own DB) |
| Caching (avoid hitting rate limits on repeated reads) | Built-in — reads hit Relay's DB, refreshed via webhook/polling |

---

## 11. AI Layer (BYOK)

- User supplies their own API key at onboarding (OpenAI, Anthropic, or Gemini) — encrypted per-user using the same envelope-encryption pattern Corsair uses for OAuth credentials.
- All inference calls are made directly against the user's key — Relay's infrastructure cost is hosting + Corsair + DB only.
- **Usage cap**: user sets a max AI-calls/day (or /month) limit; hard-enforced, with a clear warning before the cap is hit.
- **Trial pool**: small number of free AI actions (e.g., 20) on Relay's own key at signup, so a new user can see value before adding their own key.
- **Cost/usage dashboard**: shows calls made and rough token estimate, even though the bill lands on the user's own provider account — this is a trust feature, not a billing feature.
- *(Team key option — one shared key across a workspace — deferred until Organization support is reintroduced.)*

---

## 12. Security, Privacy & Permissions

- No AI agent, and no Relay backend code path, ever sees a raw OAuth credential or AI key in plaintext outside the decryption boundary at call time.
- Every outbound action (email send, calendar invite, Slack post flagged sensitive) requires explicit approval — no fully autonomous send path exists in v1.
- Full audit log of every executed action, immutable, queryable per user.
- Configurable data retention window for cached email/calendar content (relevant for recruiters/sales teams handling PII).
- Self-hosted Corsair means customer credentials and cached data live in Relay's own database, not a third-party vendor's.

---

## 13. Non-Functional Requirements

- **Data isolation**: strict per-user isolation at the database and Corsair-connection level (no Organization layer for v1).
- **Reliability**: background jobs (polling, webhook intake) must retry on transient failure (Trigger.dev's built-in retry handling).
- **Latency**: prep-summary Slack posts should land at least 15–30 minutes before a meeting by default (configurable).
- **Auditability**: every agent action traceable to a specific triggering event and AI call.
- **Extensibility**: new integrations addable without touching core workflow engine (Corsair plugin model).

---

## 14. Pricing & Monetization

Since AI inference cost is offloaded to the user's own key, pricing is based on **automation usage**, not tokens:

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | 1 integration set (Gmail+GCal), limited workflows/month, Relay-key trial pool |
| Individual | ~$20–30/mo per seat | Full integrations (+Slack, +Calendly), unlimited workflows, usage-cap dashboard |
| Team *(future)* | ~$15–25/mo per seat (volume) | Team-key option, shared Slack channels, admin controls, audit log export — **requires reintroducing Organization support; not part of v1** |

Because infra cost is low (no inference spend), the free tier can be genuinely useful rather than a crippled trial — this is a deliberate acquisition lever. v1 ships Free and Individual tiers only.

---

## 15. Success Metrics

- **Activation**: % of signups that connect all required integrations + complete one full scheduling cycle within 7 days
- **Retention**: % of users still active at 30/60/90 days (proxy for "felt the payoff before churning")
- **Time saved (self-reported or estimated)**: meetings scheduled/prepped without manual back-and-forth
- **Approval-queue trust signal**: % of proposed actions approved without edits (rising over time = agent quality improving, trust increasing)
- **Conversion**: free → paid conversion rate, especially after Calendly/Slack are added (P1 gating point)

---

## 16. Rollout Plan

**Phase 0 — Internal dogfood (2–3 weeks)**
Build P0 feature set; test on your own Gmail/Calendar/Slack with a single niche template active.

**Phase 1 — Closed beta (single wedge)**
Pick one niche (e.g., recruiter or solo founder) to onboard 5–10 real users manually; validate the approval-queue trust model and prep-context quality before opening all three templates.

**Phase 2 — Public launch, all templates**
Open signups with all three niche templates, free tier live, BYOK trial pool active.

**Phase 3 — P1 features**
Calendly plugin, team-key option, prebuilt playbooks, dry-run mode.

**Phase 4 — P2 expansion**
Granola integration, CRM/ATS read integrations, per-contact auto-approval.

---

## 17. Risks & Open Questions

- **Calendly plugin build risk**: not a Corsair built-in — needs custom scaffolding and testing; scope this early to avoid a late P1 surprise.
- **Trust risk**: an agent touching someone's inbox/calendar is a high-trust ask — approval-gating mitigates this, but onboarding copy and dry-run mode need to actively sell the "nothing sends without you" story, not just technically support it.
- **BYOK friction**: some users won't want to get an API key at all — the trial pool softens this, but conversion past the trial is untested and worth watching closely in beta.
- **Single-wedge validation**: general engine is the long-term shape, but going live with all three templates before validating one deeply risks spreading feedback too thin — Phase 1 beta should stay single-niche even though the product supports all three.
- **Open question**: is one AI key per user sufficient for v1, or does any workflow need per-workflow key selection? (Recommend deferring per-workflow keys to P2 — the team-key question is moot for now since Organization support itself is deferred.)

---

## 18. Out of Scope (v1)

- Full CRM/ATS functionality
- Autonomous sending without approval
- Hosting/providing the AI model
- Mobile app
- Integrations beyond Gmail, GCal, Calendly, Slack
- Multi-tenant Organization / team support (deferred — user-scoped only for v1; reintroduce when team features like shared keys or shared Slack channels are prioritized)
