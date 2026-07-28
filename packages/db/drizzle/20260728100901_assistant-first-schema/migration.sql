CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "pending_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"source_message_id" uuid,
	"mail_item_id" uuid,
	"scheduling_request_id" uuid,
	"connection_id" uuid,
	"action_type" text NOT NULL,
	"integration" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"payload" jsonb NOT NULL,
	"preview_text" text,
	"idempotency_key" text NOT NULL,
	"confirmed_at" timestamp with time zone,
	"executed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"label" text NOT NULL,
	"encrypted_key" text NOT NULL,
	"key_iv" text NOT NULL,
	"key_auth_tag" text NOT NULL,
	"encryption_version" integer DEFAULT 1 NOT NULL,
	"key_hint" text,
	"status" text DEFAULT 'active' NOT NULL,
	"last_validated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"credential_id" uuid,
	"provider" text NOT NULL,
	"model" text NOT NULL,
	"operation" text NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"total_tokens" integer,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"daily_call_limit" integer DEFAULT 20 NOT NULL,
	"monthly_call_limit" integer DEFAULT 500 NOT NULL,
	"warning_threshold_percent" integer DEFAULT 80 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"issuer" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"niche_template" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"pending_action_id" uuid,
	"source_message_id" uuid,
	"event_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"integration" text,
	"ai_usage_event_id" uuid,
	"summary" text NOT NULL,
	"details" jsonb DEFAULT '{}' NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"thread_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"citations" jsonb DEFAULT '[]' NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"corsair_tenant_id" text NOT NULL,
	"external_account_id" text,
	"display_name" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corsair_accounts" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tenant_id" text NOT NULL,
	"integration_id" text NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"dek" text
);
--> statement-breakpoint
CREATE TABLE "corsair_entities" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"version" text NOT NULL,
	"data" jsonb DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "corsair_events" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "corsair_integrations" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"dek" text
);
--> statement-breakpoint
CREATE TABLE "corsair_permissions" (
	"id" text PRIMARY KEY,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"token" text NOT NULL,
	"plugin" text NOT NULL,
	"endpoint" text NOT NULL,
	"args" text NOT NULL,
	"tenant_id" text DEFAULT 'default' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" text NOT NULL,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "mail_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"mail_item_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"token_count" integer,
	"embedding" vector(1536),
	"embedding_model" text,
	"embedded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mail_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"provider_message_id" text NOT NULL,
	"provider_thread_id" text NOT NULL,
	"sender_email" text NOT NULL,
	"sender_name" text,
	"recipients" jsonb NOT NULL,
	"subject" text NOT NULL,
	"snippet" text,
	"body_text" text NOT NULL,
	"labels" jsonb DEFAULT '[]' NOT NULL,
	"is_unread" boolean DEFAULT true NOT NULL,
	"urgency" text,
	"importance_score" integer,
	"meeting_intent" boolean,
	"classification_confidence" integer,
	"classification_reason" text,
	"received_at" timestamp with time zone NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"indexed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduling_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"mail_item_id" uuid NOT NULL,
	"calendar_connection_id" uuid,
	"status" text DEFAULT 'detected' NOT NULL,
	"title" text NOT NULL,
	"attendee_emails" jsonb DEFAULT '[]' NOT NULL,
	"timezone" text NOT NULL,
	"candidate_slots" jsonb DEFAULT '[]' NOT NULL,
	"selected_start" timestamp with time zone,
	"selected_end" timestamp with time zone,
	"external_event_id" text,
	"confirmed_at" timestamp with time zone,
	"booked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "pending_actions_user_idempotency_unique" ON "pending_actions" ("user_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "pending_actions_user_status_idx" ON "pending_actions" ("user_id","status");--> statement-breakpoint
CREATE INDEX "pending_actions_source_message_idx" ON "pending_actions" ("source_message_id");--> statement-breakpoint
CREATE INDEX "ai_credentials_user_id_idx" ON "ai_credentials" ("user_id");--> statement-breakpoint
CREATE INDEX "ai_credentials_user_provider_status_idx" ON "ai_credentials" ("user_id","provider","status");--> statement-breakpoint
CREATE INDEX "ai_usage_events_user_occurred_at_idx" ON "ai_usage_events" ("user_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_usage_policies_user_unique" ON "ai_usage_policies" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_issuer_provider_account_unique" ON "accounts" ("issuer","provider_account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_unique" ON "sessions" ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");--> statement-breakpoint
CREATE INDEX "audit_logs_user_occurred_at_idx" ON "audit_logs" ("user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "audit_logs_user_entity_idx" ON "audit_logs" ("user_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_pending_action_idx" ON "audit_logs" ("pending_action_id");--> statement-breakpoint
CREATE INDEX "chat_messages_thread_created_at_idx" ON "chat_messages" ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_messages_user_created_at_idx" ON "chat_messages" ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_threads_user_updated_at_idx" ON "chat_threads" ("user_id","updated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "connections_user_provider_tenant_unique" ON "connections" ("user_id","provider","corsair_tenant_id");--> statement-breakpoint
CREATE INDEX "connections_user_id_idx" ON "connections" ("user_id");--> statement-breakpoint
CREATE INDEX "connections_provider_status_idx" ON "connections" ("provider","status");--> statement-breakpoint
CREATE INDEX "corsair_accounts_tenant_id_idx" ON "corsair_accounts" ("tenant_id");--> statement-breakpoint
CREATE INDEX "corsair_accounts_integration_id_idx" ON "corsair_accounts" ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "corsair_entities_account_entity_unique" ON "corsair_entities" ("account_id","entity_id","entity_type");--> statement-breakpoint
CREATE INDEX "corsair_events_account_id_idx" ON "corsair_events" ("account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "corsair_permissions_token_unique" ON "corsair_permissions" ("token");--> statement-breakpoint
CREATE INDEX "corsair_permissions_tenant_status_idx" ON "corsair_permissions" ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "mail_chunks_item_index_unique" ON "mail_chunks" ("mail_item_id","chunk_index");--> statement-breakpoint
CREATE INDEX "mail_chunks_user_id_idx" ON "mail_chunks" ("user_id");--> statement-breakpoint
CREATE INDEX "mail_chunks_embedding_hnsw_idx" ON "mail_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "mail_items_user_provider_message_unique" ON "mail_items" ("user_id","provider_message_id");--> statement-breakpoint
CREATE INDEX "mail_items_user_received_at_idx" ON "mail_items" ("user_id","received_at");--> statement-breakpoint
CREATE INDEX "mail_items_user_thread_idx" ON "mail_items" ("user_id","provider_thread_id");--> statement-breakpoint
CREATE INDEX "mail_items_user_urgency_received_idx" ON "mail_items" ("user_id","urgency","received_at");--> statement-breakpoint
CREATE INDEX "scheduling_requests_user_status_idx" ON "scheduling_requests" ("user_id","status");--> statement-breakpoint
CREATE INDEX "scheduling_requests_mail_item_idx" ON "scheduling_requests" ("mail_item_id");--> statement-breakpoint
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_source_message_id_chat_messages_id_fkey" FOREIGN KEY ("source_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_mail_item_id_mail_items_id_fkey" FOREIGN KEY ("mail_item_id") REFERENCES "mail_items"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_wuagNr5kRPta_fkey" FOREIGN KEY ("scheduling_request_id") REFERENCES "scheduling_requests"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pending_actions" ADD CONSTRAINT "pending_actions_connection_id_connections_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "connections"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ai_credentials" ADD CONSTRAINT "ai_credentials_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_credential_id_ai_credentials_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "ai_credentials"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ai_usage_policies" ADD CONSTRAINT "ai_usage_policies_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_pending_action_id_pending_actions_id_fkey" FOREIGN KEY ("pending_action_id") REFERENCES "pending_actions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_source_message_id_chat_messages_id_fkey" FOREIGN KEY ("source_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_ai_usage_event_id_ai_usage_events_id_fkey" FOREIGN KEY ("ai_usage_event_id") REFERENCES "ai_usage_events"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "chat_threads"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "corsair_accounts" ADD CONSTRAINT "corsair_accounts_integration_id_corsair_integrations_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "corsair_integrations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "corsair_entities" ADD CONSTRAINT "corsair_entities_account_id_corsair_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "corsair_accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "corsair_events" ADD CONSTRAINT "corsair_events_account_id_corsair_accounts_id_fkey" FOREIGN KEY ("account_id") REFERENCES "corsair_accounts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mail_chunks" ADD CONSTRAINT "mail_chunks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mail_chunks" ADD CONSTRAINT "mail_chunks_mail_item_id_mail_items_id_fkey" FOREIGN KEY ("mail_item_id") REFERENCES "mail_items"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mail_items" ADD CONSTRAINT "mail_items_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mail_items" ADD CONSTRAINT "mail_items_connection_id_connections_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "connections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scheduling_requests" ADD CONSTRAINT "scheduling_requests_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scheduling_requests" ADD CONSTRAINT "scheduling_requests_mail_item_id_mail_items_id_fkey" FOREIGN KEY ("mail_item_id") REFERENCES "mail_items"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "scheduling_requests" ADD CONSTRAINT "scheduling_requests_calendar_connection_id_connections_id_fkey" FOREIGN KEY ("calendar_connection_id") REFERENCES "connections"("id") ON DELETE SET NULL;
